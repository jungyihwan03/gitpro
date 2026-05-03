import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../constants';
import { useNavigation, useRoute } from '@react-navigation/native';

import NavHeader from '../components/NavHeader'; 
import { PrimaryButton } from '../components/PrimaryButton';
import CalorieCard from '../components/CalorieCard';             
import NutritionListCard from '../components/NutritionListCard'; 

export default function MenuDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // 🌟 SearchScreen에서 넘겨준 item(커피정보)과 user(내정보)를 모두 받습니다.
  const { item, user } = route.params || {};
  
  const [isFav, setIsFav] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 영양성분 리스트 바인딩
  const nutritionData = [
    { label: '칼로리 (kcal)', value: String(item?.calories || 0), isHighlight: true },
    { label: '당류 (g)', value: '0' },
    { label: '단백질 (g)', value: String(item?.protein || 0) },
    { label: '카페인 (mg)', value: String(item?.caffeine || 0) },
    { label: '포화지방 (g)', value: '0' },
    { label: '나트륨 (mg)', value: '0' },
  ];

  // 🌟 섭취 기록 저장 함수
  const handleSaveIntake = async () => {
    if (isSubmitting) return;
    
    // 🌟 [해결 포인트] route.params로 전달받은 실제 유저의 _id를 추출합니다.
    const userId = user?._id; 

    if (!userId) {
      Alert.alert("알림", "로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
      const response = await fetch(`${backendUrl}/api/intake/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId, // 24자리 hex string 형태의 실제 ID 전송
          coffeeName: item.coffeeName,
          brand: item.brand,
          calories: item.calories,
          caffeine: item.caffeine,
          protein: item.protein,
          emoji: item.emoji || "☕"
        }),
      });

      if (response.ok) {
      Alert.alert("기록 완료", "오늘의 섭취 목록에 추가되었습니다.", [
        { 
          text: "확인", 
          onPress: () => {
            // 🌟 [핵심 수정] 홈으로 돌아갈 때, 현재 페이지가 들고 있던 user 정보를 다시 넘겨줍니다.
            navigation.navigate('MainTabs', { 
              screen: 'Home',
              params: { user: user } // 이 부분이 빠지면 홈에서 유저 ID를 잃어버립니다!
            }); 
          }
        }
      ]);
    }
    } catch (error) {
      Alert.alert("오류", "서버와 통신할 수 없습니다.");
      console.error("Fetch 에러:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <NavHeader 
          title="메뉴 상세 정보" 
          onBack={() => navigation.goBack()} 
          rightAction={FavButton} 
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* 상단 이미지 영역 */}
        <View style={styles.heroImgWrap}>
          <Text style={styles.heroEmoji}>{item?.emoji || "☕"}</Text>
        </View>

        <View style={styles.contentArea}>
          {/* 메뉴 기본 정보 카드 */}
          <View style={styles.menuInfoCard}>
            <Text style={styles.menuBrand}>{item?.brand || "브랜드 정보 없음"}</Text>
            <Text style={styles.menuName}>{item?.coffeeName || "메뉴명 정보 없음"}</Text>
            <View style={styles.sizeChip}>
              <Text style={styles.sizeChipText}>
                기준: {item?.category === '편의점' ? '1개입' : 'Tall 사이즈'}
              </Text>
            </View>
          </View>

          {/* 칼로리 강조 카드 */}
          <CalorieCard value={String(item?.calories || 0)} />

          {/* 세부 영양 성분 리스트 */}
          <NutritionListCard data={nutritionData} />
        </View>
      </ScrollView>

      {/* 🌟 하단 고정 버튼 */}
      <View style={styles.ctaWrap}>
        <PrimaryButton 
          title={isSubmitting ? "기록 중..." : "섭취 기록하기"} 
          onPress={handleSaveIntake} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  headerArea: { backgroundColor: Colors.surface },
  favBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  scrollArea: { flexGrow: 1, paddingBottom: 100 },
  heroImgWrap: { 
    width: '100%', 
    aspectRatio: 4 / 3, 
    backgroundColor: '#FFF4EC', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  heroEmoji: { fontSize: 80 },
  contentArea: { flexDirection: 'column', gap: 24, paddingTop: 24, paddingHorizontal: 24 },
  menuInfoCard: { 
    backgroundColor: Colors.surface, 
    borderRadius: Layout.radiusLg, 
    padding: 24, 
    alignItems: 'center', 
    gap: 8, 
    ...Layout.shadow1 
  },
  menuBrand: { fontSize: 14, fontWeight: '500', color: Colors.primary, lineHeight: 20 },
  menuName: { fontSize: 24, fontWeight: '700', color: Colors.text1, lineHeight: 32, textAlign: 'center' },
  sizeChip: { 
    height: 32, 
    paddingHorizontal: 12, 
    borderRadius: Layout.radiusFull, 
    borderWidth: 1, 
    borderColor: Colors.border, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 4 
  },
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