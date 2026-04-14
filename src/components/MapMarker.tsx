import React from 'react';
// 👇 DimensionValue 타입을 react-native에서 추가로 불러옵니다.
import { View, Text, StyleSheet, TouchableOpacity, DimensionValue } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../constants';

interface MapMarkerProps {
  label?: string;
  isActive?: boolean;
  // 👇 string | number 대신 DimensionValue를 사용합니다!
  top: DimensionValue;
  left: DimensionValue;
  onPress?: () => void;
}

export default function MapMarker({ label, isActive, top, left, onPress }: MapMarkerProps) {
  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      style={[styles.container, { top, left }]} 
      onPress={onPress}
    >
      {/* 라벨 (말풍선) */}
      {label && isActive && (
        <View style={styles.labelWrap}>
          <Text style={styles.labelText}>{label}</Text>
        </View>
      )}
      
      {/* 핀 모양 */}
      <View style={[styles.pin, isActive ? styles.pinActive : styles.pinInactive]}>
        <View style={styles.iconWrap}>
          <Svg width={isActive ? "18" : "14"} height={isActive ? "18" : "14"} viewBox="0 0 24 24">
            <Path 
              d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3z" 
              fill={isActive ? "#FFFFFF" : Colors.text2} 
            />
          </Svg>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    transform: [{ translateX: -18 }], // 가운데 정렬을 위한 보정
    zIndex: 5,
  },
  labelWrap: {
    marginBottom: 4,
    backgroundColor: Colors.primary,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: Layout.radiusFull,
    ...Layout.shadow2,
  },
  labelText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  pin: {
    transform: [{ rotate: '-45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadow2,
    overflow: 'hidden', // 8각형 버그 방지
  },
  iconWrap: {
    transform: [{ rotate: '45deg' }],
  },
  pinInactive: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderBottomRightRadius: 0,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  pinActive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderBottomRightRadius: 0,
    backgroundColor: Colors.primary,
  }
});