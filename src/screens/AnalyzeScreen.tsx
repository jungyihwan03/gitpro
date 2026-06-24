import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { BACKEND_API_URL } from '../constants';

import NavHeader from '../components/NavHeader'; 
import SourceChip from '../components/SourceChip';
import PhotoPreviewScanner from '../components/PhotoPreviewScanner';
import PulseDots from '../components/PulseDots';

// 음료명 키워드 기반 평균 영양소 추정
function estimateNutrition(name: string) {
  const n = name.replace(/\s+/g, '');
  let base: any;
  if (/아메리카노/.test(n)) base = { calories: 10, caffeine: 150, sugar: 0, protein: 0, saturatedFat: 0, sodium: 5, subCategory: '에스프레소' };
  else if (/라떼|카페라떼/.test(n)) base = { calories: 180, caffeine: 75, sugar: 12, protein: 8, saturatedFat: 4, sodium: 100, subCategory: '라떼' };
  else if (/(바닐라|헤이즐넛|시럽)/.test(n)) base = { calories: 200, caffeine: 75, sugar: 18, protein: 7, saturatedFat: 3.5, sodium: 90, subCategory: '시럽 추가 커피' };
  else if (/모카|초코|핫초코/.test(n)) base = { calories: 350, caffeine: 80, sugar: 30, protein: 10, saturatedFat: 6, sodium: 150, subCategory: '모카/초코' };
  else if (/카푸치노/.test(n)) base = { calories: 120, caffeine: 75, sugar: 8, protein: 6, saturatedFat: 3, sodium: 70, subCategory: '카푸치노' };
  else if (/돌체|연유|콘파나/.test(n)) base = { calories: 250, caffeine: 75, sugar: 22, protein: 6, saturatedFat: 4.5, sodium: 80, subCategory: '연유/돌체' };
  else if (/프라푸치노|프라페|스무디|블렌디드/.test(n)) base = { calories: 400, caffeine: 50, sugar: 45, protein: 5, saturatedFat: 8, sodium: 200, subCategory: '프라페/스무디' };
  else if (/콜드브루|나이트로/.test(n)) base = { calories: 5, caffeine: 200, sugar: 0, protein: 0, saturatedFat: 0, sodium: 5, subCategory: '콜드 브루 커피' };
  else if (/에스프레소/.test(n)) base = { calories: 5, caffeine: 210, sugar: 0, protein: 0, saturatedFat: 0, sodium: 5, subCategory: '에스프레소' };
  else if (/디카페인/.test(n)) base = { calories: 10, caffeine: 5, sugar: 0, protein: 0, saturatedFat: 0, sodium: 5, subCategory: '디카페인' };
  else if (/녹차|말차/.test(n)) base = { calories: 80, caffeine: 40, sugar: 10, protein: 2, saturatedFat: 0.5, sodium: 10, subCategory: '녹차/말차' };
  else if (/홍차|얼그레이|차이|밀크티/.test(n)) base = { calories: 120, caffeine: 40, sugar: 15, protein: 3, saturatedFat: 2, sodium: 50, subCategory: '홍차/밀크티' };
  else if (/아이스티|레모네이드|에이드/.test(n)) base = { calories: 150, caffeine: 0, sugar: 35, protein: 0, saturatedFat: 0, sodium: 15, subCategory: '에이드/레모네이드' };
  else if (/에너지|몬스터|핫식스|레드불/.test(n)) base = { calories: 120, caffeine: 160, sugar: 27, protein: 0, saturatedFat: 0, sodium: 100, subCategory: '에너지 드링크' };
  else if (/탄산|콜라|사이다|환타/.test(n)) base = { calories: 140, caffeine: 0, sugar: 35, protein: 0, saturatedFat: 0, sodium: 15, subCategory: '탄산음료' };
  else if (/쉐이크|밀크쉐이크|라씨/.test(n)) base = { calories: 350, caffeine: 0, sugar: 40, protein: 8, saturatedFat: 7, sodium: 180, subCategory: '쉐이크' };
  else if (/주스|과일/.test(n)) base = { calories: 120, caffeine: 0, sugar: 25, protein: 1, saturatedFat: 0, sodium: 5, subCategory: '주스' };
  else if (/우유|밀크/.test(n)) base = { calories: 150, caffeine: 0, sugar: 12, protein: 6, saturatedFat: 3, sodium: 80, subCategory: '우유' };
  else base = { calories: 150, caffeine: 75, sugar: 15, protein: 5, saturatedFat: 2, sodium: 60, subCategory: '' };
  return { ...base, category: '카페' };
}

export default function AnalyzeScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { imageUri, sourceType: st, user, selectedBrands } = route.params || {};
  const sourceType = st || 'camera';

  useEffect(() => {
    if (!imageUri) return;
    const uploadAndAnalyze = async () => {
      try {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          imageUri,
          [{ resize: { width: 1200 } }],
          { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
        );
        const base64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
          encoding: 'base64',
        });
        const cleanUrl = BACKEND_API_URL.endsWith('/') ? BACKEND_API_URL.slice(0, -1) : BACKEND_API_URL;
        const response = await fetch(`${cleanUrl}/api/analyze-menu`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64, selectedBrands: selectedBrands || [] }),
        });
        const result = await response.json();

        if (response.ok && result.length > 0) {
          console.log("✅ 분석 성공:", JSON.stringify({ status: response.status, count: result.length, items: result.map((r: any) => ({ name: r.coffeeName, brand: r.brand, caffeine: r.caffeine, calories: r.calories })) }));

          let enrichedData = result;
          try {
            const dbRes = await fetch(`${cleanUrl}/api/coffee/list`);
            const dbData = await dbRes.json();
            const dbList: any[] = Array.isArray(dbData) ? dbData : (dbData?.data || []);
            console.log(`📦 DB 매칭용 커피 리스트: ${dbList.length}개`);

            enrichedData = result.map((item: any) => {
              const match = dbList.find((db: any) =>
                db.coffeeName?.replace(/\s+/g, '') === item.coffeeName?.replace(/\s+/g, '') &&
                db.brand?.replace(/\s+/g, '') === item.brand?.replace(/\s+/g, '')
              );
              if (match) {
                console.log(`🔗 매칭 성공: ${item.coffeeName} → DB 데이터 적용 (카페인: ${match.caffeine}, 칼로리: ${match.calories})`);
                return { ...item, caffeine: match.caffeine, calories: match.calories, protein: match.protein, sugar: match.sugar, emoji: match.emoji };
              }
              console.log(`⚠️ 매칭 실패: ${item.coffeeName} (${item.brand}) - DB에 없음`);
              if (!item.calories && !item.caffeine) {
                const est = estimateNutrition(item.coffeeName);
                return { ...item, ...est, emoji: '➕', aiGenerated: true };
              }
              return { ...item, aiGenerated: true, emoji: '➕' };
            });
          } catch (e) {
            console.error("DB 리스트 조회 실패:", e);
          }

          // 서버 응답에도 aiGenerated/➕ 없는 항목 보정
          enrichedData = enrichedData.map((item: any) => {
            if (item.emoji === '❓' || (!item.calories && !item.caffeine)) {
              const est = estimateNutrition(item.coffeeName);
              return { ...item, ...est, emoji: '➕', aiGenerated: true };
            }
            return item;
          });

          // AI 추정 메뉴를 Coffee DB에 자동 등록 (사용자 액션 전에)
          for (const aiItem of enrichedData.filter((i: any) => i.aiGenerated)) {
            const finalBrand = (aiItem.brand === "분석됨" || aiItem.brand === "미등록" || !aiItem.brand)
              ? (selectedBrands?.[0] || "카페")
              : aiItem.brand;
            fetch(`${cleanUrl}/api/coffee/register`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                coffeeName: aiItem.coffeeName,
                brand: finalBrand,
                category: aiItem.category || '카페',
                subCategory: aiItem.subCategory || '',
                calories: Number(aiItem.calories) || 0,
                protein: Number(aiItem.protein) || 0,
                sugar: Number(aiItem.sugar) || 0,
                saturatedFat: Number(aiItem.saturatedFat) || 0,
                sodium: Number(aiItem.sodium) || 0,
                caffeine: Number(aiItem.caffeine) || 0,
                emoji: aiItem.emoji || '➕',
                aiGenerated: true,
              }),
            }).catch(() => {});
          }

          navigation.replace('AnalyzeResult', {
            menuData: enrichedData,
            analyzedImage: manipulatedImage.uri,
            user: user,
            selectedBrands: selectedBrands,
          });
        } else {
          console.warn("분석 실패 사유:", { status: response.status, ok: response.ok, resultLength: result?.length, result });
          navigation.replace('AnalyzeFail', { sourceType, user });
        }
      } catch (error) {
        console.error("분석 에러:", error);
        navigation.replace('AnalyzeFail', { sourceType, user });
      }
    };
    uploadAndAnalyze();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <NavHeader 
        title="AI 분석 중" 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.main}>
        <SourceChip type={sourceType} />
        
        <PhotoPreviewScanner imageUri={imageUri} />

        <View style={styles.textContainer}>
          <PulseDots />
          <Text style={styles.title}>메뉴판을 분석하고 있어요</Text>
          <Text style={styles.desc}>
            AI가 메뉴를 인식하고 있어요.{'\n'}잠시만 기다려주세요.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F6F6',
  },
  main: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 80, 
    gap: 36,
  },
  textContainer: {
    alignItems: 'center',
    gap: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111111',
    lineHeight: 32,
    letterSpacing: -0.3,
    textAlign: 'center',
  },
  desc: {
    fontSize: 14,
    fontWeight: '400',
    color: '#999999',
    lineHeight: 22,
    textAlign: 'center',
  },
});