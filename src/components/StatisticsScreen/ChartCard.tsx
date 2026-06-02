import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Layout } from '../../constants';

interface ChartDataItem {
  time: string;
  val: number;
  height: number;
  active: boolean;
}

interface ChartCardProps {
  data: ChartDataItem[];
  chips: string[];
  activeChip: string;
  onChipChange: (chip: string) => void;
}

export const ChartCard = ({ data, chips, activeChip, onChipChange }: ChartCardProps) => {
  return (
    <View style={styles.chartCard}>
      <View style={styles.chartHeaderRow}>
        <Text style={styles.chartTitle}>시간별 {activeChip} 분석</Text>
      </View>

      <View style={styles.chipRow}>
        {chips.map((chip) => {
          const isActive = activeChip === chip;
          return (
            <TouchableOpacity 
              key={chip} 
              activeOpacity={0.6}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onChipChange(chip)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{chip}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.chartArea}>
        {data.length <= 6 ? (
          <View style={styles.chartGuidelines}>
            <View style={styles.guideline} />
            <View style={styles.guideline} />
            <View style={styles.guideline} />
            <View style={styles.guideline} />
          </View>
        ) : null}
        
        {data.map((item, index) => (
          <View key={index} style={styles.barCol}>
            <Text style={[styles.barVal, item.active && styles.barValActive]}>
              {item.val > 0 ? item.val : ''}
            </Text>
            <View style={[styles.barBody, { height: item.height }, item.active && styles.barBodyActive]} />
            <Text style={[styles.barLabel, item.active && styles.barLabelActive]}>{item.time}:00</Text>
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
    backgroundColor: Colors.border,
    borderTopLeftRadius: Layout.radiusSm,
    borderTopRightRadius: Layout.radiusSm,
  },
  barBodyActive: {
    backgroundColor: Colors.primary,
    ...Layout.shadow2,
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
