import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Polyline } from 'react-native-svg';

import { useNavigation } from '@react-navigation/native';

import { Colors, Layout } from '../constants';
import { CustomInput } from '../components/CustomInput';
import { PrimaryButton } from '../components/PrimaryButton';
import { SmallButton } from '../components/SmallButton';
import NavHeader from '../components/NavHeader'; 

export const SignUp = () => {
  const navigation = useNavigation<any>();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(179);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isCodeSent, setIsCodeSent] = useState(false); 
  
  const [isCodeVerified, setIsCodeVerified] = useState(false); 
  const [isLoading, setIsLoading] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [confirmPwError, setConfirmPwError] = useState('');

  useEffect(() => {
    let timer: any;
    if (isTimerRunning && timeLeft > 0 && !isCodeVerified) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
      if (isCodeSent && !isCodeVerified) setCodeError('입력 시간이 초과되었습니다. 다시 요청해주세요.');
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft, isCodeSent, isCodeVerified]);

  const handleSendCode = () => {
    if (!email || !email.includes('@')) {
      setEmailError('올바른 이메일 형식을 입력해주세요.');
      return;
    }
    setEmailError('');
    setCodeError('');
    setIsCodeSent(true);
    setIsCodeVerified(false);
    setIsTimerRunning(true);
    setTimeLeft(179); 
  };

  const handleVerifyCode = () => {
    if (!isCodeSent) return;
    
    if (code.length !== 4) {
      setCodeError('4자리 숫자를 입력해주세요.');
      return;
    }
    
    setIsCodeVerified(true);
    setIsTimerRunning(false);
    setCodeError('');
    Alert.alert('인증 완료', '이메일 인증이 완료되었습니다. ✅');
  };

  const formatTime = (seconds: number) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${m}:${s}`;
  };

  const isFormValid = email.includes('@') && isCodeVerified && username.trim().length > 0 && 
                      password.length >= 8 && password === confirmPassword && isTermsChecked;

  const handleRegister = async () => {
    if (!isFormValid || isLoading) return;
    setIsLoading(true);

    try {
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: username, password: password, email: email }), 
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('가입 성공! 🎉', '추가 신체 정보를 입력해 주세요.');
        navigation.navigate('BasicInfo', { 
          userId: data.user.userId,
          name: data.user.name 
        });
      } else {
        Alert.alert('가입 실패', data.error || '회원가입 중 오류가 발생했습니다.');
      }
    } catch (error) {
      console.error('회원가입 서버 에러:', error);
      Alert.alert('통신 오류', '서버에 연결할 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      
      <NavHeader title="회원가입" onBack={() => navigation.goBack()} />

      <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>간식 섭취 관리를{'\n'}시작해보세요</Text>
          <Text style={styles.heroSub}>이메일로 간편하게 가입하세요.</Text>
        </View>

        <View style={styles.formCard}>
          
          <CustomInput 
            label="이메일" 
            placeholder="example@email.com" 
            value={email} 
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            error={emailError}
            onBlur={() => { if (email && !email.includes('@')) setEmailError('올바른 이메일 형식을 입력해주세요.'); else setEmailError(''); }}
            rightAction={
              <SmallButton 
                title={isCodeVerified ? '인증완료' : (isCodeSent ? '재전송' : '인증요청')} 
                // 🌟 해결 1: disabled를 없애고, 함수 안에서 isCodeVerified면 아무 동작 안 하게 막음!
                onPress={() => {
                  if (!isCodeVerified) handleSendCode();
                }}
              />
            }
          />

          <CustomInput 
            label="인증번호" 
            placeholder="4자리 숫자 입력" 
            value={code} 
            onChangeText={(text) => { setCode(text); setCodeError(''); }}
            keyboardType="number-pad"
            maxLength={4}
            error={codeError}
            innerRightText={isCodeSent && !isCodeVerified ? formatTime(timeLeft) : undefined}
            innerRightTextColor={timeLeft === 0 ? Colors.error : Colors.primary}
            rightAction={
              <SmallButton 
                title={isCodeVerified ? "확인됨" : "확인"} 
                variant={isCodeVerified ? "filled" : "outlined"} 
                // 🌟 해결 2: 마찬가지로 disabled를 없애고 로직으로 방어!
                onPress={() => {
                  if (isCodeSent && !isCodeVerified) handleVerifyCode();
                }}
              />
            }
          />

          <CustomInput 
            label="아이디"
            value={username} 
            onChangeText={setUsername} 
            autoCapitalize="none" 
          />

          <CustomInput 
            label="비밀번호"
            value={password} 
            onChangeText={setPassword} 
            isPassword 
            hint="영문, 숫자, 특수문자 조합 8자리 이상"
          />

          <CustomInput 
            label="비밀번호 확인"
            value={confirmPassword} 
            onChangeText={setConfirmPassword} 
            isPassword 
            error={confirmPwError}
            onBlur={() => { if (confirmPassword && confirmPassword !== password) setConfirmPwError('비밀번호가 일치하지 않습니다.'); else setConfirmPwError(''); }}
          />

        </View>
      </ScrollView>

      <View style={styles.bottomArea}>
        <TouchableOpacity style={styles.termsRow} activeOpacity={0.7} onPress={() => setIsTermsChecked(!isTermsChecked)}>
          <View style={[styles.checkbox, isTermsChecked && styles.checkboxChecked]}>
            {isTermsChecked && (
              <Svg width="10" height="10" viewBox="0 0 12 10" fill="none">
                <Polyline points="1.5 5 4.5 8 10.5 1.5" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </Svg>
            )}
          </View>
          <Text style={styles.termsLabel}>
            서비스 이용을 위한 <Text style={styles.linkText}>이용약관</Text> 및 <Text style={styles.linkText}>개인정보처리방침</Text>에 동의합니다.
          </Text>
        </TouchableOpacity>

        <PrimaryButton 
          title={isLoading ? "가입 처리 중..." : "다음"} 
          onPress={handleRegister} 
          disabled={!isFormValid || isLoading} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  scrollArea: { flex: 1, backgroundColor: Colors.bg },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 32 },
  hero: { paddingTop: 28, paddingBottom: 28, gap: 8 },
  heroTitle: { fontSize: 24, fontWeight: '700', color: Colors.primary, lineHeight: 33.6, letterSpacing: -0.3 },
  heroSub: { fontSize: 12, fontWeight: '400', color: Colors.text2, lineHeight: 20 },
  formCard: { backgroundColor: Colors.surface, borderRadius: Layout.radiusLg, padding: 24, gap: 20, ...Layout.shadow1 },
  bottomArea: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 16 : 36, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.divider, ...Layout.shadow4, gap: 16 },
  termsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 },
  checkbox: { width: 22, height: 22, borderRadius: 8, borderWidth: 2, borderColor: Colors.border, backgroundColor: Colors.surface, alignItems: 'center', justifyContent: 'center' },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  termsLabel: { flex: 1, fontSize: 12, color: Colors.text1, lineHeight: 20 },
  linkText: { color: Colors.primary, fontWeight: '500', textDecorationLine: 'underline' },
});