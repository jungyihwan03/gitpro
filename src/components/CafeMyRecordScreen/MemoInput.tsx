import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Layout } from '../../constants';

interface MemoInputProps {
  onSubmit?: (text: string, photos: string[]) => void;
}

export const MemoInput = ({ onSubmit }: MemoInputProps) => {
  const [memo, setMemo] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);

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
    if (memo.trim().length === 0) return;
    onSubmit?.(memo, photos);
    setMemo('');
    setPhotos([]);
  };

  return (
    <View style={styles.memoWrap}>
      <View style={[styles.memoField, isFocused && styles.memoFieldActive]}>
        <TouchableOpacity activeOpacity={0.7} onPress={pickImage}>
          <Svg width="20" height="20" viewBox="0 0 24 24" style={styles.memoIcon}>
            <Path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill={Colors.text2} />
          </Svg>
        </TouchableOpacity>
        <TextInput
          style={styles.memoInput}
          placeholder="간단한 메모를 남겨보세요"
          placeholderTextColor={Colors.text3}
          value={memo}
          onChangeText={setMemo}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        <TouchableOpacity activeOpacity={0.7} style={styles.memoEditBtn} onPress={handleSubmit}>
          <Svg width="18" height="18" viewBox="0 0 24 24">
            <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill={Colors.text2} />
          </Svg>
        </TouchableOpacity>
      </View>
      {photos.length > 0 && (
        <View style={styles.photoRow}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  memoWrap: { marginBottom: 24 },
  memoField: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: Colors.surface, borderRadius: Layout.radiusMd, borderWidth: 1.5, borderColor: Colors.border, paddingLeft: 16, paddingRight: 8, height: 52 },
  memoFieldActive: { borderColor: Colors.primary },
  memoIcon: { flexShrink: 0 },
  memoInput: { flex: 1, fontSize: 14, fontWeight: '400', color: Colors.text1, padding: 0 },
  memoEditBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  photoRow: { flexDirection: 'row', gap: 8, marginTop: 10 },
  photoThumbWrap: { position: 'relative' },
  photoThumb: { width: 64, height: 64, borderRadius: Layout.radiusSm },
  photoRemoveBtn: { position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
});
