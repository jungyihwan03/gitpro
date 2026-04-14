import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout } from '../constants';

export default function CafePhotoGallery() {
  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>매장 사진</Text>
        <TouchableOpacity>
          <Text style={styles.linkBtn}>전체보기</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.photoGrid}>
        <View style={[styles.photoItem, styles.photoMain]}>
          <Ionicons name="image" size={40} color="rgba(255,255,255,0.3)" />
        </View>
        <View style={styles.photoItem}>
          <Ionicons name="image-outline" size={28} color={Colors.text3} />
        </View>
        <View style={styles.photoItem}>
          <Ionicons name="image-outline" size={28} color={Colors.text3} />
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
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.text1 },
  linkBtn: { fontSize: 14, fontWeight: '500', color: Colors.primary },
  photoGrid: { flexDirection: 'row', gap: 6 },
  photoItem: { flex: 1, aspectRatio: 1, backgroundColor: '#EDE9E6', borderRadius: Layout.radiusSm, alignItems: 'center', justifyContent: 'center' },
  photoMain: { backgroundColor: '#3e2000' },
});