import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Colors, Layout } from '../constants';

interface BrandAlphaButtonProps {
  letter: string;
  name: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function BrandAlphaButton({ letter, name, isSelected, onPress }: BrandAlphaButtonProps) {
  return (
    <TouchableOpacity activeOpacity={0.6} style={styles.container} onPress={onPress}>
      <View style={[styles.circle, isSelected && styles.circleSelected]}>
        <Text style={[styles.letter, isSelected && styles.textSelected]}>{letter}</Text>
      </View>
      <Text style={[styles.name, isSelected && styles.textSelected]}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // 가로 영역의 약 31%를 차지하게 하여 3열 그리드 형태를 만듭니다
  container: {
    width: '31%', 
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    marginBottom: 8,
  },
  circle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.surface,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadow1,
    overflow: 'hidden',
  },
  circleSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(139,46,58,0.08)',
  },
  letter: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text2,
  },
  name: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.text1,
    textAlign: 'center',
    lineHeight: 18,
  },
  textSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
});