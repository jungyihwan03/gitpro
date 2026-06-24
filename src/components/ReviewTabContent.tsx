import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../constants';

import { ReviewWriteCard } from './CafeReviewScreen/ReviewWriteCard';
import { ReviewItem } from './CafeReviewScreen/ReviewItem';

interface ReviewTabContentProps {
  cafe?: any;
  user?: any;
}

export const ReviewTabContent = ({ cafe, user }: ReviewTabContentProps) => {
  const cafePlaceId = cafe?.place_id;
  const [reviews, setReviews] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<any>(null);

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
  const cleanUrl = backendUrl?.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

  const fetchReviews = useCallback(async () => {
    if (!cafePlaceId) { setLoading(false); return; }
    try {
      const res = await fetch(`${cleanUrl}/api/review/list/${cafePlaceId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setReviews(data.reviews || []);
      setAvgRating(data.avgRating || 0);
      setTotalCount(data.totalCount || 0);
    } catch (e) {
      console.error('리뷰 로딩 실패:', e);
    } finally {
      setLoading(false);
    }
  }, [cafePlaceId]);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  const handleSubmit = async (rating: number, text: string, photos: string[]) => {
    if (!user?._id || !cafePlaceId) return;
    try {
      if (editingReview) {
        const res = await fetch(`${cleanUrl}/api/review/${editingReview._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, rating, text, photos }),
        });
        if (res.ok) {
          setEditingReview(null);
          fetchReviews();
        }
      } else {
        const res = await fetch(`${cleanUrl}/api/review/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user._id,
            userName: user.name || '익명',
            cafePlaceId,
            cafeName: cafe?.name || '',
            rating, text, photos,
            isPrivate: false,
          }),
        });
        if (res.ok) fetchReviews();
      }
    } catch (e) {
      console.error('리뷰 등록 실패:', e);
    }
  };

  const initial = (name: string) => name?.charAt(0) || '?';
  const colors = ['#FFF0F0', '#F0FDF4', '#FFF0F3', '#EFF6FF', '#F5F3FF'];
  const textColors = ['#8B2E3A', '#16A34A', '#C62828', '#1E40AF', '#6D28D9'];

  return (
    <View style={styles.card}>
      <View style={styles.ratingSummary}>
        <View style={styles.ratingBigGroup}>
          <Text style={styles.ratingBigScore}>{avgRating || '-'}</Text>
          <View style={styles.ratingBigRight}>
            <View style={{ flexDirection: 'row', gap: 2 }}>
              {[1,2,3,4,5].map((_, i) => (
                <Svg key={i} width="18" height="18" viewBox="0 0 24 24"><Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={i < Math.round(avgRating) ? '#F9A825' : Colors.text3}/></Svg>
              ))}
            </View>
            <Text style={styles.ratingBigCount}>총 {totalCount}개의 리뷰</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.sortBtn}>
          <Text style={styles.sortBtnText}>최신순</Text>
          <Svg width="14" height="14" viewBox="0 0 24 24"><Path d="M7 10l5 5 5-5z" fill={Colors.text2}/></Svg>
        </TouchableOpacity>
      </View>

      {editingReview && (
        <TouchableOpacity onPress={() => setEditingReview(null)} style={{ marginBottom: 8 }}>
          <Text style={{ fontSize: 12, color: Colors.primary }}>수정 취소</Text>
        </TouchableOpacity>
      )}

      <ReviewWriteCard
        key={editingReview?._id || 'new'}
        onSubmit={handleSubmit}
        initialRating={editingReview?.rating}
        initialText={editingReview?.text}
        initialPhotos={editingReview?.photos}
      />

      {loading ? (
        <ActivityIndicator color={Colors.primary} />
      ) : reviews.length === 0 ? (
        <Text style={{ color: Colors.text3, textAlign: 'center', paddingVertical: 20 }}>첫 리뷰를 남겨보세요!</Text>
      ) : (
        reviews.map((review, index) => (
          <View key={review._id}>
            {index > 0 && <View style={styles.divider} />}
            <ReviewItem
              initial={initial(review.userName)}
              avatarBg={colors[index % colors.length]}
              avatarColor={textColors[index % textColors.length]}
              name={review.userName}
              rating={review.rating}
              date={new Date(review.createdAt).toLocaleDateString('ko-KR')}
              helpfulCount={review.helpfulCount || 0}
              body={review.text}
              photos={review.photos}
              onEdit={user?._id === review.userId ? () => setEditingReview(review) : undefined}
            />
          </View>
        ))
      )}
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
