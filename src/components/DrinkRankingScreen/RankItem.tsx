import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout } from '../../constants';
import DrinkIcon from './DrinkIcon';

interface RankItemProps {
  item: {
    id: number;
    name: string;
    totalMg: string;
    count: number;
    type: string;
  };
}

export default function RankItem({ item }: RankItemProps) {
  const isRank1 = item.id === 1;

  // 순위별 뱃지 색상 정의
  let badgeBg = '#999999';
  if (item.id === 1) badgeBg = Colors.primary;
  else if (item.id === 2) badgeBg = '#888888';
  else if (item.id === 3) badgeBg = '#CD7F32';

  return (
    <View style={[styles.rankItem, isRank1 && styles.rankItemFirst]}>
      {/* 아이콘 및 순위 뱃지 */}
      <View style={styles.itemIconWrap}>
        <DrinkIcon type={item.type} />
        <View style={[styles.rankBadge, { backgroundColor: badgeBg }]}>
          <Text style={styles.rankBadgeText}>{item.id}</Text>
        </View>
      </View>

      {/* 텍스트 내용 */}
      <View style={styles.itemContent}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemSub}>총 {item.totalMg}mg 섭취</Text>
      </View>

      {/* 잔 수 */}
      <View style={styles.itemCount}>
        <Text style={[styles.countNum, isRank1 && { color: Colors.primary }]}>{item.count}</Text>
        <Text style={styles.countUnit}>잔</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rankItem: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 16,
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...Layout.shadow1,
  },
  rankItemFirst: { borderColor: 'rgba(139,46,58,0.20)' },
  itemIconWrap: { position: 'relative', width: 52, height: 52 },
  rankBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeText: { fontSize: 10, fontWeight: '700', color: '#FFFFFF', lineHeight: 12 },
  itemContent: { flex: 1, flexDirection: 'column', gap: 3 },
  itemName: { fontSize: 15, fontWeight: '700', color: '#111111', lineHeight: 22 },
  itemSub: { fontSize: 12, fontWeight: '400', color: '#999999', lineHeight: 18 },
  itemCount: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  countNum: { fontSize: 22, fontWeight: '700', color: '#111111' },
  countUnit: { fontSize: 12, fontWeight: '400', color: '#999999' },
});