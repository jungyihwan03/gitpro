import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors, Layout } from '../../constants';

interface InputFieldProps {
  label: string;
  value: string;
  suffix: string;
  onChangeText?: (text: string) => void;
  editable?: boolean; // 🌟 1. editable 속성 타입 추가
}

export const InputField = ({ 
  label, 
  value, 
  suffix, 
  onChangeText, 
  editable = true // 🌟 2. 기본값을 true로 설정 (다른 곳에선 정상 입력되도록)
}: InputFieldProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={[
        styles.inputRow,
        !editable && styles.inputRowDisabled // 🌟 수정 불가 상태일 때 배경/테두리 스타일 변경
      ]}>
        <TextInput
          style={[
            styles.input,
            !editable && styles.inputDisabled // 🌟 수정 불가 상태일 때 텍스트 색상 변경
          ]}
          value={value}
          onChangeText={onChangeText}
          keyboardType="numeric"
          selectionColor={Colors.primary}
          editable={editable} // 🌟 3. TextInput에 직접 속성 전달!
        />
        <Text style={[styles.suffix, !editable && styles.inputDisabled]}>{suffix}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    gap: 6,
    flex: 1, 
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text2,
    letterSpacing: 0.2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Layout.radiusMd, // 12dp
    height: 52,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface, // 기본 배경색
  },
  inputRowDisabled: {
    backgroundColor: Colors.bg, // 수정 불가일 때 약간 회색 배경 (constants.bg 활용)
    borderColor: 'transparent', // 테두리 제거 (또는 더 옅은 색상)
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text1,
    padding: 0, 
  },
  inputDisabled: {
    color: Colors.text2, // 수정 불가일 때 글자색을 회색으로 변경
  },
  suffix: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.text2,
    marginLeft: 4,
  },
});