import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { Colors } from '../constants';

// 🌟 부모(HomeScreen)로부터 이름을 받기 위한 설정
interface AppBarProps {
  userName?: string;
  onSearchPress?: () => void;
}

export default function AppBar({ userName, onSearchPress }: AppBarProps) {
  const displayName = userName || '회원';

  return (
    <View style={styles.appBar}>
      <View style={styles.profileArea}>
        <View style={styles.avatar}>
          <Svg viewBox="0 0 30 34" fill="none" width="30" height="30">
            <Circle cx="15" cy="11" r="8" fill={Colors.avatarIcon} />
            <Ellipse cx="15" cy="30" rx="13" ry="9" fill={Colors.avatarIcon} />
          </Svg>
        </View>
        <View style={styles.greeting}>
          <Text style={styles.subText}>좋은 하루 되세요!</Text>
          <Text style={styles.nameText}>환영합니다, {displayName}님</Text>
        </View>
      </View>
      
      <View style={styles.topActions}>
        <TouchableOpacity activeOpacity={0.6} style={styles.iconBtn} onPress={onSearchPress}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Circle cx="10.5" cy="10.5" r="6" stroke={Colors.text1} strokeWidth="1.8" />
            <Path d="M15.5 15.5L20 20" stroke={Colors.text1} strokeWidth="1.8" strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
      </View>
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
    paddingLeft: 16,
    paddingRight: 8,
  },
  profileArea: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.avatarBg, overflow: 'hidden', alignItems: 'center', justifyContent: 'flex-end' },
  greeting: { justifyContent: 'center' },
  subText: { fontSize: 12, color: Colors.text2, fontWeight: '400', lineHeight: 16 },
  nameText: { fontSize: 16, fontWeight: '700', color: Colors.text1, lineHeight: 20 },
  topActions: { flexDirection: 'row' },
  iconBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', position: 'relative' },
});