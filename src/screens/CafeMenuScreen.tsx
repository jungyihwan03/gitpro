// src/screens/CafeDetailScreen.tsx
import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
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
      {/* ✨ 1. 상태바 스타일 적용: 배경 흰색, 글자 어둡게 */}
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <NavHeader 
        title="카페 상세 정보" 
        onBack={() => console.log('뒤로가기')}
        rightAction={HeartButton}
      />

      <ScrollView 
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CafeHeroCard />
        
        {/* 임시로 메뉴 탭 하이라이트 */}
        <CafeTabBar activeTab="메뉴" />
        
        {/* 여기에 메뉴 리스트나 리뷰 리스트가 들어가면 됩니다 */}
        <CafeMenuList />
      </ScrollView>

      {/* ✨ 2. 배경 날리고 위로 올린 플로팅 버튼 */}
      <BottomCtaBar 
        title="선택한 메뉴 기록하기" 
        onPress={() => console.log('기록하기 클릭')}
      />

      {/* 바텀 네비게이션 */}
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
    // ✨ 하단 스크롤 여백: CTA 버튼과 바텀 네비게이션에 내용이 가려지지 않게 넉넉히 줍니다.
    paddingBottom: 180, 
  },
});