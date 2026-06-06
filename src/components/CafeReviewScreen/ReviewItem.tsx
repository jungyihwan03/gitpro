import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../../constants';

interface ReviewItemProps {
  initial: string;
  avatarBg: string;
  avatarColor: string;
  name: string;
  rating: number;
  date: string;
  body: string;
  photos?: string[]; 
  helpfulCount: number;
}

export const ReviewItem = ({ initial, avatarBg, avatarColor, name, rating, date, body, photos, helpfulCount }: ReviewItemProps) => {
  const [isHelpful, setIsHelpful] = useState(false);

  return (
    <View style={styles.reviewItem}>
      <View style={styles.reviewHeader}>
        <View style={[styles.reviewAvatar, { backgroundColor: avatarBg }]}>
          <Text style={[styles.avatarText, { color: avatarColor }]}>{initial}</Text>
        </View>
        <View style={styles.reviewMeta}>
          <Text style={styles.reviewerName}>{name}</Text>
          <View style={styles.reviewSub}>
            <View style={styles.reviewStars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Svg key={star} width="13" height="13" viewBox="0 0 24 24">
                  <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={star <= rating ? '#F9A825' : Colors.text3} />
                </Svg>
              ))}
            </View>
            <Text style={styles.reviewDate}>{date}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.reviewBody}>{body}</Text>

      {photos && photos.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosScroll}>
          {photos.map((color, idx) => (
            <View key={idx} style={[styles.reviewPhoto, { backgroundColor: color }]} />
          ))}
        </ScrollView>
      )}

      <TouchableOpacity activeOpacity={0.7} style={[styles.helpfulBtn, isHelpful && styles.helpfulBtnActive]} onPress={() => setIsHelpful(!isHelpful)}>
        <Svg width="16" height="16" viewBox="0 0 24 24">
          <Path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" fill={isHelpful ? Colors.primary : Colors.text2} />
        </Svg>
        <Text style={[styles.helpfulText, isHelpful && styles.helpfulTextActive]}>
          도움됨 {helpfulCount + (isHelpful ? 1 : 0)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  reviewItem: { marginBottom: 20 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  reviewAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontWeight: '700' },
  reviewMeta: { flex: 1 },
  reviewerName: { fontSize: 14, fontWeight: '700', color: Colors.text1 },
  reviewSub: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 2 },
  reviewStars: { flexDirection: 'row', gap: 2 },
  reviewDate: { fontSize: 12, color: Colors.text2 },
  reviewBody: { fontSize: 14, color: Colors.text1, lineHeight: 22, marginBottom: 12 },
  photosScroll: { flexDirection: 'row', marginBottom: 12 },
  reviewPhoto: { width: 96, height: 96, borderRadius: Layout.radiusMd, marginRight: 8 },
  helpfulBtn: { height: 32, paddingHorizontal: 12, borderRadius: Layout.radiusFull, flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, backgroundColor: 'transparent' },
  helpfulBtnActive: { backgroundColor: 'rgba(139,46,58,0.06)' },
  helpfulText: { fontSize: 12, fontWeight: '500', color: Colors.text2 },
  helpfulTextActive: { color: Colors.primary },
});