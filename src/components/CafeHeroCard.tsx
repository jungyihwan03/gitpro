import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout } from '../constants'; // 💡 경로를 맞춰주세요!

export default function CafeHeroCard() {
  return (
    <View style={styles.card}>
      {/* 태그 */}
      <View style={styles.tagRow}>
        <Text style={styles.tagChip}>개인 로스터리</Text>
        <Text style={styles.tagChip}>250m</Text>
      </View>

      {/* 이름 */}
      <Text style={styles.cafeName}>미드나잇 에스프레소</Text>

      {/* 메타 정보 */}
      <View style={styles.metaRow}>
        <Ionicons name="star" size={16} color="#F9A825" />
        <Text style={styles.ratingScore}>4.8</Text>
        <Text style={styles.ratingCount}>(128)</Text>
        <View style={styles.metaDot} />
        <Text style={styles.metaText}>역삼동</Text>
        <View style={styles.metaDot} />
        <View style={styles.closingBadge}>
          <Ionicons name="time" size={12} color={Colors.error} />
          <Text style={styles.closingBadgeText}>오후 10시 종료</Text>
        </View>
      </View>

      {/* 액션 버튼들 */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionItem}>
          <View style={[styles.actionIconWrap, styles.actionFilled]}>
            <Ionicons name="navigate" size={20} color={Colors.surface} />
          </View>
          <Text style={styles.actionLabel}>길 찾기</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <View style={[styles.actionIconWrap, styles.actionTonal]}>
            <Ionicons name="call" size={20} color={Colors.text2} />
          </View>
          <Text style={styles.actionLabel}>전화</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionItem}>
          <View style={[styles.actionIconWrap, styles.actionTonal]}>
            <Ionicons name="share-social" size={20} color={Colors.text2} />
          </View>
          <Text style={styles.actionLabel}>공유</Text>
        </TouchableOpacity>
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
  tagRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  tagChip: {
    height: 32,
    paddingHorizontal: 12,
    borderRadius: Layout.radiusFull,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text2,
    textAlignVertical: 'center',
    lineHeight: 32, // iOS 호환을 위해 추가
  },
  cafeName: { fontSize: 24, fontWeight: 'bold', color: Colors.text1, marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 20, flexWrap: 'wrap' },
  ratingScore: { fontSize: 14, fontWeight: 'bold', color: Colors.text1 },
  ratingCount: { fontSize: 12, color: Colors.text2 },
  metaDot: { width: 3, height: 3, borderRadius: Layout.radiusFull, backgroundColor: Colors.text3 },
  metaText: { fontSize: 14, color: Colors.text2 },
  closingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEE2E2', paddingHorizontal: 10, height: 24, borderRadius: Layout.radiusFull, gap: 4 },
  closingBadgeText: { fontSize: 11, fontWeight: 'bold', color: Colors.error },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around' },
  actionItem: { alignItems: 'center', gap: 6 },
  actionIconWrap: { width: 56, height: 56, borderRadius: Layout.radiusSm, alignItems: 'center', justifyContent: 'center' },
  actionFilled: { backgroundColor: Colors.primary, ...Layout.shadow1 },
  actionTonal: { backgroundColor: Colors.bg },
  actionLabel: { fontSize: 12, fontWeight: '500', color: Colors.text2 },
});