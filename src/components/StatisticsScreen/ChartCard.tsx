import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Layout } from '../../constants';

export const ChartCard = () => {
  const [activeChip, setActiveChip] = useState('칼로리');
  const chips = ['칼로리', '당', '단백질'];
  
  const chartData = [
    { time: '08', val: '120', height: 64, active: false },
    { time: '10', val: '240', height: 96, active: false },
    { time: '12', val: '350', height: 128, active: false },
    { time: '14', val: '520', height: 176, active: true },
    { time: '16', val: '180', height: 80, active: false },
    { time: '18', val: '90', height: 48, active: false },
    { time: '20', val: '45', height: 32, active: false },
  ];

  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeaderRow}>
        <Text style={styles.chartTitle}>시간별 영양소 분석</Text>
        <TouchableOpacity activeOpacity={0.6} style={styles.btnAvgCompare}>
          <Text style={styles.btnAvgCompareText}>평균과 비교</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chipRow}>
        {chips.map((chip) => {
          const isActive = activeChip === chip;
          return (
            <TouchableOpacity 
              key={chip} 
              activeOpacity={0.6}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => setActiveChip(chip)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{chip}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.chartArea}>
        <View style={styles.chartGuidelines}>
          <View style={styles.guideline} />
          <View style={styles.guideline} />
          <View style={styles.guideline} />
          <View style={styles.guideline} />
        </View>
        
        {chartData.map((item, index) => (
          <View key={index} style={styles.barCol}>
            <Text style={[styles.barVal, item.active && styles.barValActive]}>{item.val}</Text>
            <View style={[styles.barBody, { height: item.height }, item.active && styles.barBodyActive]} />
            <Text style={[styles.barLabel, item.active && styles.barLabelActive]}>{item.time}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    padding: 24,
    gap: 24,
    ...Layout.shadow1,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text1,
  },
  btnAvgCompare: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: Layout.radiusFull,
    borderWidth: 1,
    borderColor: Colors.alertBorder,
    backgroundColor: Colors.alertBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAvgCompareText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 8,
  },
  chip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: Layout.radiusFull,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: 'transparent',
    ...Layout.shadow1,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text2,
  },
  chipTextActive: {
    color: Colors.surface,
  },
  chartArea: {
    flexDirection: 'row',
    height: 240,
    alignItems: 'flex-end',
    gap: 12,
    paddingBottom: 16,
  },
  chartGuidelines: {
    ...StyleSheet.absoluteFillObject,
    top: 8,
    bottom: 24,
    justifyContent: 'space-between',
    opacity: 0.1,
  },
  guideline: {
    width: '100%',
    height: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.text3,
    borderStyle: 'dashed',
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  barVal: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.text3,
  },
  barValActive: {
    color: Colors.text1,
  },
  barBody: {
    width: '100%',
    backgroundColor: Colors.border, // 비활성 바
    borderTopLeftRadius: Layout.radiusSm,
    borderTopRightRadius: Layout.radiusSm,
  },
  barBodyActive: {
    backgroundColor: Colors.primary,
    ...Layout.shadow2, // 강조 바의 그림자
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text2,
  },
  barLabelActive: {
    fontWeight: '700',
    color: Colors.primary,
  },
});