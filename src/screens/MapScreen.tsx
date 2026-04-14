import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { StyleSheet, View, ActivityIndicator, Alert, Text, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';

// ---------------------------------------------------------
// [필수] API Key 입력
// ---------------------------------------------------------
const GOOGLE_MAPS_API_KEY = 'AIzaSyDL4nJm241dUoVTCkCc32bjpklfnlQwU6A';

// 카페 데이터 타입 정의
interface CafeData {
  name: string;
  vicinity: string; // 주소
  rating?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  isOpen?: boolean;
}

const MapScreen = () => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedCafe, setSelectedCafe] = useState<CafeData | null>(null);
  
  // 바텀 시트 참조용 Ref
  const bottomSheetRef = useRef<BottomSheet>(null);
  // 바텀 시트 스냅 포인트 (25%: 조금 보임, 50%: 절반, 90%: 전체)
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation({ coords: { latitude: 37.554678, longitude: 126.970606 } } as any);
        return;
      }
      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  // ---------------------------------------------------------
  // 웹뷰 HTML
  // ---------------------------------------------------------
  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <style>
          body, html { height: 100%; margin: 0; padding: 0; }
          #map { height: 100%; width: 100%; }
        </style>
        <script src="https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places"></script>
      </head>
      <body>
        <div id="map"></div>

        <script>
          function logToApp(type, payload) {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload }));
            }
          }

          function initMap() {
            const myLocation = { lat: ${location?.coords.latitude}, lng: ${location?.coords.longitude} };
            
            const map = new google.maps.Map(document.getElementById("map"), {
              center: myLocation,
              zoom: 14,
              disableDefaultUI: true,
              clickableIcons: false, // 기본 POI 클릭 방지 (우리 마커만 클릭되게)
            });

            new google.maps.Marker({
              position: myLocation,
              map: map,
              title: "내 위치",
              icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            });

            searchNearbyCafes(map, myLocation);
          }

          function searchNearbyCafes(map, location) {
            const service = new google.maps.places.PlacesService(map);
            const request = {
              location: location,
              radius: 10000,
              type: ['cafe', 'bakery']
            };

            service.nearbySearch(request, (results, status) => {
              if (status === google.maps.places.PlacesServiceStatus.OK) {
                // 앱으로 전체 리스트 전송 (콘솔 확인용)
                logToApp('CAFE_LIST', results.length);

                for (let i = 0; i < results.length; i++) {
                  createMarker(results[i], map);
                }
              }
            });
          }

          function createMarker(place, map) {
            if (!place.geometry || !place.geometry.location) return;

            const marker = new google.maps.Marker({
              map: map,
              position: place.geometry.location,
              title: place.name,
              // 카페 아이콘 (빨간색)
              icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png" 
            });

            // [핵심] 마커 클릭 이벤트 -> 앱으로 데이터 전송
            marker.addListener("click", () => {
              // 필요한 데이터만 추려서 전송
              const cafeData = {
                name: place.name,
                vicinity: place.vicinity,
                rating: place.rating,
                place_id: place.place_id,
                geometry: {
                  location: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                  }
                }
              };
              logToApp('MARKER_CLICK', cafeData);
            });
          }

          window.onload = initMap;
        </script>
      </body>
    </html>
  `;

  // 앱에서 메시지 수신 처리
  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'MARKER_CLICK') {
        const cafe = data.payload;
        console.log("선택된 카페:", cafe.name);
        
        // 1. 상태 업데이트
        setSelectedCafe(cafe);
        
        // 2. 바텀 시트 열기 (인덱스 0: 25% 높이)
        bottomSheetRef.current?.snapToIndex(0);
      } 
      else if (data.type === 'CAFE_LIST') {
        console.log(`총 ${data.payload}개의 카페 로드 완료`);
      }
    } catch (e) {}
  };

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>위치 로딩 중...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <WebView
        style={styles.map}
        originWhitelist={['*']}
        source={{ html: mapHtml }}
        onMessage={handleWebViewMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
      />

      {/* 바텀 시트 (마커 클릭 시 정보 표시) */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1} // 초기 상태: 숨김 (-1)
        snapPoints={snapPoints}
        enablePanDownToClose={true} // 아래로 당겨서 닫기 가능
        backgroundStyle={{ borderRadius: 24, elevation: 10 }}
      >
        <BottomSheetView style={styles.contentContainer}>
          {selectedCafe ? (
            <View>
              <Text style={styles.cafeName}>{selectedCafe.name}</Text>
              
              <View style={styles.row}>
                <Text style={styles.label}>⭐ 평점:</Text>
                <Text style={styles.value}>{selectedCafe.rating ? selectedCafe.rating : '정보 없음'}</Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>📍 주소:</Text>
                <Text style={styles.value}>{selectedCafe.vicinity}</Text>
              </View>

              <View style={styles.buttonContainer}>
                <Text style={styles.infoText}>상세 정보 보기 (준비중)</Text>
              </View>
            </View>
          ) : (
            <Text style={styles.placeholder}>지도의 마커를 클릭해보세요!</Text>
          )}
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  // 바텀 시트 스타일
  contentContainer: {
    flex: 1,
    padding: 24,
  },
  cafeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  label: {
    fontWeight: '600',
    marginRight: 8,
    color: '#666',
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  buttonContainer: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    color: '#888',
  },
  placeholder: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginTop: 20,
  }
});

export default MapScreen;