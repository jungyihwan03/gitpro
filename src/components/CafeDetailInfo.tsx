import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Layout } from '../constants';

interface PlaceHours {
  open_now?: boolean;
  weekday_text?: string[];
}

interface CafeDetailInfoProps {
  vicinity?: string;
  placeHours?: PlaceHours | null;
  phone?: string | null;
}

export default function CafeDetailInfo({ vicinity, placeHours, phone }: CafeDetailInfoProps) {
  const [hoursExpanded, setHoursExpanded] = useState(false);

  const weekdayText = placeHours?.weekday_text;
  const openNow = placeHours?.open_now;

  const todayIndex = new Date().getDay();

  const todaySchedule = weekdayText?.[todayIndex];
  const closingTime = todaySchedule?.split(': ')[1];

  return (
    <View style={styles.card}>
      <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>상세 정보</Text>
      
      {/* 주소 */}
      <View style={styles.infoItem}>
        <Ionicons name="location-sharp" size={20} color={Colors.text2} style={styles.infoIcon} />
        <View style={styles.infoContent}>
          <Text style={styles.infoPrimary}>{vicinity || '서울특별시 강남구 테헤란로 123'}</Text>
          <Text style={styles.infoSecondary}>(지번) {vicinity?.split(' ').slice(-1)[0] || '역삼동 649-10'}</Text>
        </View>
        <TouchableOpacity style={styles.copyBtn}>
          <Text style={styles.copyBtnText}>주소 복사</Text>
        </TouchableOpacity>
      </View>

      {/* 영업시간 */}
      <View style={styles.infoItem}>
        <Ionicons name="time" size={20} color={Colors.text2} style={styles.infoIcon} />
        <View style={styles.infoContent}>
          {weekdayText ? (
            <>
              <View style={styles.hoursRow}>
                <View style={[styles.openBadge, openNow ? styles.openBadgeActive : styles.openBadgeClosed]}>
                  <Text style={[styles.openBadgeText, openNow ? { color: '#16A34A' } : { color: '#EF4444' }]}>
                    {openNow ? '영업 중' : '영업 종료'}
                  </Text>
                </View>
                {closingTime && (
                  <Text style={styles.closingInfoText}>
                    {openNow ? `${closingTime}에 영업 종료` : `${todaySchedule?.split(': ')[0]} ${closingTime}`}
                  </Text>
                )}
              </View>
              <TouchableOpacity style={styles.hoursExpandBtn} onPress={() => setHoursExpanded(!hoursExpanded)}>
                <Text style={styles.hoursExpandText}>{hoursExpanded ? '접기' : '전체 시간 보기'}</Text>
                <Ionicons name={hoursExpanded ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.primary} />
              </TouchableOpacity>
              {hoursExpanded && (
                <View style={styles.fullHours}>
                  {weekdayText.map((day, i) => {
                    const isToday = i === todayIndex;
                    return (
                      <View key={i} style={[styles.hoursRowItem, isToday && styles.hoursRowToday]}>
                        <Text style={[styles.hoursDay, isToday && styles.hoursDayToday]}>{day.split(': ')[0]}</Text>
                        <Text style={[styles.hoursTime, isToday && styles.hoursTimeToday]}>{day.split(': ')[1] || day}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </>
          ) : (
            <Text style={styles.infoSecondary}>영업 시간 정보가 없습니다</Text>
          )}
        </View>
      </View>

      {/* 전화 */}
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
  openBadge: { paddingHorizontal: 10, height: 24, borderRadius: Layout.radiusFull, justifyContent: 'center' },
  openBadgeActive: { backgroundColor: '#DCFCE7' },
  openBadgeClosed: { backgroundColor: '#FEE2E2' },
  openBadgeText: { fontSize: 11, fontWeight: 'bold' },
  closingInfoText: { fontSize: 12, fontWeight: '500', color: Colors.error },
  hoursExpandBtn: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  hoursExpandText: { fontSize: 13, fontWeight: '500', color: Colors.primary },
  copyBtn: { backgroundColor: 'rgba(139,46,58,0.08)', paddingHorizontal: 14, height: 32, borderRadius: Layout.radiusFull, justifyContent: 'center' },
  copyBtnText: { fontSize: 12, fontWeight: 'bold', color: Colors.primary },
  infoLink: { fontSize: 14, color: Colors.primary, textDecorationLine: 'underline' },
  fullHours: { marginTop: 12, gap: 0 },
  hoursRowItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
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
