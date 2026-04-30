import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { BACKEND_API_URL } from '../constants';

export default function AnalyzeScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { imageUri } = route.params;

  useEffect(() => {
    const uploadAndAnalyze = async () => {
      try {
        // [1] 이미지 최적화
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          imageUri,
          [{ resize: { width: 1200 } }],
          { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
        );

        // [2] Base64 변환
        const base64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
          encoding: 'base64',
        });

        // [3] 서버 전송
        const response = await fetch(`${BACKEND_API_URL}/api/analyze-menu`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64 }),
        });

        const result = await response.json();

        if (response.ok && result.length > 0) {
          // ✅ 성공 시: 결과 화면으로 이동 (replace를 써서 대기화면을 스택에서 제거)
          navigation.replace('AnalyzeResult', { 
            menuData: result, 
            analyzedImage: manipulatedImage.uri 
          });
        } else {
          // ❌ 데이터가 없거나 서버 응답 이상 시: 실패 화면으로 이동
          navigation.replace('AnalyzeFail');
        }
      } catch (error) {
        console.error("분석 에러:", error);
        navigation.replace('AnalyzeFail'); // ❌ 네트워크 에러 시 실패 화면으로 이동
      }
    };

    uploadAndAnalyze();
  }, []);

  return (
    <View style={styles.container}>
      {/* 사용자가 찍은 사진을 배경으로 살짝 보여주면 더 고급스럽습니다 */}
      <Image source={{ uri: imageUri }} style={styles.bgImage} blurRadius={10} />
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color="#8B2E3A" />
        <Text style={styles.title}>메뉴판 분석 중...</Text>
        <Text style={styles.subtitle}>AI가 메뉴와 카페인을 계산하고 있어요.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bgImage: { ...StyleSheet.absoluteFillObject, opacity: 0.5 },
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginTop: 20 },
  subtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 14, marginTop: 10 }
});