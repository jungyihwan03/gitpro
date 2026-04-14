import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ResultPhotoPreview() {
  return (
    <View style={styles.container}>
      {/* 📸 가상의 메뉴판 이미지 내용 */}
      <View style={styles.menuBoard}>
        <Text style={styles.mbTitle}>☕ COFFEE MENU</Text>
        <View style={styles.mbRow}><Text style={styles.mbName}>아이스 아메리카노</Text><Text style={styles.mbPrice}>4,500원</Text></View>
        <View style={styles.mbRow}><Text style={styles.mbName}>카페 라떼</Text><Text style={styles.mbPrice}>5,000원</Text></View>
        <View style={styles.mbRow}><Text style={styles.mbName}>카라멜 마키아또</Text><Text style={styles.mbPrice}>5,800원</Text></View>
        <View style={styles.mbRow}><Text style={styles.mbName}>콜드 브루</Text><Text style={styles.mbPrice}>5,500원</Text></View>
        <View style={styles.mbRow}><Text style={styles.mbName}>자바 칩 프라푸치노</Text><Text style={styles.mbPrice}>6,300원</Text></View>
      </View>

      {/* ✨ 스캔 완료 오버레이 */}
      <View style={styles.overlay}>
        <View style={styles.scanDone}>
          {/* 모서리 포인트 */}
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
          
          {/* 중앙 체크 아이콘 */}
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={24} color="#FFFFFF" />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 180,
    backgroundColor: '#0D1520', // 실제로는 이미지 배경이 들어갈 자리
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  menuBoard: {
    width: 260,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 7,
  },
  mbTitle: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.45)', textAlign: 'center', marginBottom: 2, letterSpacing: 1 },
  mbRow: { flexDirection: 'row', justifyContent: 'space-between' },
  mbName: { fontSize: 11, color: 'rgba(255,255,255,0.45)' },
  mbPrice: { fontSize: 11, color: 'rgba(255,255,255,0.3)' },
  
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanDone: {
    width: 200,
    height: 130,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#8B2E3A',
  },
  topLeft: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  topRight: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  bottomLeft: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  bottomRight: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  checkCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -18 }, { translateY: -18 }], // 36px의 절반
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8B2E3A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});