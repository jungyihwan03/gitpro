import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// 👇 1. 깐깐한 함수 대신 둥글둥글한 SafeAreaView를 불러옵니다!
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../constants';

// 컴포넌트 임포트
import SearchBar from '../components/SearchBar';
import BottomNavBar from '../components/BottomNavBar';
import MapMarker from '../components/MapMarker';
import MapFilterChip from '../components/MapFilterChip';
import CafeBottomSheet from '../components/CafeBottomSheet';

export default function Map() {
  const [activeFilter, setActiveFilter] = useState('즐겨찾기');

  // 필터별 기본 아이콘 정의
  const iconFav = <Svg width="14" height="14" viewBox="0 0 24 24"><Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z" fill={Colors.text2} /></Svg>;
  const iconStore = <Svg width="14" height="14" viewBox="0 0 24 24"><Path d="M20 4H4v2l8 5 8-5V4zM4 20h16V9l-8 5-8-5v11z" fill={Colors.text2}/></Svg>;
  const iconClock = <Svg width="14" height="14" viewBox="0 0 24 24"><Path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill={Colors.text2}/></Svg>;
  const iconStar = <Svg width="14" height="14" viewBox="0 0 24 24"><Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={Colors.text2}/></Svg>;

  return (
    <View style={[styles.container, { flex: 1 }]}>
      <StatusBar style="dark" />

      {/* 1. 지도 영역 (더미 UI) - 화면 전체를 덮습니다 */}
      <View style={styles.mapArea}>
        <View style={styles.mapBg}>
          <View style={[styles.mapBlock, { left: 20, top: 60, width: 155, height: 80 }]} />
          <View style={[styles.mapBlock, { left: 20, top: 180, width: 95, height: 120 }]} />
          <View style={[styles.mapBlock, { left: 210, top: 60, width: 130, height: 170 }]} />
          <View style={[styles.mapBlock, { left: 130, top: 260, width: 100, height: 70 }]} />
        </View>

        {/* 마커들 */}
        <MapMarker left="20%" top="38%" />
        <MapMarker left="72%" top="22%" />
        <MapMarker left="45%" top="48%" isActive label="미드나잇 에스프레소" />
      </View>

      {/* 👇 2. 상단 Float 레이어 - View 대신 SafeAreaView를 쓰고 edges=['top']을 줍니다! */}
      <SafeAreaView edges={['top']} style={styles.floatTop}>
        <View style={styles.searchWrap}>
          <SearchBar placeholder="카페 검색..." />
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsWrap}>
          <MapFilterChip label="즐겨찾기" IconDefault={iconFav} isActive={activeFilter === '즐겨찾기'} onPress={() => setActiveFilter('즐겨찾기')} />
          <MapFilterChip label="프랜차이즈" IconDefault={iconStore} isActive={activeFilter === '프랜차이즈'} onPress={() => setActiveFilter('프랜차이즈')} />
          <MapFilterChip label="영업 중" IconDefault={iconClock} isActive={activeFilter === '영업 중'} onPress={() => setActiveFilter('영업 중')} />
          <MapFilterChip label="4.0+" IconDefault={iconStar} isActive={activeFilter === '4.0+'} onPress={() => setActiveFilter('4.0+')} />
        </ScrollView>
      </SafeAreaView>

      {/* 3. 우측 지도 컨트롤 버튼 */}
      <View style={styles.mapControls}>
        <View style={styles.ctrlGroup}>
          <TouchableOpacity style={styles.ctrlBtn} activeOpacity={0.7}><Svg width="20" height="20" viewBox="0 0 24 24"><Path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#111"/></Svg></TouchableOpacity>
          <View style={styles.ctrlDivider} />
          <TouchableOpacity style={styles.ctrlBtn} activeOpacity={0.7}><Svg width="20" height="20" viewBox="0 0 24 24"><Path d="M19 13H5v-2h14v2z" fill="#111"/></Svg></TouchableOpacity>
        </View>
        <View style={styles.ctrlGroup}>
          <TouchableOpacity style={styles.ctrlBtn} activeOpacity={0.7}>
            <Svg width="20" height="20" viewBox="0 0 24 24"><Path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0013 3.06V1h-2v2.06A8.994 8.994 0 003.06 11H1v2h2.06A8.994 8.994 0 0011 20.94V23h2v-2.06A8.994 8.994 0 0020.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" fill={Colors.primary}/></Svg>
          </TouchableOpacity>
        </View>
      </View>

      {/* 4. 바텀 시트 */}
      <CafeBottomSheet />

      {/* 5. 바텀 네비게이션 (지도 탭 활성화) */}
      <BottomNavBar activeTab="지도" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#e8eaed' },
  mapArea: { ...StyleSheet.absoluteFillObject, zIndex: 0 },
  mapBg: { flex: 1, backgroundColor: '#e8eaed' },
  mapBlock: { position: 'absolute', backgroundColor: '#f0f0f0', borderRadius: 4 },
  floatTop: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingTop: 8 }, // 👈 SafeAreaView 여백 외에 약간의 추가 패딩을 주면 더 예쁩니다.
  searchWrap: { paddingHorizontal: 16, paddingBottom: 8 },
  chipsWrap: { paddingHorizontal: 16, gap: 8 },
  mapControls: { position: 'absolute', right: 16, bottom: 390, gap: 8, zIndex: 10 },
  ctrlGroup: { backgroundColor: Colors.surface, borderRadius: Layout.radiusMd, overflow: 'hidden', ...Layout.shadow2 },
  ctrlBtn: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  ctrlDivider: { height: 1, backgroundColor: Colors.border, marginHorizontal: 8 },
});