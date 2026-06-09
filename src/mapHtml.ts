// src/mapHtml.ts
import { GOOGLE_MAPS_API_KEY, BRAND_STYLES, DEFAULT_STYLE } from './constants';

export const getMapHtml = (lat: number, lng: number) => {
  const brandStylesJson = JSON.stringify(BRAND_STYLES);
  const defaultStyleJson = JSON.stringify(DEFAULT_STYLE);

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>body, html { height: 100%; margin: 0; padding: 0; } #map { height: 100%; width: 100%; }</style>
        <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry"></script>
      </head>
      <body>
        <div id="map"></div>
        <script>
          let map;
          let currentMarkers = [];
          let allMarkers = [];
          let allPlaces = [];

          const jsBrandStyles = ${brandStylesJson};
          const jsDefaultStyle = ${defaultStyleJson};

          var CHOSUNG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

          function getChosung(str) {
            var result = '';
            for (var i = 0; i < str.length; i++) {
              var code = str.charCodeAt(i);
              if (code >= 0xAC00 && code <= 0xD7A3) {
                result += CHOSUNG[Math.floor((code - 0xAC00) / 588)];
              } else {
                result += str[i];
              }
            }
            return result;
          }

          function getBrandInfoJS(storeName) {
            const found = jsBrandStyles.find(brand => brand.keywords.some(keyword => storeName.includes(keyword)));
            if (found) return Object.assign({}, found, { isFranchise: true });
            return Object.assign({}, jsDefaultStyle, { isFranchise: false });
          }

          function logToApp(type, payload) {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload }));
            }
          }

          function clearMarkers() {
            for (let i = 0; i < currentMarkers.length; i++) {
              currentMarkers[i].setMap(null); 
            }
            currentMarkers = [];
          }

          function searchHere(radius) {
            const center = map.getCenter();
            searchNearbyCafes(map, center, radius);
          }

          function initMap() {
            const myLocation = new google.maps.LatLng(${lat}, ${lng});
            map = new google.maps.Map(document.getElementById("map"), {
              center: myLocation, zoom: 15, disableDefaultUI: true, clickableIcons: false,
            });

            const myLocationSvg = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">' +
              '<circle cx="20" cy="20" r="10" fill="#4A90E2" stroke="white" stroke-width="3"/>' +
              '<circle cx="20" cy="20" r="18" fill="#4A90E2" opacity="0.3"/>' +
              '</svg>'
            );

            new google.maps.Marker({
              position: myLocation, map: map, title: "내 위치",
              icon: { url: myLocationSvg, scaledSize: new google.maps.Size(40, 40), anchor: new google.maps.Point(20, 20) }
            });
            
            searchNearbyCafes(map, myLocation, 700); 
          }

          var placeDetailsMap = {};

          function searchNearbyCafes(map, location, radius) {
            const service = new google.maps.places.PlacesService(map);
            const request1 = { location: location, radius: radius, type: 'cafe' };
            const request2 = { location: location, radius: radius, keyword: '커피' };

            let combinedResults = [];
            let completedRequests = 0;

            function processResults() {
              completedRequests++;
              if (completedRequests === 2) { 
                clearMarkers();

                const uniquePlacesMap = new Map();
                combinedResults.forEach(place => {
                  if (!uniquePlacesMap.has(place.place_id)) {
                    uniquePlacesMap.set(place.place_id, place);
                  }
                });
                const uniquePlaces = Array.from(uniquePlacesMap.values());

                const blacklist = ['PC', '피시', '호텔', '모텔', '독서실', '편의점', '무인', '당구', '스크린', '다방', 'SUBWAY', '서브웨이', '부대찌개', '칼국수', '곱창', '족발', '한우', '피자', '치킨', '통닭', '설렁탕', '설농탕', '국밥', '고기', '식당', '밥', '마라탕', '짬뽕', '짜장', '분식', '김밥', '떡볶이', '삼겹살', '갈비', '돈까스', '횟집', '호프', '주점', '술', '포차', '바', 'bar', '레스토랑', '미용', '노래'];
                let filtered = uniquePlaces.filter(p => !blacklist.some(badWord => p.name.includes(badWord)));

                filtered.sort((a, b) => {
                  const distA = google.maps.geometry.spherical.computeDistanceBetween(location, a.geometry.location);
                  const distB = google.maps.geometry.spherical.computeDistanceBetween(location, b.geometry.location);
                  return distA - distB;
                });

                const top20 = filtered.slice(0, 20);
                allPlaces = top20;
                
                const listForApp = top20.map(p => ({
                  name: p.name, vicinity: p.vicinity, rating: p.rating, place_id: p.place_id,
                  geometry: { location: { lat: p.geometry.location.lat(), lng: p.geometry.location.lng() } }
                }));
                logToApp('CAFE_LIST', listForApp);

                for (let i = 0; i < top20.length; i++) {
                  createMarker(top20[i], map);
                }
              }
            }

            service.nearbySearch(request1, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) combinedResults.push(...results);
              processResults();
            });
            service.nearbySearch(request2, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) combinedResults.push(...results);
              processResults();
            });
          }

          function createMarker(place, map) {
            if (!place.geometry || !place.geometry.location) return;
            const brandInfo = getBrandInfoJS(place.name);
            
            const customSvgIcon = "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">' +
                '<circle cx="22" cy="24" r="16" fill="black" opacity="0.2"/>' + 
                '<circle cx="22" cy="20" r="16" fill="' + brandInfo.color + '" stroke="white" stroke-width="2.5"/>' + 
                '<text x="22" y="26" font-family="sans-serif" font-size="16" font-weight="bold" fill="white" text-anchor="middle">' + brandInfo.short + '</text>' + 
              '</svg>'
            );

            const marker = new google.maps.Marker({
              map: map, position: place.geometry.location, title: place.name,
              icon: { url: customSvgIcon, scaledSize: new google.maps.Size(44, 44), anchor: new google.maps.Point(22, 22) }
            });
            
            marker.placeId = place.place_id;
            currentMarkers.push(marker);
            allMarkers.push(marker);

            marker.addListener("click", function() {
              var p = place;
              function sendWithDetails(details) {
                var cafeData = {
                  name: p.name, vicinity: p.vicinity, rating: p.rating, place_id: p.place_id,
                  geometry: { location: { lat: p.geometry.location.lat(), lng: p.geometry.location.lng() } },
                  opening_hours: details ? { open_now: details.open_now, weekday_text: details.weekday_text } : null,
                  photo_url: details ? details.photo_url : null,
                  phone: details ? details.phone : null
                };
                logToApp('MARKER_CLICK', cafeData);
              }
              var existing = placeDetailsMap[p.place_id] || null;
              sendWithDetails(existing);
              if (!existing) {
                var svc = new google.maps.places.PlacesService(map);
                svc.getDetails({ placeId: p.place_id, fields: ['opening_hours', 'photos', 'formatted_phone_number'] }, function(result, status) {
                  if (status === google.maps.places.PlacesServiceStatus.OK && result) {
                    var entry = {};
                    if (result.opening_hours) { entry.open_now = result.opening_hours.open_now; entry.weekday_text = result.opening_hours.weekday_text; }
                    if (result.photos && result.photos.length > 0) { entry.photo_url = result.photos[0].getUrl({ maxWidth: 200 }); }
                    if (result.formatted_phone_number) { entry.phone = result.formatted_phone_number; }
                    placeDetailsMap[p.place_id] = entry;
                    sendWithDetails(entry);
                  }
                });
              }
            });
          }
          function showAllMarkers() {
            for (var i = 0; i < allMarkers.length; i++) {
              allMarkers[i].setVisible(true);
            }
          }

          function hideAllMarkers() {
            for (var i = 0; i < allMarkers.length; i++) {
              allMarkers[i].setVisible(false);
            }
          }

          function filterMarkers(keyword) {
            if (!keyword || keyword.trim() === '') {
              showAllMarkers();
              return;
            }
            var kw = keyword.toLowerCase().replace(/\s+/g, '');
            var kwCho = getChosung(kw);
            for (var i = 0; i < allMarkers.length; i++) {
              var place = allPlaces[i];
              if (!place) continue;
              var nameNorm = place.name.toLowerCase().replace(/\s+/g, '');
              var vicinityNorm = place.vicinity ? place.vicinity.toLowerCase().replace(/\s+/g, '') : '';
              var nameCho = getChosung(nameNorm);
              var match = nameNorm.includes(kw) || vicinityNorm.includes(kw) || nameCho.includes(kwCho);
              allMarkers[i].setVisible(match);
            }
          }

          function filterBrand(brandName) {
            if (!brandName || brandName === '') {
              showAllMarkers();
              return;
            }
            var bn = brandName.toLowerCase();
            for (var i = 0; i < allMarkers.length; i++) {
              var place = allPlaces[i];
              if (!place) continue;
              var info = getBrandInfoJS(place.name);
              var match = info.isFranchise !== false && info.name.toLowerCase() === bn;
              allMarkers[i].setVisible(match);
            }
          }

          function filterByOpenNow() {
            for (var i = 0; i < allMarkers.length; i++) {
              var place = allPlaces[i];
              if (!place) continue;
              var hours = placeDetailsMap[place.place_id];
              var open = hours && hours.open_now === true;
              allMarkers[i].setVisible(open);
            }
          }

          function filterByRating(min) {
            for (var i = 0; i < allMarkers.length; i++) {
              var place = allPlaces[i];
              if (!place) continue;
              var match = place.rating != null && place.rating >= min;
              allMarkers[i].setVisible(match);
            }
          }

          function clearFilter() {
            showAllMarkers();
          }

          function panToPlace(placeId) {
            for (var i = 0; i < allPlaces.length; i++) {
              if (allPlaces[i].place_id === placeId) {
                var loc = allPlaces[i].geometry.location;
                map.panTo(loc);
                map.setZoom(17);
                if (allMarkers[i]) {
                  google.maps.event.trigger(allMarkers[i], 'click');
                }
                break;
              }
            }
          }

          function filterFranchise() {
            for (var i = 0; i < allMarkers.length; i++) {
              var place = allPlaces[i];
              if (!place) continue;
              var info = getBrandInfoJS(place.name);
              allMarkers[i].setVisible(info.isFranchise === true);
            }
          }

          window.onload = initMap;
        </script>
      </body>
    </html>
  `;
};