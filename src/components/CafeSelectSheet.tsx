import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Layout } from '../constants';

interface CafeSelectSheetProps {
  cafe: { name: string; address: string } | null;
  onSelect: () => void;
  onClose: () => void;
}

export default function CafeSelectSheet({ cafe, onSelect, onClose }: CafeSelectSheetProps) {
  if (!cafe) return null;
  return (
    <View style={styles.container}>
      <View style={styles.handleWrap}>
        <View style={styles.handle} />
      </View>
      <View style={styles.content}>
        <Text style={styles.name}>{cafe.name}</Text>
        {cafe.address ? <Text style={styles.address}>{cafe.address}</Text> : null}
        <View style={styles.btnRow}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.selectBtn} onPress={onSelect} activeOpacity={0.7}>
            <Text style={styles.selectText}>이 카페 선택</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Layout.radiusLg,
    borderTopRightRadius: Layout.radiusLg,
    paddingBottom: 40,
    ...Layout.shadow3,
  },
  handleWrap: { alignItems: 'center', paddingTop: 12, paddingBottom: 8 },
  handle: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  content: { paddingHorizontal: 24, gap: 8 },
  name: { fontSize: 18, fontWeight: '700', color: Colors.text1 },
  address: { fontSize: 13, color: Colors.text2 },
  btnRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  cancelBtn: {
    flex: 1, height: 48, borderRadius: Layout.radiusLg,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  cancelText: { fontSize: 15, fontWeight: '600', color: Colors.text2 },
  selectBtn: {
    flex: 2, height: 48, borderRadius: Layout.radiusLg,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  selectText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});
