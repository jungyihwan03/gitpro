import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 필수 라이브러리
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
// SDK 54 대응용 legacy 모듈
import { useNavigation, useRoute } from '@react-navigation/native';
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
  const [sourceType, setSourceType] = useState<'camera' | 'gallery'>('camera');
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

  const analyzeMenuImage = (uri: string) => {
    setIsAnalyzing(true);
    navigation.replace('Analyze', {
      imageUri: uri,
      sourceType: sourceType,
      user: userData,
      selectedBrands: selectedBrands,
    });
  };

  /**
   * 셔터 버튼 클릭 시 호출
   */
  const handleShutter = async () => {
    if (cameraRef.current && !isAnalyzing) {
      try {
        setSourceType('camera');
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

  const handleGallery = async () => {
    if (isAnalyzing) return;
    setSourceType('gallery');
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
        {/* <TopBar
          onClose={() => navigation.goBack()}
          onFlash={() => setFlash(f => f === 'off' ? 'on' : 'off')}
        /> */}

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