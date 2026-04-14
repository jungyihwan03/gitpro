import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { Colors, Layout } from '../constants';

interface SearchBarProps extends TextInputProps {}

export default function SearchBar({ ...rest }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.searchBar, isFocused && styles.focused]}>
      <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Circle cx="11" cy="11" r="7" stroke={Colors.text2} strokeWidth="1.8" />
        <Path d="M16.5 16.5L21 21" stroke={Colors.text2} strokeWidth="1.8" strokeLinecap="round" />
      </Svg>
      <TextInput
        style={styles.input}
        placeholderTextColor={Colors.text3}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    height: 52,
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusFull,
    borderWidth: 1.5,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 12,
    ...Layout.shadow1,
  },
  focused: {
    borderColor: Colors.primary, // 포커스 시 Primary 컬러로 변경
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: '400',
    color: Colors.text1,
    height: '100%',
  },
});