import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  BackHandler, 
  ToastAndroid, 
  Platform,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { StatusBar } from 'expo-status-bar'; 
import Svg, { Circle as SvgCircle } from 'react-native-svg';
import { useRoute, useNavigation, useIsFocused, useFocusEffect } from '@react-navigation/native'; 

import { Colors, Layout } from '../constants';
import AppBar from '../components/AppBar';
import { useUserStore } from '../store/useUserStore';
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

  // 1. 상태 관리 (🌟 당류(sugar) 데이터도 안전하게 추가)
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ caffeine: 0, calories: 0, protein: 0, sugar: 0 });
  const [timeline, setTimeline] = useState<any[]>([]);

  // 2. 유저 정보 추출 (store 우선, params fallback)
  const params = route.params || {};
  const storeUser = useUserStore((s) => s.user);
  const userData = storeUser || params.user || params.params?.user || params;
  const userName = userData.name || '회원';
  const userId = userData._id; 

  // 권장량 계산 로직
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

  // 3. 데이터 가져오기 (로컬 타임존 기준 오늘 데이터만 필터)
  const fetchTodayData = async () => {
    if (!userId) {
      console.log("❌ 유저 ID를 찾을 수 없어 데이터를 불러오지 못합니다.");
      setLoading(false);
      return;
    }

    try {
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
      const response = await fetch(`${backendUrl}/api/intake/all/${userId}`);
      const data = await response.json();
      
      if (response.ok) {
        const now = new Date();
        const localStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const localEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

        const allLogs: any[] = data.timeline || [];
        const todayLogs = allLogs.filter((log: any) => {
          const d = new Date(log.date);
          return d >= localStart && d < localEnd;
        });

        const totals = todayLogs.reduce((acc: any, cur: any) => ({
          caffeine: acc.caffeine + (Number(cur.caffeine) || 0),
          calories: acc.calories + (Number(cur.calories) || 0),
          protein: acc.protein + (Number(cur.protein) || 0),
          sugar: acc.sugar + (Number(cur.sugar) || 0),
        }), { caffeine: 0, calories: 0, protein: 0, sugar: 0 });

        setStats(totals);
        setTimeline(todayLogs);
      }
    } catch (error) {
      console.error("📡 데이터 로딩 실패:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTodayData();
    }, [userId])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchTodayData();
  };

  // 4. 차트 수치 계산
  const circleCircumference = 2 * Math.PI * 72;
  
  const percents = [
    { label: '카페인', value: stats.caffeine, limit: 400, unit: 'mg', dotColor: '#6F4E37' },
    { label: '칼로리', value: stats.calories, limit: recommendedKcal, unit: 'kcal', dotColor: Colors.primary },
    { label: '당류', value: stats.sugar, limit: 50, unit: 'g', dotColor: Colors.warning },
    { label: '단백질', value: stats.protein, limit: 60, unit: 'g', dotColor: Colors.primary },
  ];
  let maxPct = 0;
  let maxLabel = '카페인';
  for (const p of percents) {
    const pct = Math.min(p.value / p.limit, 1);
    if (pct > maxPct) { maxPct = pct; maxLabel = p.label; }
  }
  const calPct = Math.min(stats.calories / recommendedKcal, 1);
  const progressPercent = calPct;
  const strokeDashoffset = circleCircumference * (1 - progressPercent);

  const belowNutrients = percents.filter(p => p.label !== '칼로리');

  // 안드로이드 뒤로가기
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

  const { openRecordSheet } = useBottomSheetStore();
  const CustomAppBar = AppBar as any;

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <CustomAppBar userName={userName} onSearchPress={() => navigation.navigate('Search', { user: userData })} />

      <ScrollView 
        contentContainerStyle={styles.scrollArea} 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
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
                <Text style={styles.cValue}>{stats.calories.toLocaleString()} <Text style={styles.cUnit}>kcal</Text></Text>
                <Text style={styles.cTotal}>/ {recommendedKcal.toLocaleString()}kcal</Text>
              </View>
            </View>
          </View>

          {/* 2줄: 1행 2개, 2행 1개 가운데 */}
          <View style={styles.nutrientsWrapper}>
            <View style={styles.nutrientsRow}>
              <View style={styles.nutrientItem}>
                <View style={[styles.nDot, { backgroundColor: belowNutrients[0].dotColor }]} />
                <Text style={styles.nLabel}>{belowNutrients[0].label}</Text>
                <Text style={styles.nVal}>{belowNutrients[0].value || 0}{belowNutrients[0].unit}</Text>
                <Text style={styles.nTotal}>/ {belowNutrients[0].limit}{belowNutrients[0].unit}</Text>
              </View>
              <View style={styles.nutrientItem}>
                <View style={[styles.nDot, { backgroundColor: belowNutrients[1].dotColor }]} />
                <Text style={styles.nLabel}>{belowNutrients[1].label}</Text>
                <Text style={styles.nVal}>{belowNutrients[1].value || 0}{belowNutrients[1].unit}</Text>
                <Text style={styles.nTotal}>/ {belowNutrients[1].limit}{belowNutrients[1].unit}</Text>
              </View>
            </View>
            <View style={styles.nutrientItem}>
              <View style={[styles.nDot, { backgroundColor: belowNutrients[2].dotColor }]} />
              <Text style={styles.nLabel}>{belowNutrients[2].label}</Text>
              <Text style={styles.nVal}>{belowNutrients[2].value || 0}{belowNutrients[2].unit}</Text>
              <Text style={styles.nTotal}>/ {belowNutrients[2].limit}{belowNutrients[2].unit}</Text>
            </View>
          </View>

          <PrimaryButton 
            title="기록하기" 
            onPress={openRecordSheet} 
          />
        </View>

        <AlertCard 
          title="섭취 알림" 
          bodyMain={`권장 ${maxLabel}의`} 
          highlightText={`${Math.round(maxPct * 100)}%`} 
          bodySub="를 섭취했습니다." 
        />
        
        <View style={styles.timelineSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>섭취 타임라인</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History', { ...params })}>
              <Text style={{ color: Colors.primary, fontWeight: '500' }}>전체 보기</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.timelineList}>
            {loading ? (
              <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }} />
            ) : timeline && timeline.length > 0 ? (
              timeline.slice(0, 5).map((log: any, index: number) => (
                <TimelineItem 
                  key={`${log._id}-${index}`}
                  name={log.coffeeName} 
                  time={new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                  kcal={`${log.calories}kcal`} 
                  isLast={index === timeline.length - 1 || index === 4}
                  onPress={() => navigation.navigate('MenuDetail', { item: log, user: userData, fromTimeline: true })}
                />
              ))
            ) : (
              <View style={styles.emptyWrap}>
                <Text style={styles.emptyText}>오늘 섭취한 기록이 없습니다.</Text>
              </View>
            )}
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
  
  // 🌟 변경된 영양소 레이아웃 스타일
  nutrientsWrapper: { flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 20 },
  nutrientsRow: { flexDirection: 'row', gap: 20, justifyContent: 'center' },
  nutrientItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  
  nDot: { width: 10, height: 10, borderRadius: 5 },
  nLabel: { fontSize: 13, color: Colors.text1, fontWeight: '500' },
  nVal: { fontSize: 13, fontWeight: '700', color: Colors.text1, marginLeft: 2 },
  nTotal: { fontSize: 13, color: Colors.text2, fontWeight: '400' },
  
  timelineSection: { flexDirection: 'column', gap: 16 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text1, lineHeight: 28 },
  timelineList: { gap: 0 },
  emptyWrap: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { color: Colors.text3, fontSize: 14 },
});