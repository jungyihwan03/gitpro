import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Keyboard } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';

// 공통 토큰 및 컴포넌트 로드
import { Colors, Layout } from '../constants';
import NavHeader from '../components/NavHeader';

// 🌟 새로 컴포넌트화 시킨 파일들 로드
import { AvatarSection } from '../components/ProfileDetailScreen/AvatarSection';
import { AccountInfoCard } from '../components/ProfileDetailScreen/AccountInfoCard';
import { BodyInfoCard } from '../components/ProfileDetailScreen/BodyInfoCard';

export const ProfileDetailScreen = () => {
    // 🌟 계정 정보용 상태 변수들 추가
  const [nickname, setNickname] = useState('김카페');

  // 데이터 비즈니스 상태 관리
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('68');
  const [age, setAge] = useState('28');

  // 🌟 우측 [변경] 버튼 클릭 시 수행할 비즈니스 로직
  const handleSaveNickname = () => {
    Keyboard.dismiss(); // 자판 내리기
    console.log('변경된 닉네임 반영 저장:', nickname);
  };
  
  const handleSave = () => {
    // 권장량 재계산 로직 처리 구간
    console.log('저장 데이터:', { gender, height, weight, age });
  };

  return (
    <View style={styles.safeArea}>
        <StatusBar style="dark" />
        {/* 뒤로가기 네비게이션 헤더 */}
        <NavHeader title="프로필 상세" onBack={() => console.log('뒤로가기 클릭')} />

        <ScrollView 
        style={styles.scrollArea} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        >
        {/* ① 프로필 아바타 섹션 컴포넌트 */}
        <AvatarSection 
            name="김카페" 
            email="kimcafe@example.com" 
            onEditPress={() => console.log('아바타 수정 클릭')}
        />

        {/* ② 계정 정보 카드 컴포넌트 */}
        <AccountInfoCard 
          nickname={nickname} 
          onChangeNickname={setNickname}
          onSaveNicknamePress={handleSaveNickname}
          email="kimcafe@example.com" 
        />

        {/* ③ 신체 정보 카드 컴포넌트 (상태 값들과 핸들러 매핑) */}
        <BodyInfoCard 
            gender={gender}
            onGenderChange={setGender}
            height={height}
            onHeightChange={setHeight}
            weight={weight}
            onWeightChange={setWeight}
            age={age}
            onAgeChange={setAge}
            onSavePress={handleSave}
        />

        {/* ④ 비밀번호 변경 버튼 */}
        <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.pwBtn}
            onPress={() => console.log('비밀번호 변경 이동')}
        >
            <Svg width="20" height="20" viewBox="0 0 24 24">
            <Path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill={Colors.text2} />
            </Svg>
            <Text style={styles.pwBtnText}>비밀번호 변경하기</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
    gap: 24,
  },
  pwBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 56,
    borderRadius: Layout.radiusLg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    marginHorizontal: 24,
    ...Layout.shadow1,
  },
  pwBtnText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text2,
  },
});