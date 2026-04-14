import React, { useEffect } from 'react'; // 🌟 useEffect 추가
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native'; // 🌟 이동을 위해 추가

import NavHeader from '../components/NavHeader'; 
import SourceChip from '../components/SourceChip';
import PhotoPreviewScanner from '../components/PhotoPreviewScanner';
import PulseDots from '../components/PulseDots';

export default function AnalyzeScreen() {
  const navigation = useNavigation<any>();

  // ✨ [핵심] 화면이 로드되면 3초 뒤에 결과 화면으로 이동합니다.
  useEffect(() => {
    const timer = setTimeout(() => {
      // AnalyzeResult 화면으로 이동 (Stack.Navigator에 등록된 이름이어야 함)
      navigation.navigate('AnalyzeResult'); 
    }, 3000); // 3000ms = 3초

    return () => clearTimeout(timer); // 화면을 벗어나면 타이머 해제
  }, []);

  const sourceType = 'camera'; 

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <NavHeader 
        title="AI 분석 중" 
        onBack={() => navigation.goBack()} 
      />

      <View style={styles.main}>
        <SourceChip type={sourceType} />
        
        <PhotoPreviewScanner />

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