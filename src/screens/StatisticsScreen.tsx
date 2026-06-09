import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Rect } from 'react-native-svg';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';

import { Colors, Layout } from '../constants';
import NavHeader from '../components/NavHeader';
import BottomNavBar from '../components/BottomNavBar';
import { SummaryCard } from '../components/StatisticsScreen/SummaryCard';
import { ChartCard } from '../components/StatisticsScreen/ChartCard';
import { RankingItem } from '../components/StatisticsScreen/RankingItem';

const SEGMENTS = ['일간', '주간', '월간'];
const CHIPS = ['칼로리', '단백질', '카페인'];
const NUTRIENT_KEY: Record<string, string> = { '칼로리': 'calories', '단백질': 'protein', '카페인': 'caffeine' };

export const StatisticsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const params = route.params || {};
  const userData = params.user || params.params?.user || params;
  const userId = userData._id;

  const [loading, setLoading] = useState(true);
  const [activeSegment, setActiveSegment] = useState(0);
  const [activeChip, setActiveChip] = useState('칼로리');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [allTimeline, setAllTimeline] = useState<any[]>([]);

  const fetchAllData = async () => {
    if (!userId) { setLoading(false); return; }
    try {
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
      const res = await fetch(`${backendUrl}/api/intake/all/${userId}`);
      const data = await res.json();
      if (res.ok) {
        setAllTimeline(data.timeline || []);
      }
    } catch (e) {
      console.error('통계 로딩 실패:', e);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(useCallback(() => { fetchAllData(); }, [userId]));

  const getFilteredData = () => {
    const d = selectedDate;
    return allTimeline.filter((item: any) => {
      const itemDate = new Date(item.date);
      if (activeSegment === 0) {
        return itemDate.toDateString() === d.toDateString();
      } else if (activeSegment === 1) {
        const weekAgo = new Date(d);
        weekAgo.setDate(weekAgo.getDate() - 6);
        return itemDate >= weekAgo && itemDate <= d;
      } else {
        return itemDate.getFullYear() === d.getFullYear() && itemDate.getMonth() === d.getMonth();
      }
    });
  };

  const filtered = getFilteredData();

  const totalCalories = filtered.reduce((sum: number, i: any) => sum + (Number(i.calories) || 0), 0);

  const sortedByDate = [...filtered].sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const lastIntake = sortedByDate.length > 0 ? sortedByDate[0] : null;
  const lastIntakeTime = lastIntake
    ? new Date(lastIntake.date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    : '-';

  const menuCountMap: Record<string, { count: number; totalCalories: number }> = {};
  filtered.forEach((item: any) => {
    const key = item.coffeeName || '기타';
    if (!menuCountMap[key]) menuCountMap[key] = { count: 0, totalCalories: 0 };
    menuCountMap[key].count++;
    menuCountMap[key].totalCalories += Number(item.calories) || 0;
  });
  const rankings = Object.entries(menuCountMap)
    .map(([name, data]) => ({ name, ...data }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const BASE_SLOTS = [8, 10, 12, 14, 16, 18];
  const hours = filtered.map((i: any) => new Date(i.date).getHours());
  const minHour = hours.length > 0 ? Math.min(...hours) : 12;
  const maxHour = hours.length > 0 ? Math.max(...hours) : 12;
  let slotOffset = 0;
  if (minHour < 7) slotOffset = -2;
  else if (maxHour >= 19) slotOffset = 2;
  const slots = BASE_SLOTS.map(s => s + slotOffset);
  const nutrientField = NUTRIENT_KEY[activeChip] || 'calories';
  const slotMap: Record<string, { val: number }> = {};
  slots.forEach(s => { slotMap[String(s).padStart(2, '0')] = { val: 0 }; });
  filtered.forEach((i: any) => {
    const h = new Date(i.date).getHours();
    let slot = slots[0];
    for (const s of slots) {
      if (h >= s - 1 && h < s + 1) { slot = s; break; }
      if (h < s) { slot = s; break; }
      slot = s;
    }
    const key = String(slot).padStart(2, '0');
    slotMap[key].val += Number(i[nutrientField]) || 0;
  });
  const maxSlotVal = Math.max(...Object.values(slotMap).map(v => v.val), 1);
  const hourlyData = slots
    .map(s => {
      const key = String(s).padStart(2, '0');
      return {
        time: key,
        val: slotMap[key].val,
        height: slotMap[key].val > 0 ? Math.max(8, (slotMap[key].val / maxSlotVal) * 200) : 4,
        active: slotMap[key].val > 0 && slotMap[key].val === Math.max(...Object.values(slotMap).map(v => v.val)),
      };
    });

  const peakSlot = hourlyData.length > 0 ? [...hourlyData].sort((a, b) => b.val - a.val)[0] : null;

  const changeDate = (direction: -1 | 1) => {
    const newDate = new Date(selectedDate);
    if (activeSegment === 0) newDate.setDate(newDate.getDate() + direction);
    else if (activeSegment === 1) newDate.setDate(newDate.getDate() + 7 * direction);
    else newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  const formatDate = () => {
    if (activeSegment === 0) {
      return selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
    } else if (activeSegment === 1) {
      const weekAgo = new Date(selectedDate);
      weekAgo.setDate(weekAgo.getDate() - 6);
      return `${weekAgo.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} - ${selectedDate.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}`;
    } else {
      return selectedDate.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long' });
    }
  };

  if (loading) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <BottomNavBar activeTab="분석" />
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <NavHeader title="통계 내역" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.segTab}>
          {SEGMENTS.map((tab, i) => (
            <TouchableOpacity
              key={tab} activeOpacity={0.6}
              style={[styles.segBtn, i === activeSegment && styles.segBtnActive]}
              onPress={() => setActiveSegment(i)}
            >
              <Text style={[styles.segBtnText, i === activeSegment && styles.segBtnTextActive]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.dateNav}>
          <TouchableOpacity activeOpacity={0.6} style={styles.dateBtn} onPress={() => changeDate(-1)}>
            <Svg width="10" height="17" viewBox="0 0 10 17" fill="none">
              <Path d="M9 1L1 8.5L9 16" stroke={Colors.text1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </TouchableOpacity>
          <Text style={styles.dateText}>{formatDate()}</Text>
          <TouchableOpacity activeOpacity={0.6} style={styles.dateBtn} onPress={() => changeDate(1)}>
            <Svg width="10" height="17" viewBox="0 0 10 17" fill="none">
              <Path d="M1 1L9 8.5L1 16" stroke={Colors.text1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryRow}>
          <SummaryCard icon="🔥" label="총 칼로리" value={totalCalories.toLocaleString()} unit="kcal" isSuccessBadge />
          <SummaryCard icon="⏰" label="마지막 섭취" value={lastIntakeTime} flexWeight={1} />
        </View>

        {hourlyData.length > 0 && <ChartCard data={hourlyData} chips={CHIPS} activeChip={activeChip} onChipChange={setActiveChip} />}

        {rankings.length > 0 && (
          <View style={styles.rankingSection}>
            <View style={styles.rankingHeader}>
              <Text style={styles.rankingTitle}>많이 먹은 메뉴 랭킹</Text>
              <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('History', { user: userData })}>
                <Text style={styles.rankingLink}>전체보기</Text>
              </TouchableOpacity>
            </View>
            {rankings.map((r, i) => (
              <RankingItem
                key={r.name}
                rank={i + 1}
                name={r.name}
                sub={`총 ${r.totalCalories.toLocaleString()}kcal · ${r.count}회 섭취`}
                count={String(r.count)}
                unit=" 회"
              />
            ))}
          </View>
        )}

        {peakSlot && (
          <View style={styles.patternCard}>
            <View style={styles.patternHeader}>
              <View style={styles.patternIcon}>
                <Svg width="17" height="13" viewBox="0 0 17 13" fill="none">
                  <Rect x="0" y="7" width="3" height="6" rx="1" fill={Colors.primary} />
                  <Rect x="4.5" y="4" width="3" height="9" rx="1" fill={Colors.primary} />
                  <Rect x="9" y="1.5" width="3" height="11.5" rx="1" fill={Colors.primary} />
                  <Rect x="13.5" y="0" width="3" height="13" rx="1" fill={Colors.primary} />
                </Svg>
              </View>
              <Text style={styles.patternTitle}>섭취 패턴 분석</Text>
            </View>
            <Text style={styles.patternBody}>
              {activeSegment === 0 ? '오늘' : '이 기간'} 중 <Text style={styles.patternHighlight}>{peakSlot.time}:00</Text>에 섭취량이 가장 많았습니다.
              총 {peakSlot.val.toLocaleString()}kcal를 섭취했으며, {rankings[0]?.name || '커피'}가 가장 많이 기록되었습니다.
            </Text>
          </View>
        )}
      </ScrollView>
      <BottomNavBar activeTab="분석" />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  scrollArea: {
    flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 104, gap: 24,
  },
  segTab: {
    backgroundColor: Colors.border,
    borderRadius: Layout.radiusLg,
    padding: 4,
    flexDirection: 'row',
    width: '100%',
  },
  segBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Layout.radiusLg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segBtnActive: {
    backgroundColor: Colors.primary,
    ...Layout.shadow1,
  },
  segBtnText: {
    fontSize: 14, fontWeight: '500', color: Colors.text2,
  },
  segBtnTextActive: {
    color: Colors.surface,
  },
  dateNav: {
    flexDirection: 'row', height: 48, alignItems: 'center',
    justifyContent: 'space-between', width: '100%',
  },
  dateBtn: {
    width: 48, height: 48, alignItems: 'center', justifyContent: 'center',
    borderRadius: Layout.radiusLg,
  },
  dateText: {
    fontSize: 20, fontWeight: '700', color: Colors.text1, lineHeight: 28,
  },
  summaryRow: {
    flexDirection: 'row', gap: 16, width: '100%',
  },
  rankingSection: {
    flexDirection: 'column', gap: 16, width: '100%',
  },
  rankingHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  rankingTitle: {
    fontSize: 18, fontWeight: '700', color: Colors.text1,
  },
  rankingLink: {
    fontSize: 14, fontWeight: '500', color: Colors.primary,
  },
  patternCard: {
    width: '100%', backgroundColor: Colors.alertBg,
    borderRadius: Layout.radiusLg, borderWidth: 1,
    borderColor: Colors.alertBorder, padding: 24, gap: 12,
  },
  patternHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  patternIcon: {
    width: 32, height: 32, borderRadius: Layout.radiusSm,
    backgroundColor: 'rgba(139,46,58,0.1)', alignItems: 'center', justifyContent: 'center',
  },
  patternTitle: {
    fontSize: 16, fontWeight: '700', color: Colors.text1,
  },
  patternBody: {
    fontSize: 14, color: Colors.text2, lineHeight: 24,
  },
  patternHighlight: {
    color: Colors.primary, fontWeight: '700',
  },
});
