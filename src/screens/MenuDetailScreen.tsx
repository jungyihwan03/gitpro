import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../constants';

// 🌟 네비게이션 도구 임포트
import { useNavigation } from '@react-navigation/native';

import NavHeader from '../components/NavHeader'; 
import { PrimaryButton } from '../components/PrimaryButton';
import CalorieCard from '../components/CalorieCard';             
import NutritionListCard from '../components/NutritionListCard'; 

export default function MenuDetailScreen() {
  const [isFav, setIsFav] = useState(true);
  
  // 🌟 네비게이션 도구 장착
  const navigation = useNavigation();

  const nutritionData = [
    { label: '칼로리 (kcal)', value: '15', isHighlight: true },
    { label: '당류 (g)', value: '0' },
    { label: '단백질 (g)', value: '1' },
    { label: '카페인 (mg)', value: '150' },
    { label: '포화지방 (g)', value: '0' },
    { label: '나트륨 (mg)', value: '10' },
  ];

  const FavButton = (
    <TouchableOpacity activeOpacity={0.6} style={styles.favBtn} onPress={() => setIsFav(!isFav)}>
      <Svg width="24" height="24" viewBox="0 -2 24 24" fill="none">
        {isFav ? (
          <Path d="M12 21S2 14 2 7.5A5.5 5.5 0 0112 4a5.5 5.5 0 0110 3.5C22 14 12 21 12 21z" fill={Colors.error} />
        ) : (
          <Path d="M12 21S2 14 2 7.5A5.5 5.5 0 0112 4a5.5 5.5 0 0110 3.5C22 14 12 21 12 21z" stroke={Colors.text3} strokeWidth="1.8" fill="none" />
        )}
      </Svg>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.headerArea}>
        {/* 🌟 onBack에 navigation.goBack()을 연결했습니다. */}
        <NavHeader 
          title="메뉴 상세 정보" 
          onBack={() => navigation.goBack()} 
          rightAction={FavButton} 
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.heroImgWrap}><Text style={styles.heroEmoji}>☕</Text></View>

        <View style={styles.contentArea}>
          <View style={styles.menuInfoCard}>
            <Text style={styles.menuBrand}>스타벅스</Text>
            <Text style={styles.menuName}>아이스 아메리카노</Text>
            <View style={styles.sizeChip}><Text style={styles.sizeChipText}>기준: 355ml / Tall 사이즈</Text></View>
          </View>

          <CalorieCard value="15" />
          <NutritionListCard data={nutritionData} />
        </View>
      </ScrollView>

      <View style={styles.ctaWrap}>
        <PrimaryButton title="섭취 기록하기" onPress={() => console.log('기록하기 클릭됨')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  headerArea: { backgroundColor: Colors.surface },
  favBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  scrollArea: { flexGrow: 1, paddingBottom: 100 },
  heroImgWrap: { width: '100%', aspectRatio: 4 / 3, backgroundColor: '#FFF4EC', alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: 80 },
  contentArea: { flexDirection: 'column', gap: 24, paddingTop: 24, paddingHorizontal: 24 },
  menuInfoCard: { backgroundColor: Colors.surface, borderRadius: Layout.radiusLg, padding: 24, alignItems: 'center', gap: 8, ...Layout.shadow1 },
  menuBrand: { fontSize: 14, fontWeight: '500', color: Colors.primary, lineHeight: 20 },
  menuName: { fontSize: 24, fontWeight: '700', color: Colors.text1, lineHeight: 32, textAlign: 'center' },
  sizeChip: { height: 32, paddingHorizontal: 12, borderRadius: Layout.radiusFull, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 4 },
  sizeChipText: { fontSize: 12, fontWeight: '500', color: Colors.text2 },
  ctaWrap: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    paddingTop: 12, 
    paddingHorizontal: 24, 
    paddingBottom: 24, 
    backgroundColor: Colors.surface, 
    borderTopWidth: 1, 
    borderTopColor: Colors.divider 
  },
});