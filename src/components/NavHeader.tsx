import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants';

interface NavHeaderProps {
  title: string;
  onBack: () => void;
  rightAction?: React.ReactNode; // ✨ 추가: 우측 커스텀 액션 버튼
}

export default function NavHeader({ title, onBack, rightAction }: NavHeaderProps) {
  return (
    <View style={styles.appBar}>
      <TouchableOpacity activeOpacity={0.6} style={styles.btnBack} onPress={onBack}>
        <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <Path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" fill={Colors.text1} />
        </Svg>
      </TouchableOpacity>
      
      <Text style={styles.appBarTitle}>{title}</Text>
      
      {/* rightAction이 있으면 렌더링, 없으면 균형을 맞추기 위한 빈 공간 렌더링 */}
      {rightAction ? (
        <View style={styles.rightActionWrap}>{rightAction}</View>
      ) : (
        <View style={styles.placeholder} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  appBar: {
    height: 64,
    backgroundColor: Colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  btnBack: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appBarTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 28,
  },
  rightActionWrap: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 48, // 양쪽 균형을 맞추기 위한 빈 공간
  },
});