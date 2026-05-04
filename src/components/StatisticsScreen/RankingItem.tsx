import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout } from '../../constants';

interface RankingItemProps {
  rank: number;
  name: string;
  sub: string;
  count: string;
  unit: string;
}

export const RankingItem = ({ rank, name, sub, count, unit }: RankingItemProps) => {
  const isFirst = rank === 1;

  return (
    <View style={styles.rankingItem}>
      <View style={[styles.rankBadge, isFirst && styles.rankBadgeFirst]}>
        <Text style={[styles.rankNum, isFirst && styles.rankNumFirst]}>{rank}</Text>
      </View>
      <View style={styles.rankInfo}>
        <Text style={styles.rankName}>{name}</Text>
        <Text style={styles.rankSub}>{sub}</Text>
      </View>
      <View style={styles.rankCount}>
        <Text style={styles.rankCountNum}>{count}</Text>
        <Text style={styles.rankCountUnit}>{unit}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    ...Layout.shadow1,
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: Layout.radiusFull,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankBadgeFirst: {
    backgroundColor: Colors.primary,
  },
  rankNum: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text2,
  },
  rankNumFirst: {
    color: Colors.surface,
  },
  rankInfo: {
    flex: 1,
    gap: 2,
  },
  rankName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text1,
  },
  rankSub: {
    fontSize: 12,
    color: Colors.text2,
  },
  rankCount: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  rankCountNum: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text1,
  },
  rankCountUnit: {
    fontSize: 12,
    color: Colors.text2,
  },
});