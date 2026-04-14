import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants';
import { useNavigation } from '@react-navigation/native';

// 컴포넌트 임포트
import NavHeader from '../components/NavHeader';
import BottomNavBar from '../components/BottomNavBar';
import CafeHeroCard from '../components/CafeHeroCard';
import CafeTabBar from '../components/CafeTabBar';
import BottomCtaBar from '../components/BottomCtaBar'; 
import CafeMenuList from '../components/CafeMenuList'; 
import CafePhotoGallery from '../components/CafePhotoGallery';
import CafeDetailInfo from '../components/CafeDetailInfo';

export default function CafeDetailScreen() {
  const navigation = useNavigation<any>();
  const [isFavorite, setIsFavorite] = useState(false);
  
  // 🌟 상태 관리: 현재 탭과 선택된 메뉴 ID
  const [activeTab, setActiveTab] = useState('홈');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const HeartButton = (
    <TouchableOpacity onPress={() => setIsFavorite(!isFavorite)}>
      <Ionicons 
        name={isFavorite ? "heart" : "heart-outline"} 
        size={24} 
        color={isFavorite ? Colors.error : Colors.text1} 
      />
    </TouchableOpacity>
  );

  // 기록하기 버튼 클릭 시 실행
  const handleRecord = () => {
    if (!selectedId) {
      Alert.alert('알림', '기록할 메뉴를 먼저 선택해 주세요.');
      return;
    }
    // 선택된 ID를 가지고 상세 화면으로 이동
    navigation.navigate('MenuDetail', { menuId: selectedId });
  };

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
        
        <CafeTabBar 
          activeTab={activeTab} 
          onTabChange={(tabName) => setActiveTab(tabName)} 
        />
        
        {/* ── 탭별 컨텐츠 ── */}
        {activeTab === '홈' && (
          <>
            <CafePhotoGallery />
            <CafeDetailInfo />
          </>
        )}

        {activeTab === '메뉴' && (
          <CafeMenuList 
            selectedId={selectedId} 
            onSelect={(id) => setSelectedId(id)} // 🌟 에러 해결: 함수를 정확히 전달
          />
        )}

        {/* 리뷰/기록은 추후 구현 영역 */}
      </ScrollView>

      {/* 하단 기록하기 버튼 (메뉴 탭일 때 강조) */}
      <BottomCtaBar 
        title="선택한 메뉴 기록하기" 
        onPress={handleRecord}
      />

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