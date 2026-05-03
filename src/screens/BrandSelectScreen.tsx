import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants';
import { useNavigation, useRoute } from '@react-navigation/native';

import NavHeader from '../components/NavHeader';
import SearchBar from '../components/SearchBar';
import { PrimaryButton } from '../components/PrimaryButton';
import TabBar from '../components/TabBar';
import BrandFeaturedButton from '../components/BrandFeaturedButton';
import BrandAlphaButton from '../components/BrandAlphaButton';

export default function BrandSelectScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // 🌟 유저 정보 추출 (Home -> BottomSheet -> BrandSelect 순서로 잘 전달되었는지 확인)
  const params = route.params || {};
  const userData = params.user || params;

  const [activeTab, setActiveTab] = useState('프랜차이즈');
  
  // 🌟 [수정] 여러 개 선택이 아닌 '한 개'만 선택되도록 문자열 상태로 변경
  const [selectedBrand, setSelectedBrand] = useState<string>('스타벅스');

  // 브랜드 선택 함수 (단일 선택 로직)
  const handleSelectBrand = (brandName: string) => {
    setSelectedBrand(brandName);
  };

  const handleReset = () => {
    setSelectedBrand('');
  };

  // 🌟 [수정] 적용하기 버튼 클릭 시 동작
  const handleApply = () => {
    if (!selectedBrand) {
      Alert.alert("알림", "브랜드를 선택해주세요.");
      return;
    }

    console.log("🚀 카메라로 이동. 선택된 브랜드:", selectedBrand);
    
    // 🌟 selectedBrands를 배열 형태로 보내 서버 API(match-nutrients)와 호환성을 유지합니다.
    navigation.navigate('MenuScannerCamera', { 
      user: userData, 
      selectedBrands: [selectedBrand] 
    });
  };

  const ResetButton = (
    <TouchableOpacity onPress={handleReset} activeOpacity={0.6} style={styles.resetBtnWrap}>
      <Text style={styles.resetBtnText}>초기화</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.headerArea}>
        <NavHeader 
          title="브랜드 선택" 
          onBack={() => navigation.goBack()} 
          rightAction={ResetButton} 
        />
        
        <View style={styles.searchTabArea}>
          <SearchBar placeholder="브랜드를 검색해보세요" />
          <TabBar 
            tabs={['프랜차이즈', '편의점', '믹스커피', '개인카페']} 
            activeTab={activeTab} 
            onTabPress={setActiveTab} 
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>자주 찾는 브랜드</Text>
          <View style={styles.featuredGrid}>
            <BrandFeaturedButton 
              emoji="☕" name="스타벅스" 
              isSelected={selectedBrand === '스타벅스'} 
              onPress={() => handleSelectBrand('스타벅스')} 
            />
            <BrandFeaturedButton 
              emoji="🍵" name="메가MGC커피" 
              isSelected={selectedBrand === '메가MGC커피'} 
              onPress={() => handleSelectBrand('메가MGC커피')} 
            />
            <BrandFeaturedButton 
              emoji="🍓" name="투썸플레이스" 
              isSelected={selectedBrand === '투썸플레이스'} 
              onPress={() => handleSelectBrand('투썸플레이스')} 
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>가나다순</Text>
          <View style={styles.alphaGrid}>
            {[
              { letter: 'G', name: '공차' },
              { letter: 'B', name: '빽다방' },
              { letter: 'P', name: '폴바셋' },
              { letter: 'E', name: '이디야커피' },
              { letter: 'H', name: '할리스' },
              { letter: 'C', name: '커피빈' },
              { letter: 'P', name: '파스쿠찌' },
              { letter: 'A', name: '엔제리너스' },
              { letter: 'D', name: '더벤티' },
            ].map((brand) => (
              <BrandAlphaButton 
                key={brand.name}
                letter={brand.letter} 
                name={brand.name} 
                isSelected={selectedBrand === brand.name} 
                onPress={() => handleSelectBrand(brand.name)} 
              />
            ))}
          </View>
        </View>

      </ScrollView>

      <SafeAreaView edges={['bottom']} style={styles.ctaWrap}>
        <PrimaryButton 
          title={selectedBrand ? `${selectedBrand} 선택됨 (적용하기)` : '브랜드를 선택해주세요'} 
          disabled={!selectedBrand}
          onPress={handleApply} 
        />
      </SafeAreaView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  headerArea: { backgroundColor: Colors.surface },
  resetBtnWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  resetBtnText: { fontSize: 14, fontWeight: '500', color: Colors.primary },
  searchTabArea: { paddingTop: 12, paddingHorizontal: 24 },
  scrollArea: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 120, gap: 32 },
  section: { flexDirection: 'column' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text1, lineHeight: 28, marginBottom: 16 },
  featuredGrid: { flexDirection: 'row', gap: 16 },
  alphaGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  ctaWrap: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    paddingTop: 12, 
    paddingHorizontal: 24, 
    paddingBottom: 24, 
    backgroundColor: Colors.surface, 
    borderTopWidth: 1, 
    borderTopColor: Colors.divider 
  },
});