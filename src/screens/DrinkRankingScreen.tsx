import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '../constants';

import NavHeader from '../components/NavHeader';
import RankItem from '../components/DrinkRankingScreen/RankItem';

const DRINK_TYPE_MAP: Record<string, string> = {
  '라떼': 'latte', '카페라떼': 'latte', '모카': 'latte',
  '에스프레소': 'espresso', '샷': 'espresso',
  '아메리카노': 'americano',
  '카푸치노': 'cappuccino',
  '바닐라': 'vanilla',
  '콜드 브루': 'coldbrew', '나이트로': 'coldbrew',
  '녹차': 'greentea', '말차': 'greentea',
  '아이스티': 'icetea', '복숭아': 'icetea',
  '홍차': 'hongtea', '얼그레이': 'hongtea', '차이': 'hongtea',
  '에너지': 'energy', '몬스터': 'energy', '핫식스': 'energy',
};

function guessDrinkType(name: string): string {
  for (const [keyword, type] of Object.entries(DRINK_TYPE_MAP)) {
    if (name.includes(keyword)) return type;
  }
  return 'americano';
}

export default function DrinkRankingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params || {};
  const userData = params.user || params;
  const userId = userData._id;

  const [loading, setLoading] = useState(true);
  const [rankingData, setRankingData] = useState<any[]>([]);

  useEffect(() => {
    const fetchRanking = async () => {
      if (!userId) { setLoading(false); return; }
      try {
        const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
        const res = await fetch(`${backendUrl}/api/intake/all/${userId}`);
        const data = await res.json();
        const timeline: any[] = data.timeline || [];

        const countMap: Record<string, { count: number; totalCaffeine: number }> = {};
        timeline.forEach((item: any) => {
          const key = item.coffeeName || '기타';
          if (!countMap[key]) countMap[key] = { count: 0, totalCaffeine: 0 };
          countMap[key].count++;
          countMap[key].totalCaffeine += Number(item.caffeine) || 0;
        });

        const sorted = Object.entries(countMap)
          .map(([name, info]) => ({ name, count: info.count, totalCaffeine: info.totalCaffeine }))
          .sort((a, b) => b.count - a.count);

        setRankingData(sorted.map((item, i) => ({
          id: i + 1,
          name: item.name,
          totalMg: item.totalCaffeine.toLocaleString(),
          count: item.count,
          type: guessDrinkType(item.name),
        })));
      } catch (e) {
        console.error('랭킹 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchRanking();
  }, [userId]);

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <NavHeader title="많이 마신 음료 랭킹" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 60 }} />
        ) : (
          rankingData.map((data) => (
            <RankItem key={data.id} item={data} />
          ))
        )}
      </ScrollView>
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