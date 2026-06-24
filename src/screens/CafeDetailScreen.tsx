import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert, ActivityIndicator, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, getBrandInfo } from '../constants';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useUserStore } from '../store/useUserStore';
import { fetchPlaceDetails, fetchCoffeeApi } from '../api';

import NavHeader from '../components/NavHeader';
import BottomNavBar from '../components/BottomNavBar';
import CafeHeroCard from '../components/CafeHeroCard';
import CafeTabBar from '../components/CafeTabBar';
import BottomCtaBar from '../components/BottomCtaBar';
import CafeMenuList from '../components/CafeMenuList';
import type { MenuItem } from '../components/CafeMenuList';
import CafePhotoGallery from '../components/CafePhotoGallery';
import CafeDetailInfo from '../components/CafeDetailInfo';
import { ReviewTabContent } from '../components/ReviewTabContent';
import { MyRecordTabContent } from '../components/MyRecordTabContent';

export default function CafeDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const cafe = route.params?.cafe ?? null;
  const distance = route.params?.distance ?? '';
  const userData = useUserStore((s) => s.user);

  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('홈');

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
  const cleanUrl = backendUrl?.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

  const checkCafeFav = useCallback(() => {
    if (!userData?._id || !cafe?.place_id) return;
    fetch(`${cleanUrl}/api/favorite/check/${userData._id}/cafe/${cafe.place_id}`)
      .then(r => r.json())
      .then(data => setIsFavorite(data.favorited))
      .catch(e => console.warn('checkCafeFav fail', e));
  }, [userData?._id, cafe?.place_id, cleanUrl]);

  useFocusEffect(checkCafeFav);

  const toggleFavorite = () => {
    if (!userData?._id || !cafe?.place_id) return;
    fetch(`${cleanUrl}/api/favorite/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: userData._id,
        targetType: 'cafe',
        targetId: cafe.place_id,
        name: cafe.name || '',
        vicinity: cafe.vicinity || '',
      }),
    }).then(r => r.json()).then(data => setIsFavorite(data.favorited)).catch(e => console.warn('toggleCafeFav fail', e));
  };
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const brandInfo = getBrandInfo(cafe?.name || '');
  const isFranchise = brandInfo.isFranchise;

  const [rawCoffeeData, setRawCoffeeData] = useState<any[]>([]);
  const [menuData, setMenuData] = useState<{ category: string; items: MenuItem[] }[] | null>(null);
  const [placeDetails, setPlaceDetails] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);

  const [searchText, setSearchText] = useState('');
  useEffect(() => { setSelectedId(null); }, [searchText]);
  const [showNameInput, setShowNameInput] = useState(false);
  const [customName, setCustomName] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);

  const cafeLocation = useMemo(() => ({
    lat: placeDetails?.geometry?.location?.lat || cafe?.geometry?.location?.lat,
    lng: placeDetails?.geometry?.location?.lng || cafe?.geometry?.location?.lng,
  }), [placeDetails, cafe]);

  const filteredMenuData = useMemo(() => {
    if (!menuData || !searchText) return menuData;
    return menuData
      .map(section => ({
        ...section,
        items: section.items.filter(item =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        ),
      }))
      .filter(section => section.items.length > 0);
  }, [menuData, searchText]);

  useEffect(() => {
    if (!cafe?.name) return;

    setLoadingData(true);

    fetchPlaceDetails(cafe.place_id)
      .then((details) => setPlaceDetails(details))
      .catch((err) => console.error('Place Details error:', err));

    if (isFranchise) {
      const brandName = brandInfo.name;
      fetchCoffeeApi()
        .then((data: any[]) => {
          setRawCoffeeData(data);
          const filtered = data.filter((item: any) => {
            const itemBrand = (item.brand || '').toLowerCase();
            return brandName.toLowerCase().includes(itemBrand) || itemBrand.includes(brandName.toLowerCase());
          });

          if (filtered.length === 0) {
            setMenuData(null);
            return;
          }

          const grouped: Record<string, MenuItem[]> = {};
          filtered.forEach((item: any) => {
            const cat = item.category || '기타';
            if (!grouped[cat]) grouped[cat] = [];
            grouped[cat].push({
              id: item._id,
              name: item.coffeeName,
              kcal: `${item.calories || 0} kcal`,
              price: item.caffeine ? `카페인 ${item.caffeine}mg` : undefined,
              thumbColor: '#5c3317',
              iconFill: '#fff',
            });
          });

          const sections = Object.entries(grouped).map(([category, items]) => ({ category, items }));
          setMenuData(sections);
        })
        .catch((err) => {
          console.error('DB menu fetch error:', err);
          setMenuData(null);
        })
        .finally(() => setLoadingData(false));
    } else {
      setLoadingData(false);
    }
  }, [cafe?.place_id]);

  const handleSelect = (id: string) => {
    setSelectedId(id === selectedId ? null : id);
  };

  const handleRecord = () => {
    if (!selectedId) {
      Alert.alert('알림', '기록할 메뉴를 먼저 선택해 주세요.');
      return;
    }
    const fullItem = rawCoffeeData.find((c: any) => c._id === selectedId);
    if (!fullItem) {
      Alert.alert('오류', '메뉴 정보를 찾을 수 없습니다.');
      return;
    }
    if (!userData?._id) {
      Alert.alert('알림', '로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.');
      return;
    }
    navigation.navigate('MenuDetail', {
      item: { ...fullItem, brand: cafe?.name || fullItem.brand },
      user: userData,
      cafe: { name: cafe?.name, ...cafeLocation },
    });
  };

  const handleAiSearch = async () => {
    if (!customName.trim()) return;
    if (!userData?._id) {
      Alert.alert('알림', '로그인 정보가 유효하지 않습니다.');
      return;
    }
    setIsAiSearching(true);
    try {
      const res = await fetch(`${cleanUrl}/api/analyze-by-name`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coffeeName: customName.trim(), brand: cafe?.name || '' }),
      });
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }
      const aiData = await res.json();
      setShowNameInput(false);
      setCustomName('');
      navigation.navigate('MenuDetail', {
        item: { ...aiData, brand: cafe?.name || aiData.brand || '' },
        user: userData,
        cafe: { name: cafe?.name, ...cafeLocation },
      });
    } catch (e: any) {
      Alert.alert('오류', 'AI 분석에 실패했습니다.\n다시 시도해주세요.');
    } finally {
      setIsAiSearching(false);
    }
  };

  const HeartButton = (
    <TouchableOpacity onPress={toggleFavorite}>
      <Ionicons 
        name={isFavorite ? "heart" : "heart-outline"} 
        size={24} 
        color={isFavorite ? Colors.error : Colors.text1} 
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <NavHeader 
        title={cafe?.name || '카페 상세 정보'} 
        onBack={() => navigation.goBack()}
        rightAction={HeartButton}
      />

      <ScrollView 
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CafeHeroCard cafe={cafe != null ? cafe : undefined} distance={distance} phone={cafe?.phone || placeDetails?.formatted_phone_number} />
        
        <CafeTabBar 
          activeTab={activeTab} 
          onTabChange={(tabName) => {
            console.log("현재 활성화된 탭:", tabName);
            setActiveTab(tabName);
          }} 
        />
        
        {activeTab === '홈' && (
          <>
            <CafePhotoGallery photos={placeDetails?.photos} />
            <CafeDetailInfo vicinity={cafe?.vicinity} placeHours={cafe?.opening_hours || placeDetails?.opening_hours} phone={cafe?.phone || placeDetails?.formatted_phone_number} />
            {(() => { console.log('=== CafeDetailInfo phone ===', cafe?.phone, placeDetails?.formatted_phone_number); return null; })()}
          </>
        )}

        {activeTab === '메뉴' && (
          <>
            <View style={styles.searchWrap}>
              <View style={styles.searchBar}>
                <Ionicons name="search" size={18} color={Colors.text3} style={{ marginRight: 6 }} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="메뉴 검색"
                  placeholderTextColor={Colors.text3}
                  value={searchText}
                  onChangeText={setSearchText}
                />
                {searchText ? (
                  <TouchableOpacity onPress={() => setSearchText('')}>
                    <Ionicons name="close-circle" size={18} color={Colors.text3} />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>

            {loadingData ? (
              <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
            ) : isFranchise && filteredMenuData && filteredMenuData.length > 0 ? (
              <CafeMenuList 
                selectedId={selectedId} 
                onSelect={handleSelect}
                menuData={filteredMenuData}
              />
            ) : isFranchise && menuData !== null && filteredMenuData?.length === 0 ? (
              <View style={styles.noResultWrap}>
                <Text style={styles.noResultText}>검색 결과가 없습니다</Text>
              </View>
            ) : isFranchise ? (
              <CafeMenuList 
                selectedId={selectedId} 
                onSelect={handleSelect}
                menuData={undefined}
              />
            ) : null}

            {showNameInput ? (
              <View style={styles.nameInputWrap}>
                <TextInput
                  style={styles.nameInput}
                  placeholder="커피 이름 입력"
                  placeholderTextColor={Colors.text3}
                  value={customName}
                  onChangeText={setCustomName}
                  autoFocus
                />
                <View style={styles.nameInputRow}>
                  <TouchableOpacity style={styles.nameCancelBtn} onPress={() => { setShowNameInput(false); setCustomName(''); }}>
                    <Text style={styles.nameCancelBtnText}>취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.nameSearchBtn, !customName.trim() && { opacity: 0.5 }]}
                    onPress={handleAiSearch}
                    disabled={!customName.trim() || isAiSearching}
                  >
                    {isAiSearching ? (
                      <ActivityIndicator color="#FFF" size="small" />
                    ) : (
                      <Text style={styles.nameSearchBtnText}>AI 검색</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity style={styles.noMenuBtn} onPress={() => setShowNameInput(true)}>
                <Ionicons name="search" size={18} color={Colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.noMenuBtnText}>찾으시는 메뉴가 없나요?</Text>
              </TouchableOpacity>
            )}
          </>
        )}

        {activeTab === '리뷰' && <ReviewTabContent cafe={cafe} user={userData} />}

        {activeTab === '나의 기록' && <MyRecordTabContent cafe={cafe} user={userData} />}
        
      </ScrollView>

      {activeTab === '메뉴' && isFranchise && menuData && selectedId && (
        <BottomCtaBar 
          title="선택한 메뉴 기록하기" 
          onPress={handleRecord}
        />
      )}

      <BottomNavBar activeTab="지도" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scrollArea: { flex: 1 },
  scrollContent: {
    padding: 24,
    gap: 24,
    paddingBottom: 180,
  },
  searchWrap: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 48,
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.text1,
    paddingVertical: 0,
  },
  noResultWrap: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultText: {
    fontSize: 14,
    color: Colors.text3,
  },
  nameInputWrap: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  nameInput: {
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: Colors.text1,
  },
  nameInputRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
  nameCancelBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.border,
  },
  nameCancelBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text2,
  },
  nameSearchBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    minWidth: 80,
    alignItems: 'center',
  },
  nameSearchBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFF',
  },
  noMenuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  noMenuBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
});
