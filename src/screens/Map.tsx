import React, { useState, useRef, useMemo, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Text, FlatList, Modal, TextInput, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors, Layout, BRAND_STYLES, getBrandInfo } from '../constants';
import { getMapHtml } from '../mapHtml';
import { useCafeStore } from '../store/useCafeStore';
import { useFocusEffect, useRoute, useNavigation } from '@react-navigation/native';

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
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const selectionMode = route.params?.selectionMode === true;
  const selectUserData = route.params?.user || {};

  const [activeFilter, setActiveFilter] = useState('');
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [selectedCafe, setSelectedCafe] = useState<CafeInfo | null>(null);
  const [cafeList, setCafeList] = useState<CafeInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // selection mode states
  const [placingMode, setPlacingMode] = useState(false);
  const [pendingCenter, setPendingCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [showNameForm, setShowNameForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [myCafes, setMyCafes] = useState<any[]>([]);
  const [showMyCafes, setShowMyCafes] = useState(false);

  const setCafeStore = useCafeStore((s) => s.setCafe);
  const webViewRef = useRef<WebView>(null);
  const lastFetchRef = useRef<{ time: number; lat: number; lng: number } | null>(null);
  const customCafesRef = useRef<any[]>([]);

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
  const cleanUrl = backendUrl?.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

  const userIdRef = useRef(selectUserData._id);
  const serverUrlRef = useRef(cleanUrl);
  userIdRef.current = selectUserData._id;
  serverUrlRef.current = cleanUrl;

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          if (!location) setLocation({ coords: { latitude: 37.5665, longitude: 126.978 } } as any);
          return;
        }
        const currentLoc = await Location.getCurrentPositionAsync({});
        if (cancelled) return;

        setRefreshKey(k => k + 1);
        lastFetchRef.current = { time: Date.now(), lat: currentLoc.coords.latitude, lng: currentLoc.coords.longitude };
        setLocation(currentLoc);

        // 모든 사용자 카페 가져와서 지도에 표시
        try {
          const res = await fetch(`${serverUrlRef.current}/api/user-cafe/all`);
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            customCafesRef.current = data;
            // WebView가 이미 로드되었으면 바로 주입
            webViewRef.current?.injectJavaScript(`addCustomMarkersDirect(${JSON.stringify(data)});true;`);
          }
        } catch (e) {
          // fallback: /api/user-cafe/all 미배포 시 자신의 카페라도 표시
          try {
            if (userIdRef.current) {
              const res2 = await fetch(`${serverUrlRef.current}/api/user-cafe/list/${userIdRef.current}`);
              const data2 = await res2.json();
              if (Array.isArray(data2) && data2.length > 0) {
                customCafesRef.current = data2;
                webViewRef.current?.injectJavaScript(`addCustomMarkersDirect(${JSON.stringify(data2)});true;`);
              }
            }
          } catch (e2) {}
        }
      })();
      return () => { cancelled = true; };
    }, []),
  );

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'MARKER_CLICK') {
        const payload = data.payload;
        setSelectedCafe(payload);
        const dist = payload && location
          ? getDistance(location.coords.latitude, location.coords.longitude, payload.geometry.location.lat, payload.geometry.location.lng)
          : undefined;
        setCafeStore(payload, dist);
      } else if (data.type === 'CAFE_LIST') {
        setCafeList(data.payload || []);
        // 지도 로드 완료 → 모든 사용자 카페 마커 추가
        if (customCafesRef.current.length > 0) {
          webViewRef.current?.injectJavaScript(`addCustomMarkersDirect(${JSON.stringify(customCafesRef.current)});true;`);
        }
      } else if (data.type === 'CUSTOM_MARKER_CLICK') {
        const p = data.payload;
        setSelectedCafe({ name: p.name, vicinity: `${p.lat.toFixed(5)}, ${p.lng.toFixed(5)}`, place_id: p._id, geometry: { location: { lat: p.lat, lng: p.lng } }, isCustom: true, registeredBy: p.userName } as any);
      } else if (data.type === 'MAP_CENTER') {
        setPendingCenter(data.payload);
        setPlacingMode(false);
        setShowNameForm(true);
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
      // 새로고침 시 사용자 카페도 다시 불러오기
      try {
        const res = await fetch(`${cleanUrl}/api/user-cafe/all`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          customCafesRef.current = data;
          webViewRef.current?.injectJavaScript(`addCustomMarkersDirect(${JSON.stringify(data)});true;`);
        }
      } catch (e) {
        try {
          if (userIdRef.current) {
            const res2 = await fetch(`${cleanUrl}/api/user-cafe/list/${userIdRef.current}`);
            const data2 = await res2.json();
            if (Array.isArray(data2) && data2.length > 0) {
              customCafesRef.current = data2;
              webViewRef.current?.injectJavaScript(`addCustomMarkersDirect(${JSON.stringify(data2)});true;`);
            }
          }
        } catch (e2) {}
      }
    })();
  };

  const cafeDistance = selectedCafe && location
    ? getDistance(
        location.coords.latitude, location.coords.longitude,
        selectedCafe.geometry.location.lat, selectedCafe.geometry.location.lng,
      )
    : undefined;

  const handleSelectCafe = (cafe: any) => {
    setSelectedCafe(null);
    if (selectionMode) {
      navigation.navigate('MenuDetail', {
        cafe: { name: cafe.name, lat: cafe.geometry?.location?.lat, lng: cafe.geometry?.location?.lng },
        user: selectUserData,
        mode: 'create',
      });
    } else if (cafe.isCustom) {
      navigation.navigate('SimpleCafeDetail', {
        cafe: { name: cafe.name, address: cafe.vicinity, _id: cafe.place_id, isCustom: true },
        user: selectUserData,
      });
    } else {
      navigation.navigate('SimpleCafeDetail', {
        cafe: { placeId: cafe.place_id, name: cafe.name, address: cafe.vicinity },
        user: selectUserData,
      });
    }
  };

  const handleDeleteCustomCafe = async (cafe: any) => {
    Alert.alert('카페 삭제', `${cafe.name}을(를) 삭제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제', style: 'destructive',
        onPress: async () => {
          try {
            const id = cafe._id || cafe.place_id;
            const res = await fetch(`${cleanUrl}/api/user-cafe/delete/${id}`, { method: 'DELETE' });
            if (!res.ok) { Alert.alert('오류', '삭제에 실패했습니다.'); return; }
            // 지도에서 마커 제거
            webViewRef.current?.injectJavaScript(`removeCustomMarker('${id}');true;`);
            // ref에서 제거
            customCafesRef.current = customCafesRef.current.filter((c: any) => c._id !== id);
            setSelectedCafe(null);
          } catch (e: any) {
            Alert.alert('오류', `삭제 중 오류:\n${e?.message || ''}`);
          }
        },
      },
    ]);
  };

  const fetchMyCafes = useCallback(async () => {
    if (!selectUserData._id) return;
    try {
      const res = await fetch(`${cleanUrl}/api/user-cafe/list/${selectUserData._id}`);
      const data = await res.json();
      setMyCafes(Array.isArray(data) ? data : []);
    } catch (e) {}
  }, [selectUserData._id, cleanUrl]);

  const handleConfirmPlace = () => {
    webViewRef.current?.injectJavaScript('sendCenter();true;');
  };

  const handleAddCustomCafe = async () => {
    if (!customName.trim()) { Alert.alert('알림', '카페 이름을 입력해주세요.'); return; }
    if (!pendingCenter) { Alert.alert('알림', '위치 정보가 없습니다.'); return; }
    if (!cleanUrl) { Alert.alert('오류', '서버 주소가 설정되지 않았습니다.'); return; }
    try {
      const addressStr = `${pendingCenter.lat.toFixed(6)}, ${pendingCenter.lng.toFixed(6)}`;
      const url = `${cleanUrl}/api/user-cafe/add`;
      console.log('📡 [user-cafe/add] 요청 URL:', url);
      console.log('📡 [user-cafe/add] body:', { userId: selectUserData._id, name: customName.trim(), address: addressStr });
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: selectUserData._id,
          userName: selectUserData.name || '익명',
          name: customName.trim(),
          address: addressStr,
          lat: pendingCenter.lat,
          lng: pendingCenter.lng,
        }),
      });
      console.log('📡 [user-cafe/add] 응답 상태:', res.status);
      if (!res.ok) {
        const text = await res.text();
        console.log('📡 [user-cafe/add] 응답 본문:', text);
        Alert.alert('오류', `서버 오류 (${res.status})\n\n서버에 새로운 API가 배포되지 않았습니다.\nserver.js를 다시 배포하거나 로컬에서 재시작하세요.`);
        return;
      }
      const result = await res.json();
      if (result.success) {
        setShowNameForm(false);
        setCustomName('');
        setPendingCenter(null);
        // 모든 사용자 목록에 추가 후 지도에 즉시 마커 표시
        customCafesRef.current.push(result.item);
        webViewRef.current?.injectJavaScript(`addCustomMarker('${result.item.name.replace(/'/g, "\\'")}', ${result.item.lat}, ${result.item.lng}, '${result.item._id}', '${(result.item.userName || '').replace(/'/g, "\\'")}');true;`);
      } else { Alert.alert('오류', '저장에 실패했습니다.'); }
    } catch (e: any) {
      console.log('📡 [user-cafe/add] fetch 실패:', e?.message);
      Alert.alert('오류', `서버와 통신할 수 없습니다.\n${e?.message || ''}`);
    }
  };

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

      <CafeBottomSheet
        cafe={selectedCafe}
        distance={cafeDistance}
        selectionMode={selectionMode}
        onSelectCafe={handleSelectCafe}
        onDeleteCafe={handleDeleteCustomCafe}
      />

      {selectionMode && !placingMode && (
        <>
          <TouchableOpacity style={styles.notFoundBtn} activeOpacity={0.7} onPress={() => setPlacingMode(true)}>
            <Text style={styles.notFoundBtnText}>찾는곳이 없나요?</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.myCafeBtn} activeOpacity={0.7} onPress={() => { fetchMyCafes(); setShowMyCafes(true); }}>
            <Text style={styles.myCafeBtnText}>내가 추가한 카페</Text>
          </TouchableOpacity>

          <Modal visible={showMyCafes} transparent animationType="fade">
            <View style={styles.modalOverlay}>
              <View style={styles.myCafeModal}>
                <Text style={styles.modalTitle}>내가 추가한 카페</Text>
                {myCafes.length === 0 ? (
                  <Text style={styles.emptyText}>추가한 카페가 없습니다.</Text>
                ) : (
                  <View style={styles.myCafeList}>
                    {myCafes.map((cafe: any) => (
                      <TouchableOpacity key={cafe._id} style={styles.myCafeItem} activeOpacity={0.7} onPress={() => {
                        setShowMyCafes(false);
                        navigation.navigate('SimpleCafeDetail', {
                          cafe: { name: cafe.name, address: cafe.address, _id: cafe._id, isCustom: true },
                          user: selectUserData,
                        });
                      }}>
                        <View style={styles.myCafeItemText}>
                          <Text style={styles.myCafeItemName}>{cafe.name}</Text>
                          {cafe.address ? <Text style={styles.myCafeItemAddr}>{cafe.address}</Text> : null}
                        </View>
                        <Text style={styles.myCafeItemArrow}>{'>'}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
                <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowMyCafes(false)} activeOpacity={0.7}>
                  <Text style={styles.modalCloseText}>닫기</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}

      {/* placing mode: crosshair + confirm/cancel */}
      {selectionMode && placingMode && (
        <View style={styles.placingOverlay}>
          {/* crosshair pin */}
          <View style={styles.crosshairWrap}>
            <View style={styles.crosshairCircle}>
              <View style={styles.crosshairDot} />
            </View>
            <View style={styles.crosshairStick} />
            <View style={styles.crosshairShadow} />
          </View>

          <View style={styles.placingActions}>
            <TouchableOpacity
              style={styles.placingCancelBtn}
              activeOpacity={0.7}
              onPress={() => { setPlacingMode(false); setPendingCenter(null); }}
            >
              <Text style={styles.placingCancelText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.placingConfirmBtn}
              activeOpacity={0.7}
              onPress={handleConfirmPlace}
            >
              <Text style={styles.placingConfirmText}>이 위치에 추가</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* name form after pin placed */}
      <Modal visible={showNameForm} transparent animationType="fade">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>카페 이름 입력</Text>
            <TextInput
              style={styles.input}
              placeholder="카페 이름"
              placeholderTextColor={Colors.text3}
              value={customName}
              onChangeText={setCustomName}
              autoFocus
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => { setShowNameForm(false); setPendingCenter(null); }} activeOpacity={0.7}>
                <Text style={styles.modalCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleAddCustomCafe} activeOpacity={0.7}>
                <Text style={styles.modalSubmitText}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {!selectionMode && <BottomNavBar activeTab="지도" />}
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
  placingOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center', alignItems: 'center', zIndex: 20,
    pointerEvents: 'box-none',
  },
  crosshairWrap: { alignItems: 'center', justifyContent: 'center', marginBottom: 60 },
  crosshairCircle: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 3, borderColor: Colors.primary,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(139,46,58,0.10)',
  },
  crosshairDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.primary },
  crosshairStick: {
    width: 3, height: 30,
    backgroundColor: Colors.primary,
    borderBottomLeftRadius: 2, borderBottomRightRadius: 2,
  },
  crosshairShadow: {
    width: 16, height: 6, borderRadius: 3,
    backgroundColor: 'rgba(0,0,0,0.15)',
    marginTop: -2,
  },
  placingActions: {
    position: 'absolute', bottom: 40, left: 24, right: 24,
    flexDirection: 'row', gap: 12, zIndex: 30,
  },
  placingCancelBtn: {
    flex: 1, height: 50, borderRadius: Layout.radiusLg,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    ...Layout.shadow2,
  },
  placingCancelText: { fontSize: 16, fontWeight: '600', color: Colors.text2 },
  placingConfirmBtn: {
    flex: 2, height: 50, borderRadius: Layout.radiusLg,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary, ...Layout.shadow2,
  },
  placingConfirmText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  notFoundBtn: {
    position: 'absolute', bottom: 280, right: 16,
    height: 40, paddingHorizontal: 16, borderRadius: Layout.radiusFull,
    backgroundColor: Colors.surface, ...Layout.shadow2,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  notFoundBtnText: { fontSize: 13, fontWeight: '600', color: Colors.text2 },
  myCafeBtn: {
    position: 'absolute', bottom: 230, right: 16,
    height: 40, paddingHorizontal: 16, borderRadius: Layout.radiusFull,
    backgroundColor: Colors.primary, ...Layout.shadow2,
    alignItems: 'center', justifyContent: 'center',
  },
  myCafeBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'center', alignItems: 'center', padding: 40 },
  modalContent: { width: '100%', backgroundColor: Colors.surface, borderRadius: Layout.radiusLg, padding: 24, gap: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: Colors.text1, textAlign: 'center' },
  input: { height: 48, borderWidth: 1, borderColor: Colors.border, borderRadius: Layout.radiusMd, paddingHorizontal: 16, fontSize: 14, color: Colors.text1 },
  modalBtnRow: { flexDirection: 'row', gap: 12, marginTop: 8 },
  modalCancelBtn: { flex: 1, height: 48, borderRadius: Layout.radiusLg, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  modalCancelText: { fontSize: 15, fontWeight: '600', color: Colors.text2 },
  modalSubmitBtn: { flex: 1, height: 48, borderRadius: Layout.radiusLg, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary },
  modalSubmitText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  myCafeModal: { width: '100%', maxHeight: '70%', backgroundColor: Colors.surface, borderRadius: Layout.radiusLg, padding: 24, gap: 12 },
  emptyText: { fontSize: 14, color: Colors.text3, textAlign: 'center', paddingVertical: 24 },
  myCafeList: { maxHeight: 300 },
  myCafeItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  myCafeItemText: { flex: 1 },
  myCafeItemName: { fontSize: 15, fontWeight: '600', color: Colors.text1 },
  myCafeItemAddr: { fontSize: 12, color: Colors.text2, marginTop: 2 },
  myCafeItemArrow: { fontSize: 16, color: Colors.text3, marginLeft: 8 },
  modalCloseBtn: { height: 44, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  modalCloseText: { fontSize: 15, fontWeight: '600', color: Colors.text2 },
});
