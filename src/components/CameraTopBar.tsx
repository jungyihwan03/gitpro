import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Layout } from '../constants';

interface CafeTabBarProps {
  activeTab: string;
  onTabChange: (tabName: string) => void; // 🌟 탭 변경 함수 추가
}

export default function CafeTabBar({ activeTab, onTabChange }: CafeTabBarProps) {
  const tabs = ['홈', '메뉴', '리뷰', '나의 기록'];

  return (
    <View style={styles.card}>
      <View style={styles.tabBar}>
        {tabs.map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={styles.tab} 
            activeOpacity={0.6}
            onPress={() => onTabChange(tab)} // 🌟 클릭 시 부모에게 알림
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, borderRadius: Layout.radiusLg, ...Layout.shadow1, overflow: 'hidden' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: Colors.border },
  tab: { flex: 1, height: 48, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  tabText: { fontSize: 14, fontWeight: '500', color: Colors.text2 },
  tabTextActive: { color: Colors.primary },
  tabIndicator: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 2, backgroundColor: Colors.primary, borderTopLeftRadius: 2, borderTopRightRadius: 2 },
});