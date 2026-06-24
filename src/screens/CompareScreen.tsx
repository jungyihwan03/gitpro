import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRoute, useNavigation } from '@react-navigation/native';

import { Colors } from '../constants';

import NavHeader from '../components/NavHeader';
import BottomNavBar from '../components/BottomNavBar';
import { ComparisonChartCard } from '../components/CompareScreen.tsx/ComparisonChartCard';
import { AnalysisCard } from '../components/CompareScreen.tsx/AnalysisCard';
import { FilterBottomSheet } from '../components/CompareScreen.tsx/FilterBottomSheet';

const GENDER_MAP: Record<string, string> = { '남성': 'M', '여성': 'F' };
const AGE_MAP: Record<string, number> = { '10대': 10, '20대': 20, '30대': 30, '40대': 40, '50대': 50, '60대 이상': 60 };

const getAgeGroup = (age: number): string => {
  if (age >= 60) return '60대 이상';
  if (age >= 50) return '50대';
  if (age >= 40) return '40대';
  if (age >= 30) return '30대';
  if (age >= 20) return '20대';
  return '10대';
};

const getGenderLabel = (gender: string): string => {
  if (gender === 'M') return '남성';
  if (gender === 'F') return '여성';
  return '남성';
};

export const CompareScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params || {};
  const userData = params.user || params;
  const userId = userData._id;

  const initialGender = userData.gender ? getGenderLabel(userData.gender) : '남성';
  const initialAge = userData.age ? getAgeGroup(Number(userData.age)) : '30대';

  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [currentFilter, setCurrentFilter] = useState({ gender: initialGender, age: initialAge });
  const [loading, setLoading] = useState(true);
  const [myTotals, setMyTotals] = useState({ calories: 0, sugar: 0, protein: 0, caffeine: 0 });
  const [avgTotals, setAvgTotals] = useState({ calories: 0, sugar: 0, protein: 0, caffeine: 0 });

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
  const cleanUrl = backendUrl?.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) { setLoading(false); return; }
      try {
        const [myRes, avgRes] = await Promise.all([
          fetch(`${cleanUrl}/api/intake/all/${userId}`),
          fetch(`${cleanUrl}/api/intake/average?gender=${GENDER_MAP[currentFilter.gender]}&age=${AGE_MAP[currentFilter.age]}`),
        ]);
        const myData = await myRes.json();
        const avgData = await avgRes.json();
        const timeline: any[] = myData.timeline || [];
        const totals = timeline.reduce((acc: any, item: any) => ({
          calories: acc.calories + (Number(item.calories) || 0),
          sugar: acc.sugar + (Number(item.sugar) || 0),
          protein: acc.protein + (Number(item.protein) || 0),
          caffeine: acc.caffeine + (Number(item.caffeine) || 0),
        }), { calories: 0, sugar: 0, protein: 0, caffeine: 0 });
        setMyTotals(totals);
        setAvgTotals({
          calories: avgData.avgCalories || 0,
          sugar: avgData.avgSugar || 0,
          protein: avgData.avgProtein || 0,
          caffeine: avgData.avgCaffeine || 0,
        });
      } catch (e) {
        console.error('데이터 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, currentFilter]);

  const avg = avgTotals;

  const compare = (my: number, avgVal: number) => {
    if (my > avgVal) return 'HIGHER';
    if (my < avgVal) return 'LOWER';
    return 'SAME';
  };

  const diff = (my: number, avgVal: number) => Math.abs(my - avgVal);

  if (loading) {
    return (
      <View style={[styles.safeArea, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <NavHeader title="내 섭취량 비교" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollArea}>
        
        <ComparisonChartCard 
          onOpenFilter={() => setIsFilterVisible(true)}
          filterGender={currentFilter.gender}
          filterAge={currentFilter.age}
          myTotals={myTotals}
          avgTotals={avgTotals}
        />

        <View style={styles.analysisSection}>
          <Text style={styles.sectionTitle}>상세 분석</Text>
          
          <AnalysisCard 
            title="칼로리"
            status={compare(myTotals.calories, avg.calories)}
            compareText={`평균: ${avg.calories} kcal / 나: ${myTotals.calories} kcal`}
            highlightText={`${diff(myTotals.calories, avg.calories)} kcal`}
            descText={myTotals.calories > avg.calories ? '평균보다 높게 섭취하고 있습니다.' : '평균보다 낮게 섭취하고 있습니다.'}
            highlightType={myTotals.calories > avg.calories ? 'error' : 'success'}
          />

          <AnalysisCard 
            title="당류"
            status={compare(myTotals.sugar, avg.sugar)}
            compareText={`평균: ${avg.sugar}g / 나: ${myTotals.sugar}g`}
            highlightText={`${diff(myTotals.sugar, avg.sugar)}g`}
            descText={myTotals.sugar > avg.sugar ? '더 많이 섭취하고 있습니다.' : '더 적게 섭취하고 있습니다.'}
            highlightType={myTotals.sugar > avg.sugar ? 'error' : 'success'}
          />

          <AnalysisCard 
            title="단백질"
            status={compare(myTotals.protein, avg.protein)}
            compareText={`평균: ${avg.protein}g / 나: ${myTotals.protein}g`}
            highlightText={`${diff(myTotals.protein, avg.protein)}g`}
            descText={myTotals.protein < avg.protein ? '적게 섭취하고 있습니다. 보충이 필요해요.' : '충분히 섭취하고 있습니다.'}
            highlightType={myTotals.protein < avg.protein ? 'warning' : 'success'}
          />

          <AnalysisCard 
            title="카페인"
            status={compare(myTotals.caffeine, avg.caffeine)}
            compareText={`평균: ${avg.caffeine}mg / 나: ${myTotals.caffeine}mg`}
            highlightText={`${diff(myTotals.caffeine, avg.caffeine)}mg`}
            descText={myTotals.caffeine > avg.caffeine ? '더 많이 섭취하고 있습니다. 수면을 위해 조절을 권장해요.' : '평균보다 적게 섭취하고 있습니다.'}
            highlightType={myTotals.caffeine > avg.caffeine ? 'error' : 'success'}
          />
        </View>

      </ScrollView>

      <BottomNavBar activeTab="분석" />
      
      <FilterBottomSheet 
        visible={isFilterVisible}
        onClose={() => setIsFilterVisible(false)}
        onApply={(filters) => {
          setCurrentFilter(filters);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  scrollArea: { 
    padding: 24, 
    gap: 24, 
    paddingBottom: 110 // BottomNavBar 공간 확보
  },
  analysisSection: {
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 28,
  }
});