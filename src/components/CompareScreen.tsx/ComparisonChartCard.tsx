import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../../constants';

// 개별 막대 그룹(쌍)을 렌더링하기 위한 내부용 컴포넌트
const BarPair = ({ label, meVal, avgVal, meHeight, avgHeight }: any) => (
  <View style={styles.barGroup}>
    <View style={styles.barPairWrap}>
      <View style={[styles.bar, styles.barMe, { height: meHeight }]} />
      <View style={[styles.bar, styles.barAvg, { height: avgHeight }]} />
    </View>
    <View style={styles.barValues}>
      <Text style={styles.barValMe}>{meVal}</Text>
      <Text style={styles.barValAvg}>{avgVal}</Text>
    </View>
    <Text style={styles.barName}>{label}</Text>
  </View>
);

interface ComparisonChartCardProps {
  onOpenFilter: () => void;
  // 선택된 필터 값을 표시하고 싶다면 prop으로 받아오면 됩니다.
  filterGender: string; 
  filterAge: string;
}

export const ComparisonChartCard = ({ onOpenFilter, filterGender, filterAge }: ComparisonChartCardProps) => {
  return (
    <View style={styles.chartCard}>
      {/* 헤더 (제목 + 필터 버튼) */}
      <View style={styles.chartHeaderRow}>
        <Text style={styles.chartTitle}>{filterAge} {filterGender} 평균과 비교</Text>
        {/* 👇 온프레스 이벤트 연결! */}
        <TouchableOpacity activeOpacity={0.7} style={styles.btnFilter} onPress={onOpenFilter}>
          <Svg width="14" height="11" viewBox="0 0 14 11" fill="none">
            <Path d="M0 1h14M2.5 5.5h9M5 10h4" stroke={Colors.primary} strokeWidth="1.5" strokeLinecap="round"/>
          </Svg>
          <Text style={styles.btnFilterText}>필터 변경</Text>
        </TouchableOpacity>
      </View>

      {/* 범례 */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotMe]} />
          <Text style={styles.legendLabel}>나</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, styles.legendDotAvg]} />
          <Text style={styles.legendLabel}>평균</Text>
        </View>
      </View>

      {/* 차트 영역 */}
      <View style={styles.chartArea}>
        {/* 가이드라인 (배경 점선) */}
        <View style={styles.chartGuidelines} pointerEvents="none">
          <View style={styles.guideline} />
          <View style={styles.guideline} />
          <View style={styles.guideline} />
          <View style={styles.guideline} />
        </View>

        {/* 막대 그래프들 (🌟 카페인 추가됨) */}
        <BarPair label="칼로리" meVal="1,800" avgVal="2,100" meHeight={137} avgHeight={160} />
        <BarPair label="당류"   meVal="45g"   avgVal="38g"   meHeight={160} avgHeight={135} />
        <BarPair label="단백질" meVal="52g"   avgVal="65g"   meHeight={128} avgHeight={160} />
        <BarPair label="카페인" meVal="220mg" avgVal="150mg" meHeight={150} avgHeight={110} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    padding: 24,
    gap: 24,
    ...Layout.shadow1,
  },
  chartHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 28,
  },
  btnFilter: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: Layout.radiusFull,
    borderWidth: 1,
    borderColor: '#FFEDD5',
    backgroundColor: '#FFF8F1',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  btnFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendDotMe: { backgroundColor: Colors.primary },
  legendDotAvg: { backgroundColor: '#D1D5DB' },
  legendLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text2,
  },
  chartArea: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 240,
    position: 'relative',
  },
  chartGuidelines: {
    position: 'absolute',
    top: 8, left: 0, right: 0, bottom: 60,
    justifyContent: 'space-between',
    opacity: 0.2, // 투명도로 점선 색상 조절
  },
  guideline: {
    width: '100%',
    height: 1,
    borderTopWidth: 1,
    borderColor: '#9CA3AF',
    borderStyle: 'dashed',
  },
  barGroup: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    height: '100%',
  },
  barPairWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  bar: {
    width: 24, // 4개로 늘어나서 간격을 위해 너비 살짝 조정
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  barMe: {
    backgroundColor: Colors.primary,
    // RN에서는 안드로이드/iOS 분기 그림자 필요 시 elevation 사용
    shadowColor: Colors.primary, shadowOpacity: 0.25, shadowRadius: 4, shadowOffset: { width:0, height:2 }, elevation: 3,
  },
  barAvg: {
    backgroundColor: '#D1D5DB',
  },
  barValues: {
    alignItems: 'center',
  },
  barValMe: { fontSize: 13, fontWeight: '700', color: Colors.text1, lineHeight: 18 },
  barValAvg: { fontSize: 12, fontWeight: '400', color: Colors.text2, lineHeight: 16 },
  barName: { fontSize: 12, fontWeight: '500', color: Colors.text2, lineHeight: 16 },
});