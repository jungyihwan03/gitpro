import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../constants';

// 컴포넌트 임포트 (기존 + 신규)
import NavHeader from '../components/NavHeader';
import SearchBar from '../components/SearchBar';
import { PrimaryButton } from '../components/PrimaryButton';
import TabBar from '../components/TabBar';
import BrandFeaturedButton from '../components/BrandFeaturedButton';
import BrandAlphaButton from '../components/BrandAlphaButton';

export default function BrandSelectScreen() {
  const [activeTab, setActiveTab] = useState('프랜차이즈');
  
  // HTML 코드의 동작과 동일하게 '스타벅스', '메가MGC커피'가 기본 선택된 상태로 설정합니다.
  const [selectedBrands, setSelectedBrands] = useState<string[]>(['스타벅스', '메가MGC커피']);

  // 브랜드 선택 토글 함수
  const toggleBrand = (brandName: string) => {
    setSelectedBrands(prev => 
      prev.includes(brandName) 
        ? prev.filter(b => b !== brandName) 
        : [...prev, brandName]
    );
  };

  // 초기화 버튼 함수
  const handleReset = () => {
    setSelectedBrands([]);
  };

  // NavHeader 우측에 들어갈 초기화 텍스트 버튼
  const ResetButton = (
    <TouchableOpacity onPress={handleReset} activeOpacity={0.6} style={styles.resetBtnWrap}>
      <Text style={styles.resetBtnText}>초기화</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* 🌟 노치 및 헤더 영역 */}
      <View style={styles.headerArea}>
        <NavHeader 
          title="브랜드 선택" 
          onBack={() => console.log('뒤로 가기')} 
          rightAction={ResetButton} 
        />
        
        {/* 검색바 및 탭 영역 */}
        <View style={styles.searchTabArea}>
          <SearchBar placeholder="브랜드를 검색해보세요" />
          <TabBar 
            tabs={['프랜차이즈', '편의점', '믹스커피', '개인카페']} 
            activeTab={activeTab} 
            onTabPress={setActiveTab} 
          />
        </View>
      </View>

      {/* 메인 스크롤 콘텐츠 */}
      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        
        {/* 1. 자주 찾는 브랜드 섹션 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>자주 찾는 브랜드</Text>
          <View style={styles.featuredGrid}>
            <BrandFeaturedButton 
              emoji="☕" name="스타벅스" 
              isSelected={selectedBrands.includes('스타벅스')} 
              onPress={() => toggleBrand('스타벅스')} 
            />
            <BrandFeaturedButton 
              emoji="🍵" name="메가MGC커피" 
              isSelected={selectedBrands.includes('메가MGC커피')} 
              onPress={() => toggleBrand('메가MGC커피')} 
            />
            <BrandFeaturedButton 
              emoji="🍓" name="투썸플레이스" 
              isSelected={selectedBrands.includes('투썸플레이스')} 
              onPress={() => toggleBrand('투썸플레이스')} 
            />
          </View>
        </View>

        {/* 2. 가나다순 섹션 (3열 그리드 배치) */}
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
                isSelected={selectedBrands.includes(brand.name)} 
                onPress={() => toggleBrand(brand.name)} 
              />
            ))}
          </View>
        </View>

      </ScrollView>

      {/* 3. 하단 CTA (PrimaryButton 재사용) */}
      <SafeAreaView edges={['bottom']} style={styles.ctaWrap}>
        <PrimaryButton 
          title={selectedBrands.length > 0 ? `${selectedBrands.length}개 브랜드 적용하기` : '브랜드를 선택해주세요'} 
          disabled={selectedBrands.length === 0}
          onPress={() => console.log('적용하기 클릭')} 
        />
      </SafeAreaView>

    </View>
  );
}

const styles = StyleSheet.create({
  // 전체 배경
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  // 상태바, NavHeader, 검색 영역을 모두 포함하는 흰색 상단 배경
  headerArea: {
    backgroundColor: Colors.surface,
  },
  resetBtnWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  searchTabArea: {
    paddingTop: 12,
    paddingHorizontal: 24,
  },
  // 스크롤 영역
  scrollArea: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 120, // 하단 고정 CTA를 피하기 위한 여백
    gap: 32, // 섹션 간의 간격
  },
  section: {
    flexDirection: 'column',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 28,
    marginBottom: 16,
  },
  featuredGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  // 알파벳 브랜드들의 3열 그리드를 구현하기 위한 flex-wrap
  alphaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between', // 남은 간격을 일정하게 분배
  },
  // 하단 고정 CTA 버튼 래퍼
  ctaWrap: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    paddingTop: 12,
    paddingHorizontal: 24,
    paddingBottom: 24,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
});