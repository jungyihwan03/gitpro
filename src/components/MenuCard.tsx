import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../constants';

interface MenuCardProps {
  imgEmoji: string;
  brand: string;
  name: string;
  kcal: string;
  initialFav?: boolean;
  onPress?: () => void; // 🌟 onPress 프롭 추가
}

export default function MenuCard({ 
  imgEmoji, 
  brand, 
  name, 
  kcal, 
  initialFav = false,
  onPress // 🌟 추가
}: MenuCardProps) {
  const [isFav, setIsFav] = useState(initialFav);

  return (
    <TouchableOpacity 
      activeOpacity={0.8} 
      style={styles.menuCard} 
      onPress={onPress} // 🌟 드디어 클릭 이벤트가 연결되었습니다!
    >
      {/* 썸네일 */}
      <View style={styles.menuImg}>
        <Text style={styles.emoji}>{imgEmoji}</Text>
      </View>

      {/* 정보 */}
      <View style={styles.menuInfo}>
        <Text style={styles.menuBrand}>{brand}</Text>
        <Text style={styles.menuName} numberOfLines={2}>{name}</Text>
        <View style={styles.kcalChip}>
          <Text style={styles.kcalText}>{kcal}</Text>
        </View>
      </View>

      {/* 우측 액션 버튼들 */}
      <View style={styles.menuActions}>
        <TouchableOpacity 
          activeOpacity={0.6} 
          style={styles.favBtn} 
          onPress={(e) => {
            e.stopPropagation(); // 🌟 하트 클릭 시 상세페이지로 넘어가지 않게 방지
            setIsFav(!isFav);
          }}
        >
          <Svg width="22" height="22" viewBox="0 -2 22 22" fill="none">
            {isFav ? (
              <Path d="M11 18.5S1 12 1 5.5A5 5 0 0111 3a5 5 0 0110 2.5C21 12 11 18.5 11 18.5z" fill={Colors.error} />
            ) : (
              <Path d="M11 18.5S1 12 1 5.5A5 5 0 0111 3a5 5 0 0110 2.5C21 12 11 18.5 11 18.5z" stroke={Colors.text3} strokeWidth="1.6" fill="none" />
            )}
          </Svg>
        </TouchableOpacity>
        
        <TouchableOpacity 
          activeOpacity={0.6} 
          style={styles.storeBtn}
          onPress={(e) => e.stopPropagation()} // 🌟 매장찾기 클릭 시 이동 방지
        >
          <Svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill={Colors.text2} />
          </Svg>
          <Text style={styles.storeBtnText}>매장 찾기</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    ...Layout.shadow1,
  },
  menuImg: {
    width: 72,
    height: 72,
    borderRadius: Layout.radiusMd,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 28,
  },
  menuInfo: {
    flex: 1,
    flexDirection: 'column',
    gap: 2,
  },
  menuBrand: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.text2,
    lineHeight: 16,
  },
  menuName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 20,
  },
  kcalChip: {
    backgroundColor: 'rgba(139, 46, 58, 0.08)',
    borderRadius: Layout.radiusFull,
    paddingHorizontal: 10,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  kcalText: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '700',
  },
  menuActions: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: 8,
    alignSelf: 'stretch',
  },
  favBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 32,
    paddingHorizontal: 12,
    borderRadius: Layout.radiusFull,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  storeBtnText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text2,
  },
});