import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps, Platform } from 'react-native';
import Svg, { Path, Circle, Line } from 'react-native-svg';
import { Colors, Layout } from '../constants'; // 공통 색상 및 레이아웃

interface CustomInputProps extends TextInputProps {
  label: string;
  isPassword?: boolean;
  error?: string;
  hint?: string;
  success?: string; // ✨ 추가: 성공 메시지
  leftIcon?: React.ReactNode; // ✨ 추가: 입력창 왼쪽 아이콘
  rightAction?: React.ReactNode;
  innerRightText?: string;
  innerRightTextColor?: string;
}

export const CustomInput = ({ 
  label, isPassword, error, hint, success, leftIcon, rightAction, innerRightText, innerRightTextColor, onFocus, onBlur, ...rest 
}: CustomInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPwVisible, setIsPwVisible] = useState(false);

  const paddingRight = innerRightText ? 58 : (isPassword ? 52 : 16);
  const paddingLeft = leftIcon ? 44 : 16; // 왼쪽 아이콘이 있으면 여백 확보

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <View style={styles.row}>
        <View style={styles.inputWrap}>
          {/* 왼쪽 아이콘 */}
          {leftIcon && <View style={styles.leftIconWrap}>{leftIcon}</View>}

          <View style={[
            styles.inputBox,
            isFocused && styles.inputFocused,
            error ? styles.inputError : null
          ]}>
            <TextInput
              style={[styles.input, { paddingRight, paddingLeft }]}
              placeholderTextColor={Colors.text3}
              onFocus={(e) => { setIsFocused(true); onFocus && onFocus(e); }}
              onBlur={(e) => { setIsFocused(false); onBlur && onBlur(e); }}
              secureTextEntry={isPassword && !isPwVisible}
              {...rest}
            />
            
            {innerRightText && (
              <Text style={[styles.timer, { color: innerRightTextColor || Colors.primary }]}>{innerRightText}</Text>
            )}

            {isPassword && (
              <TouchableOpacity style={styles.visibilityBtn} onPress={() => setIsPwVisible(!isPwVisible)} activeOpacity={0.6}>
                {/* 비밀번호 눈 아이콘 생략 (이전 답변과 동일) */}
              </TouchableOpacity>
            )}
          </View>
        </View>
        
        {rightAction}
      </View>

      {/* 에러, 힌트, 성공 메시지 렌더링 */}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : success ? (
        <Text style={styles.successText}>{success}</Text>
      ) : hint ? (
        <Text style={styles.hintText}>{hint}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { fontSize: 14, fontWeight: '500', color: Colors.text1, paddingLeft: 2 },
  row: { flexDirection: 'row', gap: 8 },
  inputWrap: { flex: 1, justifyContent: 'center', position: 'relative' },
  leftIconWrap: { position: 'absolute', left: 16, zIndex: 1, justifyContent: 'center' },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', height: 52,
    borderRadius: 12, borderWidth: 1.5,
    borderColor: Colors.border, backgroundColor: Colors.surface,
  },
  inputFocused: { borderColor: Colors.primary },
  inputError: { borderColor: Colors.error },
  input: { flex: 1, height: '100%', fontSize: 15, color: Colors.text1 },
  visibilityBtn: { position: 'absolute', right: 2, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  timer: { position: 'absolute', right: 14, fontSize: 13, fontWeight: '500', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  errorText: { color: Colors.error, fontSize: 12, marginTop: -2, marginLeft: 2 },
  hintText: { color: Colors.text2, fontSize: 12, marginTop: -2, marginLeft: 2 },
  successText: { color: Colors.text2, fontSize: 12, marginTop: -2, marginLeft: 2 },
});