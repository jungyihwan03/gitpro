import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FailPhotoPreview() {
  return (
    <View style={styles.container}>
      {/* 가상의 메뉴판 내용 (실제로는 찍은 사진 이미지가 들어갈 자리) */}
      <View style={styles.menuContent}>
        <Text style={styles.mbTitle}>☕ COFFEE MENU</Text>
        <View style={styles.mbRow}><Text style={styles.mbName}>아이스 아메리카노</Text><Text style={styles.mbPrice}>4,500원</Text></View>
        <View style={styles.mbRow}><Text style={styles.mbName}>카페 라떼</Text><Text style={styles.mbPrice}>5,000원</Text></View>
        <View style={styles.mbRow}><Text style={styles.mbName}>카라멜 마키아또</Text><Text style={styles.mbPrice}>5,800원</Text></View>
        <View style={styles.mbRow}><Text style={styles.mbName}>콜드 브루</Text><Text style={styles.mbPrice}>5,500원</Text></View>
      </View>

      {/* 실패 붉은색 오버레이 */}
      <View style={styles.scanOverlay} />

      {/* 모서리 붉은 프레임 */}
      <View style={[styles.corner, styles.topLeft]} />
      <View style={[styles.corner, styles.topRight]} />
      <View style={[styles.corner, styles.bottomLeft]} />
      <View style={[styles.corner, styles.bottomRight]} />

      {/* 중앙 실패 아이콘 */}
      <View style={styles.failIcon}>
        <Ionicons name="close" size={32} color="#FFFFFF" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 220,
    height: 220,
    borderRadius: 24,
    backgroundColor: '#0D1520',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
  },
  menuContent: {
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
  
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(197,48,48,0.08)',
  },
  corner: {
    position: 'absolute',
    width: 22,
    height: 22,
    borderColor: '#C53030', // 에러용 붉은색
  },
  topLeft: { top: 10, left: 10, borderTopWidth: 2.5, borderLeftWidth: 2.5, borderTopLeftRadius: 4 },
  topRight: { top: 10, right: 10, borderTopWidth: 2.5, borderRightWidth: 2.5, borderTopRightRadius: 4 },
  bottomLeft: { bottom: 10, left: 10, borderBottomWidth: 2.5, borderLeftWidth: 2.5, borderBottomLeftRadius: 4 },
  bottomRight: { bottom: 10, right: 10, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderBottomRightRadius: 4 },
  
  failIcon: {
    position: 'absolute',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#C53030',
    alignItems: 'center',
    justifyContent: 'center',
  },
});