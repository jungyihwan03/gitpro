import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout } from '../constants';

export default function CafeDetailInfo() {
  return (
    <View style={styles.card}>
      <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>상세 정보</Text>
      
      {/* 주소 */}
      <View style={styles.infoItem}>
        <Ionicons name="location-sharp" size={20} color={Colors.text2} style={styles.infoIcon} />
        <View style={styles.infoContent}>
          <Text style={styles.infoPrimary}>서울특별시 강남구 테헤란로 123</Text>
          <Text style={styles.infoSecondary}>(지번) 역삼동 649-10</Text>
        </View>
        <TouchableOpacity style={styles.copyBtn}>
          <Text style={styles.copyBtnText}>주소 복사</Text>
        </TouchableOpacity>
      </View>

      {/* 영업시간 */}
      <View style={styles.infoItem}>
        <Ionicons name="time" size={20} color={Colors.text2} style={styles.infoIcon} />
        <View style={styles.infoContent}>
          <View style={styles.hoursRow}>
            <View style={styles.openBadge}>
              <Text style={styles.openBadgeText}>영업 중</Text>
            </View>
            <Text style={styles.closingInfoText}>22:00에 영업 종료</Text>
          </View>
          <TouchableOpacity style={styles.hoursExpandBtn}>
            <Text style={styles.hoursExpandText}>전체 시간 보기</Text>
            <Ionicons name="chevron-down" size={16} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* 인스타그램 */}
      <View style={[styles.infoItem, { borderBottomWidth: 0, paddingBottom: 0 }]}>
        <Ionicons name="logo-instagram" size={20} color={Colors.text2} style={styles.infoIcon} />
        <View style={styles.infoContent}>
          <Text style={styles.infoLink}>instagram.com/midnight_espresso</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    padding: 24,
    ...Layout.shadow1,
  },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text1 },
  infoItem: { flexDirection: 'row', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.divider, alignItems: 'flex-start', gap: 12 },
  infoIcon: { marginTop: 2 },
  infoContent: { flex: 1, gap: 2 },
  infoPrimary: { fontSize: 15, fontWeight: '500', color: Colors.text1 },
  infoSecondary: { fontSize: 12, color: Colors.text2 },
  hoursRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  openBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 10, height: 24, borderRadius: Layout.radiusFull, justifyContent: 'center' },
  openBadgeText: { fontSize: 11, fontWeight: 'bold', color: '#16A34A' },
  closingInfoText: { fontSize: 12, fontWeight: '500', color: Colors.error },
  hoursExpandBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  hoursExpandText: { fontSize: 13, fontWeight: '500', color: Colors.primary },
  copyBtn: { backgroundColor: 'rgba(139,46,58,0.08)', paddingHorizontal: 14, height: 32, borderRadius: Layout.radiusFull, justifyContent: 'center' },
  copyBtnText: { fontSize: 12, fontWeight: 'bold', color: Colors.primary },
  infoLink: { fontSize: 14, color: Colors.primary, textDecorationLine: 'underline' }
});