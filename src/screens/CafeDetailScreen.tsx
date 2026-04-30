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
  
  // 🌟 상태 관리: 현재 탭(기본값 '홈')과 선택된 메뉴 ID
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
        {/* 카페 공통 상단 정보 */}
        <CafeHeroCard />
        
        {/* 탭바: 클릭 시 activeTab 상태를 변경함 */}
        <CafeTabBar 
          activeTab={activeTab} 
          onTabChange={(tabName) => {
            console.log("현재 활성화된 탭:", tabName);
            setActiveTab(tabName);
          }} 
        />
        
        {/* ── 탭별 컨텐츠 분기 ── */}
        
        {/* [홈 탭] 사진 갤러리와 상세 정보 표시 */}
        {activeTab === '홈' && (
          <>
            <CafePhotoGallery />
            <CafeDetailInfo />
          </>
        )}

        {/* [메뉴 탭] 메뉴 리스트 표시 */}
        {activeTab === '메뉴' && (
          <CafeMenuList 
            selectedId={selectedId} 
            onSelect={(id) => setSelectedId(id)} 
          />
        )}

        {/* 리뷰/기록 탭의 경우 필요 시 여기에 추가 */}
        
      </ScrollView>

      {/* 🌟 [핵심 로직] activeTab이 정확히 '메뉴'일 때만 하단 기록하기 버튼을 렌더링함 */}
      {activeTab === '메뉴' && (
        <BottomCtaBar 
          title="선택한 메뉴 기록하기" 
          onPress={handleRecord}
        />
      )}

      {/* 하단 네비게이션 바 */}
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
    // 하단바와 버튼에 가려지지 않도록 넉넉한 여백 부여
    paddingBottom: 180, 
  },
});