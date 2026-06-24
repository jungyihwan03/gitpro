import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRoute, useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../constants';
import NavHeader from '../components/NavHeader';

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
const cleanUrl = backendUrl?.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

export default function FavoriteListScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const params = route.params || {};
  const targetType = params.targetType || 'menu';
  const user = params.user || {};
  const userId = user._id;
  const title = targetType === 'menu' ? '즐겨찾기 한 메뉴' : '즐겨찾기에 추가한 카페';

  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavs = async () => {
      if (!userId) { setLoading(false); return; }
      try {
        const res = await fetch(`${cleanUrl}/api/favorite/list/${userId}/${targetType}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setList(data || []);
      } catch (e) {
        console.error('즐겨찾기 로딩 실패:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchFavs();
  }, [userId, targetType]);

  const handleToggle = async (item: any) => {
    try {
      const res = await fetch(`${cleanUrl}/api/favorite/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, targetType, targetId: item.targetId }),
      });
      if (res.ok) {
        setList(prev => prev.filter(f => f._id !== item._id));
      }
    } catch (e) {
      console.error('즐겨찾기 제거 실패:', e);
    }
  };

  const renderMenu = ({ item }: any) => {
    const menuItem = { _id: item.targetId, coffeeName: item.name, brand: item.brand, emoji: item.emoji, calories: item.calories, caffeine: item.caffeine };
    return (
    <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => navigation.navigate('MenuDetail', { item: menuItem, user })}>
      <View style={styles.rowLeft}>
        <Text style={styles.emoji}>{item.emoji || '☕'}</Text>
        <View style={styles.rowInfo}>
          <Text style={styles.rowName}>{item.name}</Text>
          <Text style={styles.rowSub}>{item.brand} · {item.calories}kcal</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleToggle(item)} style={styles.heartBtn}>
        <Svg width="22" height="22" viewBox="0 0 24 24">
          <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z" fill={Colors.error} />
        </Svg>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  };

  const renderCafe = ({ item }: any) => (
    <TouchableOpacity style={styles.row} activeOpacity={0.7} onPress={() => navigation.navigate('CafeDetail', { cafe: { place_id: item.targetId, name: item.name, vicinity: item.vicinity }, distance: '' })}>
      <View style={styles.rowLeft}>
        <View style={styles.cafeIconWrap}>
          <Svg width="22" height="22" viewBox="0 0 24 24">
            <Path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3z" fill={Colors.primary} />
          </Svg>
        </View>
        <View style={styles.rowInfo}>
          <Text style={styles.rowName}>{item.name}</Text>
          {item.vicinity ? <Text style={styles.rowSub}>{item.vicinity}</Text> : null}
        </View>
      </View>
      <TouchableOpacity onPress={() => handleToggle(item)} style={styles.heartBtn}>
        <Svg width="22" height="22" viewBox="0 0 24 24">
          <Path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.27 2 8.5 2 5.41 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.08C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.41 22 8.5c0 3.77-3.4 6.86-8.55 11.53L12 21.35z" fill={Colors.error} />
        </Svg>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <NavHeader title={title} onBack={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
      ) : list.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>즐겨찾기가 없습니다.</Text>
        </View>
      ) : (
        <FlatList
          data={list}
          keyExtractor={item => item._id}
          renderItem={targetType === 'menu' ? renderMenu : renderCafe}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  listContent: { padding: 24, gap: 0 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.surface, borderRadius: Layout.radiusMd, padding: 16, marginBottom: 12, ...Layout.shadow1 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  emoji: { fontSize: 28 },
  cafeIconWrap: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(139,46,58,0.08)', alignItems: 'center', justifyContent: 'center' },
  rowInfo: { flex: 1 },
  rowName: { fontSize: 16, fontWeight: '700', color: Colors.text1 },
  rowSub: { fontSize: 12, color: Colors.text2, marginTop: 2 },
  heartBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 14, color: Colors.text3 },
});
