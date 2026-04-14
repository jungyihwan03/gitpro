import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SourceChipProps {
  type: 'camera' | 'gallery'; // ✨ 두 가지 타입만 받도록 설정
}

export default function SourceChip({ type }: SourceChipProps) {
  const isCamera = type === 'camera';
  
  // ✨ 타입에 따라 색상 자동 지정
  const color = isCamera ? '#8B2E3A' : '#6366F1';
  const bgColor = isCamera ? 'rgba(139,46,58,0.05)' : 'rgba(99,102,241,0.05)';
  const borderColor = isCamera ? '#8B2E3A' : '#6366F1';

  return (
    <View style={[styles.chip, { backgroundColor: bgColor, borderColor: borderColor }]}>
      {/* 갤러리일 때는 image-outline 아이콘 사용 */}
      <Ionicons name={isCamera ? "camera" : "image-outline"} size={14} color={color} />
      <Text style={[styles.chipText, { color: color }]}>
        {isCamera ? '카메라로 촬영한 사진' : '갤러리에서 선택한 사진'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    paddingHorizontal: 14,
    height: 30,
    borderRadius: 9999,
    gap: 6,
  },
  chipText: { 
    fontSize: 12, 
    fontWeight: '500' 
  },
});