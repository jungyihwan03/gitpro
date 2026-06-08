import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../constants';

import { ReviewWriteCard } from './CafeReviewScreen/ReviewWriteCard';
import { ReviewItem } from './CafeReviewScreen/ReviewItem';

export const ReviewTabContent = () => {
  return (
    <View style={styles.card}>
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

      <ReviewWriteCard />

      <View style={styles.divider} />

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
  );
};

const styles = StyleSheet.create({
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
