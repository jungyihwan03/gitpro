import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../constants';

// 🌟 화면 이동을 위한 useNavigation 임포트
import { useNavigation } from '@react-navigation/native';

import { useBottomSheetStore } from '../store/useBottomSheetStore';

export default function RecordBottomSheet() {
  const { isRecordSheetVisible, closeRecordSheet } = useBottomSheetStore();
  
  // 🌟 네비게이션 도구 장착 (TS 에러 방지용 <any> 추가)
  const navigation = useNavigation<any>();

  // 📸 [메뉴판 찍기] 버튼 클릭 시 동작
  const handleCameraOption = () => {
    closeRecordSheet(); // 시트를 먼저 닫습니다 (배경 먹통 방지)
    setTimeout(() => {
      // 🌟 목적지를 'MenuScannerCamera'로 수정했습니다!
      navigation.navigate('MenuScannerCamera'); 
    }, 100); 
  };

  // 🔍 [직접 검색하기] 버튼 클릭 시 동작
  const handleSearchOption = () => {
    closeRecordSheet(); 
    setTimeout(() => {
      navigation.navigate('Search'); 
    }, 100);
  };

  return (
    <Modal
      visible={isRecordSheetVisible}
      transparent={true}
      animationType="fade" 
      onRequestClose={closeRecordSheet} 
    >
      <View style={styles.overlay}>
        
        {/* 딤(Dim) 영역 - 클릭 시 바텀시트 닫힘 */}
        <TouchableWithoutFeedback onPress={closeRecordSheet}>
          <View style={styles.dim} />
        </TouchableWithoutFeedback>

        {/* 바텀시트 컨텐츠 영역 (하단 고정) */}
        <View style={styles.bottomSheet}>
          <View style={styles.handleWrap}>
            <View style={styles.handle} />
          </View>

          <Text style={styles.sheetTitle}>어떻게 기록할까요?</Text>
          <Text style={styles.sheetDesc}>메뉴판을 찍으면 AI가 메뉴를 찾아 목록으로 보여드려요.</Text>

          <View style={styles.sheetOptions}>
            
            {/* 1. 사진 촬영 옵션 (메뉴판 찍기) */}
            <TouchableOpacity 
              style={[styles.sheetOption, styles.optPrimary]} 
              activeOpacity={0.7}
              onPress={handleCameraOption} // 🌟 클릭하면 카메라로 이동!
            >
              <View style={[styles.optIconWrap, styles.optIconCam]}>
                <Text style={styles.optIconText}>📷</Text>
              </View>
              <View style={styles.optTextWrap}>
                <Text style={[styles.optTitle, styles.primaryText]}>메뉴판 찍기</Text>
                <Text style={styles.optDesc}>AI가 메뉴판에서 메뉴를 자동 인식해요</Text>
              </View>
              <View style={styles.optBadge}>
                <Text style={styles.optBadgeText}>NEW</Text>
              </View>
            </TouchableOpacity>

            {/* 2. 직접 검색 옵션 */}
            <TouchableOpacity 
              style={styles.sheetOption} 
              activeOpacity={0.7}
              onPress={handleSearchOption} // 🌟 클릭하면 검색으로 이동!
            >
              <View style={[styles.optIconWrap, styles.optIconSearch]}>
                <Text style={styles.optIconText}>🔍</Text>
              </View>
              <View style={styles.optTextWrap}>
                <Text style={styles.optTitle}>직접 검색하기</Text>
                <Text style={styles.optDesc}>메뉴 이름으로 직접 찾아요</Text>
              </View>
              <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <Path d="M9 18l6-6-6-6" stroke="#CCCCCC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </Svg>
            </TouchableOpacity>
            
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end', 
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)', 
  },
  bottomSheet: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 40,
    ...Layout.shadow4, 
  },
  handleWrap: { alignItems: 'center', paddingTop: 14, paddingBottom: 24 },
  handle: { width: 36, height: 4, backgroundColor: Colors.border, borderRadius: 2 },
  
  sheetTitle: { fontSize: 20, fontWeight: '700', color: Colors.text1, lineHeight: 28, marginBottom: 8 },
  sheetDesc: { fontSize: 14, fontWeight: '400', color: Colors.text2, lineHeight: 22, marginBottom: 24 },
  sheetOptions: { flexDirection: 'column', gap: 12 },
  
  sheetOption: {
    width: '100%',
    backgroundColor: Colors.bg,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Layout.radiusLg,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  optPrimary: {
    backgroundColor: 'rgba(139,46,58,0.04)', 
    borderColor: Colors.primary,
  },
  
  optIconWrap: { width: 48, height: 48, borderRadius: Layout.radiusMd, alignItems: 'center', justifyContent: 'center' },
  optIconCam: { backgroundColor: 'rgba(139,46,58,0.10)' },
  optIconSearch: { backgroundColor: Colors.divider },
  optIconText: { fontSize: 22 },
  
  optTextWrap: { flex: 1, flexDirection: 'column', gap: 4 },
  optTitle: { fontSize: 16, fontWeight: '700', color: Colors.text1, lineHeight: 24 },
  primaryText: { color: Colors.primary },
  optDesc: { fontSize: 13, fontWeight: '400', color: Colors.text2, lineHeight: 20 },
  
  optBadge: {
    height: 22,
    paddingHorizontal: 10,
    backgroundColor: Colors.primary,
    borderRadius: Layout.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optBadgeText: { fontSize: 11, fontWeight: '700', color: Colors.surface },
});