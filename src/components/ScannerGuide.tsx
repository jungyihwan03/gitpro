// src/components/ScannerGuide.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface ScannerGuideProps {
  hintText?: string;
}

export default function ScannerGuide({ hintText }: ScannerGuideProps) {
  // 스캔 라인 애니메이션을 위한 값 (이 컴포넌트 내부로 격리)
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // 애니메이션 무한 반복 루프
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [scanAnim]);

  // 애니메이션 값을 Y축 이동(translateY) 값으로 변환
  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [4, 194], // 200px(프레임 높이) 안에서 움직임
  });

  return (
    <View style={styles.guideWrap}>
      {/* 가이드 코너 네 네모 */}
      <View style={[styles.guideCorner, styles.tl]} />
      <View style={[styles.guideCorner, styles.tr]} />
      <View style={[styles.guideCorner, styles.bl]} />
      <View style={[styles.guideCorner, styles.br]} />
      
      {/* 🌟 움직이는 스캔 라인 애니메이션 */}
      <Animated.View style={[styles.scanLine, { transform: [{ translateY }] }]} />
      
      {/* 가이드 힌트 텍스트 */}
      <View style={styles.guideHintWrap}>
        <Text style={styles.guideHintText}>{hintText || '메뉴판이 프레임 안에 들어오도록 맞춰주세요'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  guideWrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 320,
    height: 200,
    marginLeft: -160,
    marginTop: -120, // 가로 꽉 차고 세로 약간 위쪽 정렬
    zIndex: 10,
  },
  guideCorner: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderColor: '#FFFFFF',
    opacity: 0.95,
  },
  tl: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 8 },
  tr: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 8 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 8 },
  br: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 8 },
  
  scanLine: {
    position: 'absolute',
    left: 4,
    right: 4,
    height: 2,
    backgroundColor: '#8B2E3A', // primary color
    borderRadius: 1,
    // 그림자 효과 추가 (HTML의 glow 효과 재현)
    shadowColor: '#8B2E3A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
  },
  
  guideHintWrap: {
    position: 'absolute',
    bottom: -56,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  guideHintText: {
    fontSize: 13,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.75)',
    backgroundColor: 'rgba(0,0,0,0.35)',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 9999,
    overflow: 'hidden', // 안드로이드 둥근 모서리 텍스트 짤림 방지
  },
});