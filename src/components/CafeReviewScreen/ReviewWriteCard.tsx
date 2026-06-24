import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Layout } from '../../constants';

interface ReviewWriteCardProps {
  onSubmit?: (rating: number, text: string, photos: string[]) => void;
  initialRating?: number;
  initialText?: string;
  initialPhotos?: string[];
}

export const ReviewWriteCard = ({ onSubmit, initialRating, initialText, initialPhotos }: ReviewWriteCardProps) => {
  const [rating, setRating] = useState(initialRating || 5);
  const [reviewText, setReviewText] = useState(initialText || '');
  const [photos, setPhotos] = useState<string[]>(initialPhotos || []);

  useEffect(() => {
    if (initialRating !== undefined) setRating(initialRating);
    if (initialText !== undefined) setReviewText(initialText);
    if (initialPhotos !== undefined) setPhotos(initialPhotos);
  }, [initialRating, initialText, initialPhotos]);

  const pickImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.6,
        base64: true,
        allowsMultipleSelection: true,
        selectionLimit: 3,
      });
      if (!result.canceled && result.assets.length > 0) {
        const newPhotos = result.assets
          .filter(a => a.base64)
          .map(a => `data:image/jpeg;base64,${a.base64}`);
        setPhotos(prev => [...prev, ...newPhotos].slice(0, 3));
      }
    } catch (e) {
      console.error('사진 선택 오류:', e);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (reviewText.trim().length === 0) return;
    onSubmit?.(rating, reviewText, photos);
    setRating(0);
    setReviewText('');
    setPhotos([]);
  };

  return (
    <View style={styles.writeCard}>
      <View style={styles.writeTop}>
        <View style={styles.avatarSm}>
          <Svg width="22" height="22" viewBox="0 0 24 24">
            <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill={Colors.text2} />
          </Svg>
        </View>

        <View style={styles.writeRight}>
          <View style={styles.starInput}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} activeOpacity={0.7} style={styles.starBtn} onPress={() => setRating(star)}>
                <Svg width="24" height="24" viewBox="0 0 24 24">
                  <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={star <= rating ? '#F9A825' : Colors.text3} />
                </Svg>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.writeField}>
            <TextInput
              style={styles.textArea}
              placeholder="이 카페의 커피맛과 분위기는 어땠나요?"
              placeholderTextColor={Colors.text3}
              multiline={true}
              value={reviewText}
              onChangeText={setReviewText}
            />
          </View>

          {photos.length > 0 && (
            <View style={styles.photoPreviewRow}>
              {photos.map((photo, idx) => (
                <View key={idx} style={styles.photoThumbWrap}>
                  <Image source={{ uri: photo }} style={styles.photoThumb} />
                  <TouchableOpacity style={styles.photoRemoveBtn} onPress={() => removePhoto(idx)}>
                    <Svg width="14" height="14" viewBox="0 0 24 24">
                      <Path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
                    </Svg>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          <View style={styles.writeActions}>
            <TouchableOpacity activeOpacity={0.7} style={styles.attachBtn} onPress={pickImage}>
              <Svg width="22" height="22" viewBox="0 0 24 24">
                <Path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill={Colors.text2} />
              </Svg>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.submitBtn, reviewText.trim().length > 0 && styles.submitBtnActive]}
              onPress={handleSubmit}
            >
              <Text style={styles.submitBtnText}>{initialRating !== undefined ? '수정' : '등록'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  writeCard: { backgroundColor: Colors.bg, borderRadius: Layout.radiusMd, padding: 16, marginBottom: 24 },
  writeTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  avatarSm: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  writeRight: { flex: 1 },
  starInput: { flexDirection: 'row', gap: 4, marginBottom: 10 },
  starBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  writeField: { backgroundColor: Colors.surface, borderRadius: Layout.radiusMd, borderWidth: 1.5, borderColor: Colors.border, paddingHorizontal: 16, paddingVertical: 12 },
  textArea: { fontSize: 14, color: Colors.text1, lineHeight: 22, minHeight: 44, textAlignVertical: 'top' },
  photoPreviewRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  photoThumbWrap: { position: 'relative' },
  photoThumb: { width: 64, height: 64, borderRadius: Layout.radiusSm },
  photoRemoveBtn: { position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  writeActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  attachBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  submitBtn: { height: 36, paddingHorizontal: 20, borderRadius: Layout.radiusFull, backgroundColor: Colors.text3, justifyContent: 'center', alignItems: 'center' },
  submitBtnActive: { backgroundColor: Colors.primary, ...Layout.shadow1 },
  submitBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
});
