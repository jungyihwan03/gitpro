import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// 🌟 Expo 도구
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

// 컴포넌트 임포트
import CameraTopBar from '../components/CameraTopBar';
import CameraBottomBar from '../components/CameraBottomBar';
import ScannerGuide from '../components/ScannerGuide';

export default function MenuScannerCamera() {
  const navigation = useNavigation<any>();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const [flash, setFlash] = useState<'off' | 'on'>('off');
  const cameraRef = useRef<any>(null);

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>메뉴판을 촬영하려면 카메라 권한이 필요해요!</Text>
        <TouchableOpacity style={styles.permissionBtn} onPress={requestPermission}>
          <Text style={styles.permissionBtnText}>카메라 권한 허용하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleShutter = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        navigation.navigate('Analyze', { imageUri: photo.uri, source: 'camera' });
      } catch (error) {
        console.error('촬영 실패:', error);
      }
    }
  };

  const handleGallery = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      navigation.navigate('Analyze', { imageUri: result.assets[0].uri, source: 'gallery' });
    }
  };

  return (
    <View style={styles.container}>
      {/* ── 🌟 [수정] CameraView를 단독 태그로 분리 ── */}
      <CameraView 
        style={StyleSheet.absoluteFillObject} 
        facing={facing} 
        flash={flash}
        ref={cameraRef}
      />

      {/* ── 🌟 [수정] 모든 UI 레이어는 CameraView와 '형제'가 되어야 함 ── */}
      <SafeAreaView style={styles.overlay} pointerEvents="box-none">
        
        {/* 상단 컨트롤 바 */}
        <CameraTopBar 
          onClose={() => navigation.goBack()}
          onFlash={() => setFlash(current => (current === 'off' ? 'on' : 'off'))}
        />

        {/* 메뉴판 시뮬레이션 UI (중앙 배치) */}
        <View style={styles.centerContainer} pointerEvents="none">
           <View style={styles.menuBoard}>
            <Text style={styles.menuBoardTitle}>☕ COFFEE MENU (예시)</Text>
            <View style={styles.menuRow}><Text style={styles.menuRowName}>아이스 아메리카노</Text><Text style={styles.menuRowPrice}>4,500원</Text></View>
            <View style={styles.menuRow}><Text style={styles.menuRowName}>카페 라떼</Text><Text style={styles.menuRowPrice}>5,000원</Text></View>
          </View>
        </View>

        {/* 팁 배너 */}
        <View style={styles.tipBannerWrap} pointerEvents="none">
          <View style={styles.tipBanner}>
            <Text style={styles.tipBannerText}>📋 메뉴판 전체가 보이도록 찍어주세요</Text>
          </View>
        </View>

        {/* 가이드 프레임 */}
        <ScannerGuide hintText="메뉴판이 프레임 안에 들어오도록 맞춰주세요" />

        {/* 하단 컨트롤 (갤러리, 셔터 등) */}
        <CameraBottomBar 
          onGalleryPress={handleGallery}
          onShutterPress={handleShutter}
          onSwitchCamera={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  overlay: { ...StyleSheet.absoluteFillObject }, // 카메라 위에 덮씌우는 레이어
  
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0D1520', padding: 20 },
  permissionText: { color: 'white', marginBottom: 20, fontSize: 16, textAlign: 'center' },
  permissionBtn: { backgroundColor: '#8B2E3A', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  permissionBtnText: { color: 'white', fontWeight: '700' },
  
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  menuBoard: { width: 300, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 8, padding: 16, gap: 10 },
  menuBoardTitle: { fontSize: 13, fontWeight: '700', color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 4 },
  menuRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)' },
  menuRowName: { fontSize: 12, fontWeight: '500', color: 'rgba(255,255,255,0.8)' },
  menuRowPrice: { fontSize: 12, color: 'rgba(255,255,255,0.6)' },
  
  tipBannerWrap: { position: 'absolute', top: 100, left: 0, right: 0, alignItems: 'center' },
  tipBanner: { backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 9999, paddingVertical: 8, paddingHorizontal: 20 },
  tipBannerText: { fontSize: 13, fontWeight: '500', color: 'rgba(255,255,255,0.9)' },
});