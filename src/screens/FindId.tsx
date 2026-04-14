import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';
import { FindAccountTemplate } from '../components/FindAccountTemplate';
import { Colors } from '../constants';

export const FindId = () => {
  const UserIcon = (
    <Svg width="44" height="44" viewBox="0 0 52 52" fill="none">
      <Circle cx="26" cy="18" r="8" stroke={Colors.primary} strokeWidth="3.5" />
      <Path d="M12 42c0-7 7-12 14-12s14 5 14 12" stroke={Colors.primary} strokeWidth="3.5" strokeLinecap="round" />
    </Svg>
  );

  return (
    <FindAccountTemplate
      appBarTitle="아이디 찾기"
      HeaderIcon={UserIcon}
      headlineTitle="아이디를 잊으셨나요?"
      headlineBody={`가입하신 이메일 주소를 입력하시면\n해당 이메일로 아이디를 보내드립니다.`}
      submitButtonText="아이디 전송하기"
      successMessageSuffix="로 아이디를 보냈어요."
    />
  );
};