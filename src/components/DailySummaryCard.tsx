// src/components/DailySummaryCard.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout } from '../constants';

interface DailySummaryCardProps {
  calories: string | number;
  count: string | number;
  caffeine: string | number;
}

export default function DailySummaryCard({ calories, count, caffeine }: DailySummaryCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>오늘의 요약</Text>
      
      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>총 칼로리</Text>
          <Text style={[styles.summaryValue, styles.primaryText]}>
            {calories}<Text style={styles.summaryUnit}>kcal</Text>
          </Text>
        </View>
        
        <View style={[styles.summaryItem, styles.summaryBorder]}>
          <Text style={styles.summaryLabel}>섭취 횟수</Text>
          <Text style={styles.summaryValue}>
            {count}<Text style={styles.summaryUnit}>회</Text>
          </Text>
        </View>
        
        <View style={[styles.summaryItem, styles.summaryBorder]}>
          <Text style={styles.summaryLabel}>총 카페인</Text>
          <Text style={styles.summaryValue}>
            {caffeine}<Text style={styles.summaryUnit}>mg</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    padding: 24,
    ...Layout.shadow1,
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: Colors.text1, lineHeight: 28, marginBottom: 20 },
  summaryRow: { flexDirection: 'row', width: '100%' },
  summaryItem: { flex: 1, alignItems: 'center', gap: 4 },
  summaryBorder: { borderLeftWidth: 1, borderLeftColor: Colors.divider },
  summaryLabel: { fontSize: 12, fontWeight: '500', color: Colors.text2 },
  summaryValue: { fontSize: 22, fontWeight: '700', color: Colors.text1, lineHeight: 26.4 },
  primaryText: { color: Colors.primary },
  summaryUnit: { fontSize: 12, fontWeight: '400', color: Colors.text2, marginLeft: 1 },
});