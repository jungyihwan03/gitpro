import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, Layout } from '../constants';
import NavHeader from '../components/NavHeader';

export default function RecordCompleteScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const params = route.params || {};
  const coffeeName = params.coffeeName || '메뉴';
  const calories = params.calories ?? 0;
  const user = params.user || {};
  const isDelete = params.isDelete || false;

  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <NavHeader title={isDelete ? "삭제 완료" : "기록 완료"} onBack={() => navigation.navigate('MainTabs', { screen: 'Home', params: { user } })} />
      <View style={styles.mainContent}>
        <Animated.View style={[styles.iconWrap, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
          <View style={styles.iconBgPulse} />
          <Svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            {isDelete ? (
              <Path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill={Colors.error} />
            ) : (
              <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill={Colors.primary} />
            )}
          </Svg>
        </Animated.View>

        <View style={styles.textWrap}>
          <Text style={styles.title}>{isDelete ? "섭취 기록이 삭제되었습니다." : "선택한 메뉴가 기록되었습니다."}</Text>
        </View>

        {!isDelete && (
        <View style={styles.bentoCard}>
          <View style={styles.cardIconWrap}>
            <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <Path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" fill={Colors.primary} />
            </Svg>
          </View>
          <View style={styles.cardTextWrap}>
            <Text style={styles.cardLabel}>방금 기록한 메뉴</Text>
            <Text style={styles.cardMenuName}>{coffeeName}</Text>
          </View>
          <View style={styles.calorieBadge}>
            <Text style={styles.calorieBadgeText}>{calories} kcal</Text>
          </View>
        </View>
        )}

        {isDelete && (
        <View style={styles.bentoCard}>
          <View style={styles.cardIconWrap}>
            <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <Path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill={Colors.error} />
            </Svg>
          </View>
          <View style={styles.cardTextWrap}>
            <Text style={styles.cardLabel}>삭제된 메뉴</Text>
            <Text style={styles.cardMenuName}>{coffeeName}</Text>
          </View>
        </View>
        )}

        <View style={styles.actionWrap}>
          <TouchableOpacity activeOpacity={0.8} style={styles.btnPrimary} onPress={() => navigation.navigate('MainTabs', { screen: 'Home', params: { user } })}>
            <Text style={styles.btnPrimaryText}>홈 화면으로 돌아가기</Text>
          </TouchableOpacity>
          {!isDelete && (
          <TouchableOpacity activeOpacity={0.7} style={styles.btnSecondary} onPress={() => navigation.goBack()}>
            <Text style={styles.btnSecondaryText}>기록 계속하기</Text>
          </TouchableOpacity>
          )}
        </View>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  mainContent: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, paddingBottom: 40 },
  iconWrap: { width: 160, height: 160, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.surface, borderRadius: 80, marginBottom: 32, ...Layout.shadow1 },
  iconBgPulse: { position: 'absolute', width: '100%', height: '100%', borderRadius: 80, backgroundColor: Colors.primary, opacity: 0.05 },
  textWrap: { alignItems: 'center', marginBottom: 32, gap: 8 },
  title: { fontSize: 20, fontWeight: '700', color: Colors.text1, textAlign: 'center' },
  bentoCard: { width: '100%', flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Layout.radiusMd, padding: 16, marginBottom: 40, ...Layout.shadow1 },
  cardIconWrap: { width: 48, height: 48, borderRadius: Layout.radiusSm, backgroundColor: 'rgba(139,46,58,0.06)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  cardTextWrap: { flex: 1 },
  cardLabel: { fontSize: 12, fontWeight: '500', color: Colors.text2, marginBottom: 2 },
  cardMenuName: { fontSize: 16, fontWeight: '700', color: Colors.text1 },
  calorieBadge: { backgroundColor: 'rgba(139,46,58,0.1)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Layout.radiusFull },
  calorieBadgeText: { fontSize: 12, fontWeight: '700', color: Colors.primary },
  actionWrap: { width: '100%', gap: 12 },
  btnPrimary: { width: '100%', height: 56, backgroundColor: Colors.primary, borderRadius: Layout.radiusFull, alignItems: 'center', justifyContent: 'center', shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  btnPrimaryText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  btnSecondary: { width: '100%', height: 56, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, borderRadius: Layout.radiusFull, alignItems: 'center', justifyContent: 'center' },
  btnSecondaryText: { fontSize: 16, fontWeight: '600', color: Colors.text2 },
});
