import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Colors, Layout } from '../constants';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

import NavHeader from '../components/NavHeader';
import CafeTabBar from '../components/CafeTabBar';
import { ReviewTabContent } from '../components/ReviewTabContent';
import { MyRecordTabContent } from '../components/MyRecordTabContent';

export default function SimpleCafeDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { cafe, user } = route.params || {};
  const cafeName = cafe?.name || '';
  const cafeAddress = cafe?.address || '';
  const isCustom = cafe?.isCustom === true;
  const cafeId = cafe?._id || cafe?.placeId || cafeName;

  // ReviewTabContent / MyRecordTabContent는 cafe.place_id를 사용하므로 가상 객체 생성
  const cafeObj = { place_id: cafeId, name: cafeName, vicinity: cafeAddress };

  const [activeTab, setActiveTab] = useState('메뉴');

  useEffect(() => {
    if (isCustom) setActiveTab('나의 기록');
  }, []);

  return (
    <View style={styles.container}>
      <NavHeader title={cafeName} onBack={() => navigation.goBack()} />

      {/* 간략한 카페 정보 */}
      <View style={styles.cafeInfoBar}>
        <Text style={styles.cafeName}>{cafeName}</Text>
        {cafeAddress ? <Text style={styles.cafeAddress}>{cafeAddress}</Text> : null}
      </View>

      <CafeTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {activeTab === '메뉴' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>메뉴</Text>
            <Text style={styles.placeholderText}>메뉴 정보가 없습니다.{'\n'}검색 또는 메뉴판 촬영으로 메뉴를 추가해보세요.</Text>
          </View>
        )}

        {activeTab === '리뷰' && (
          <ReviewTabContent cafe={cafeObj} user={user} />
        )}

        {activeTab === '나의 기록' && (
          <MyRecordTabContent cafe={cafeObj} user={user} />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  cafeInfoBar: { backgroundColor: Colors.surface, paddingHorizontal: 24, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  cafeName: { fontSize: 20, fontWeight: '700', color: Colors.text1 },
  cafeAddress: { fontSize: 13, color: Colors.text2, marginTop: 4 },
  scrollArea: { padding: 24, paddingBottom: 40 },
  section: { gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text1 },
  placeholderText: { fontSize: 14, color: Colors.text3, textAlign: 'center', paddingVertical: 40, lineHeight: 22 },
});
