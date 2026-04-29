import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';

// 🌟 해결 1: <any>를 붙여서 사진 1, 3번의 useNavigation<never> 에러를 차단!
import { useNavigation } from '@react-navigation/native'; 

import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

import { Colors, Layout } from '../constants'; 
import { CustomInput } from '../components/CustomInput'; 
import { PrimaryButton } from '../components/PrimaryButton'; 

export const Login = () => {
  const navigation = useNavigation<any>(); // 👈 여기에 <any>가 들어갔습니다!
  
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
      offlineAccess: true, 
    });
  }, []);

  // 일반 로그인 로직
  const handleLocalLogin = async () => {
    if (!userId || !password) return Alert.alert('알림', '아이디와 비밀번호를 입력해 주세요.');
    
    if (isLoading) return; setIsLoading(true);
    try {
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, password }),
      });
      const data = await response.json();

      if (response.ok) {
        navigation.navigate('Home', { 
          name: data.user.name,
          gender: data.user.gender,
          height: data.user.height,
          weight: data.user.weight,
          age: data.user.age
        });
      } else {
        Alert.alert('로그인 실패', data.error);
      }
    } catch (error) {
      Alert.alert('오류', '서버 통신 오류');
    } finally {
      setIsLoading(false);
    }
  };

  // 소셜 로그인 로직 (구글)
  const handleGoogleLogin = async () => {
    if (isLoading) return; setIsLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      // 🌟 해결 2: 사진 2번 에러 방지 (구글 정보가 null일 경우를 대비한 안전장치)
      if (!userInfo.data) {
        Alert.alert('오류', '구글 로그인 정보를 가져오지 못했습니다.');
        return;
      }

      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
      const response = await fetch(`${backendUrl}/api/auth/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          provider: 'google', 
          providerId: userInfo.data.user.id, 
          email: userInfo.data.user.email, 
          name: userInfo.data.user.name, 
          token: userInfo.data.idToken 
        }),
      });
      const data = await response.json();

      if (response.ok) {
        navigation.navigate('BasicInfo', { providerId: data.user.providerId, name: data.user.name });
      } else {
        Alert.alert('로그인 실패', '서버 통신 오류');
      }
      // 🌟 해결 3: catch (error: any) 로 바꿔서 사진 4번의 unknown 에러를 차단!
    } catch (error: any) {
      if (error.code !== statusCodes.SIGN_IN_CANCELLED) console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNaverLogin = () => Alert.alert('네이버 로그인', '현재 준비 중입니다.');
  const handleKakaoLogin = () => Alert.alert('카카오 로그인', '현재 준비 중입니다.');

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.mainContent}>
          <View style={styles.headerSection}>
            <View style={styles.logoWrap}><Text style={styles.logoText}>☕</Text></View>
            <Text style={styles.appTitle}>로그인</Text>
            <Text style={styles.appSubtitle}>오늘 하루의 에너지를 기록하세요</Text>
          </View>

          <View style={styles.formCard}>
            <CustomInput label="아이디" placeholder="아이디를 입력하세요" value={userId} onChangeText={setUserId} autoCapitalize="none" />
            <CustomInput label="비밀번호" placeholder="비밀번호를 입력하세요" value={password} onChangeText={setPassword} isPassword />
            
            <View style={styles.findPwWrap}>
              <TouchableOpacity activeOpacity={0.6} style={styles.linkTouch} onPress={() => navigation.navigate('FindId')}>
                <Text style={styles.findPwLink}>아이디 찾기</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.6} style={styles.linkTouch} onPress={() => navigation.navigate('FindPassword')}>
                <Text style={styles.findPwLink}>비밀번호 찾기</Text>
              </TouchableOpacity>
            </View>

            <PrimaryButton title={isLoading ? "로그인 중..." : "로그인"} onPress={handleLocalLogin} />
          </View>

          <View style={styles.dividerSection}>
            <View style={styles.dividerLine} /><Text style={styles.dividerText}>SNS 계정으로 계속하기</Text><View style={styles.dividerLine} />
          </View>
          
          <View style={styles.socialBtns}>
            {/* 구글 */}
            <TouchableOpacity style={styles.socialBtn} activeOpacity={isLoading ? 1 : 0.6} onPress={handleGoogleLogin}>
              <View style={[styles.socialIconCircle, { backgroundColor: Colors.google, opacity: isLoading ? 0.6 : 1 }]}><Svg width="22" height="22" viewBox="0 0 22 22" fill="none"><Path d="M20.6 11.2c0-.7-.1-1.4-.2-2H11v3.8h5.4a4.6 4.6 0 01-2 3v2.5h3.2c1.9-1.7 3-4.3 3-7.3z" fill="#4285F4"/><Path d="M11 21c2.7 0 5-.9 6.6-2.4l-3.2-2.5c-.9.6-2 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H2.1v2.6A10 10 0 0011 21z" fill="#34A853"/><Path d="M5.4 13c-.2-.6-.3-1.3-.3-2s.1-1.4.3-2V6.4H2.1A10 10 0 001 11c0 1.6.4 3.1 1.1 4.5L5.4 13z" fill="#FBBC05"/><Path d="M11 4.9c1.5 0 2.8.5 3.8 1.5l2.9-2.9C15.9 1.8 13.6 1 11 1A10 10 0 002.1 6.4L5.4 9c.8-2.4 3-4.1 5.6-4.1z" fill="#EA4335"/></Svg></View>
            </TouchableOpacity>

            {/* 네이버 */}
            <TouchableOpacity style={styles.socialBtn} activeOpacity={isLoading ? 1 : 0.6} onPress={handleNaverLogin}>
              <View style={[styles.socialIconCircle, { backgroundColor: Colors.naver, borderColor: Colors.naver, opacity: isLoading ? 0.6 : 1 }]}><Svg width="16" height="16" viewBox="0 0 14 14" fill="none"><Path d="M8.2 7.3L5.6 3.5H3.5v7h2.3V6.7l2.6 3.8H10.5v-7H8.2v3.8z" fill="#fff"/></Svg></View>
            </TouchableOpacity>

            {/* 카카오 */}
            <TouchableOpacity style={styles.socialBtn} activeOpacity={isLoading ? 1 : 0.6} onPress={handleKakaoLogin}>
              <View style={[styles.socialIconCircle, { backgroundColor: Colors.kakao, borderColor: Colors.kakao, opacity: isLoading ? 0.6 : 1 }]}><Svg width="22" height="20" viewBox="0 0 20 18" fill="none"><Path fillRule="evenodd" clipRule="evenodd" d="M10 0C4.5 0 0 3.4 0 7.6c0 2.7 1.8 5.1 4.5 6.5l-1.2 4.3 5-3.2c.5.1 1.1.1 1.7.1 5.5 0 10-3.4 10-7.7S15.5 0 10 0z" fill="#3C1E1E"/></Svg></View>
            </TouchableOpacity>
          </View>

        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>계정이 없으신가요?</Text>
          <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signupLink}>회원가입</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  scrollContainer: { flexGrow: 1, backgroundColor: Colors.bg },
  mainContent: { flex: 1 },
  headerSection: { alignItems: 'center', paddingTop: 52, paddingHorizontal: 24, paddingBottom: 36, gap: 8 },
  logoWrap: { width: 80, height: 80, borderRadius: Layout.radiusFull, backgroundColor: Colors.surface, borderColor: Colors.border, borderWidth: 1, alignItems: 'center', justifyContent: 'center', marginBottom: 16, ...Layout.shadow1 },
  logoText: { fontSize: 36 },
  appTitle: { fontSize: 24, fontWeight: '700', color: Colors.primary, lineHeight: 32 },
  appSubtitle: { fontSize: 12, fontWeight: '400', color: Colors.text2, lineHeight: 20, textAlign: 'center' },
  formCard: { marginHorizontal: 24, backgroundColor: Colors.surface, borderRadius: Layout.radiusLg, padding: 24, gap: 16, ...Layout.shadow1 },
  findPwWrap: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: -4 },
  linkTouch: { height: 40, justifyContent: 'center', paddingHorizontal: 2 },
  findPwLink: { fontSize: 13, fontWeight: '500', color: Colors.primary },
  dividerSection: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 28, paddingBottom: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 12, fontWeight: '400', color: Colors.text2 },
  socialBtns: { flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 24, gap: 20 },
  socialBtn: { width: 52, height: 52, borderRadius: 26 },
  socialIconCircle: { ...StyleSheet.absoluteFillObject, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.border, ...Layout.shadow1 },
  footer: { marginTop: 'auto', borderTopWidth: 1, borderTopColor: Colors.divider, paddingVertical: 20, paddingHorizontal: 24, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 4 },
  footerText: { fontSize: 14, fontWeight: '400', color: Colors.text2 },
  signupLink: { height: 44, textAlignVertical: 'center', paddingHorizontal: 4, fontSize: 14, fontWeight: '700', color: Colors.primary },
});