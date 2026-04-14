import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../constants';

interface FilterChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function FilterChip({ label, isSelected, onPress }: FilterChipProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      style={[styles.chip, isSelected && styles.selectedChip]} 
      onPress={onPress}
    >
      {isSelected && (
        <View style={styles.chipCheck}>
          <Svg width="12" height="10" viewBox="0 0 14 11" fill="none">
            <Path d="M1 5l4 4 8-8" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </View>
      )}
      <Text style={[styles.label, isSelected && styles.selectedLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32,
    paddingHorizontal: 12,
    borderRadius: Layout.radiusFull,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
    gap: 4,
  },
  selectedChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
    ...Layout.shadow1,
  },
  chipCheck: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text2,
  },
  selectedLabel: {
    color: '#FFFFFF',
  },
});