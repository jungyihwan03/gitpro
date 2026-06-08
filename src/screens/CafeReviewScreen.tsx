import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';

import { Colors, Layout } from '../constants';

// ✨ 팀원분이 만들어두신 4개의 컴포넌트 사용!
import NavHeader from '../components/NavHeader';
import CafeHeroCard from '../components/CafeHeroCard';
import CafeTabBar from '../components/CafeTabBar';
import BottomNavBar from '../components/BottomNavBar';

// 위에서 분리한 리뷰 전용 컴포넌트들
import { ReviewWriteCard } from '../components/CafeReviewScreen/ReviewWriteCard';
import { ReviewItem } from '../components/CafeReviewScreen/ReviewItem';

export const CafeReviewScreen = () => {
  const [isFav, setIsFav] = useState(false);

  // 우측 상단 즐겨찾기 하트 아이콘
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
      {/* 상단바 */}
      <NavHeader title="카페 상세 정보" onBack={() => console.log('뒤로가기')} rightAction={FavIcon} />
      <StatusBar style="dark" />

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        
        {/* 🌟 1. 이미 만들어진 히어로 카드 */}
        <CafeHeroCard />

        {/* 🌟 2. 이미 만들어진 탭 바 */}
        <CafeTabBar activeTab="리뷰" onTabChange={() => {}} />

        {/* 3. 리뷰 메인 섹션 */}
        <View style={styles.card}>
          
          {/* 평점 요약 및 정렬 */}
          <View style={styles.ratingSummary}>
            <View style={styles.ratingBigGroup}>
              <Text style={styles.ratingBigScore}>4.8</Text>
              <View style={styles.ratingBigRight}>
                <View style={{ flexDirection: 'row', gap: 2 }}>
                  {[1,2,3,4,5].map((_, i) => (
                    <Svg key={i} width="18" height="18" viewBox="0 0 24 24"><Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#F9A825"/></Svg>
                  ))}
                </View>
                <Text style={styles.ratingBigCount}>총 128개의 리뷰</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.sortBtn}>
              <Text style={styles.sortBtnText}>최신순</Text>
              <Svg width="14" height="14" viewBox="0 0 24 24"><Path d="M7 10l5 5 5-5z" fill={Colors.text2}/></Svg>
            </TouchableOpacity>
          </View>

          {/* 리뷰 작성 박스 */}
          <ReviewWriteCard />

          <View style={styles.divider} />

          {/* 리뷰 목록 */}
          <ReviewItem 
            initial="김" avatarBg="#FFF0F0" avatarColor="#8B2E3A"
            name="김커피" rating={5} date="23.10.14" helpfulCount={12}
            body="아메리카노 산미가 적당해서 좋았어요. 매장 분위기도 조용하고 작업하기 딱 좋은 공간입니다. 직원분들도 친절하셔서 자주 올 것 같아요! 👍"
            photos={['#f5c97a', '#f0b96a', '#f4c5a0']}
          />
          <View style={styles.divider} />
          
          <ReviewItem 
            initial="카" avatarBg="#F0FDF4" avatarColor="#16A34A"
            name="카페러버" rating={4} date="23.10.12" helpfulCount={5}
            body="라떼 아트가 너무 예뻐요! 사진 찍기 좋은 곳입니다. 다만 주말에는 사람이 좀 많아서 웨이팅이 있을 수 있어요."
            photos={['#e8d5b7']}
          />
          <View style={styles.divider} />

          <ReviewItem 
            initial="디" avatarBg="#FFF0F3" avatarColor="#C62828"
            name="디저트킬러" rating={4} date="23.10.05" helpfulCount={3}
            body="티라미수가 진짜 맛있어요! 커피랑 찰떡궁합입니다. 재방문 의사 100%"
          />

        </View>
      </ScrollView>

      {/* 🌟 4. 팀에서 쓰는 하단 바 */}
      <BottomNavBar activeTab="지도" />
      
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  scrollArea: { padding: 24, gap: 24, paddingBottom: 110 }, 
  card: { backgroundColor: Colors.surface, borderRadius: Layout.radiusLg, padding: 24, ...Layout.shadow1 },
  
  ratingSummary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  ratingBigGroup: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  ratingBigScore: { fontSize: 48, fontWeight: '700', color: Colors.text1 },
  ratingBigRight: { gap: 4 },
  ratingBigCount: { fontSize: 12, color: Colors.text2 },
  sortBtn: { flexDirection: 'row', alignItems: 'center', height: 32, paddingHorizontal: 12, borderRadius: Layout.radiusFull, borderWidth: 1, borderColor: Colors.border, gap: 4, backgroundColor: Colors.surface, ...Layout.shadow1 },
  sortBtnText: { fontSize: 12, fontWeight: '500', color: Colors.text2 },
  
  divider: { height: 1, backgroundColor: Colors.divider, marginVertical: 20 },
});