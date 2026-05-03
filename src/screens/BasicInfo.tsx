// src/screens/BasicInfo.tsx
import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Alert, 
  PanResponder, 
  Animated 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Colors } from '../constants';
import { CustomInput } from '../components/CustomInput'; 
import { PrimaryButton } from '../components/PrimaryButton';

export const BasicInfo = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  // 🌟 Login 스크린에서 넘어온 _id를 최우선으로 받습니다.
  const { _id, name, providerId, userId: legacyUserId } = route.params || {};

  const [gender, setGender] = useState<string | null>(null);
  const [height, setHeight] = useState('165');
  const [weight, setWeight] = useState('56');
  const [age, setAge] = useState('24');
  const [isSaving, setIsSaving] = useState(false);

  // ── [키(Height) Ruler 인터랙션 로직] ──
  const TICK_WIDTH = 10; 
  const currentHeightRef = useRef(165);
  const startHeightRef = useRef(165);

  const heightPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { 
        startHeightRef.current = currentHeightRef.current; 
      },
      onPanResponderMove: (_, gestureState) => {
        let newHeight = Math.round(startHeightRef.current - (gestureState.dx / TICK_WIDTH));
        if (newHeight < 130) newHeight = 130;
        if (newHeight > 210) newHeight = 210;
        setHeight(String(newHeight));
        currentHeightRef.current = newHeight;
      }
    })
  ).current;

  // ── [몸무게(Weight) 슬라이더 인터랙션 로직] ──
  const sliderWidthRef = useRef(300); 
  const currentWeightRef = useRef(56);
  const startWeightRef = useRef(56);

  const weightPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { 
        startWeightRef.current = currentWeightRef.current; 
      },
      onPanResponderMove: (_, gestureState) => {
        const kgPerPixel = 90 / sliderWidthRef.current;
        let newWeight = Math.round(startWeightRef.current + (gestureState.dx * kgPerPixel));
        if (newWeight < 30) newWeight = 30;
        if (newWeight > 120) newWeight = 120;
        setWeight(String(newWeight));
        currentWeightRef.current = newWeight;
      }
    })
  ).current;

  let wPercent = ((Number(weight) - 30) / 90) * 100;
  wPercent = Math.min(Math.max(wPercent, 0), 100);

  // ── [데이터 저장 핸들러] ──
  const handleSaveAndNext = async () => {
    // 🌟 _id가 없으면 중복 생성이 발생할 수 있으므로 체크합니다.
    if (!_id) {
      Alert.alert('오류', '유저 인증 정보가 누락되었습니다. 다시 로그인해 주세요.');
      return;
    }

    if (!gender || !height || !weight || !age) {
      Alert.alert('알림', '모든 정보를 입력해 주세요.');
      return;
    }

    if (isSaving) return;
    setIsSaving(true);

    try {
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
      
      // 🌟 [핵심] providerId나 userId 대신, MongoDB 고유 식별자인 _id를 보냅니다.
      const payload = {
        _id: _id, 
        gender: gender,
        height: Number(height),
        weight: Number(weight),
        age: Number(age)
      };

      const response = await fetch(`${backendUrl}/api/users/basic-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        // 성공 시 메인 화면으로 이동하며 서버가 반환한 최신 유저 정보를 넘깁니다.
        navigation.reset({
          index: 0,
          routes: [{ 
            name: 'MainTabs', 
            params: { user: data.user } 
          }],
        });
      } else {
        Alert.alert('저장 실패', data.error || '정보를 저장할 수 없습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '네트워크 연결을 확인해 주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>{name || '회원'}님, 정보를 입력해주세요</Text>
          <Text style={styles.subtitle}>정확한 카페인 분석을 위해 기초 정보가 필요합니다.</Text>
        </View>

        <View style={styles.formSection}>
          {/* 성별 선택 */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>성별</Text>
            <View style={styles.rowWrap}>
              <TouchableOpacity 
                style={[styles.genderBtn, gender === 'M' && styles.genderBtnActive]} 
                onPress={() => setGender('M')}
              >
                <Text style={[styles.genderText, gender === 'M' && styles.genderTextActive]}>남성</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.genderBtn, gender === 'F' && styles.genderBtnActive]} 
                onPress={() => setGender('F')}
              >
                <Text style={[styles.genderText, gender === 'F' && styles.genderTextActive]}>여성</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 키 조절 (Ruler) */}
          <View style={styles.fieldWrap}>
            <CustomInput label="키" value={height} onChangeText={setHeight} keyboardType="numeric" innerRightText="cm" />
            <View style={styles.visualBox}>
              <View style={styles.rulerWrapper} {...heightPanResponder.panHandlers}>
                <Animated.View style={[styles.rulerTape, { transform: [{ translateX: (170 - Number(height)) * TICK_WIDTH }] }]}>
                  {Array.from({ length: 81 }).map((_, i) => (
                    <View key={i} style={i % 5 === 0 ? styles.rulerTickLong : styles.rulerTickShort} />
                  ))}
                </Animated.View>
                <View style={styles.rulerPointer} />
              </View>
            </View>
          </View>

          {/* 몸무게 조절 (Slider) */}
          <View style={styles.fieldWrap}>
            <CustomInput label="몸무게" value={weight} onChangeText={setWeight} keyboardType="numeric" innerRightText="kg" />
            <View style={styles.visualBox}>
              <View 
                style={styles.sliderWrapper} 
                onLayout={(e) => { sliderWidthRef.current = e.nativeEvent.layout.width; }} 
                {...weightPanResponder.panHandlers}
              >
                <View style={styles.sliderTrackBg}>
                  <View style={[styles.sliderTrackActive, { width: `${wPercent}%` }]} />
                  <View style={[styles.sliderThumb, { left: `${wPercent}%` }]} />
                </View>
              </View>
            </View>
          </View>

          {/* 나이 입력 */}
          <View style={{ flex: 1 }}>
            <CustomInput label="나이" value={age} onChangeText={setAge} keyboardType="numeric" innerRightText="세" />
          </View>
        </View>

        <PrimaryButton title={isSaving ? "저장 중..." : "설정 완료"} onPress={handleSaveAndNext} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 56 },
  headerBlock: { marginBottom: 40, gap: 8 },
  title: { fontSize: 24, fontWeight: '700', color: '#333' },
  subtitle: { fontSize: 14, color: '#666' },
  formSection: { gap: 32, marginBottom: 48 },
  fieldWrap: { gap: 10 },
  fieldLabel: { fontSize: 14, fontWeight: '500', color: '#333' },
  rowWrap: { flexDirection: 'row', gap: 12 },
  genderBtn: { flex: 1, height: 52, borderRadius: 12, borderWidth: 1, borderColor: '#EEE', alignItems: 'center', justifyContent: 'center' },
  genderBtnActive: { backgroundColor: '#8B2E3A', borderColor: '#8B2E3A' },
  genderText: { fontSize: 15, color: '#666' },
  genderTextActive: { color: '#FFF', fontWeight: 'bold' },
  visualBox: { backgroundColor: '#F8F9FA', borderRadius: 12, padding: 16 },
  rulerWrapper: { height: 40, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  rulerTape: { flexDirection: 'row', alignItems: 'flex-end', height: 24 },
  rulerTickShort: { width: 2, height: 12, backgroundColor: '#D1D5DB', marginHorizontal: 4 },
  rulerTickLong: { width: 2, height: 24, backgroundColor: '#9CA3AF', marginHorizontal: 4 },
  rulerPointer: { position: 'absolute', width: 4, height: 36, backgroundColor: '#8B2E3A', borderRadius: 2 },
  sliderWrapper: { height: 40, justifyContent: 'center' },
  sliderTrackBg: { height: 6, backgroundColor: '#EEE', borderRadius: 3, position: 'relative' },
  sliderTrackActive: { height: '100%', backgroundColor: '#8B2E3A', borderRadius: 3, position: 'absolute' },
  sliderThumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#8B2E3A', position: 'absolute', marginLeft: -12, borderWidth: 3, borderColor: '#FFF' },
});