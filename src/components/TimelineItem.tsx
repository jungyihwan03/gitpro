// src/components/TimelineItem.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Layout } from '../constants';

interface TimelineItemProps {
  name: string;
  time: string;
  kcal: string;
  isLast?: boolean;
  isPast?: boolean; // ✨ 추가: 어제/과거 내역 여부
}

export default function TimelineItem({ name, time, kcal, isLast = false, isPast = false }: TimelineItemProps) {
  return (
    <View style={styles.timelineItem}>
      {/* 마지막 아이템이 아닐 때만 세로선 표시 */}
      {!isLast && <View style={styles.timelineLine} />}
      
      {/* ✨ isPast가 true면 과거 내역 스타일(timelineDotPast) 적용 */}
      <View style={[styles.timelineDot, isPast && styles.timelineDotPast]} />
      
      <TouchableOpacity activeOpacity={0.6} style={styles.timelineCard}>
        <View>
          <Text style={[styles.timelineName, isPast && styles.timelineNamePast]}>{name}</Text>
          <Text style={styles.timelineTime}>{time}</Text>
        </View>
        <Text style={[styles.timelineKcal, isPast && styles.timelineKcalPast]}>{kcal}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  timelineItem: { position: 'relative', paddingLeft: 20, marginBottom: 12 },
  timelineLine: { position: 'absolute', left: 5, top: 18, width: 1, height: '100%', backgroundColor: Colors.border, zIndex: -1 },
  timelineDot: { position: 'absolute', left: -1, top: 18, width: 12, height: 12, backgroundColor: Colors.primary, borderRadius: 6, borderWidth: 2, borderColor: '#FFEDD5' },
  
  // ✨ 과거 내역 추가 스타일
  timelineDotPast: { backgroundColor: Colors.text3, borderColor: Colors.bg },
  
  timelineCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Layout.shadow1,
  },
  timelineName: { fontSize: 14, fontWeight: '700', color: Colors.text1, marginBottom: 3, lineHeight: 20 },
  timelineNamePast: { color: Colors.text2, fontWeight: '500' }, // ✨ 과거 내역은 글자색 연하게 변경
  
  timelineTime: { fontSize: 12, color: Colors.text2, lineHeight: 16 },
  timelineKcal: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  timelineKcalPast: { color: Colors.text3 }, // ✨ 과거 내역 칼로리 색상 연하게 변경
});