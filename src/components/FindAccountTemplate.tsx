import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';

import { Colors } from '../constants';
import { CustomInput } from './CustomInput';
import NavHeader from './NavHeader';

interface FindAccountTemplateProps {
  appBarTitle: string;
  HeaderIcon: React.ReactNode;
  headlineTitle: string;
  headlineBody: string;
  submitButtonText: string;
  successMessageSuffix: string;
}

export const FindAccountTemplate = ({
  appBarTitle,
  HeaderIcon,
  headlineTitle,
  headlineBody,
  submitButtonText,
  successMessageSuffix
}: FindAccountTemplateProps) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  // 스피너 애니메이션 로직
  const spinValue = React.useRef(new Animated.Value(0)).current;
  const startSpin = () => {
    spinValue.setValue(0);
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  };
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const validateEmail = (text: string) => {
    if (!text) {
      setEmailError('이메일 주소를 입력해 주세요.');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text)) {
      setEmailError('올바른 이메일 주소를 입력해 주세요.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleBlur = () => {
    if (email) validateEmail(email);
  };
  
  const handleChangeText = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError('');
    if (submitStatus !== 'idle') setSubmitStatus('idle');
  };

  const handleSubmit = () => {
    if (!validateEmail(email)) return;
    setSubmitStatus('loading');
    startSpin();
    setTimeout(() => {
      spinValue.stopAnimation();
      setSubmitStatus('success');
    }, 1800);
  };

  const EmailIcon = (
    <Svg width="18" height="14" viewBox="0 0 20 16" fill="none">
      <Path
        d="M18 0H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm0 4-8 5-8-5V2l8 5 8-5v2z"
        fill={Colors.text2}
      />
    </Svg>
  );

  return (
    <View style={styles.container}>
      {/* 상태바 글씨 색상 어둡게 */}
      <StatusBar style="dark" />

      {/* 🌟 노치 영역과 헤더를 감싸는 SafeAreaView (흰색 배경) */}
      <View style={styles.headerArea}>
        <NavHeader title={appBarTitle} onBack={() => console.log('뒤로가기 클릭')} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {HeaderIcon}
        </View>

        <View style={styles.headlineBlock}>
          <Text style={styles.headlineTitle}>{headlineTitle}</Text>
          <Text style={styles.headlineBody}>{headlineBody}</Text>
        </View>

        <View style={styles.formSection}>
          <CustomInput 
            label="이메일 주소"
            placeholder="example@email.com"
            value={email}
            onChangeText={handleChangeText}
            onBlur={handleBlur}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={EmailIcon}
            error={emailError}
            success={submitStatus === 'success' ? `${email} ${successMessageSuffix}` : undefined}
          />

          <TouchableOpacity
            style={[
              styles.btnCta,
              (!email || submitStatus === 'loading') && styles.btnCtaDisabled
            ]}
            disabled={!email || submitStatus === 'loading'}
            activeOpacity={0.8}
            onPress={handleSubmit}
          >
            {submitStatus === 'idle' && (
              <>
                <Svg width="16" height="13" viewBox="0 0 20 16" fill="none">
                  <Path d="M18 0H2C.9 0 0 .9 0 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V2c0-1.1-.9-2-2-2zm0 4-8 5-8-5V2l8 5 8-5v2z" fill="#FFFFFF"/>
                </Svg>
                <Text style={styles.btnCtaText}>{submitButtonText}</Text>
              </>
            )}
            {submitStatus === 'loading' && (
              <>
                <Animated.View style={{ transform: [{ rotate: spin }] }}>
                  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <Path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6a6 6 0 0 1-6 6 6 6 0 0 1-6-6H4a8 8 0 0 0 8 8 8 8 0 0 0 8-8c0-4.42-3.58-8-8-8z" fill={Colors.text2}/>
                  </Svg>
                </Animated.View>
                <Text style={styles.btnCtaDisabledText}>전송 중...</Text>
              </>
            )}
            {submitStatus === 'success' && (
              <>
                <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#FFFFFF"/>
                </Svg>
                <Text style={styles.btnCtaText}>전송 완료!</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.footerArea}>
          <Text style={styles.footerText}>이메일이 기억나지 않으시나요?</Text>
          <TouchableOpacity activeOpacity={0.6}>
            <Text style={styles.footerLink}>고객센터 문의</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // 1. 전체 배경 (회색)
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  // 2. 상태바 및 NavHeader 영역 배경 (흰색)
  headerArea: {
    backgroundColor: Colors.surface, 
  },
  // 3. 메인 콘텐츠 영역
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 56,
  },
  // 4. 아이콘 영역
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  // 5. 제목 및 본문 블록
  headlineBlock: {
    alignItems: 'center',
    marginBottom: 32,
    gap: 8,
  },
  headlineTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 32,
  },
  headlineBody: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.text2,
    lineHeight: 20,
    textAlign: 'center',
  },
  // 6. 입력창 및 버튼 영역
  formSection: {
    width: '100%',
    gap: 16,
  },
  // 7. 메인 전송 버튼 (기본)
  btnCta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    height: 52,
    backgroundColor: Colors.primary,
    borderRadius: 9999,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  // 메인 전송 버튼 (비활성화 상태)
  btnCtaDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  // 메인 전송 버튼 텍스트 (기본)
  btnCtaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  // 메인 전송 버튼 텍스트 (비활성화 상태)
  btnCtaDisabledText: {
    color: Colors.text2,
    fontSize: 16,
    fontWeight: '700',
  },
  // 8. 하단 고객센터 문의 영역
  footerArea: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.text2,
  },
  footerLink: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
});