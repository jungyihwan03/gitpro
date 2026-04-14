import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../constants';

interface MapFilterChipProps {
  label: string;
  isActive: boolean;
  IconDefault: React.ReactNode;
  onPress: () => void;
}

export default function MapFilterChip({ label, isActive, IconDefault, onPress }: MapFilterChipProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      style={[styles.chip, isActive && styles.activeChip]} 
      onPress={onPress}
    >
      {isActive ? (
        <Svg width="14" height="14" viewBox="0 0 24 24">
          <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#FFFFFF" />
        </Svg>
      ) : (
        IconDefault
      )}
      <Text style={[styles.label, isActive && styles.activeLabel]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: Layout.radiusFull,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    ...Layout.shadow1,
  },
  activeChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text2,
  },
  activeLabel: {
    color: '#FFFFFF',
  }
});