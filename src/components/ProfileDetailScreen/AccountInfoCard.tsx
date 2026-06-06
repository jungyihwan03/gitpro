import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../../constants';

interface AccountInfoCardProps {
  nickname: string;
  onChangeNickname: (text: string) => void;
  onSaveNicknamePress: () => void; // 🌟 [변경] 버튼을 눌렀을 때 실행될 저장 함수
  email: string;
}

export const AccountInfoCard = ({ 
  nickname, 
  onChangeNickname,
  onSaveNicknamePress, 
  email 
}: AccountInfoCardProps) => {
  
  // 입력창이 선택되었을 때 테두리 색상을 바꾸기 위한 상태
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.card}>
      <View style={styles.cardTitleRow}>
        <Svg width="20" height="20" viewBox="0 0 24 24">
          <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill={Colors.text2} />
        </Svg>
        <Text style={styles.cardTitle}>계정 정보</Text>
      </View>

      {/* 닉네임 */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>닉네임</Text>
        <View style={styles.fieldRowH}>
          {/* 🌟 포커스 상태(isFocused)에 따라 테두리 색상 분기 */}
          <View style={[styles.fieldBox, isFocused && styles.activeFieldBox]}>
            <TextInput 
              style={styles.inputText} 
              value={nickname} 
              editable={true} // 🌟 언제든 터치하면 자판이 올라오도록 true 고정!
              onChangeText={onChangeNickname}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="닉네임을 입력해 주세요"
              placeholderTextColor={Colors.text3}
            />
          </View>
          {/* 🌟 수정을 마친 후 최종 적용하는 [변경] 버튼 */}
          <TouchableOpacity activeOpacity={0.7} style={styles.changeBtn} onPress={onSaveNicknamePress}>
            <Text style={styles.changeBtnText}>변경</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardDivider} />

      {/* 이메일 (여기는 읽기전용 잠금 유지) */}
      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>이메일</Text>
        <View style={[styles.fieldBox, styles.readonlyBox]}>
          <TextInput style={[styles.inputText, styles.readonlyText]} value={email} editable={false} />
          <View style={styles.fieldLock}>
            <Svg width="18" height="18" viewBox="0 0 24 24">
              <Path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill={Colors.text3} />
            </Svg>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    padding: 24,
    marginHorizontal: 24,
    ...Layout.shadow1,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 28,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 20,
  },
  fieldGroup: {
    flexDirection: 'column',
    gap: 6,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.text2,
    letterSpacing: 0.2,
  },
  fieldRowH: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fieldBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Layout.radiusMd,
    height: 52,
    paddingHorizontal: 16,
    backgroundColor: Colors.surface,
  },
  activeFieldBox: {
    borderColor: Colors.primary, // 포커스 되었을 때 브랜드 강조색 테두리
  },
  inputText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text1,
    padding: 0,
  },
  readonlyBox: {
    backgroundColor: Colors.bg,
  },
  readonlyText: {
    color: Colors.text2,
    fontWeight: '400',
  },
  fieldLock: {
    marginLeft: 8,
    justifyContent: 'center',
  },
  changeBtn: {
    height: 40,
    paddingHorizontal: 18,
    borderRadius: Layout.radiusFull,
    backgroundColor: 'rgba(139,46,58,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  changeBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
});