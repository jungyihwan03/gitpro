import React from 'react';
import Svg, { Path, Rect, Circle } from 'react-native-svg';
import { FindAccountTemplate } from '../components/FindAccountTemplate';
import { Colors } from '../constants';

export const FindPassword = () => {
  const LockIcon = (
    <Svg width="44" height="44" viewBox="0 0 52 52" fill="none">
      <Rect x="8" y="22" width="36" height="26" rx="6" fill={Colors.primary}/>
      <Path d="M16 22V16C16 10.48 20.48 6 26 6s10 4.48 10 10v6" stroke={Colors.primary} strokeWidth="3.5" strokeLinecap="round" />
      <Circle cx="26" cy="35" r="4" fill="#fff"/>
      <Rect x="24" y="38" width="4" height="5" rx="2" fill="#fff"/>
    </Svg>
  );

  return (
    <FindAccountTemplate
      appBarTitle="비밀번호 찾기"
      HeaderIcon={LockIcon}
      headlineTitle="비밀번호를 잊으셨나요?"
      headlineBody={`가입하신 이메일 주소를 입력하시면\n비밀번호 재설정 메일을 보내드립니다.`}
      submitButtonText="인증 메일 보내기"
      successMessageSuffix="로 재설정 메일을 보냈어요."
    />
  );
};