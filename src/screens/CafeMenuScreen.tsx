// src/screens/CafeDetailScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants';

// 컴포넌트 임포트
import NavHeader from '../components/NavHeader';
import BottomNavBar from '../components/BottomNavBar';
import CafeHeroCard from '../components/CafeHeroCard';
import CafeTabBar from '../components/CafeTabBar';
import BottomCtaBar from '../components/BottomCtaBar'; 
import CafeMenuList from '../components/CafeMenuList'; 

export default function CafeDetailScreen({ navigation }: any) {
  const [isFavorite, setIsFavorite] = useState(false);
  
  // 🌟 1. 현재 선택된 탭 상태 (기본값 '메뉴')
  const [currentTab, setCurrentTab] = useState('메뉴');
  
  // 🌟 2. 선택된 메뉴 ID 상태 (CafeMenuList 에러 해결용)
  const [selectedMenuId, setSelectedMenuId] = useState<string | null>(null);

  const HeartButton = (
    <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
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
        title="카페 상세 정보" 
        onBack={() => navigation.goBack()}
        rightAction={HeartButton}
      />

      <ScrollView 
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CafeHeroCard />
        
        {/* 🌟 3. 에러 해결: onTabChange 속성 연결 */}
        <CafeTabBar 
          activeTab={currentTab} 
          onTabChange={(tab: string) => setCurrentTab(tab)} 
        />
        
        {/* 🌟 4. 에러 해결: selectedId, onSelect 속성 연결 및 탭 분기 처리 */}
        {currentTab === '메뉴' ? (
          <CafeMenuList 
            selectedId={selectedMenuId} 
            onSelect={(id: string) => setSelectedMenuId(id)} 
          />
        ) : (
          <View style={styles.emptyTab}>
            <Text style={{ color: Colors.text2 }}>{currentTab} 정보가 준비 중입니다.</Text>
          </View>
        )}
      </ScrollView>

      {/* 🌟 5. 로직 추가: '메뉴' 탭일 때만 기록하기 버튼 표시 */}
      {currentTab === '메뉴' && (
        <BottomCtaBar 
          title="선택한 메뉴 기록하기" 
          onPress={() => {
            if (selectedMenuId) {
              console.log('기록하기 클릭:', selectedMenuId);
              // 여기에 기록 로직 추가
            } else {
              alert('메뉴를 먼저 선택해주세요!');
            }
          }}
        />
      )}

      <BottomNavBar activeTab="지도" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 24,
    paddingBottom: 180, 
  },
  emptyTab: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  }
});