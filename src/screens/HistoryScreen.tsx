// src/screens/HistoryScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors } from '../constants';

// 컴포넌트 임포트
import NavHeader from '../components/NavHeader';
import TimelineItem from '../components/TimelineItem';
import DateNavigator from '../components/DateNavigator';
import DailySummaryCard from '../components/DailySummaryCard';

export default function HistoryScreen() {
  return (
    <View style={styles.safeArea}>
      <View style={styles.container}>
        <NavHeader title="" onBack={() => console.log('뒤로 가기 클릭')} />

        <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
          
          {/* 1. 페이지 헤더 (컴포넌트로 분리됨) */}
          <DateNavigator 
            title="섭취 내역"
            dateText="오늘, 10월 24일"
            onPrevPress={() => console.log('이전 날짜')}
            onNextPress={() => console.log('다음 날짜')}
            isNextDisabled={true} // 오늘이므로 미래로 갈 수 없게 막음
          />

          {/* 2. 오늘의 요약 카드 (컴포넌트로 분리됨) */}
          <DailySummaryCard 
            calories={300} 
            count={3} 
            caffeine={280} 
          />

          {/* 3. 오늘 타임라인 */}
          <View style={styles.timelineSection}>
            <Text style={styles.sectionTitle}>오늘</Text>
            <View style={styles.timelineList}>
              <TimelineItem name="아이스 카페 라떼" time="오후 02:40" kcal="150kcal" />
              <TimelineItem name="에스프레소 샷" time="오후 01:15" kcal="30kcal" />
              <TimelineItem name="아메리카노" time="오전 09:30" kcal="120kcal" isLast={true} />
            </View>
          </View>

          {/* 4. 어제 타임라인 */}
          <View style={styles.timelineSection}>
            <Text style={styles.sectionTitle}>어제, 10월 23일</Text>
            <View style={styles.timelineList}>
              <TimelineItem name="콜드브루 오트라떼" time="오후 04:00" kcal="210kcal" isPast={true} />
              <TimelineItem name="아이스 아메리카노" time="오전 08:50" kcal="15kcal" isPast={true} isLast={true} />
            </View>
          </View>

        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  container: { flex: 1, backgroundColor: Colors.bg },
  scrollArea: { flexGrow: 1, padding: 24, paddingBottom: 40, gap: 24 },
  
  timelineSection: { flexDirection: 'column', gap: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text1, lineHeight: 28 },
  timelineList: { flexDirection: 'column' }, 
});