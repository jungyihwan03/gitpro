import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../constants';
import { useBottomSheetStore } from '../store/useBottomSheetStore';

// 🌟 네비게이션 및 라우트 정보 임포트
import { useNavigation, useRoute } from '@react-navigation/native';

interface BottomNavBarProps {
  activeTab: '홈' | '지도' | '분석' | '설정';
}

export default function BottomNavBar({ activeTab }: BottomNavBarProps) {
  const { openRecordSheet } = useBottomSheetStore();
  const navigation = useNavigation<any>();
  const route = useRoute<any>(); // 🌟 현재 유저 정보(params)를 가져오기 위함

  return (
    <View style={styles.container} pointerEvents="box-none">
      
      <View style={styles.navBarBg}>
        
        {/* 🏠 홈 탭 */}
        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.6}
          onPress={() => navigation.navigate('Home', { ...route.params })}
        >
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={activeTab === '홈' ? Colors.primary : Colors.text2} />
          </Svg>
          <Text style={[styles.navLabel, activeTab === '홈' && styles.activeLabel]}>홈</Text>
        </TouchableOpacity>

        {/* 🗺️ 지도 탭 (현재는 Alert 유지 혹은 Map 이동) */}
        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.6}
          onPress={() => navigation.navigate('Map', { ...route.params })}
        >
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" fill={activeTab === '지도' ? Colors.primary : Colors.text2} />
          </Svg>
          <Text style={[styles.navLabel, activeTab === '지도' && styles.activeLabel]}>지도</Text>
        </TouchableOpacity>

        <View style={styles.fabSpace} />

        {/* 📊 분석 탭: 🌟 StatisticsScreen으로 연결 */}
        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.6}
          onPress={() => navigation.navigate('Statistics', { ...route.params })} 
        >
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14H7v-2h5v2zm5-4H7v-2h10v2zm0-4H7V7h10v2z" fill={activeTab === '분석' ? Colors.primary : Colors.text2} />
          </Svg>
          <Text style={[styles.navLabel, activeTab === '분석' && styles.activeLabel]}>분석</Text>
        </TouchableOpacity>

        {/* ⚙️ 설정 탭: 🌟 SettingsScreen으로 연결 */}
        <TouchableOpacity 
          style={[styles.navItem]} 
          activeOpacity={0.6}
          onPress={() => navigation.navigate('Settings', { ...route.params })}
        >
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M19.14 12.94c.04-.3.06-.61.06-.94s-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.56-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill={activeTab === '설정' ? Colors.primary : Colors.text2} />
          </Svg>
          <Text style={[styles.navLabel, activeTab === '설정' && styles.activeLabel]}>설정</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.navFabWrap} pointerEvents="box-none">
        <TouchableOpacity style={styles.navFab} activeOpacity={0.8} onPress={openRecordSheet}>
          <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <Path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#FFFFFF" />
          </Svg>
        </TouchableOpacity>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    height: 100, 
    justifyContent: 'flex-end', zIndex: 20,
  },
  navBarBg: {
    width: '100%', height: 80,
    backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: '#E0E0E0',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
  },
  navItem: { width: 64, height: 64, alignItems: 'center', justifyContent: 'center', paddingVertical: 9.5, marginHorizontal: 6.5 },
  navLabel: { fontSize: 12, fontWeight: '400', color: Colors.text2, letterSpacing: -0.22, marginTop: 2 },
  activeLabel: { color: Colors.primary, fontWeight: '700' },
  fabSpace: { width: 72, marginHorizontal: 6.5 }, 
  navFabWrap: {
    position: 'absolute', bottom: 30, 
    left: '50%', marginLeft: -32,
    width: 64, height: 64,
    alignItems: 'center', justifyContent: 'center',
  },
  navFab: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', ...Layout.shadow4 },
});