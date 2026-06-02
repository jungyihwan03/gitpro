import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors, Layout, BRAND_STYLES, getBrandInfo } from '../constants';
import { getMapHtml } from '../mapHtml';
import { useCafeStore } from '../store/useCafeStore';
import { fetchPlaceDetails } from '../api';
import { useFocusEffect } from '@react-navigation/native';

import SearchBar from '../components/SearchBar';
import BottomNavBar from '../components/BottomNavBar';
import MapFilterChip from '../components/MapFilterChip';
import CafeBottomSheet from '../components/CafeBottomSheet';

export interface CafeInfo {
  name: string;
  vicinity: string;
  rating?: number;
  place_id: string;
  geometry: { location: { lat: number; lng: number } };
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  } | null;
  photo_url?: string | null;
  phone?: string | null;
}

function getDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const d = getDistanceMeters(lat1, lng1, lat2, lng2);
  if (d >= 1000) return `${(d / 1000).toFixed(1)}km`;
  return `${Math.round(d)}m`;
}

interface Suggestion {
  type: 'brand' | 'cafe';
  label: string;
  subtitle?: string;
  place_id?: string;
  brandName?: string;
}

const CHOSUNG = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

function getChosung(str: string): string {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if (code >= 0xAC00 && code <= 0xD7A3) {
      result += CHOSUNG[Math.floor((code - 0xAC00) / 588)];
    } else {
      result += str[i];
    }
  }
  return result;
}

const ALL_BRAND_NAMES = BRAND_STYLES.map(b => b.name);

export default function Map() {
  const [activeFilter, setActiveFilter] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedCafe, setSelectedCafe] = useState<CafeInfo | null>(null);
  const [cafeList, setCafeList] = useState<CafeInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const setCafeStore = useCafeStore((s) => s.setCafe);
  const webViewRef = useRef<WebView>(null);
  const lastFetchRef = useRef<{ time: number; lat: number; lng: number } | null>(null);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (!location) setLocation({ coords: { latitude: 37.5665, longitude: 126.978 } } as any);
          return;
        }
        const currentLoc = await Location.getCurrentPositionAsync({});

        const last = lastFetchRef.current;
        const now = Date.now();
        const FIVE_MIN = 5 * 60 * 1000;
        const DIST_THRESHOLD = 500;

        let shouldRefetch = !location;
        if (last && location) {
          const elapsed = now - last.time;
          const dist = getDistanceMeters(last.lat, last.lng, currentLoc.coords.latitude, currentLoc.coords.longitude);
          if (elapsed <= FIVE_MIN && dist <= DIST_THRESHOLD) shouldRefetch = false;
        }

        if (shouldRefetch) {
          lastFetchRef.current = { time: now, lat: currentLoc.coords.latitude, lng: currentLoc.coords.longitude };
          setLocation(currentLoc);
        }
      })();
    }, [])
  );

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'MARKER_CLICK') {
        const payload = data.payload;
        console.log('=== MARKER_CLICK payload.phone ===', payload?.phone);
        setSelectedCafe(payload);
        const dist = payload && location
          ? getDistance(location.coords.latitude, location.coords.longitude, payload.geometry.location.lat, payload.geometry.location.lng)
          : undefined;
        setCafeStore(payload, dist);

        if (payload?.place_id && !payload?.phone) {
          console.log('=== No phone in MARKER_CLICK, fetching via REST ===');
          fetchPlaceDetails(payload.place_id).then(details => {
            console.log('=== REST phone result ===', details?.formatted_phone_number);
            if (details?.formatted_phone_number) {
              const updated = { ...payload, phone: details.formatted_phone_number };
              setSelectedCafe(updated);
              setCafeStore(updated, dist);
            }
          });
        }
      } else if (data.type === 'CAFE_LIST') {
        setCafeList(data.payload || []);
      }
    } catch (e) {}
  };

  const suggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.trim().toLowerCase().replace(/\s+/g, '');
    const qCho = getChosung(q);

    const brandMatches = ALL_BRAND_NAMES
      .filter(name => {
        const n = name.toLowerCase();
        return n.includes(q) || getChosung(n).includes(qCho);
      })
      .map(name => ({ type: 'brand' as const, label: name, brandName: name }));

    const cafeMatches = cafeList
      .filter(c => {
        const n = c.name.toLowerCase().replace(/\s+/g, '');
        return n.includes(q) || getChosung(n).includes(qCho);
      })
      .slice(0, 8)
      .map(c => {
        const dist = location
          ? getDistance(location.coords.latitude, location.coords.longitude, c.geometry.location.lat, c.geometry.location.lng)
          : '';
        return { type: 'cafe' as const, label: c.name, subtitle: `${dist} · ${c.vicinity}`, place_id: c.place_id };
      });

    const combined = [...brandMatches, ...cafeMatches];
    return combined.slice(0, 10);
  }, [searchQuery, cafeList, location]);

  const handleSelectSuggestion = (item: Suggestion) => {
    setShowSuggestions(false);
    setSearchQuery('');

    if (item.type === 'brand') {
      setActiveFilter('프랜차이즈');
      webViewRef.current?.injectJavaScript(`filterBrand('${item.brandName}');true;`);
    } else if (item.type === 'cafe' && item.place_id) {
      setActiveFilter('');
      webViewRef.current?.injectJavaScript(`panToPlace('${item.place_id}');true;`);
    }
  };

  const applyFilter = (filter: string) => {
    const newFilter = activeFilter === filter ? '' : filter;
    setActiveFilter(newFilter);

    if (newFilter === '') {
      webViewRef.current?.injectJavaScript('clearFilter();true;');
    } else if (newFilter === '프랜차이즈') {
      webViewRef.current?.injectJavaScript('filterFranchise();true;');
    } else if (newFilter === '영업 중') {
      webViewRef.current?.injectJavaScript('filterByOpenNow();true;');
    } else if (newFilter === '4.0+') {
      webViewRef.current?.injectJavaScript('filterByRating(4.0);true;');
    }
  };

  const handleZoomIn = () => {
    webViewRef.current?.injectJavaScript('map.setZoom(map.getZoom()+1);true;');
  };
  const handleZoomOut = () => {
    webViewRef.current?.injectJavaScript('map.setZoom(map.getZoom()-1);true;');
  };
  const handleMyLocation = () => {
    if (location) {
      webViewRef.current?.injectJavaScript(
        `map.setCenter({lat:${location.coords.latitude},lng:${location.coords.longitude}});true;`
      );
    }
  };

  const handleRefresh = () => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const currentLoc = await Location.getCurrentPositionAsync({});
      lastFetchRef.current = { time: Date.now(), lat: currentLoc.coords.latitude, lng: currentLoc.coords.longitude };
      setLocation(currentLoc);
      setRefreshKey(k => k + 1);
    })();
  };

  const cafeDistance = selectedCafe && location
    ? getDistance(
        location.coords.latitude, location.coords.longitude,
        selectedCafe.geometry.location.lat, selectedCafe.geometry.location.lng,
      )
    : undefined;

  const iconFav = <Svg width="14" height="14" viewBox="0 0 24 24"><Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z" fill={Colors.text2} /></Svg>;
  const iconStore = <Svg width="14" height="14" viewBox="0 0 24 24"><Path d="M20 4H4v2l8 5 8-5V4zM4 20h16V9l-8 5-8-5v11z" fill={Colors.text2}/></Svg>;
  const iconClock = <Svg width="14" height="14" viewBox="0 0 24 24"><Path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill={Colors.text2}/></Svg>;
  const iconStar = <Svg width="14" height="14" viewBox="0 0 24 24"><Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={Colors.text2}/></Svg>;

  const mapHtml = location ? getMapHtml(location.coords.latitude, location.coords.longitude) : '';

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <StatusBar style="dark" />

      <View style={styles.mapArea}>
        {location ? (
          <WebView
            key={refreshKey}
            ref={webViewRef}
            style={styles.mapWebView}
            originWhitelist={['*']}
            source={{ html: mapHtml }}
            onMessage={handleWebViewMessage}
            javaScriptEnabled
            domStorageEnabled
          />
        ) : (
          <View style={styles.mapBg} />
        )}
      </View>

      <SafeAreaView edges={['top']} style={styles.floatTop}>
        <View style={styles.searchWrap}>
          <SearchBar
            placeholder="카페 또는 브랜드 검색..."
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              setShowSuggestions(text.trim().length > 0);
              webViewRef.current?.injectJavaScript(`filterMarkers('${text.replace(/'/g, "\\'")}');true;`);
            }}
            onFocus={() => setShowSuggestions(searchQuery.trim().length > 0)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <View style={styles.suggestionsContainer}>
              <FlatList
                data={suggestions}
                keyExtractor={(_, i) => String(i)}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.suggestionItem} onPress={() => handleSelectSuggestion(item)}>
                    <View style={styles.suggestionIcon}>
                      <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <Circle cx="11" cy="11" r="7" stroke={Colors.text2} strokeWidth="1.8" />
                        <Path d="M16.5 16.5L21 21" stroke={Colors.text2} strokeWidth="1.8" strokeLinecap="round" />
                      </Svg>
                    </View>
                    <View style={styles.suggestionText}>
                      <Text style={styles.suggestionLabel}>{item.label}</Text>
                      {'subtitle' in item && item.subtitle ? <Text style={styles.suggestionSub}>{item.subtitle}</Text> : null}
                    </View>
                    <Text style={styles.suggestionBadge}>
                      {item.type === 'brand' ? '브랜드' : '카페'}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsWrap}>
          <MapFilterChip label="프랜차이즈" IconDefault={iconStore} isActive={activeFilter === '프랜차이즈'} onPress={() => applyFilter('프랜차이즈')} />
          <MapFilterChip label="영업 중" IconDefault={iconClock} isActive={activeFilter === '영업 중'} onPress={() => applyFilter('영업 중')} />
          <MapFilterChip label="4.0+" IconDefault={iconStar} isActive={activeFilter === '4.0+'} onPress={() => applyFilter('4.0+')} />
        </ScrollView>
      </SafeAreaView>

      <View style={styles.mapControls}>
        <View style={styles.ctrlGroup}>
          <TouchableOpacity style={styles.ctrlBtn} activeOpacity={0.7} onPress={handleZoomIn}>
            <Svg width="20" height="20" viewBox="0 0 24 24"><Path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#111"/></Svg>
          </TouchableOpacity>
          <View style={styles.ctrlDivider} />
          <TouchableOpacity style={styles.ctrlBtn} activeOpacity={0.7} onPress={handleZoomOut}>
            <Svg width="20" height="20" viewBox="0 0 24 24"><Path d="M19 13H5v-2h14v2z" fill="#111"/></Svg>
          </TouchableOpacity>
        </View>
        <View style={styles.ctrlGroup}>
          <TouchableOpacity style={styles.ctrlBtn} activeOpacity={0.7} onPress={handleMyLocation}>
            <Svg width="20" height="20" viewBox="0 0 24 24"><Path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" fill={Colors.primary}/></Svg>
          </TouchableOpacity>
        </View>
        <View style={styles.ctrlGroup}>
          <TouchableOpacity style={styles.ctrlBtn} activeOpacity={0.7} onPress={handleRefresh}>
            <Svg width="20" height="20" viewBox="0 0 24 24"><Path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" fill={Colors.text1}/></Svg>
          </TouchableOpacity>
        </View>
      </View>

      <CafeBottomSheet cafe={selectedCafe} distance={cafeDistance} />

      <BottomNavBar activeTab="지도" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8eaed' },
  mapArea: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  mapBg: { flex: 1, backgroundColor: '#e8eaed' },
  mapWebView: { flex: 1 },
  floatTop: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingTop: 8 },
  searchWrap: { paddingHorizontal: 16, paddingBottom: 8, zIndex: 20 },
  chipsWrap: { paddingHorizontal: 16, gap: 8 },
  mapControls: { position: 'absolute', right: 16, bottom: 390, gap: 8, zIndex: 10 },
  ctrlGroup: { backgroundColor: Colors.surface, borderRadius: Layout.radiusMd, overflow: 'hidden', ...Layout.shadow2 },
  ctrlBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  ctrlDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 8 },
  suggestionsContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusMd,
    marginTop: 4,
    marginHorizontal: 4,
    ...Layout.shadow3,
    maxHeight: 320,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: 12,
  },
  suggestionIcon: { width: 24, alignItems: 'center' },
  suggestionText: { flex: 1 },
  suggestionLabel: { fontSize: 15, fontWeight: '600', color: Colors.text1 },
  suggestionSub: { fontSize: 12, color: Colors.text2, marginTop: 2 },
  suggestionBadge: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
});
