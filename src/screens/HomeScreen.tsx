import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, BackHandler, ToastAndroid, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar'; 
import Svg, { Circle as SvgCircle, Path } from 'react-native-svg';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native'; 

import { Colors, Layout } from '../constants';
import AppBar from '../components/AppBar';
import { PrimaryButton } from '../components/PrimaryButton';
import AlertCard from '../components/AlertCard';
import TimelineItem from '../components/TimelineItem';
import BottomNavBar from '../components/BottomNavBar'; 
import RecordBottomSheet from '../components/RecordBottomSheet'; 
import { useBottomSheetStore } from '../store/useBottomSheetStore'; 

export default function HomeScreen() {
  const navigation = useNavigation<any>(); 
  const route = useRoute<any>(); 
  const isFocused = useIsFocused();
  const lastBackPressed = useRef<number>(0);

  // 🌟 [최종 해결] 닉네임을 찾는 모든 경로를 탐색합니다.
  const params = route.params || {};
  const userName = 
    params.name || 
    params.user?.name || 
    params.params?.name || 
    params.params?.user?.name || 
    '회원';

  const { openRecordSheet } = useBottomSheetStore();

  // 안드로이드 뒤로가기 종료 로직
  useEffect(() => {
    const backAction = () => {
      if (isFocused) {
        const currentTime = Date.now();
        if (currentTime - lastBackPressed.current < 2000) {
          BackHandler.exitApp();
          return true;
        }
        lastBackPressed.current = currentTime;
        if (Platform.OS === 'android') {
          ToastAndroid.show("'뒤로' 버튼을 한 번 더 누르면 종료됩니다.", ToastAndroid.SHORT);
        }
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [isFocused]);

  // 권장 칼로리 계산을 위한 유저 데이터 추출
  const userData = params.user || params || {};
  const weight = Number(userData.weight || 0);
  const height = Number(userData.height || 0);
  const age = Number(userData.age || 0);
  const gender = userData.gender;

  let recommendedKcal = 2000; 
  if (weight > 0 && height > 0 && age > 0) {
    if (gender === 'M' || gender === 'male') {
      recommendedKcal = Math.round(((10 * weight) + (6.25 * height) - (5 * age) + 5) * 1.3);
    } else {
      recommendedKcal = Math.round(((10 * weight) + (6.25 * height) - (5 * age) - 161) * 1.3);
    }
  }

  const currentKcal = 1000; 
  const circleCircumference = 2 * Math.PI * 72;
  let progressPercent = currentKcal / recommendedKcal; 
  if (progressPercent > 1) progressPercent = 1; 
  const strokeDashoffset = circleCircumference * (1 - progressPercent);

  const CustomAppBar = AppBar as any;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      {/* 🌟 최종 확인된 userName을 AppBar에 전달 */}
      <CustomAppBar userName={userName} />

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>오늘의 섭취 현황</Text>
          <View style={styles.chartArea}>
            <View style={styles.circularWrap}>
              <View style={{ transform: [{ rotate: '-90deg' }] }}>
                <Svg width="180" height="180" viewBox="0 0 180 180">
                  <SvgCircle cx="90" cy="90" r="72" stroke={Colors.border} strokeWidth="14" fill="none" />
                  <SvgCircle 
                    cx="90" cy="90" r="72" 
                    stroke={Colors.primary} 
                    strokeWidth="14" 
                    fill="none" 
                    strokeLinecap="round"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={strokeDashoffset} 
                  />
                </Svg>
              </View>
              <View style={styles.chartCenter}>
                <Text style={styles.cLabel}>칼로리 섭취량</Text>
                <Text style={styles.cValue}>{currentKcal.toLocaleString()} <Text style={styles.cUnit}>kcal</Text></Text>
                <Text style={styles.cTotal}>/ {recommendedKcal.toLocaleString()}kcal</Text>
              </View>
            </View>
          </View>

          <View style={styles.nutrients}>
            <View style={styles.nutrientItem}>
              <View style={[styles.nDot, { backgroundColor: Colors.warning }]} />
              <Text style={styles.nLabel}>당류</Text>
              <Text style={styles.nVal}>25g</Text>
              <Text style={styles.nTotal}>/ 50g</Text>
            </View>
            <View style={styles.nutrientItem}>
              <View style={[styles.nDot, { backgroundColor: Colors.primary, opacity: 0.5 }]} />
              <Text style={styles.nLabel}>단백질</Text>
              <Text style={styles.nVal}>40g</Text>
              <Text style={styles.nTotal}>/ 60g</Text>
            </View>
          </View>

          <PrimaryButton 
            title="기록하기" 
            onPress={openRecordSheet} 
          />
        </View>

        <AlertCard 
          title="주의 알림" 
          bodyMain="권장 섭취량의" 
          highlightText={`${Math.round(progressPercent * 100)}%`} 
          bodySub="를 도달했습니다." 
        />
        
        <View style={styles.timelineSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>섭취 타임라인</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History', { ...params })}>
              <Text style={{ color: Colors.primary, fontWeight: '500' }}>전체 보기</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.timelineList}>
            <TimelineItem name="아메리카노" time="오전 09:30" kcal="120kcal" />
            <TimelineItem name="아이스 카페 라떼" time="오후 02:40" kcal="150kcal" isLast={true} />
          </View>
        </View>
      </ScrollView>

      <BottomNavBar activeTab="홈" />
      <RecordBottomSheet />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scrollArea: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 110, gap: 24 },
  card: { backgroundColor: Colors.surface, borderRadius: Layout.radiusLg, padding: 24, ...Layout.shadow1 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: Colors.text1, marginBottom: 20 },
  chartArea: { alignItems: 'center', marginBottom: 20 },
  circularWrap: { position: 'relative', width: 180, height: 180 },
  chartCenter: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, alignItems: 'center', justifyContent: 'center' },
  cLabel: { fontSize: 12, color: Colors.text2, marginBottom: 2 },
  cValue: { fontSize: 28, fontWeight: '700', color: Colors.text1, lineHeight: 32 },
  cUnit: { fontSize: 14, fontWeight: '500', color: Colors.text2 },
  cTotal: { fontSize: 12, color: Colors.text2, marginTop: 4 },
  nutrients: { flexDirection: 'row', gap: 20, justifyContent: 'center', marginBottom: 20 },
  nutrientItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  nDot: { width: 10, height: 10, borderRadius: 5 },
  nLabel: { fontSize: 13, color: Colors.text1, fontWeight: '500' },
  nVal: { fontSize: 13, fontWeight: '700', color: Colors.text1, marginLeft: 2 },
  nTotal: { fontSize: 13, color: Colors.text2, fontWeight: '400' },
  timelineSection: { flexDirection: 'column', gap: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text1, lineHeight: 28 },
  timelineList: { gap: 0 },
});