import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants';

interface SmallButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'filled' | 'outlined';
}

export const SmallButton = ({ title, onPress, variant = 'filled' }: SmallButtonProps) => {
  const isFilled = variant === 'filled';
  
  return (
    <TouchableOpacity 
      style={[styles.button, isFilled ? styles.filled : styles.outlined]} 
      activeOpacity={0.8}
      onPress={onPress}
    >
      <Text style={[styles.text, isFilled ? styles.textFilled : styles.textOutlined]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 88,
    height: 52,
    borderRadius: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filled: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  outlined: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  text: { fontSize: 14, fontWeight: '700' },
  textFilled: { color: '#FFFFFF' },
  textOutlined: { color: Colors.primary },
});