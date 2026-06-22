import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import NavHeader from '../components/NavHeader';
import RankItem from '../components/DrinkRankingScreen/RankItem';
import { PrimaryButton } from '../components/PrimaryButton';

// 랭킹 더미 데이터
const RANKING_DATA = [
  { id: 1, name: '아이스 카페 라떼', totalMg: '1,800', count: 12, type: 'latte' },
  { id: 2, name: '에스프레소', totalMg: '525', count: 7, type: 'espresso' },
  { id: 3, name: '녹차', totalMg: '180', count: 3, type: 'greentea' },
  { id: 4, name: '아메리카노', totalMg: '750', count: 5, type: 'americano' },
  { id: 5, name: '카푸치노', totalMg: '400', count: 4, type: 'cappuccino' },
  { id: 6, name: '바닐라 라떼', totalMg: '450', count: 3, type: 'vanilla' },
  { id: 7, name: '콜드 브루', totalMg: '300', count: 2, type: 'coldbrew' },
  { id: 8, name: '아이스 티', totalMg: '60', count: 2, type: 'icetea' },
  { id: 9, name: '홍차', totalMg: '50', count: 1, type: 'hongtea' },
  { id: 10, name: '에너지 드링크', totalMg: '100', count: 1, type: 'energy' },
];

export default function DrinkRankingScreen() {
  // navigation 객체 가져오는 부분 삭제

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      {/* 상단 앱바 컴포넌트 (navigation.goBack 대신 console.log 적용) */}
      <NavHeader title="많이 마신 음료 랭킹" onBack={() => console.log('뒤로가기 버튼 클릭됨')} />

      {/* 리스트 스크롤 영역 */}
      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {RANKING_DATA.map((data) => (
          <RankItem key={data.id} item={data} />
        ))}
      </ScrollView>

      {/* 하단 고정 CTA 버튼 (공통 PrimaryButton 재사용) */}
      {/* <View style={styles.bottomCtaWrap}>
        <PrimaryButton 
          title="전체 인기 메뉴 및 트렌드 분석 보기" 
          onPress={() => console.log('트렌드 분석 이동 클릭됨')} 
        />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F6F6F6' },
  scrollArea: { padding: 24, gap: 16 },
  // bottomCtaWrap: {
  //   paddingTop: 12,
  //   paddingHorizontal: 24,
  //   paddingBottom: 28, // iOS 하단 바(Home Indicator) 간격 확보
  //   backgroundColor: '#F6F6F6',
  //   borderTopWidth: 1,
  //   borderTopColor: '#F0F0F0',
  // },
});