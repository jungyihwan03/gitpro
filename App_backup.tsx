// App.tsx
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { 
  StyleSheet, View, ActivityIndicator, Alert, Text, TextInput, 
  TouchableOpacity, KeyboardAvoidingView, Platform, Modal, ScrollView 
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import BottomSheet, { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';

// 💡 분리된 로직들 불러오기
import { getBrandInfo, CafeData } from './src/constants';
import { getAiAnalysis, saveCoffeeApi, fetchCoffeeApi } from './src/api';
import { getMapHtml } from './src/mapHtml';

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const webviewRef = useRef<WebView>(null);
  
  const [nearbyCafes, setNearbyCafes] = useState<CafeData[]>([]);
  const [selectedCafe, setSelectedCafe] = useState<CafeData | null>(null);
  const [isSearching, setIsSearching] = useState(true); 
  
  const [food, setFood] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const myFavorite = { name: "민트초코 프라페", kcal: 450 };

  const [isDbModalVisible, setIsDbModalVisible] = useState(false);
  const [dbForm, setDbForm] = useState({ coffeeName: '', caffeine: '', brand: '' });
  const [dbSaving, setDbSaving] = useState(false);

  const [isDbListModalVisible, setIsDbListModalVisible] = useState(false);
  const [coffeeList, setCoffeeList] = useState<any[]>([]);
  const [dbLoading, setDbLoading] = useState(false);

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['25%', '50%', '90%'], []);

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

  const handleRefreshSearch = () => {
    setIsSearching(true);
    setSelectedCafe(null);
    bottomSheetRef.current?.snapToIndex(0); 
    webviewRef.current?.injectJavaScript('searchHere(700); true;');
  };

  const handleSaveToDb = async () => {
    if (!dbForm.coffeeName || !dbForm.caffeine) {
      Alert.alert("알림", "커피 이름과 카페인 함량은 필수입니다!");
      return;
    }
    setDbSaving(true);
    try {
      await saveCoffeeApi(dbForm.coffeeName, Number(dbForm.caffeine), dbForm.brand);
      Alert.alert("성공", "DB에 성공적으로 저장되었습니다!");
      setDbForm({ coffeeName: '', caffeine: '', brand: '' }); 
      setIsDbModalVisible(false); 
    } catch (error) {
      Alert.alert("오류", "저장에 실패했습니다.");
    } finally {
      setDbSaving(false);
    }
  };

  const fetchCoffeeDb = async () => {
    setDbLoading(true);
    try {
      const data = await fetchCoffeeApi();
      setCoffeeList(data);
    } catch (error) {
      Alert.alert("오류", "DB 목록을 불러오지 못했습니다.");
    } finally {
      setDbLoading(false);
    }
  };

  const handleAiTest = async () => {
    if (!food.trim()) return;
    setAiLoading(true);
    const data = await getAiAnalysis(food, myFavorite);
    setAiResult(data);
    setAiLoading(false);
  };

  const handleSheetChanges = (index: number) => {
    if (index === 0 && selectedCafe !== null) {
      setSelectedCafe(null);
      setAiResult(null); 
      setFood('');
    }
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'ERROR') {
        console.error("웹뷰 에러:", data.payload);
        setIsSearching(false);
      } 
      else if (data.type === 'CAFE_LIST') {
        setNearbyCafes(data.payload);
        setIsSearching(false); 
      } 
      else if (data.type === 'MARKER_CLICK') {
        setSelectedCafe(data.payload);
        bottomSheetRef.current?.snapToIndex(1); 
      }
    } catch (e) {}
  };

  if (!location) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6F4E37" />
        <Text style={{ marginTop: 10, color: '#6F4E37' }}>위치를 잡는 중입니다...</Text>
      </View>
    );
  }

  // 외부 파일에서 HTML 문자열 가져오기
  const mapHtml = getMapHtml(location.coords.latitude, location.coords.longitude);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        
        <WebView
          ref={webviewRef}
          style={styles.map}
          originWhitelist={['*']}
          source={{ html: mapHtml }}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
        />

        <View style={styles.topCenterButtonContainer}>
          <TouchableOpacity style={styles.refreshButton} onPress={handleRefreshSearch}>
            <Ionicons name="refresh" size={18} color="#fff" />
            <Text style={styles.refreshButtonText}>현재 위치 주변 재검색</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.topLeftButtonContainer}>
          <TouchableOpacity style={styles.floatingButton} onPress={() => { setIsDbListModalVisible(true); fetchCoffeeDb(); }}>
            <Ionicons name="list" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.topRightButtonContainer}>
          <TouchableOpacity style={styles.floatingButton} onPress={() => setIsDbModalVisible(true)}>
            <Ionicons name="cloud-upload" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={0} 
          snapPoints={snapPoints}
          onChange={handleSheetChanges}
          enablePanDownToClose={false}
          backgroundStyle={{ borderRadius: 24, elevation: 15 }}
          keyboardBehavior="interactive"
        >
          <BottomSheetScrollView contentContainerStyle={styles.sheetContent}>
            {selectedCafe ? (
              <View style={{ flex: 1 }}>
                <TouchableOpacity style={styles.backButton} onPress={() => { setSelectedCafe(null); bottomSheetRef.current?.snapToIndex(0); }}>
                  <Ionicons name="arrow-back" size={20} color="#666" />
                  <Text style={styles.backButtonText}>목록으로</Text>
                </TouchableOpacity>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                  <Text style={styles.detailTitle}>{selectedCafe.name}</Text>
                  {getBrandInfo(selectedCafe.name).isFranchise && (
                    <View style={styles.franchiseBadgeLarge}>
                      <Text style={styles.franchiseBadgeTextLarge}>프랜차이즈</Text>
                    </View>
                  )}
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>⭐ 평점:</Text>
                  <Text style={styles.detailValue}>{selectedCafe.rating || '정보 없음'}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>📍 주소:</Text>
                  <Text style={styles.detailValue}>{selectedCafe.vicinity}</Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.aiHeader}>🤖 디저트 AI 분석기</Text>
                <Text style={styles.aiSubHeader}>내 기준: {myFavorite.name} ({myFavorite.kcal}kcal)</Text>
                
                <TextInput style={styles.input} placeholder="카페에서 먹을 디저트 입력 (예: 치즈케이크)" value={food} onChangeText={setFood} />
                <TouchableOpacity style={styles.aiButton} onPress={handleAiTest} disabled={aiLoading}>
                  {aiLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.aiButtonText}>AI 분석 시작</Text>}
                </TouchableOpacity>

                {aiResult && (
                  <View style={styles.aiResultBox}>
                    <Text style={styles.aiResultKcal}>🔥 예상 {aiResult.kcal} kcal</Text>
                    <Text style={styles.aiResultRatio}>{myFavorite.name}의 <Text style={{ fontWeight: 'bold', color: '#FF6B6B' }}>{aiResult.ratio}배</Text>!</Text>
                    <Text style={styles.aiResultMsg}>"{aiResult.message}"</Text>
                  </View>
                )}
              </View>
            ) : (
              <View>
                <Text style={styles.listHeader}>내 주변 카페 (가까운 순)</Text>
                {isSearching ? (
                  <ActivityIndicator size="large" color="#6F4E37" style={{ marginTop: 30 }} />
                ) : nearbyCafes.length === 0 ? (
                  <Text style={styles.placeholder}>주변에 카페가 없습니다.</Text>
                ) : (
                  nearbyCafes.map((cafe) => {
                    const brandInfo = getBrandInfo(cafe.name); 
                    return (
                      <TouchableOpacity key={cafe.place_id} style={styles.listItem} onPress={() => { setSelectedCafe(cafe); bottomSheetRef.current?.snapToIndex(1); }}>
                        <View style={[styles.brandDot, { backgroundColor: brandInfo.color }]}>
                          <Text style={styles.brandDotText}>{brandInfo.short}</Text>
                        </View>
                        <View style={styles.listInfo}>
                          <View style={styles.listNameRow}>
                            <Text style={styles.listName} numberOfLines={1}>{cafe.name}</Text>
                            {brandInfo.isFranchise && <View style={styles.franchiseBadge}><Text style={styles.franchiseBadgeText}>프랜차이즈</Text></View>}
                          </View>
                          <Text style={styles.listAddress} numberOfLines={1}>{cafe.vicinity}</Text>
                        </View>
                        <View style={styles.listRating}>
                          <Ionicons name="star" size={14} color="#FFD700" />
                          <Text style={styles.listRatingText}>{cafe.rating || '-'}</Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })
                )}
              </View>
            )}
          </BottomSheetScrollView>
        </BottomSheet>

        {/* 💾 DB 저장 모달 */}
        <Modal visible={isDbModalVisible} animationType="fade" transparent={true}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>☕ Cafe DB 등록</Text>
                <TouchableOpacity onPress={() => setIsDbModalVisible(false)}><Ionicons name="close" size={28} color="#333" /></TouchableOpacity>
              </View>
              <Text style={styles.modalLabel}>커피 이름</Text>
              <TextInput style={styles.modalInput} placeholder="예: 바닐라 라떼" value={dbForm.coffeeName} onChangeText={t => setDbForm({...dbForm, coffeeName: t})} />
              <Text style={styles.modalLabel}>카페인 (mg)</Text>
              <TextInput style={styles.modalInput} placeholder="예: 75" keyboardType="numeric" value={dbForm.caffeine} onChangeText={t => setDbForm({...dbForm, caffeine: t})} />
              <Text style={styles.modalLabel}>브랜드/카페명</Text>
              <TextInput style={styles.modalInput} placeholder="예: 투썸플레이스" value={dbForm.brand} onChangeText={t => setDbForm({...dbForm, brand: t})} />
              <TouchableOpacity style={styles.modalSaveBtn} onPress={handleSaveToDb} disabled={dbSaving}>
                {dbSaving ? <ActivityIndicator color="#fff" /> : <Text style={styles.modalSaveBtnText}>클라우드 DB에 저장</Text>}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        {/* 📋 DB 목록 모달 */}
        <Modal visible={isDbListModalVisible} animationType="slide" transparent={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.listModalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>📋 내 카페인 DB 목록</Text>
                <TouchableOpacity onPress={() => setIsDbListModalVisible(false)}><Ionicons name="close" size={28} color="#333" /></TouchableOpacity>
              </View>
              {dbLoading ? (
                <ActivityIndicator size="large" color="#6F4E37" style={{ marginTop: 20 }} />
              ) : (
                <ScrollView style={{ marginTop: 10 }} showsVerticalScrollIndicator={false}>
                  {coffeeList.map((item, index) => (
                    <View key={index} style={styles.dbListItem}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.dbItemName}>{item.coffeeName}</Text>
                        <Text style={styles.dbItemBrand}>{item.brand || '일반 카페'}</Text>
                      </View>
                      <View style={styles.dbItemCaffeineBadge}>
                        <Text style={styles.dbItemCaffeine}>{item.caffeine} mg</Text>
                      </View>
                    </View>
                  ))}
                  {coffeeList.length === 0 && <Text style={styles.placeholder}>저장된 데이터가 없습니다.</Text>}
                </ScrollView>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  topCenterButtonContainer: { position: 'absolute', top: 50, alignSelf: 'center', zIndex: 10 },
  refreshButton: { flexDirection: 'row', backgroundColor: '#4A90E2', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 25, alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8 },
  refreshButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14, marginLeft: 6 },

  topLeftButtonContainer: { position: 'absolute', top: 50, left: 20, zIndex: 10 },
  topRightButtonContainer: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
  floatingButton: { backgroundColor: '#6F4E37', width: 50, height: 50, borderRadius: 25, justifyContent: 'center', alignItems: 'center', shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 4.65, elevation: 8 },

  sheetContent: { padding: 24, paddingBottom: 50 },
  divider: { height: 1, backgroundColor: '#eee', marginVertical: 20 },

  listHeader: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  listItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f9f9f9', padding: 12, borderRadius: 12, marginBottom: 10 },
  brandDot: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  brandDotText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  listInfo: { flex: 1, marginRight: 10 },
  listNameRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  listName: { fontSize: 16, fontWeight: 'bold', color: '#333', flexShrink: 1 },
  franchiseBadge: { backgroundColor: '#E3F2FD', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 6 },
  franchiseBadgeText: { color: '#2E7D32', fontSize: 10, fontWeight: 'bold' },
  listAddress: { fontSize: 12, color: '#888' },
  listRating: { flexDirection: 'row', alignItems: 'center' },
  listRatingText: { fontSize: 14, fontWeight: 'bold', color: '#555', marginLeft: 4 },

  backButton: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', marginBottom: 15, paddingVertical: 5, paddingRight: 10 },
  backButtonText: { marginLeft: 5, color: '#666', fontSize: 14, fontWeight: 'bold' },
  detailTitle: { fontSize: 24, fontWeight: 'bold', color: '#3e2723', flexShrink: 1 },
  franchiseBadgeLarge: { backgroundColor: '#E3F2FD', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginLeft: 10 },
  franchiseBadgeTextLarge: { color: '#2E7D32', fontSize: 12, fontWeight: 'bold' },
  detailRow: { flexDirection: 'row', marginBottom: 8, alignItems: 'center' },
  detailLabel: { fontWeight: '600', marginRight: 8, color: '#666', fontSize: 16 },
  detailValue: { fontSize: 16, color: '#333', flex: 1 },

  aiHeader: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  aiSubHeader: { fontSize: 13, color: '#888', marginBottom: 15 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 14, marginBottom: 10, fontSize: 15, backgroundColor: '#fff' },
  aiButton: { backgroundColor: '#4A90E2', padding: 15, borderRadius: 10, alignItems: 'center' },
  aiButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  aiResultBox: { marginTop: 20, padding: 18, backgroundColor: '#F8F9FA', borderRadius: 15, alignItems: 'center', borderWidth: 1, borderColor: '#eee' },
  aiResultKcal: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  aiResultRatio: { fontSize: 16, marginVertical: 8, color: '#555' },
  aiResultMsg: { fontSize: 14, fontStyle: 'italic', color: '#666', textAlign: 'center', lineHeight: 20 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 25, shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 10 },
  listModalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 25, maxHeight: '80%', shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 10 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#3e2723' },
  modalLabel: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 6 },
  modalInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 10, padding: 12, fontSize: 15, marginBottom: 15, backgroundColor: '#fafafa' },
  modalSaveBtn: { backgroundColor: '#6F4E37', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  modalSaveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  dbListItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f9f5f2', padding: 15, borderRadius: 12, marginBottom: 10 },
  dbItemName: { fontSize: 16, fontWeight: 'bold', color: '#3e2723', marginBottom: 4 },
  dbItemBrand: { fontSize: 12, color: '#8d6e63' },
  dbItemCaffeineBadge: { backgroundColor: '#ffebe6', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 20 },
  dbItemCaffeine: { fontSize: 14, fontWeight: 'bold', color: '#d84315' },
  
  placeholder: { fontSize: 15, color: '#999', textAlign: 'center', marginTop: 30 }
});