import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Colors } from '../constants';

// 팀 공통 컴포넌트
import NavHeader from '../components/NavHeader';
import BottomNavBar from '../components/BottomNavBar';

// 로컬 스크린 전용 컴포넌트
import { ComparisonChartCard } from '../components/CompareScreen.tsx/ComparisonChartCard';
import { AnalysisCard } from '../components/CompareScreen.tsx/AnalysisCard';
// 바텀시트 로드
import { FilterBottomSheet } from '../components/CompareScreen.tsx/FilterBottomSheet';

export const CompareScreen = () => {
    // 바텀시트 표시 여부
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  
  // 현재 적용된 필터 상태
  const [currentFilter, setCurrentFilter] = useState({ gender: '남성', age: '30대' });

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      {/* 🔴 상단 헤더 */}
      <NavHeader title="내 섭취량 비교" onBack={() => console.log('뒤로가기')} />

      <ScrollView contentContainerStyle={styles.scrollArea}>
        
        {/* 1. 상단 차트 영역 (필터 열기 함수와 현재 필터값 전달) */}
        <ComparisonChartCard 
          onOpenFilter={() => setIsFilterVisible(true)}
          filterGender={currentFilter.gender}
          filterAge={currentFilter.age}
        />

        {/* 2. 상세 분석 섹션 */}
        <View style={styles.analysisSection}>
          <Text style={styles.sectionTitle}>상세 분석</Text>
          
          <AnalysisCard 
            title="칼로리"
            status="LOWER"
            compareText="평균: 2,100 kcal / 나: 1,800 kcal"
            highlightText="300 kcal"
            descText="낮게 섭취하고 있습니다."
            highlightType="success"
          />

          <AnalysisCard 
            title="당류"
            status="HIGHER"
            compareText="평균: 38g / 나: 45g"
            highlightText="7g"
            descText="더 많이 섭취하고 있습니다."
            highlightType="error"
          />

          <AnalysisCard 
            title="단백질"
            status="LOWER"
            compareText="평균: 65g / 나: 52g"
            highlightText="13g"
            descText="적게 섭취하고 있습니다. 보충이 필요해요."
            highlightType="warning"
          />

          {/* 🌟 새로 추가된 카페인 분석 카드 */}
          <AnalysisCard 
            title="카페인"
            status="HIGHER"
            compareText="평균: 150mg / 나: 220mg"
            highlightText="70mg"
            descText="더 많이 섭취하고 있습니다. 수면을 위해 조절을 권장해요."
            highlightType="error"
          />
        </View>

      </ScrollView>

      {/* 🔴 하단 네비게이션 바 */}
      <BottomNavBar activeTab="분석" />
      
      {/* 🌟 3. 바텀시트 마운트 */}
      <FilterBottomSheet 
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={(filters) => {
          setCurrentFilter(filters);
          console.log('새로운 필터 적용:', filters);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  scrollArea: { 
    padding: 24, 
    gap: 24, 
    paddingBottom: 110 // BottomNavBar 공간 확보
  },
  analysisSection: {
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 28,
  }
});