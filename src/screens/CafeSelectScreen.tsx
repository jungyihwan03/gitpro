import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, Layout } from '../constants';
import NavHeader from '../components/NavHeader';
import CafeSelectSheet from '../components/CafeSelectSheet';

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';

function generateMapHtml(apiKey: string): string {
  return `
<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<style>
  body { margin: 0; padding: 0; height: 100%; }
  #map { height: 100vh; width: 100%; }
  .gm-style .gm-style-iw-c { padding: 12px !important; }
  .gm-style .gm-style-iw-d { overflow: hidden !important; }
</style>
</head><body>
<div id="map"></div>
<script>
let map;
let markers = [];
let infowindow;

function initMap() {
  navigator.geolocation.getCurrentPosition(
    pos => {
      const center = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      initMapAt(center);
    },
    () => {
      initMapAt({ lat: 37.5665, lng: 126.9780 });
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

function initMapAt(center) {
  map = new google.maps.Map(document.getElementById('map'), {
    center,
    zoom: 15,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
  });
  infowindow = new google.maps.InfoWindow();

  const service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: center,
    radius: 1000,
    type: 'cafe',
  }, (results, status) => {
    if (status === 'OK' && results) {
      results.forEach(place => {
        const marker = new google.maps.Marker({
          map,
          position: place.geometry.location,
          title: place.name,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#8B2E3A',
            fillOpacity: 0.9,
            strokeColor: '#FFFFFF',
            strokeWeight: 2,
          },
        });
        marker.addListener('click', () => {
          const data = JSON.stringify({
            name: place.name,
            address: place.vicinity || '',
            placeId: place.place_id,
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          });
          window.ReactNativeWebView.postMessage(data);
        });
        markers.push(marker);
      });
    }
  });
}
<\/script>
<script async defer src="https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap"><\/script>
</body></html>`;
}

export default function CafeSelectScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const userData = route.params?.user || {};

  const [selectedCafe, setSelectedCafe] = useState<{ name: string; address: string; placeId?: string; lat?: number; lng?: number } | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customAddress, setCustomAddress] = useState('');
  const [myCafes, setMyCafes] = useState<any[]>([]);
  const [showMyCafes, setShowMyCafes] = useState(false);

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
  const cleanUrl = backendUrl?.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

  const handleMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      setSelectedCafe(data);
    } catch (e) {}
  }, []);

  const handleSelect = () => {
    if (!selectedCafe) return;
    navigation.navigate('SimpleCafeDetail', {
      cafe: selectedCafe,
      user: userData,
    });
  };

  const handleAddCustomCafe = async () => {
    if (!customName.trim()) {
      Alert.alert('알림', '카페 이름을 입력해주세요.');
      return;
    }
    try {
      const res = await fetch(`${cleanUrl}/api/user-cafe/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData._id,
          name: customName.trim(),
          address: customAddress.trim(),
        }),
      });
      const result = await res.json();
      if (result.success) {
        setShowAddForm(false);
        setCustomName('');
        setCustomAddress('');
        navigation.navigate('SimpleCafeDetail', {
          cafe: { name: customName.trim(), address: customAddress.trim(), _id: result.item._id, isCustom: true },
          user: userData,
        });
      } else {
        Alert.alert('오류', '저장에 실패했습니다.');
      }
    } catch (e) {
      Alert.alert('오류', '서버와 통신할 수 없습니다.');
    }
  };

  const fetchMyCafes = useCallback(async () => {
    if (!userData._id) return;
    try {
      const res = await fetch(`${cleanUrl}/api/user-cafe/list/${userData._id}`);
      const data = await res.json();
      setMyCafes(Array.isArray(data) ? data : []);
    } catch (e) {}
  }, [userData._id, cleanUrl]);

  return (
    <View style={styles.container}>
      <NavHeader title="카페 선택" onBack={() => navigation.goBack()} />
      <View style={styles.mapWrap}>
        <WebView
          source={{ html: generateMapHtml(GOOGLE_MAPS_API_KEY) }}
          onMessage={handleMessage}
          javaScriptEnabled
          domStorageEnabled
          startInLoadingState
          renderLoading={() => (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator color={Colors.primary} size="large" />
            </View>
          )}
        />
      </View>

      {/* 찾는곳이 없나요? 버튼 */}
      <TouchableOpacity
        style={styles.notFoundBtn}
        activeOpacity={0.7}
        onPress={() => setShowAddForm(true)}
      >
        <Text style={styles.notFoundBtnText}>찾는곳이 없나요?</Text>
      </TouchableOpacity>

      {/* 내가 추가한 카페 버튼 */}
      <TouchableOpacity
        style={styles.myCafeBtn}
        activeOpacity={0.7}
        onPress={() => {
          fetchMyCafes();
          setShowMyCafes(true);
        }}
      >
        <Text style={styles.myCafeBtnText}>내가 추가한 카페</Text>
      </TouchableOpacity>

      {/* 선택된 카페 바텀시트 */}
      <CafeSelectSheet
        cafe={selectedCafe}
        onSelect={handleSelect}
        onClose={() => setSelectedCafe(null)}
      />

      {/* 카페 추가 폼 모달 */}
      <Modal visible={showAddForm} transparent animationType="fade">
        <KeyboardAvoidingView style={styles.modalOverlay} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>카페 직접 추가</Text>
            <TextInput
              style={styles.input}
              placeholder="카페 이름"
              placeholderTextColor={Colors.text3}
              value={customName}
              onChangeText={setCustomName}
            />
            <TextInput
              style={styles.input}
              placeholder="위치 (주소)"
              placeholderTextColor={Colors.text3}
              value={customAddress}
              onChangeText={setCustomAddress}
            />
            <View style={styles.modalBtnRow}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setShowAddForm(false)} activeOpacity={0.7}>
                <Text style={styles.modalCancelText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalSubmitBtn} onPress={handleAddCustomCafe} activeOpacity={0.7}>
                <Text style={styles.modalSubmitText}>추가</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* 내가 추가한 카페 목록 모달 */}
      <Modal visible={showMyCafes} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.myCafeModal}>
            <Text style={styles.modalTitle}>내가 추가한 카페</Text>
            {myCafes.length === 0 ? (
              <Text style={styles.emptyText}>추가한 카페가 없습니다.</Text>
            ) : (
              <View style={styles.myCafeList}>
                {myCafes.map((cafe: any) => (
                  <TouchableOpacity
                    key={cafe._id}
                    style={styles.myCafeItem}
                    activeOpacity={0.7}
                    onPress={() => {
                      setShowMyCafes(false);
                      navigation.navigate('SimpleCafeDetail', {
                        cafe: { name: cafe.name, address: cafe.address, _id: cafe._id, isCustom: true },
                        user: userData,
                      });
                    }}
                  >
                    <View style={styles.myCafeItemText}>
                      <Text style={styles.myCafeItemName}>{cafe.name}</Text>
                      {cafe.address ? <Text style={styles.myCafeItemAddr}>{cafe.address}</Text> : null}
                    </View>
                    <Text style={styles.myCafeItemArrow}>{'>'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowMyCafes(false)}
              activeOpacity={0.7}
            >
              <Text style={styles.modalCloseText}>닫기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  mapWrap: { flex: 1 },
  loadingOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  notFoundBtn: {
    position: 'absolute', bottom: 220, right: 16,
    height: 40, paddingHorizontal: 16, borderRadius: Layout.radiusFull,
    backgroundColor: Colors.surface, ...Layout.shadow2,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  notFoundBtnText: { fontSize: 13, fontWeight: '600', color: Colors.text2 },
  myCafeBtn: {
    position: 'absolute', bottom: 170, right: 16,
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
