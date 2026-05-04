import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path, Rect } from 'react-native-svg';

// 공통 토큰
import { Colors, Layout } from '../constants';

// 작성된 컴포넌트들
import NavHeader from '../components/NavHeader';
import BottomNavBar from '../components/BottomNavBar';
import { SegmentTab } from '../components/StatisticsScreen/SegmentTab';
import { SummaryCard } from '../components/StatisticsScreen/SummaryCard';
import { ChartCard } from '../components/StatisticsScreen/ChartCard';
import { RankingItem } from '../components/StatisticsScreen/RankingItem';

export const StatisticsScreen = () => {

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      {/* 🔴 메인 스크롤 콘텐츠 */}
      <ScrollView 
        contentContainerStyle={styles.scrollArea}
        showsVerticalScrollIndicator={false}
      >
        {/* 세그먼트 탭 */}
        <SegmentTab />

        {/* 날짜 네비게이션 */}
        <View style={styles.dateNav}>
          <TouchableOpacity activeOpacity={0.6} style={styles.dateBtn}>
            <Svg width="10" height="17" viewBox="0 0 10 17" fill="none">
              <Path d="M9 1L1 8.5L9 16" stroke={Colors.text1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </TouchableOpacity>
          <Text style={styles.dateText}>2024년 5월 24일</Text>
          <TouchableOpacity activeOpacity={0.6} style={styles.dateBtn}>
            <Svg width="10" height="17" viewBox="0 0 10 17" fill="none">
              <Path d="M1 1L9 8.5L1 16" stroke={Colors.text1} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </Svg>
          </TouchableOpacity>
        </View>

        {/* 요약 카드 */}
        <View style={styles.summaryRow}>
          <SummaryCard 
            icon="🔥" 
            label="총 칼로리" 
            value="1,240" 
            unit="kcal" 
            isSuccessBadge={true} 
          />
          <SummaryCard 
            icon="⏰" 
            label="마지막 섭취" 
            value="14:30" 
            flexWeight={1} 
          />
        </View>

        {/* 차트 영역 */}
        <ChartCard />

        {/* 랭킹 섹션 */}
        <View style={styles.rankingSection}>
          <View style={styles.rankingHeader}>
            <Text style={styles.rankingTitle}>많이 먹은 메뉴 랭킹</Text>
            <TouchableOpacity activeOpacity={0.6}>
              <Text style={styles.rankingLink}>전체보기</Text>
            </TouchableOpacity>
          </View>

          <RankingItem rank={1} name="아이스 카페 라떼" sub="총 1,800kcal • 평균 150kcal/잔" count="12" unit=" 잔" />
          <RankingItem rank={2} name="초코 케이크" sub="총 1,200kcal • 당 80g" count="3" unit=" 개" />
          <RankingItem rank={3} name="녹차" sub="총 120kcal • 평균 60kcal/잔" count="2" unit=" 잔" />
        </View>

        {/* 패턴 분석 영역 */}
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
            <Text style={styles.patternTitle}>일일 섭취 패턴 분석</Text>
          </View>
          <Text style={styles.patternBody}>
            하루 중 <Text style={styles.patternHighlight}>14:00</Text>에 섭취량이 가장 많았습니다. 
            칼로리와 당의 비율이 높았으며, 저녁 시간대로 갈수록 단백질 섭취가 늘어나며 영양 균형을 찾고 있습니다.
          </Text>
        </View>

      </ScrollView>

      {/* 🔴 팀에서 구현한 BottomNavBar 적용 */}
      <BottomNavBar activeTab="분석" />
      
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1, 
    backgroundColor: Colors.bg, // 팀 constants의 bg 속성 사용
  },
  scrollArea: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 104, // BottomNavBar가 absolute이므로 스크롤 하단 공간을 충분히 확보
    gap: 24, 
  },
  dateNav: {
    flexDirection: 'row',
    height: 48,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  dateBtn: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Layout.radiusLg,
  },
  dateText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 28,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  rankingSection: {
    flexDirection: 'column',
    gap: 16,
    width: '100%',
  },
  rankingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rankingTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text1,
  },
  rankingLink: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
  },
  patternCard: {
    width: '100%',
    backgroundColor: Colors.alertBg, // constants의 alertBg 활용
    borderRadius: Layout.radiusLg,
    borderWidth: 1,
    borderColor: Colors.alertBorder, // constants의 alertBorder 활용
    padding: 24,
    gap: 12,
  },
  patternHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  patternIcon: {
    width: 32,
    height: 32,
    borderRadius: Layout.radiusSm,
    backgroundColor: 'rgba(139,46,58,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text1,
  },
  patternBody: {
    fontSize: 14,
    color: Colors.text2,
    lineHeight: 24,
  },
  patternHighlight: {
    color: Colors.primary,
    fontWeight: '700',
  },
});