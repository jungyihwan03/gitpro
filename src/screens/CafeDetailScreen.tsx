import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, getBrandInfo } from '../constants';
import { useNavigation, useRoute } from '@react-navigation/native';
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
import CafeExternalInfo from '../components/CafeExternalInfo';

export default function CafeDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const cafe = route.params?.cafe ?? null;
  const distance = route.params?.distance ?? '';

  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('홈');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const brandInfo = getBrandInfo(cafe?.name || '');
  const isFranchise = brandInfo.isFranchise;

  const [menuData, setMenuData] = useState<{ category: string; items: MenuItem[] }[] | null>(null);
  const [placeDetails, setPlaceDetails] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(false);

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

  const HeartButton = (
    <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
      <Ionicons 
        name={isFavorite ? "heart" : "heart-outline"} 
        size={24} 
        color={isFavorite ? Colors.error : Colors.text1} 
      />
    </TouchableOpacity>
  );

  const handleRecord = () => {
    if (!selectedId) {
      Alert.alert('알림', '기록할 메뉴를 먼저 선택해 주세요.');
      return;
    }
    navigation.navigate('MenuDetail', { menuId: selectedId });
  };

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
          loadingData ? (
            <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
          ) : isFranchise ? (
            <CafeMenuList 
              selectedId={selectedId} 
              onSelect={(id) => setSelectedId(id)} 
              menuData={menuData ?? undefined}
            />
          ) : (
            <CafeExternalInfo details={placeDetails} />
          )
        )}
        
      </ScrollView>

      {activeTab === '메뉴' && isFranchise && (
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
});
