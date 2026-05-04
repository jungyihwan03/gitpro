import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors, Layout } from '../../constants';

interface SummaryCardProps {
  icon: string;
  label: string;
  value: string;
  unit?: string;
  isSuccessBadge?: boolean;
  flexWeight?: number;
}

export const SummaryCard = ({ icon, label, value, unit, isSuccessBadge, flexWeight }: SummaryCardProps) => {
  return (
    <View style={[styles.card, flexWeight ? { flex: flexWeight } : { width: 174 }]}>
      <View style={styles.cardLabelRow}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>{icon}</Text>
        </View>
        <Text style={styles.cardLabel}>{label}</Text>
      </View>
      <View style={styles.cardValueRow}>
        <Text style={styles.cardValue}>{value}</Text>
        {unit && <Text style={styles.cardUnit}>{unit}</Text>}
      </View>
      {isSuccessBadge && (
        <View style={styles.badgeSuccess}>
          <Svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <Circle cx="6" cy="6" r="6" fill={Colors.success} />
            <Path d="M3 6l2 2 4-4" stroke={Colors.surface} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
          <Text style={styles.badgeSuccessText}>적정 수준</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    padding: 24,
    flexDirection: 'column',
    gap: 8,
    ...Layout.shadow1, // 공통 그림자 토큰 적용
  },
  cardLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: Layout.radiusFull,
    backgroundColor: Colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 14,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text2,
  },
  cardValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  cardValue: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text1,
  },
  cardUnit: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text2,
  },
  badgeSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  badgeSuccessText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.success,
  },
});