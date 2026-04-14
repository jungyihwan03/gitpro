import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function PhotoPreviewScanner() {
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 1800,
        useNativeDriver: true,
      })
    ).start();
  }, [scanAnim]);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220], // 컴포넌트 높이만큼 이동
  });

  const opacity = scanAnim.interpolate({
    inputRange: [0, 0.05, 0.95, 1],
    outputRange: [0, 1, 1, 0], // 시작과 끝에서 자연스럽게 사라짐
  });

  return (
    <View style={styles.previewContainer}>
      {/* ── 가짜 메뉴판 데이터 (추후 실제 이미지 URI를 Image 태그로 띄울 영역) ── */}
      <View style={styles.menuBoard}>
        <Text style={styles.mbTitle}>☕ COFFEE MENU</Text>
        <View style={styles.mbRow}><Text style={styles.mbName}>아이스 아메리카노</Text><Text style={styles.mbPrice}>4,500원</Text></View>
        <View style={styles.mbRow}><Text style={styles.mbName}>카페 라떼</Text><Text style={styles.mbPrice}>5,000원</Text></View>
        <View style={styles.mbRow}><Text style={styles.mbName}>카라멜 마키아또</Text><Text style={styles.mbPrice}>5,800원</Text></View>
        <View style={styles.mbRow}><Text style={styles.mbName}>콜드 브루</Text><Text style={styles.mbPrice}>5,500원</Text></View>
      </View>

      {/* ── 붉은 오버레이 및 모서리 프레임 ── */}
      <View style={styles.scanOverlay} />
      <View style={[styles.corner, styles.tl]} />
      <View style={[styles.corner, styles.tr]} />
      <View style={[styles.corner, styles.bl]} />
      <View style={[styles.corner, styles.br]} />

      {/* ── 위아래로 움직이는 스캔 라인 ── */}
      <Animated.View style={[styles.scanLine, { opacity, transform: [{ translateY }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  previewContainer: {
    width: 220,
    height: 220,
    borderRadius: 24,
    backgroundColor: '#0d1520',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
  },
  menuBoard: {
    width: 178,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 7,
  },
  mbTitle: { fontSize: 10, fontWeight: '700', color: 'rgba(255,255,255,0.45)', textAlign: 'center', letterSpacing: 1, marginBottom: 2 },
  mbRow: { flexDirection: 'row', justifyContent: 'space-between' },
  mbName: { fontSize: 10, color: 'rgba(255,255,255,0.4)' },
  mbPrice: { fontSize: 10, color: 'rgba(255,255,255,0.28)' },
  
  scanOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(139,46,58,0.06)' },
  
  scanLine: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 2,
    backgroundColor: '#8B2E3A',
    shadowColor: '#8B2E3A',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 4,
  },

  corner: { position: 'absolute', width: 22, height: 22, borderColor: '#8B2E3A' },
  tl: { top: 10, left: 10, borderTopWidth: 2.5, borderLeftWidth: 2.5, borderTopLeftRadius: 4 },
  tr: { top: 10, right: 10, borderTopWidth: 2.5, borderRightWidth: 2.5, borderTopRightRadius: 4 },
  bl: { bottom: 10, left: 10, borderBottomWidth: 2.5, borderLeftWidth: 2.5, borderBottomLeftRadius: 4 },
  br: { bottom: 10, right: 10, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderBottomRightRadius: 4 },
});