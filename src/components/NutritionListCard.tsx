import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors, Layout } from '../constants';

export interface NutritionItem {
  label: string;
  value: string | number;
  isHighlight?: boolean;
}

interface NutritionListCardProps {
  data: NutritionItem[];
  editable?: boolean;
  onValueChange?: (index: number, value: string) => void;
}

export default function NutritionListCard({ data, editable, onValueChange }: NutritionListCardProps) {
  return (
    <View style={styles.nutritionCard}>
      <View style={styles.nutritionHeader}>
        <Text style={styles.nutritionTitle}>영양 성분</Text>
      </View>
      
      <View style={styles.nutritionList}>
        {data.map((item, index) => (
          <View key={index} style={styles.nutritionRow}>
            <Text style={styles.nutritionName}>{item.label}</Text>
            {editable ? (
              <TextInput
                style={[styles.nutritionInput, item.isHighlight && styles.nutritionInputHighlight]}
                value={String(item.value)}
                onChangeText={(v) => onValueChange?.(index, v)}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={Colors.text3}
              />
            ) : (
              <Text style={[styles.nutritionVal, item.isHighlight && styles.nutritionValHighlight]}>
                {item.value}
              </Text>
            )}
          </View>
        ))}
      </View>
      
      <View style={styles.nutritionNote}>
        <Text style={styles.nutritionNoteText}>
          * 매장별 제조 방식에 따라 실제 영양 성분은 조금씩 다를 수 있습니다.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nutritionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    overflow: 'hidden',
    ...Layout.shadow1,
  },
  nutritionHeader: { paddingTop: 24, paddingHorizontal: 24, paddingBottom: 16 },
  nutritionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text1, lineHeight: 28 },
  nutritionList: { flexDirection: 'column' },
  nutritionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    minHeight: 56, paddingHorizontal: 24,
    borderTopWidth: 1, borderTopColor: Colors.divider,
  },
  nutritionName: { fontSize: 14, fontWeight: '400', color: Colors.text1, flex: 1 },
  nutritionVal: { fontSize: 14, fontWeight: '700', color: Colors.text1, marginLeft: 16 },
  nutritionValHighlight: { color: Colors.primary, fontSize: 16 },
  nutritionInput: {
    fontSize: 14, fontWeight: '700', color: Colors.text1, marginLeft: 16,
    textAlign: 'right', minWidth: 60,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
    paddingVertical: 2, paddingHorizontal: 4,
  },
  nutritionInputHighlight: { color: Colors.primary, fontSize: 16 },
  nutritionNote: {
    paddingTop: 16, paddingHorizontal: 24, paddingBottom: 24,
    borderTopWidth: 1, borderTopColor: Colors.divider, alignItems: 'center',
  },
  nutritionNoteText: { fontSize: 12, fontWeight: '400', color: Colors.text2, lineHeight: 20, textAlign: 'center' },
});