import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar'
import Svg, { Path } from 'react-native-svg';

import { Colors, Layout } from '../constants';
import NavHeader from '../components/NavHeader';
import BottomNavBar from '../components/BottomNavBar';
import { SectionHeader } from '../components/SettingsScreen/SectionHeader';
import { ListItem } from '../components/SettingsScreen/ListItem';
import { InputField } from '../components/SettingsScreen/InputField';
import { SwitchItem } from '../components/SettingsScreen/SwitchItem';

export const SettingsScreen = ({ navigation }: any) => {
  // 스위치 상태 관리
  const [alertLimit, setAlertLimit] = useState(false);
  const [alertNight, setAlertNight] = useState(true);

  // 뒤로가기 핸들러 (NavHeader 용)
  const handleBack = () => {
    if (navigation?.goBack) {
      navigation.goBack();
    }
  };

  const handleLogout = () => {
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      { text: '확인', style: 'destructive' },
    ]);
  };

  const handleWithdraw = () => {
    Alert.alert('회원탈퇴', '정말 탈퇴하시겠습니까? 모든 데이터가 삭제됩니다.', [
      { text: '취소', style: 'cancel' },
      { text: '탈퇴', style: 'destructive' },
    ]);
  };

  // 공통 화살표 아이콘
  const ChevronIcon = () => (
    <Svg width="24" height="24" viewBox="0 0 24 24">
      <Path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill={Colors.text3} />
    </Svg>
  );

  return (
    <View style={styles.safeArea}>

        <StatusBar style="dark" />
        {/* 1. 팀에서 구축한 공통 헤더 사용 */}
        <NavHeader title="설정" onBack={handleBack} />

        {/* 2. 스크롤 영역 */}
        <ScrollView 
            style={styles.scrollArea} 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
        >
        
        {/* ① 프로필 카드 */}
        <View style={[styles.card, styles.profileCard]}>
          <View style={styles.profileRow}>
            <View style={styles.avatarWrap}>
              {/* constants.ts의 avatarBg, avatarIcon 활용 */}
              <View style={styles.avatar}>
                <Svg width="32" height="32" viewBox="0 0 24 24">
                  <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill={Colors.avatarIcon} />
                </Svg>
              </View>
              <TouchableOpacity activeOpacity={0.8} style={styles.avatarEdit}>
                <Svg width="12" height="12" viewBox="0 0 24 24">
                  <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill={Colors.surface} />
                </Svg>
              </TouchableOpacity>
            </View>
            
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>김카페</Text>
              <Text style={styles.profileEmail}>kimcafe@example.com</Text>
            </View>
            
            <ChevronIcon />
          </View>
          
          <TouchableOpacity activeOpacity={0.6} style={styles.profileLinkBtn}>
            <Text style={styles.profileLinkText}>프로필 상세 보기</Text>
            <Svg width="16" height="16" viewBox="0 0 24 24">
              <Path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill={Colors.primary} />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* ② 즐겨찾기 섹션 */}
        <SectionHeader 
          title="즐겨찾기" 
          icon={
            <Svg width="20" height="20" viewBox="0 0 24 24">
              <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill={Colors.text2} />
            </Svg>
          } 
        />
        <View style={styles.listCard}>
          <ListItem 
            headline="즐겨찾기 한 메뉴"
            supporting="저장된 메뉴 목록"
            leadingIcon={
              <Svg width="20" height="20" viewBox="0 0 24 24">
                <Path d="M3 2l2.01 18.23C5.13 21.23 5.97 22 7 22h10c1.03 0 1.87-.77 1.99-1.77L21 2H3zm9 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm1-9h-2V7h2v3z" fill={Colors.text2} />
              </Svg>
            }
            trailingElement={<ChevronIcon />}
          />
          <ListItem 
            headline="즐겨찾기에 추가한 카페"
            supporting="카페 정보 및 메뉴"
            isLast={true}
            leadingIcon={
              <Svg width="20" height="20" viewBox="0 0 24 24">
                <Path d="M20 4H4v2l8 5 8-5V4zM4 11v7a2 2 0 002 2h12a2 2 0 002-2v-7l-8 5-8-5z" fill={Colors.text2} />
              </Svg>
            }
            trailingElement={<ChevronIcon />}
          />
        </View>

        {/* ③ 신체 정보 섹션 */}
        <SectionHeader 
          title="신체 정보" 
          icon={
            <Svg width="20" height="20" viewBox="0 0 24 24">
              <Path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" fill={Colors.text2} />
            </Svg>
          } 
        />
        <Text style={styles.helperText}>일일 권장 섭취량을 정확하게 계산하기 위해 필요한 정보입니다.</Text>
        
        <View style={styles.card}>
          <View style={styles.fieldsContainer}>
            <InputField label="키" value="175" suffix="cm" editable={false} />
            <View style={styles.fieldsRow}>
              <InputField label="몸무게" value="68" suffix="kg" editable={false} />
              <InputField label="나이" value="28" suffix="세" editable={false} />
            </View>
          </View>
        </View>

        {/* ④ 알림 설정 섹션 */}
        <SectionHeader 
          title="알림 설정" 
          icon={
            <Svg width="20" height="20" viewBox="0 0 24 24">
              <Path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill={Colors.text2} />
            </Svg>
          } 
        />
        <View style={styles.listCard}>
          <SwitchItem 
            headline="일일 권장량 초과 알림" 
            supporting="하루 제한량을 넘기면 경고 알림을 보냅니다." 
            value={alertLimit} 
            onValueChange={setAlertLimit} 
          />
          <SwitchItem 
            headline="야간 섭취 주의 알림" 
            supporting="수면 6시간 전 카페인 섭취 시 알림을 보냅니다." 
            value={alertNight} 
            onValueChange={setAlertNight} 
            isLast={true}
          />
        </View>

        {/* ⑤ 기타 섹션 */}
        <SectionHeader 
          title="기타" 
          icon={
            <Svg width="20" height="20" viewBox="0 0 24 24">
              <Path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill={Colors.text2} />
            </Svg>
          } 
        />
        <View style={styles.listCard}>
          <ListItem headline="공지사항" trailingElement={<ChevronIcon />} />
          <ListItem headline="이용약관 및 개인정보 처리방침" trailingElement={<ChevronIcon />} />
          <ListItem 
            headline="앱 버전" 
            trailingElement={<Text style={styles.versionText}>v1.2.0</Text>} 
            isLast={true} 
            disabled={true} 
          />
        </View>

        {/* ⑥ 로그아웃 / 회원탈퇴 */}
        <View style={styles.actionSection}>
          <TouchableOpacity activeOpacity={0.6} style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>로그아웃</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.6} style={styles.withdrawBtn} onPress={handleWithdraw}>
            <Text style={styles.withdrawText}>회원탈퇴</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>

      {/* 3. 팀에서 구축한 공통 하단 네비게이션 사용 */}
      <BottomNavBar activeTab="설정" />

    </View>
  );
};

const styles = StyleSheet.create({
  // 레이아웃 기본 설정
  safeArea: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    gap: 24,
    // BottomNavBar가 absolute로 떠있고 height가 100이므로 
    // 콘텐츠가 가려지지 않도록 하단 여백을 충분히 줍니다.
    paddingBottom: 130, 
  },

  // 카드 공통 스타일 (팀에서 정의한 Layout 객체 사용)
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg, // 24dp
    padding: 24,
    ...Layout.shadow1,             // elevation 및 그림자 공통 속성
  },
  listCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    overflow: 'hidden',
    ...Layout.shadow1,
  },

  // 프로필 전용 스타일
  profileCard: {
    paddingTop: 20,
    paddingBottom: 16,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: Layout.radiusFull, // 원형
    backgroundColor: Colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEdit: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 24,
    height: 24,
    borderRadius: Layout.radiusFull,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 22,
  },
  profileEmail: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.text2,
    lineHeight: 18,
    marginTop: 2,
  },
  profileLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 36,
    gap: 4,
    alignSelf: 'flex-start',
  },
  profileLinkText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },

  // 텍스트 & 섹션 스타일
  helperText: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.text2,
    lineHeight: 18,
    marginTop: -8,
    paddingHorizontal: 2,
  },
  versionText: {
    fontSize: 13,
    fontWeight: '400',
    color: Colors.text2,
  },

  // 폼 필드 레이아웃
  fieldsContainer: {
    flexDirection: 'column',
    gap: 16,
  },
  fieldsRow: {
    flexDirection: 'row',
    gap: 12,
  },

  // 하단 액션 버튼
  actionSection: {
    alignItems: 'center',
    gap: 4,
    paddingBottom: 8,
  },
  logoutBtn: {
    height: 44,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text2,
  },
  withdrawBtn: {
    height: 44,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  withdrawText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.error,
  },
});