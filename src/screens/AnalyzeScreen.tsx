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
              return item;
            });
          } catch (e) {
            console.error("DB 리스트 조회 실패:", e);
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