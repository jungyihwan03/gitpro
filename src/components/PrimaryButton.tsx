import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors, Layout } from '../constants';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  leftIcon?: React.ReactNode; // ✨ 추가: 버튼 왼쪽 아이콘 (홈 화면 기록하기 버튼 대응)
}

export const PrimaryButton = ({ title, onPress, disabled, leftIcon }: ButtonProps) => {
  return (
    <TouchableOpacity 
      style={[styles.button, disabled && styles.disabled]} 
      activeOpacity={0.8} 
      onPress={onPress}
      disabled={disabled}
    >
      {/* 아이콘이 전달되면 렌더링 */}
      {leftIcon && <View style={styles.iconWrap}>{leftIcon}</View>}
      <Text style={[styles.text, disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row', // ✨ 아이콘과 텍스트를 나란히 배치하기 위해 추가
    width: '100%',
    height: 52,
    borderRadius: Layout.radiusFull,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    ...Layout.shadow4, 
  },
  iconWrap: {
    marginRight: 8, // ✨ 아이콘과 텍스트 사이 간격
  },
  disabled: { 
    backgroundColor: Colors.border, 
    shadowOpacity: 0, 
    elevation: 0 
  },
  text: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#FFFFFF',
    letterSpacing: 0.1, // 디자인 가이드 미세 조정
  },
  disabledText: { 
    color: Colors.text2 
  },
});