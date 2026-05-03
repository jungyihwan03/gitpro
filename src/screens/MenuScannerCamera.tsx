import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 필수 라이브러리
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
// SDK 54 대응용 legacy 모듈
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation, useRoute } from '@react-navigation/native';

import { BACKEND_API_URL } from '../constants';
import CameraTopBar from '../components/CameraTopBar';
import CameraBottomBar from '../components/CameraBottomBar';
import ScannerGuide from '../components/ScannerGuide';

export default function MenuScannerCamera() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // 🌟 [핵심] 이전 화면들로부터 전달된 유저 정보 및 선택된 브랜드 정보 추출
  const userData = route.params?.user || route.params;
  const selectedBrands = route.params?.selectedBrands || [];

  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cameraRef = useRef<any>(null);

  const [permission, requestPermission] = useCameraPermissions();

  const TopBar = CameraTopBar as any;

  if (!permission) return <View style={styles.container} />;
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>메뉴판 촬영을 위해 카메라 권한이 필요해요!</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>권한 허용하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  /**
   * 이미지 분석 함수
   * @param uri 촬영되거나 선택된 이미지의 로컬 경로
   */
  const analyzeMenuImage = async (uri: string) => {
    try {
      setIsAnalyzing(true);
      console.log("📸 1. 이미지 처리 시작 - 선택된 브랜드:", selectedBrands);

      // [1] 이미지 최적화 (서버 부하 감소 및 분석 속도 향상)
      const manipulatedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1200 } }],
        { compress: 0.6, format: ImageManipulator.SaveFormat.JPEG }
      );

      // [2] Base64 변환
      const base64 = await FileSystem.readAsStringAsync(manipulatedImage.uri, {
        encoding: 'base64',
      });

      // [3] 서버 전송 (이미지와 선택된 브랜드 리스트를 함께 전송)
      const cleanUrl = BACKEND_API_URL.endsWith('/') ? BACKEND_API_URL.slice(0, -1) : BACKEND_API_URL;
      
      const response = await fetch(`${cleanUrl}/api/analyze-menu`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: base64,
          selectedBrands: selectedBrands // 🌟 서버에서 DB 매칭 시 사용할 브랜드 정보
        }),
      });

      if (!response.ok) {
        throw new Error(`Server status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ 4. 분석 데이터 수신 완료:", result.length, "개 메뉴");

      // [4] 결과 화면으로 이동
      // replace를 사용하여 스택을 교체함으로써 뒤로가기 시 다시 분석 중 화면이 나오는 것을 방지합니다.
      navigation.replace('AnalyzeResult', {
        menuData: result,
        analyzedImage: manipulatedImage.uri,
        user: userData, // 🌟 저장 시 필요한 유저 정보
        selectedBrands: selectedBrands // 🌟 UI 방어 로직을 위해 브랜드 정보도 전달
      });

    } catch (error: any) {
      console.error('⚠️ 분석 에러 상세:', error);
      Alert.alert("분석 실패", "메뉴판을 분석하는 중 오류가 발생했습니다.");
      navigation.navigate('AnalyzeFail', { sourceType: 'camera', user: userData });
    } finally {
      setIsAnalyzing(false);
    }
  };

  /**
   * 셔터 버튼 클릭 시 호출
   */
  const handleShutter = async () => {
    if (cameraRef.current && !isAnalyzing) {
      try {
        // 안드로이드 무음 촬영 시도
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          mute: true 
        });
        analyzeMenuImage(photo.uri);
      } catch (e) {
        console.error("촬영 에러:", e);
      }
    }
  };

  /**
   * 갤러리 선택 버튼 클릭 시 호출
   */
  const handleGallery = async () => {
    if (isAnalyzing) return;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      analyzeMenuImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing={facing}
        flash={flash}
        ref={cameraRef}
      />

      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        {/* 상단 바: 뒤로가기 및 플래시 제어 */}
        <TopBar
          onClose={() => navigation.goBack()}
          onFlash={() => setFlash(f => f === 'off' ? 'on' : 'off')}
        />

        {/* 분석 중 로딩 레이어 */}
        {isAnalyzing && (
          <View style={styles.loadingLayer}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>선택하신 브랜드를 바탕으로</Text>
            <Text style={styles.loadingText}>메뉴를 정밀 분석 중입니다...</Text>
            <Text style={styles.loadingSubText}>잠시만 기다려 주세요 (약 5~10초)</Text>
          </View>
        )}

        {/* 화면 중앙 가이드 텍스트 */}
        <View style={styles.centerContainer} pointerEvents="none">
          <View style={styles.menuBoard}>
            <Text style={styles.menuBoardTitle}>☕ AI MENU SCANNER</Text>
            <Text style={styles.menuRowName}>글자가 잘 보이도록 찍어주세요</Text>
          </View>
        </View>

        {/* 스캐너 가이드 라인 컴포넌트 */}
        <ScannerGuide hintText="메뉴판 전체가 나오도록 맞춰주세요" />

        {/* 하단 바: 갤러리, 촬영, 카메라 전환 */}
        <CameraBottomBar
          onGalleryPress={handleGallery}
          onShutterPress={handleShutter}
          onSwitchCamera={() => setFacing(f => f === 'back' ? 'front' : 'back')}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject },
  loadingLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
  },
  loadingText: { color: '#FFF', marginTop: 8, fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
  loadingSubText: { color: 'rgba(255,255,255,0.6)', marginTop: 12, fontSize: 12 },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D1520' },
  permissionText: { color: 'white', marginBottom: 20 },
  permissionBtn: { backgroundColor: '#8B2E3A', padding: 12, borderRadius: 8 },
  permissionBtnText: { color: 'white', fontWeight: '700' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  menuBoard: {
    width: 280,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  menuBoardTitle: { fontSize: 12, fontWeight: '800', color: 'rgba(255,255,255,0.6)', marginBottom: 4 },
  menuRowName: { fontSize: 14, color: '#FFF', fontWeight: '500' },
});