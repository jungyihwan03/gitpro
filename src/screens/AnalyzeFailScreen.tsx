import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
// import { useRoute, useNavigation } from '@react-navigation/native'; // ⛔ UI 테스트 중에는 주석 처리!

import NavHeader from '../components/NavHeader';
import SourceChip from '../components/SourceChip'; 
import FailPhotoPreview from '../components/FailPhotoPreview';

export default function AnalyzeFailScreen() {
  // ⛔ 네비게이션 연결 전이므로 이 부분도 잠깐 주석 처리합니다.
  // const route = useRoute();
  // const navigation = useNavigation<any>();
  // const params = route.params as AnalyzeRouteParams;
  
  // ✨ 수동으로 값을 넣어서 테스트해 보세요! ('camera' 또는 'gallery'로 변경하며 확인)
  const sourceType = 'camera'; // 'camera' | 'gallery'
  const isCamera = sourceType === 'camera';

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <NavHeader 
        title="AI 분석 중" 
        onBack={() => Alert.alert('알림', '나중에 이전 화면으로 돌아갈 거예요!')} // 임시 알림창
      />

      <View style={styles.main}>
        <SourceChip type={sourceType} />

        <FailPhotoPreview />

        <View style={styles.textContainer}>
          <Text style={styles.title}>인식에 실패했어요</Text>
          <Text style={styles.desc}>
            사진이 흐리거나 메뉴가 잘 보이지 않아요.{'\n'}
            {isCamera ? '다시 찍거나' : '다른 사진을 고르거나'} 직접 검색해주세요.
          </Text>
        </View>

        <View style={styles.btnWrap}>
          <TouchableOpacity 
            activeOpacity={0.8} 
            style={styles.btnPrimary} 
            onPress={() => {
              if (isCamera) {
                Alert.alert("다시 찍기", "카메라 화면으로 돌아갑니다.");
              } else {
                Alert.alert("다시 고르기", "갤러리를 다시 엽니다.");
              }
            }}
          >
            <Ionicons name={isCamera ? "refresh" : "image-outline"} size={20} color="#FFFFFF" />
            <Text style={styles.btnPrimaryText}>
              {isCamera ? '다시 찍기' : '다른 사진 고르기'}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            activeOpacity={0.6} 
            style={styles.btnOutlined} 
            onPress={() => Alert.alert('직접 검색', '검색 화면으로 이동합니다.')}
          >
            <Text style={styles.btnOutlinedText}>직접 검색할게요</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ... 아래 styles 코드는 아까와 완전 동일합니다! ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6F6' },
  main: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 80, gap: 36 },
  textContainer: { alignItems: 'center', gap: 14 },
  title: { fontSize: 24, fontWeight: '700', color: '#111111', lineHeight: 32, letterSpacing: -0.3, textAlign: 'center' },
  desc: { fontSize: 14, fontWeight: '400', color: '#999999', lineHeight: 22, textAlign: 'center' },
  btnWrap: { width: '100%', gap: 10, marginTop: 10 },
  btnPrimary: { width: '100%', height: 52, borderRadius: 9999, backgroundColor: '#8B2E3A', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, elevation: 4, shadowColor: '#8B2E3A', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16 },
  btnPrimaryText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  btnOutlined: { width: '100%', height: 48, borderRadius: 9999, borderWidth: 1.5, borderColor: '#E5E7EB', backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  btnOutlinedText: { fontSize: 14, fontWeight: '500', color: '#999999' },
});