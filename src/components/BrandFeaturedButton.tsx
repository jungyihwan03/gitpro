import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../constants';

interface BrandFeaturedButtonProps {
  emoji: string;
  name: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function BrandFeaturedButton({ emoji, name, isSelected, onPress }: BrandFeaturedButtonProps) {
  return (
    <TouchableOpacity activeOpacity={0.6} style={styles.container} onPress={onPress}>
      <View style={styles.imgWrap}>
        <View style={[styles.circle, isSelected && styles.circleSelected]}>
          <Text style={styles.emoji}>{emoji}</Text>
        </View>
        {isSelected && (
          <View style={styles.checkBadge}>
            <Svg width="12" height="10" viewBox="0 0 12 10" fill="none">
              <Path d="M1 5l3.5 3.5 6-7" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </Svg>
          </View>
        )}
      </View>
      <Text style={[styles.name, isSelected && styles.nameSelected]}>{name}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  imgWrap: {
    position: 'relative',
    width: 88,
    height: 88,
  },
  circle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.bg,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleSelected: {
    borderColor: Colors.primary,
    borderWidth: 2.5,
  },
  emoji: { fontSize: 32 },
  checkBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.text1,
    textAlign: 'center',
    lineHeight: 18,
  },
  nameSelected: {
    color: Colors.primary,
    fontWeight: '700',
  },
});