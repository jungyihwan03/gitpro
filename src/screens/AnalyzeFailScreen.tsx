import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native'; // 🌟 주석 해제!

import NavHeader from '../components/NavHeader';
import SourceChip from '../components/SourceChip'; 
import FailPhotoPreview from '../components/FailPhotoPreview';

export default function AnalyzeFailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // 🌟 AnalyzeScreen에서 넘겨받은 파라미터 (어떤 경로로 들어왔는지 파악)
  // 만약 직접 테스트 중이라면 기본값으로 'camera'를 설정합니다.
  const sourceType = route.params?.sourceType || 'camera'; 
  const isCamera = sourceType === 'camera';

  // [다시 시도] 버튼 핸들러
  const handleRetry = () => {
    if (isCamera) {
      // 카메라 화면으로 돌아가기
      navigation.goBack(); 
    } else {
      // 갤러리 선택을 위해 다시 이전 화면으로 가거나 특정 스캔 화면으로 이동
      navigation.goBack();
    }
  };

  // [직접 검색] 버튼 핸들러
  const handleSearchManually = () => {
    // 🌟 내비게이션에 등록된 검색 화면(SearchScreen)으로 이동
    navigation.navigate('SearchScreen'); 
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      
      {/* 상단 헤더: 뒤로가기 누르면 카메라 화면으로 복귀 */}
      <NavHeader 
        title="분석 실패" 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.main}>
        {/* 카메라/갤러리 아이콘 칩 */}
        <SourceChip type={sourceType} />

        {/* 엑스 표시가 있는 미리보기 컴포넌트 */}
        <FailPhotoPreview />

        <View style={styles.textContainer}>
          <Text style={styles.title}>인식에 실패했어요</Text>
          <Text style={styles.desc}>
            사진이 흐리거나 메뉴가 잘 보이지 않아요.{'\n'}
            {isCamera ? '다시 찍거나' : '다른 사진을 고르거나'} 직접 검색해주세요.
          </Text>
        </View>

        <View style={styles.btnWrap}>
          {/* 다시 시도 버튼 */}
          <TouchableOpacity 
            activeOpacity={0.8} 
            style={styles.btnPrimary} 
            onPress={handleRetry}
          >
            <Ionicons name={isCamera ? "refresh" : "image-outline"} size={20} color="#FFFFFF" />
            <Text style={styles.btnPrimaryText}>
              {isCamera ? '다시 찍기' : '다른 사진 고르기'}
            </Text>
          </TouchableOpacity>
          
          {/* 직접 검색 버튼 */}
          <TouchableOpacity 
            activeOpacity={0.6} 
            style={styles.btnOutlined} 
            onPress={handleSearchManually}
          >
            <Text style={styles.btnOutlinedText}>직접 검색할게요</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6F6' },
  main: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingHorizontal: 24, 
    paddingBottom: 80, 
    gap: 36 
  },
  textContainer: { alignItems: 'center', gap: 14 },
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#111111', 
    lineHeight: 32, 
    letterSpacing: -0.3, 
    textAlign: 'center' 
  },
  desc: { 
    fontSize: 14, 
    fontWeight: '400', 
    color: '#999999', 
    lineHeight: 22, 
    textAlign: 'center' 
  },
  btnWrap: { width: '100%', gap: 10, marginTop: 10 },
  btnPrimary: { 
    width: '100%', 
    height: 52, 
    borderRadius: 9999, 
    backgroundColor: '#8B2E3A', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    gap: 8, 
    elevation: 4, 
    shadowColor: '#8B2E3A', 
    shadowOffset: { width: 0, height: 8 }, 
    shadowOpacity: 0.25, 
    shadowRadius: 16 
  },
  btnPrimaryText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  btnOutlined: { 
    width: '100%', 
    height: 48, 
    borderRadius: 9999, 
    borderWidth: 1.5, 
    borderColor: '#E5E7EB', 
    backgroundColor: 'transparent', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  btnOutlinedText: { fontSize: 14, fontWeight: '500', color: '#999999' },
});