import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Alert, PanResponder, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, Layout } from '../constants';
import { CustomInput } from '../components/CustomInput'; 
import { PrimaryButton } from '../components/PrimaryButton';

export const BasicInfo = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const providerId = route.params?.providerId; 
  const incomingUserId = route.params?.userId; 
  const userName = route.params?.name; 

  const [gender, setGender] = useState<string | null>(null);
  const [height, setHeight] = useState('165');
  const [weight, setWeight] = useState('56');
  const [age, setAge] = useState('24');
  const [isSaving, setIsSaving] = useState(false);

  // 자(Ruler) 인터랙션 관련 Refs
  const TICK_WIDTH = 10; 
  const currentHeightRef = useRef(165);
  const startHeightRef = useRef(165);

  const heightPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { 
        startHeightRef.current = currentHeightRef.current; 
      },
      onPanResponderMove: (evt, gestureState) => {
        let newHeight = Math.round(startHeightRef.current - (gestureState.dx / TICK_WIDTH));
        if (newHeight < 130) newHeight = 130;
        if (newHeight > 210) newHeight = 210;
        setHeight(String(newHeight));
        currentHeightRef.current = newHeight;
      }
    })
  ).current;

  // 몸무게 슬라이더 관련 Refs
  const sliderWidthRef = useRef(300); 
  const currentWeightRef = useRef(56);
  const startWeightRef = useRef(56);

  const weightPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => { 
        startWeightRef.current = currentWeightRef.current; 
      },
      onPanResponderMove: (evt, gestureState) => {
        const kgPerPixel = 90 / sliderWidthRef.current;
        let newWeight = Math.round(startWeightRef.current + (gestureState.dx * kgPerPixel));
        if (newWeight < 30) newWeight = 30;
        if (newWeight > 120) newWeight = 120;
        setWeight(String(newWeight));
        currentWeightRef.current = newWeight;
      }
    })
  ).current;

  let wPercent = ((currentWeightRef.current - 30) / 90) * 100;
  if (wPercent < 0) wPercent = 0;
  if (wPercent > 100) wPercent = 100;

  // 저장 및 다음 화면 이동 (Reset 사용)
  const handleSaveAndNext = async () => {
    if (!gender || !height || !weight || !age) {
      Alert.alert('알림', '모든 정보를 입력해 주세요.');
      return;
    }
    if (isSaving) return;
    setIsSaving(true);

    try {
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
      const response = await fetch(`${backendUrl}/api/users/basic-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId: providerId, 
          userId: incomingUserId, 
          gender: gender,
          height: Number(height), 
          weight: Number(weight),
          age: Number(age)
        }),
      });

      if (response.ok) {
        // 정보 저장 성공 시 메인 화면으로 리셋 (뒤로가기로 다시 여기 못 옴)
        navigation.reset({
          index: 0,
          routes: [{ 
            name: 'MainTabs', 
            params: { 
              user: { 
                name: userName, 
                userId: incomingUserId || providerId 
              } 
            } 
          }],
        });
      } else {
        const errorData = await response.json();
        Alert.alert('저장 실패', errorData.error || '서버 오류가 발생했습니다.');
      }
    } catch (error) {
      Alert.alert('오류', '네트워크 연결을 확인해 주세요.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} bounces={false}>
        <View style={styles.headerBlock}>
          <Text style={styles.title}>기본 정보를 알려주세요</Text>
          <Text style={styles.subtitle}>정확한 카페인 섭취 가이드를 위해 정보를 입력해 주세요.</Text>
        </View>

        <View style={styles.formSection}>
          {/* 성별 선택 */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>성별</Text>
            <View style={styles.rowWrap}>
              <TouchableOpacity 
                style={[styles.genderBtn, gender === 'M' && styles.genderBtnActive]} 
                activeOpacity={0.7} 
                onPress={() => setGender('M')}
              >
                <Text style={[styles.genderText, gender === 'M' && styles.genderTextActive]}>남성</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.genderBtn, gender === 'F' && styles.genderBtnActive]} 
                activeOpacity={0.7} 
                onPress={() => setGender('F')}
              >
                <Text style={[styles.genderText, gender === 'F' && styles.genderTextActive]}>여성</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 키 입력 */}
          <View style={styles.fieldWrap}>
            <CustomInput 
              label="키" 
              value={height} 
              onChangeText={setHeight} 
              keyboardType="numeric" 
              maxLength={3} 
              innerRightText="cm" 
              innerRightTextColor={Colors.text2} 
            />
            <View style={styles.visualBox}>
              <View style={styles.rulerWrapper} {...heightPanResponder.panHandlers}>
                <Animated.View style={[styles.rulerTape, { transform: [{ translateX: (170 - currentHeightRef.current) * TICK_WIDTH }] }]}>
                  {Array.from({ length: 81 }).map((_, i) => (
                    <View key={i} style={i % 5 === 0 ? styles.rulerTickLong : styles.rulerTickShort} />
                  ))}
                </Animated.View>
                <View style={styles.rulerPointer} />
              </View>
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabelText}>130cm</Text>
                <Text style={styles.sliderLabelText}>210cm</Text>
              </View>
            </View>
          </View>

          {/* 몸무게 입력 */}
          <View style={styles.fieldWrap}>
            <CustomInput 
              label="몸무게" 
              value={weight} 
              onChangeText={setWeight} 
              keyboardType="numeric" 
              maxLength={3} 
              innerRightText="kg" 
              innerRightTextColor={Colors.text2} 
            />
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
              <View style={styles.sliderLabels}>
                <Text style={styles.sliderLabelText}>30kg</Text>
                <Text style={styles.sliderLabelText}>120kg</Text>
              </View>
            </View>
          </View>

          {/* 나이 입력 */}
          <View style={styles.rowWrap}>
            <View style={{ flex: 1 }}>
              <CustomInput 
                label="나이" 
                value={age} 
                onChangeText={setAge} 
                keyboardType="numeric" 
                maxLength={3} 
                innerRightText="세" 
                innerRightTextColor={Colors.text2} 
              />
            </View>
            <View style={styles.infoBox}>
              <Svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginTop: 2 }}>
                <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill={Colors.primary} />
              </Svg>
              <Text style={styles.infoText}>연령별 권장 섭취량이 달라집니다.</Text>
            </View>
          </View>
        </View>

        <PrimaryButton 
          title={isSaving ? "저장 중..." : "다음"} 
          onPress={handleSaveAndNext} 
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 40, paddingBottom: 56 },
  headerBlock: { marginBottom: 40, gap: 8 },
  title: { fontSize: 26, fontWeight: '700', color: Colors.primary, lineHeight: 34 },
  subtitle: { fontSize: 14, fontWeight: '400', color: Colors.text2, lineHeight: 22 },
  formSection: { gap: 32, marginBottom: 48 },
  fieldWrap: { gap: 8 },
  fieldLabel: { fontSize: 14, fontWeight: '500', color: Colors.text1, paddingLeft: 2, marginBottom: -2 },
  rowWrap: { flexDirection: 'row', gap: 12, alignItems: 'flex-end' },
  genderBtn: { flex: 1, height: 52, backgroundColor: Colors.surface, borderRadius: 12, borderWidth: 1.5, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  genderBtnActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  genderText: { fontSize: 15, fontWeight: '600', color: Colors.text2 },
  genderTextActive: { color: '#FFFFFF' },
  visualBox: { backgroundColor: Colors.surface, borderRadius: 12, padding: 16, borderWidth: 1, borderColor: Colors.border, marginTop: 4 },
  rulerWrapper: { height: 40, overflow: 'hidden', justifyContent: 'center', alignItems: 'center', backgroundColor: '#F8F9FA', borderRadius: 8, borderWidth: 1, borderColor: '#EEEEEE' },
  rulerTape: { flexDirection: 'row', alignItems: 'flex-end', height: 24 },
  rulerTickShort: { width: 2, height: 12, backgroundColor: '#D1D5DB', marginHorizontal: 4 }, 
  rulerTickLong: { width: 2, height: 24, backgroundColor: '#9CA3AF', marginHorizontal: 4 },
  rulerPointer: { position: 'absolute', width: 4, height: 36, backgroundColor: Colors.primary, borderRadius: 2 },
  sliderWrapper: { height: 40, justifyContent: 'center', paddingVertical: 10 },
  sliderTrackBg: { height: 6, backgroundColor: Colors.border, borderRadius: 3, position: 'relative', justifyContent: 'center' },
  sliderTrackActive: { height: '100%', backgroundColor: Colors.primary, borderRadius: 3, position: 'absolute', left: 0 },
  sliderThumb: { position: 'absolute', width: 24, height: 24, borderRadius: 12, backgroundColor: Colors.primary, borderWidth: 3, borderColor: '#FFFFFF', transform: [{ translateX: -12 }], shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 4 },
  sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  sliderLabelText: { fontSize: 12, color: Colors.text3, fontWeight: '500' },
  infoBox: { flex: 1.2, height: 52, backgroundColor: '#F8EAEB', borderRadius: 12, paddingHorizontal: 12, flexDirection: 'row', gap: 6, alignItems: 'center' },
  infoText: { flex: 1, fontSize: 11, color: Colors.text1, lineHeight: 16 },
});