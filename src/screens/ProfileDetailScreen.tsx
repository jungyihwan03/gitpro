import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Keyboard, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { useNavigation, useRoute } from '@react-navigation/native';

import { Colors, Layout } from '../constants';
import NavHeader from '../components/NavHeader';
import { useUserStore } from '../store/useUserStore';

// 🌟 새로 컴포넌트화 시킨 파일들 로드
import { AvatarSection } from '../components/ProfileDetailScreen/AvatarSection';
import { AccountInfoCard } from '../components/ProfileDetailScreen/AccountInfoCard';
import { BodyInfoCard } from '../components/ProfileDetailScreen/BodyInfoCard';

export const ProfileDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const storeUser = useUserStore((s) => s.user);
  const user = storeUser || route.params?.user || {};

  const [nickname, setNickname] = useState(user.name || '사용자');

  const [gender, setGender] = useState<'male' | 'female'>((user.gender || 'female') === 'M' ? 'male' : 'female');
  const [height, setHeight] = useState(String(user.height || ''));
  const [weight, setWeight] = useState(String(user.weight || ''));
  const [age, setAge] = useState(String(user.age || ''));

  const setUser = useUserStore((s) => s.setUser);

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;

  const updateFromServer = (serverUser: any) => {
    setNickname(serverUser.name || nickname);
    setGender((serverUser.gender || 'F') === 'M' ? 'male' : 'female');
    setHeight(String(serverUser.height ?? height));
    setWeight(String(serverUser.weight ?? weight));
    setAge(String(serverUser.age ?? age));
    const merged = { ...user, ...serverUser };
    setUser(merged);
    navigation.setParams({ user: merged });
  };

  const handleSaveNickname = async () => {
    Keyboard.dismiss();
    const newName = nickname;
    try {
      const res = await fetch(`${backendUrl}/api/users/basic-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ _id: user._id, name: newName }),
      });
      const data = await res.json();
      console.log('handleSaveNickname response', { ok: res.ok, data });
      const serverUser = data.user;
      if (res.ok && serverUser) {
        const merged = { ...user, name: newName, ...serverUser };
        setUser(merged);
        setNickname(newName);
        navigation.setParams({ user: merged });
        Alert.alert('완료', '닉네임이 변경되었습니다.');
      } else {
        Alert.alert('오류', JSON.stringify(data));
      }
    } catch (e: any) {
      Alert.alert('오류', `네트워크: ${e.message}`);
    }
  };
  
  const handleSave = async () => {
    try {
      const res = await fetch(`${backendUrl}/api/users/basic-info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          _id: user._id,
          gender: gender === 'male' ? 'M' : 'F',
          height: Number(height),
          weight: Number(weight),
          age: Number(age),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        updateFromServer(data.user);
        Alert.alert('완료', '신체 정보가 저장되었습니다.');
      } else {
        Alert.alert('오류', JSON.stringify(data));
      }
    } catch (e: any) {
      Alert.alert('오류', `네트워크: ${e.message}`);
    }
  };

  return (
    <View style={styles.safeArea}>
        <StatusBar style="dark" />
        {/* 뒤로가기 네비게이션 헤더 */}
        <NavHeader title="프로필 상세" onBack={() => navigation.goBack()} />

        <ScrollView 
        style={styles.scrollArea} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        >
        {/* ① 프로필 아바타 섹션 컴포넌트 */}
        <AvatarSection 
            name={nickname}
            email={user.email || ''}
            onEditPress={() => console.log('아바타 수정 클릭')}
        />

        <AccountInfoCard 
          nickname={nickname} 
          onChangeNickname={setNickname}
          onSaveNicknamePress={handleSaveNickname}
          email={user.email || ''}
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