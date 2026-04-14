// src/components/BottomCtaBar.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PrimaryButton } from './PrimaryButton';

interface BottomCtaBarProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
}

export default function BottomCtaBar({ title, onPress, icon }: BottomCtaBarProps) {
  return (
    <View style={styles.container}>
      <PrimaryButton 
        title={title} 
        onPress={onPress} 
        leftIcon={icon} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // ✨ 바텀 네비게이션의 튀어나온 버튼과 안 겹치게 위로 띄움 (기존 80 -> 105)
    bottom: 105, 
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    zIndex: 10,
    // 🗑️ 배경색(backgroundColor), 패딩(paddingVertical), 테두리(border) 전부 삭제!
  },
});