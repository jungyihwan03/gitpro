import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout } from '../constants';

interface PlaceDetails {
  formatted_phone_number?: string;
  website?: string;
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  };
  price_level?: number;
  rating?: number;
  user_ratings_total?: number;
}

interface CafeExternalInfoProps {
  details: PlaceDetails | null;
  loading?: boolean;
}

const PRICE_LEVEL_MAP: Record<number, string> = {
  0: '무료', 1: '저렴', 2: '보통', 3: '비쌈', 4: '매우 비쌈',
};

export default function CafeExternalInfo({ details, loading }: CafeExternalInfoProps) {
  if (loading) {
    return (
      <View style={styles.card}>
        <Text style={styles.loadingText}>불러오는 중...</Text>
      </View>
    );
  }

  if (!details) return null;

  const phone = details.formatted_phone_number;
  const website = details.website;
  const hours = details.opening_hours;
  const priceLevel = details.price_level;
  const rating = details.rating;
  const totalRatings = details.user_ratings_total;

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>영업 정보</Text>

        {phone && (
          <TouchableOpacity style={styles.infoItem} onPress={() => Linking.openURL(`tel:${phone}`)}>
            <Ionicons name="call" size={20} color={Colors.text2} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoPrimary}>{phone}</Text>
              <Text style={styles.infoSecondary}>전화걸기</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.text3} />
          </TouchableOpacity>
        )}

        {website && (
          <TouchableOpacity style={styles.infoItem} onPress={() => Linking.openURL(website)}>
            <Ionicons name="globe" size={20} color={Colors.text2} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoPrimary} numberOfLines={1}>{website.replace(/^https?:\/\//, '')}</Text>
              <Text style={styles.infoSecondary}>웹사이트 방문</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.text3} />
          </TouchableOpacity>
        )}

        {priceLevel !== undefined && (
          <View style={[styles.infoItem, !website ? { borderBottomWidth: 0, paddingBottom: 0 } : {}]}>
            <Ionicons name="wallet" size={20} color={Colors.text2} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoPrimary}>가격대: {PRICE_LEVEL_MAP[priceLevel] || '알 수 없음'}</Text>
              <Text style={styles.infoSecondary}>
                {new Array(priceLevel).fill('₩').join('')}
              </Text>
            </View>
          </View>
        )}
      </View>

      {hours?.weekday_text && (
        <View style={styles.card}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>영업 시간</Text>
            {hours.open_now !== undefined && (
              <View style={[styles.openBadge, hours.open_now ? styles.openBadgeActive : styles.openBadgeClosed]}>
                <Text style={[styles.openBadgeText, hours.open_now ? { color: '#16A34A' } : { color: '#EF4444' }]}>
                  {hours.open_now ? '영업 중' : '영업 종료'}
                </Text>
              </View>
            )}
          </View>
          {hours.weekday_text.map((day, i) => {
            const isToday = i === new Date().getDay();
            return (
              <View key={i} style={[styles.hoursRow, isToday && styles.hoursRowToday]}>
                <Text style={[styles.hoursDay, isToday && styles.hoursDayToday]}>{day.split(': ')[0]}</Text>
                <Text style={[styles.hoursTime, isToday && styles.hoursTimeToday]}>{day.split(': ')[1] || day}</Text>
              </View>
            );
          })}
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>리뷰 정보</Text>

        {rating && (
          <View style={styles.infoItem}>
            <Ionicons name="star" size={20} color="#F59E0B" style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoPrimary}>구글 평점 {rating.toFixed(1)}</Text>
              {totalRatings && (
                <Text style={styles.infoSecondary}>리뷰 {totalRatings.toLocaleString()}개</Text>
              )}
            </View>
          </View>
        )}

        <View style={[styles.infoItem, { borderBottomWidth: 0, paddingBottom: 0 }]}>
          <Ionicons name="logo-instagram" size={20} color={Colors.text2} style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoSecondary}>인스타그램 정보가 없습니다</Text>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    padding: 24,
    ...Layout.shadow1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text1,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 15,
    color: Colors.text2,
    textAlign: 'center',
    paddingVertical: 24,
  },
  infoItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    alignItems: 'center',
    gap: 12,
  },
  infoIcon: { marginTop: 0 },
  infoContent: { flex: 1, gap: 2 },
  infoPrimary: { fontSize: 15, fontWeight: '500', color: Colors.text1 },
  infoSecondary: { fontSize: 12, color: Colors.text2 },
  openBadge: {
    paddingHorizontal: 12,
    height: 26,
    borderRadius: Layout.radiusFull,
    justifyContent: 'center',
  },
  openBadgeActive: { backgroundColor: '#DCFCE7' },
  openBadgeClosed: { backgroundColor: '#FEE2E2' },
  openBadgeText: { fontSize: 12, fontWeight: 'bold' },
  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  hoursRowToday: {
    backgroundColor: 'rgba(139,46,58,0.05)',
    borderRadius: 8,
    borderBottomColor: 'transparent',
  },
  hoursDay: { fontSize: 14, color: Colors.text1, fontWeight: '500' },
  hoursDayToday: { color: Colors.primary, fontWeight: '700' },
  hoursTime: { fontSize: 14, color: Colors.text2 },
  hoursTimeToday: { color: Colors.text1, fontWeight: '600' },
});
