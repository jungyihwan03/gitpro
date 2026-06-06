import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import Svg, { Path, Defs, ClipPath, Rect } from 'react-native-svg';
import { Colors, Layout } from '../../constants';

interface TimelineRecordItemProps {
  date: string;
  rating: number; // 1~5 (0.5 단위 지원)
  text: string;
  photos?: string[];
  isLast?: boolean;
  onDelete?: () => void;
}

export const TimelineRecordItem = ({ date, rating, text, photos, isLast, onDelete }: TimelineRecordItemProps) => {

  const handleDelete = () => {
    Alert.alert('기록 삭제', '이 기록을 삭제할까요?', [
      { text: '취소', style: 'cancel' },
      { text: '삭제', style: 'destructive', onPress: onDelete },
    ]);
  };

  // 별점 렌더링 로직 (반쪽 별 포함)
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        // 꽉 찬 별
        stars.push(
          <Svg key={i} width="16" height="16" viewBox="0 0 24 24">
            <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#F9A825" />
          </Svg>
        );
      } else if (rating === i - 0.5) {
        // 반쪽 별
        stars.push(
          <Svg key={i} width="16" height="16" viewBox="0 0 24 24">
            <Defs>
              <ClipPath id={`half-clip-${i}`}>
                <Rect x="0" y="0" width="12" height="24" />
              </ClipPath>
            </Defs>
            <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={Colors.text3} />
            <Path clipPath={`url(#half-clip-${i})`} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#F9A825" />
          </Svg>
        );
      } else {
        // 빈 별
        stars.push(
          <Svg key={i} width="16" height="16" viewBox="0 0 24 24">
            <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={Colors.text3} />
          </Svg>
        );
      }
    }
    return stars;
  };

  return (
    <View style={[styles.timelineItem, isLast && styles.timelineItemLast]}>
      {/* 타임라인 세로선 (마지막 아이템이 아닐 때만 표시) */}
      {!isLast && <View style={styles.timelineLine} />}
      
      {/* 타임라인 점 */}
      <View style={styles.timelineDot} />

      <View style={styles.contentWrap}>
        <View style={styles.metaRow}>
          <Text style={styles.recordDate}>{date}</Text>
          <View style={styles.actions}>
            <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn}>
              <Text style={styles.actionText}>수정</Text>
            </TouchableOpacity>
            <View style={styles.actionSep} />
            <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn} onPress={handleDelete}>
              <Text style={[styles.actionText, styles.deleteText]}>삭제</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.recordStars}>{renderStars()}</View>

        <View style={styles.recordCard}>
          <Text style={styles.recordText}>{text}</Text>
          
          {photos && photos.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
              {photos.map((color, idx) => (
                <View key={idx} style={[styles.recordPhoto, { backgroundColor: color }]} />
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  timelineItem: {
    position: 'relative',
    paddingLeft: 26,
    paddingBottom: 24,
  },
  timelineItemLast: {
    paddingBottom: 0,
  },
  timelineLine: {
    position: 'absolute',
    left: 5,
    top: 10,
    bottom: 0,
    width: 2,
    backgroundColor: Colors.border,
    borderRadius: 1,
  },
  timelineDot: {
    position: 'absolute',
    left: 0,
    top: 9,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.surface,
    zIndex: 2,
  },
  contentWrap: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordDate: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text2,
    letterSpacing: 0.2,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionBtn: {
    height: 30,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text2,
  },
  deleteText: {
    color: Colors.text3,
  },
  actionSep: {
    width: 1,
    height: 10,
    backgroundColor: Colors.border,
    marginHorizontal: 2,
  },
  recordStars: {
    flexDirection: 'row',
    gap: 2,
    marginBottom: 10,
  },
  recordCard: {
    backgroundColor: Colors.bg,
    borderRadius: Layout.radiusMd,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  recordText: {
    fontSize: 14,
    color: Colors.text1,
    lineHeight: 22,
  },
  photosScroll: {
    flexDirection: 'row',
    marginTop: 10,
  },
  recordPhoto: {
    width: 96,
    height: 96,
    borderRadius: Layout.radiusMd,
    marginRight: 8,
  },
});