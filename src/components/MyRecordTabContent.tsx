import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout } from '../constants';

import { MemoInput } from './CafeMyRecordScreen/MemoInput';
import { TimelineRecordItem } from './CafeMyRecordScreen/TimelineRecordItem';

export const MyRecordTabContent = () => {
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

  return (
    <View style={styles.card}>
      <MemoInput />

      <Text style={styles.recordsHeader}>
        내가 남긴 한줄평 <Text style={styles.countText}>{records.length}</Text>개
      </Text>

      <View style={styles.timelineWrap}>
        {records.map((record, index) => (
          <TimelineRecordItem
            key={record.id}
            date={record.date}
            rating={record.rating}
            text={record.text}
            photos={record.photos}
            isLast={index === records.length - 1}
            onDelete={() => handleDelete(record.id)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
  timelineWrap: {},
});
