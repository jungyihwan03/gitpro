import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar'; 
import Svg, { Circle as SvgCircle, Path } from 'react-native-svg';

// 🌟 화면 이동을 위해 useNavigation 도구를 추가로 가져옵니다!
import { useRoute, useNavigation } from '@react-navigation/native'; 

import { Colors, Layout } from '../constants';

import AppBar from '../components/AppBar';
import { PrimaryButton } from '../components/PrimaryButton';
import AlertCard from '../components/AlertCard';
import TimelineItem from '../components/TimelineItem';
import BottomNavBar from '../components/BottomNavBar';
import RecordBottomSheet from '../components/RecordBottomSheet'; 

import { useBottomSheetStore } from '../store/useBottomSheetStore'; 

export default function HomeScreen() {
  // 🌟 네비게이션 도구 장착 (TS 에러 방지용 <any> 추가)
  const navigation = useNavigation<any>(); 
  
  const route = useRoute<any>(); 
  const { name, gender, height, weight, age } = route.params || {};
  const userName = name || '회원';

  const { openRecordSheet } = useBottomSheetStore();

  let recommendedKcal = 2000; 
  
  if (weight && height && age && gender) {
    if (gender === 'M') {
      const bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
      recommendedKcal = Math.round(bmr * 1.3);
    } else if (gender === 'F') {
      const bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
      recommendedKcal = Math.round(bmr * 1.3);
    }
  }

  const currentKcal = 1000; 
  const circleCircumference = 2 * Math.PI * 72;
  
  let progressPercent = currentKcal / recommendedKcal; 
  if (progressPercent > 1) progressPercent = 1; 
  
  const strokeDashoffset = circleCircumference * (1 - progressPercent);

  const RecordIcon = (
    <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <Path d="M9 2v14M2 9h14" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
    </Svg>
  );

  const CustomAppBar = AppBar as any;

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      
      <View style={styles.container}>
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
              leftIcon={RecordIcon} 
              onPress={openRecordSheet} 
            />
          </View>

          <AlertCard 
            title="주의 알림"
            bodyMain="권장 섭취량의"
            highlightText={`${Math.round(progressPercent * 100)}%`} 
            bodySub="를 도달했습니다. 늦은 오후에는 고칼로리 디저트 섭취에 유의하세요."
          />

          <View style={styles.timelineSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>섭취 타임라인</Text>
              
              {/* 🌟 '전체 보기' 누르면 History 화면으로 이동하게 연결! */}
              <TouchableOpacity 
                activeOpacity={0.6} 
                onPress={() => navigation.navigate('History')}
                style={styles.viewAllBtn}
              >
                <Text style={styles.viewAllText}>전체 보기</Text>
                <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <Path d="M9 18l6-6-6-6" stroke={Colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </Svg>
              </TouchableOpacity>
            </View>
            
            <View style={styles.timelineList}>
              <TimelineItem name="아메리카노" time="오전 09:30" kcal="120kcal" />
              <TimelineItem name="에스프레소 샷" time="오후 01:15" kcal="30kcal" />
              <TimelineItem name="아이스 카페 라떼" time="오후 02:40" kcal="150kcal" isLast={true} />
            </View>
          </View>
        </ScrollView>

        <BottomNavBar activeTab="홈"/>
      </View>
      
      <RecordBottomSheet />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  container: { flex: 1, backgroundColor: Colors.bg, position: 'relative' },
  scrollArea: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 104, gap: 24 },
  
  card: { backgroundColor: Colors.surface, borderRadius: Layout.radiusLg, padding: 24, ...Layout.shadow1 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: Colors.text1, lineHeight: 28, marginBottom: 20 },
  
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
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAllText: { fontSize: 14, fontWeight: '500', color: Colors.primary },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text1, lineHeight: 28 },
  timelineList: { flexDirection: 'column', position: 'relative' },
});