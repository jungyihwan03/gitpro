import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Colors, Layout } from '../constants';

import { MemoInput } from './CafeMyRecordScreen/MemoInput';
import { TimelineRecordItem } from './CafeMyRecordScreen/TimelineRecordItem';
import { ReviewWriteCard } from './CafeReviewScreen/ReviewWriteCard';

interface MyRecordTabContentProps {
  cafe?: any;
  user?: any;
}

export const MyRecordTabContent = ({ cafe, user }: MyRecordTabContentProps) => {
  const cafePlaceId = cafe?.place_id;
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState<any>(null);

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
  const cleanUrl = backendUrl?.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

  const fetchRecords = useCallback(async () => {
    if (!user?._id || !cafePlaceId) { setLoading(false); return; }
    try {
      const res = await fetch(`${cleanUrl}/api/review/my/${user._id}/${cafePlaceId}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRecords(data || []);
    } catch (e) {
      console.error('기록 로딩 실패:', e);
    } finally {
      setLoading(false);
    }
  }, [user?._id, cafePlaceId]);

  useEffect(() => { fetchRecords(); }, [fetchRecords]);

  const handleSaveMemo = async (text: string, photos: string[]) => {
    if (!user?._id || !cafePlaceId || !text.trim()) return;
    try {
      const res = await fetch(`${cleanUrl}/api/review/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          userName: user.name || '익명',
          cafePlaceId,
          cafeName: cafe?.name || '',
          rating: 5,
          text,
          photos,
          isPrivate: true,
        }),
      });
      if (res.ok) fetchRecords();
    } catch (e) {
      console.error('기록 저장 실패:', e);
    }
  };

  const handleSubmitEdit = async (rating: number, text: string, photos: string[]) => {
    if (!user?._id || !editingRecord) return;
    try {
      const res = await fetch(`${cleanUrl}/api/review/${editingRecord._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, rating, text, photos }),
      });
      if (res.ok) {
        setEditingRecord(null);
        fetchRecords();
      }
    } catch (e) {
      console.error('기록 수정 실패:', e);
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      const res = await fetch(`${cleanUrl}/api/review/${reviewId}?userId=${user._id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setRecords(records.filter(r => r._id !== reviewId));
      }
    } catch (e) {
      console.error('기록 삭제 실패:', e);
    }
  };

  return (
    <View style={styles.card}>
      {editingRecord ? (
        <>
          <TouchableOpacity onPress={() => setEditingRecord(null)} style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 12, color: Colors.primary }}>수정 취소</Text>
          </TouchableOpacity>
          <ReviewWriteCard
            onSubmit={handleSubmitEdit}
            initialRating={editingRecord.rating}
            initialText={editingRecord.text}
            initialPhotos={editingRecord.photos}
          />
        </>
      ) : (
        <MemoInput onSubmit={handleSaveMemo} />
      )}

      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <>
          <Text style={styles.recordsHeader}>
            내가 남긴 한줄평 <Text style={styles.countText}>{records.length}</Text>개
          </Text>

          <View style={styles.timelineWrap}>
            {records.length === 0 ? (
              <Text style={{ color: Colors.text3, textAlign: 'center', paddingVertical: 20 }}>카페에 대한 나의 기록을 남겨보세요.</Text>
            ) : (
              records.map((record, index) => (
                <TimelineRecordItem
                  key={record._id}
                  date={new Date(record.createdAt).toLocaleDateString('ko-KR')}
                  rating={record.rating}
                  text={record.text}
                  photos={record.photos}
                  isLast={index === records.length - 1}
                  onDelete={() => handleDelete(record._id)}
                  onEdit={() => setEditingRecord(record)}
                />
              ))
            )}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, borderRadius: Layout.radiusLg, padding: 24, ...Layout.shadow1 },
  recordsHeader: { fontSize: 18, fontWeight: '700', color: Colors.text1, lineHeight: 28, marginBottom: 20 },
  countText: { color: Colors.primary },
  timelineWrap: {},
});
