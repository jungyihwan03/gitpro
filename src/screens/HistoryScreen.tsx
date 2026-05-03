import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors } from '../constants';

import NavHeader from '../components/NavHeader';
import TimelineItem from '../components/TimelineItem';
import DateNavigator from '../components/DateNavigator';
import DailySummaryCard from '../components/DailySummaryCard';

export default function HistoryScreen() {
  const navigation = useNavigation();
  const route = useRoute<any>();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ caffeine: 0, calories: 0, protein: 0 });
  const [groupedTimeline, setGroupedTimeline] = useState<any[]>([]);

  const params = route.params || {};
  const userData = params.user || params || {};
  const userId = userData._id;

  // 🌟 데이터를 날짜별로 묶는 함수
  const groupDataByDate = (logs: any[]) => {
    const groups: { [key: string]: any[] } = {};
    
    logs.forEach(log => {
      const dateObj = new Date(log.date);
      const dateKey = dateObj.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
      });
      
      if (!groups[dateKey]) groups[dateKey] = [];
      groups[dateKey].push(log);
    });

    return Object.keys(groups).map(date => ({
      date,
      data: groups[date],
    }));
  };

  const fetchAllHistory = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
      // 🌟 새로 만든 'all' 엔드포인트 호출
      const response = await fetch(`${backendUrl}/api/intake/all/${userId}`);
      const data = await response.json();

      if (response.ok) {
        setStats(data.totals);
        // 데이터를 그룹화하여 저장
        setGroupedTimeline(groupDataByDate(data.timeline));
      }
    } catch (error) {
      console.error("전체 내역 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllHistory();
    }, [userId])
  );

  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <NavHeader title="" onBack={() => navigation.goBack()} />

        {loading ? (
          <View style={styles.loadingCenter}>
            <ActivityIndicator color={Colors.primary} size="large" />
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
            
            <DateNavigator 
              title="섭취 내역"
              dateText="전체 기록" // 전체를 보여주므로 텍스트 변경
              onPrevPress={() => {}}
              onNextPress={() => {}}
              isNextDisabled={true} 
            />

            {/* 상단은 오늘 기준 요약 */}
            <DailySummaryCard 
              calories={stats.calories} 
              count={groupedTimeline[0]?.data.length || 0} 
              caffeine={stats.caffeine} 
            />

            {/* 🌟 날짜별로 그룹화된 타임라인 렌더링 */}
            {groupedTimeline.length > 0 ? (
              groupedTimeline.map((group, groupIndex) => (
                <View key={group.date} style={styles.timelineSection}>
                  <Text style={styles.sectionTitle}>{group.date}</Text>
                  <View style={styles.timelineList}>
                    {group.data.map((item: any, index: number) => (
                      <TimelineItem 
                        key={item._id}
                        name={item.coffeeName} 
                        time={new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} 
                        kcal={`${item.calories}kcal`} 
                        isLast={index === group.data.length - 1}
                        // 과거 데이터는 색상을 다르게 표시 (isPast)
                        isPast={groupIndex > 0} 
                      />
                    ))}
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>저장된 기록이 없습니다.</Text>
            )}

          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  container: { flex: 1, backgroundColor: Colors.bg },
  scrollArea: { flexGrow: 1, padding: 24, paddingBottom: 40, gap: 24 },
  loadingCenter: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  timelineSection: { flexDirection: 'column', gap: 16, marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text2, backgroundColor: '#f8f8f8', padding: 8, borderRadius: 8 },
  timelineList: { flexDirection: 'column' },
  emptyText: { textAlign: 'center', color: Colors.text3, marginTop: 40 }
});