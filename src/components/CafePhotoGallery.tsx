import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout, GOOGLE_MAPS_API_KEY } from '../constants';

interface PhotoRef {
  photo_reference: string;
  height?: number;
  width?: number;
}

interface CafePhotoGalleryProps {
  photos?: PhotoRef[] | null;
}

function getPhotoUrl(ref: string, maxWidth = 400): string {
  if (!GOOGLE_MAPS_API_KEY) return '';
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxWidth}&photoreference=${ref}&key=${GOOGLE_MAPS_API_KEY}`;
}

export default function CafePhotoGallery({ photos }: CafePhotoGalleryProps) {
  const hasPhotos = photos && photos.length > 0;

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>매장 사진</Text>
        {hasPhotos && (
          <TouchableOpacity>
            <Text style={styles.linkBtn}>전체보기</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.photoGrid}>
        {hasPhotos ? (
          <>
            <Image
              source={{ uri: getPhotoUrl(photos[0].photo_reference, 400) }}
              style={[styles.photoItem, styles.photoMain]}
              resizeMode="cover"
            />
            {photos[1] && (
              <Image
                source={{ uri: getPhotoUrl(photos[1].photo_reference, 200) }}
                style={styles.photoItem}
                resizeMode="cover"
              />
            )}
            {photos[2] && (
              <Image
                source={{ uri: getPhotoUrl(photos[2].photo_reference, 200) }}
                style={styles.photoItem}
                resizeMode="cover"
              />
            )}
          </>
        ) : (
          <>
            <View style={[styles.photoItem, styles.photoMain]}>
              <Ionicons name="image" size={40} color="rgba(255,255,255,0.3)" />
            </View>
            <View style={styles.photoItem}>
              <Ionicons name="image-outline" size={28} color={Colors.text3} />
            </View>
            <View style={styles.photoItem}>
              <Ionicons name="image-outline" size={28} color={Colors.text3} />
            </View>
          </>
        )}
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
  photoMain: { flex: 2 },
});
