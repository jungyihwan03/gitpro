import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../../constants';

export const ReviewWriteCard = () => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  return (
    <View style={styles.writeCard}>
      <View style={styles.writeTop}>
        {/* 임시 아바타 */}
        <View style={styles.avatarSm}>
          <Svg width="22" height="22" viewBox="0 0 24 24">
            <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill={Colors.text2} />
          </Svg>
        </View>

        <View style={styles.writeRight}>
          {/* 별점 선택 1~5 */}
          <View style={styles.starInput}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity 
                key={star} 
                activeOpacity={0.7} 
                style={styles.starBtn}
                onPress={() => setRating(star)}
              >
                <Svg width="24" height="24" viewBox="0 0 24 24">
                  <Path 
                    d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" 
                    fill={star <= rating ? '#F9A825' : Colors.text3} 
                  />
                </Svg>
              </TouchableOpacity>
            ))}
          </View>

          {/* 리뷰 내용 입력창 */}
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

          {/* 등록 및 사진 첨부 버튼 */}
          <View style={styles.writeActions}>
            <TouchableOpacity activeOpacity={0.7} style={styles.attachBtn}>
              <Svg width="22" height="22" viewBox="0 0 24 24">
                <Path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill={Colors.text2} />
              </Svg>
            </TouchableOpacity>
            
            <TouchableOpacity 
              activeOpacity={0.8} 
              style={[styles.submitBtn, reviewText.length > 0 && styles.submitBtnActive]}
            >
              <Text style={styles.submitBtnText}>등록</Text>
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
  writeActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  attachBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  submitBtn: { height: 36, paddingHorizontal: 20, borderRadius: Layout.radiusFull, backgroundColor: Colors.text3, justifyContent: 'center', alignItems: 'center' },
  submitBtnActive: { backgroundColor: Colors.primary, ...Layout.shadow1 },
  submitBtnText: { fontSize: 13, fontWeight: '700', color: '#fff' },
});