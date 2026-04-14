import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout } from '../constants';

interface CalorieCardProps {
  value: string | number;
}

export default function CalorieCard({ value }: CalorieCardProps) {
  return (
    <View style={styles.calorieCard}>
      <View style={styles.calorieLeft}>
        <View style={styles.calorieIconWrap}>
          <Text style={styles.calorieIconText}>🔥</Text>
        </View>
        <Text style={styles.calorieLabel}>칼로리 정보</Text>
      </View>
      <View style={styles.calorieRight}>
        <Text style={styles.calorieValue}>{value}</Text>
        <Text style={styles.calorieUnit}> kcal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  calorieCard: {
    backgroundColor: Colors.alertBg, // constants에 추가했던 #FFF8F1 재사용
    borderWidth: 1,
    borderColor: Colors.alertBorder, // constants에 추가했던 #FFEDD5 재사용
    borderRadius: Layout.radiusLg,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Layout.shadow1,
  },
  calorieLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  calorieIconWrap: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: Colors.avatarBg,
    alignItems: 'center', justifyContent: 'center',
  },
  calorieIconText: { fontSize: 16 },
  calorieLabel: { fontSize: 14, fontWeight: '500', color: Colors.text2, lineHeight: 20 },
  calorieRight: { flexDirection: 'row', alignItems: 'baseline' },
  calorieValue: { fontSize: 24, fontWeight: '700', color: Colors.primary, lineHeight: 32 },
  calorieUnit: { fontSize: 14, fontWeight: '500', color: Colors.text2 },
});