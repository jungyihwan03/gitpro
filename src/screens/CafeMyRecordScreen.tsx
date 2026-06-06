import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';

import { Colors, Layout } from '../constants';

// 팀 공통 컴포넌트 로드
import NavHeader from '../components/NavHeader';
import CafeHeroCard from '../components/CafeHeroCard';
import CafeTabBar from '../components/CafeTabBar';
import BottomNavBar from '../components/BottomNavBar';

// 로컬 스크린 전용 컴포넌트 로드
import { MemoInput } from '../components/CafeMyRecordScreen/MemoInput';
import { TimelineRecordItem } from '../components/CafeMyRecordScreen/TimelineRecordItem';

export const CafeMyRecordScreen = () => {
  const [isFav, setIsFav] = useState(false);
  
  // 삭제 테스트용 더미 상태
  const [records, setRecords] = useState([
    {
      id: 1,
      date: '23.10.14',
      rating: 5,
      text: '친구랑 와서 수다떨기 좋은 곳. 커피맛도 훌륭하고 디저트 종류도 다양해서 좋아요. 특히 당근케이크 추천! 🥕',
      photos: ['#f5c97a'],
    },
    {
      id: 2,
      date: '23.09.28',
      rating: 4,
      text: '비오는 날 창가자리에 앉으니 분위기 정말 좋네요. 혼자 책읽으러 오기에도 부담없어요.',
    },
    {
      id: 3,
      date: '23.08.15',
      rating: 4.5,
      text: '여름 한정 메뉴 수박주스 짱맛! 🍉',
    }
  ]);

  const handleDelete = (id: number) => {
    setRecords(records.filter(record => record.id !== id));
  };

  const FavIcon = (
    <TouchableOpacity onPress={() => setIsFav(!isFav)} style={{ padding: 8 }}>
      <Svg width="24" height="24" viewBox="0 0 24 24">
        {isFav ? (
          <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z" fill={Colors.error} />
        ) : (
          <Path d="M16.5 3C14.76 3 13.09 3.81 12 5.08 10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z" fill={Colors.text2} />
        )}
      </Svg>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      {/* 상단바 */}
      <NavHeader title="카페 상세 정보" onBack={() => console.log('뒤로가기')} rightAction={FavIcon} />

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        
        {/* ① 기존 공통 히어로 카드 */}
        <CafeHeroCard />

        {/* ② 기존 공통 탭 바 */}
        <CafeTabBar activeTab="나의 기록" />

        {/* ③ 나의 기록 메인 섹션 */}
        <View style={styles.card}>
          
          {/* 메모 필드 컴포넌트 */}
          <MemoInput />

          {/* 섹션 헤더 */}
          <Text style={styles.recordsHeader}>
            내가 남긴 한줄평 <Text style={styles.countText}>{records.length}</Text>개
          </Text>

          {/* 타임라인 목록 렌더링 */}
          <View style={styles.timelineWrap}>
            {records.map((record, index) => (
              <TimelineRecordItem
                key={record.id}
                date={record.date}
                rating={record.rating}
                text={record.text}
                photos={record.photos}
                isLast={index === records.length - 1} // 마지막 항목이면 선 제거 처리
                onDelete={() => handleDelete(record.id)}
              />
            ))}
          </View>

        </View>
      </ScrollView>

      {/* 🔴 팀 공통 BottomNavBar 적용 (지도 화면 기준) */}
      <BottomNavBar activeTab="지도" />
      
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  scrollArea: { padding: 24, gap: 24, paddingBottom: 110 }, 
  card: { backgroundColor: Colors.surface, borderRadius: Layout.radiusLg, padding: 24, ...Layout.shadow1 },
  
  recordsHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 28,
    marginBottom: 20,
  },
  countText: {
    color: Colors.primary,
  },
  timelineWrap: {
    // 내부 패딩/마진 제어용 래퍼
  }
});