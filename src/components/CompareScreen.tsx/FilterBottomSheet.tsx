import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../../constants';

interface FilterBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: { gender: string; age: string }) => void;
}

export const FilterBottomSheet = ({ visible, onClose, onApply }: FilterBottomSheetProps) => {
  // 선택 상태 관리
  const [gender, setGender] = useState('남성');
  const [age, setAge] = useState('20대');

  const ages = ['10대', '20대', '30대', '40대', '50대', '60대 이상'];

  const handleReset = () => {
    setGender('남성');
    setAge('20대');
  };

  const handleApply = () => {
    onApply({ gender, age });
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* 바탕의 어두운 스크림 (터치 시 닫힘) */}
      <Pressable style={styles.scrim} onPress={onClose} />

      {/* 바텀시트 본체 */}
      <View style={styles.bottomSheet}>
        
        {/* 상단 드래그 핸들 */}
        <View style={styles.sheetHandleWrap}>
          <View style={styles.sheetHandle} />
        </View>

        <View style={styles.sheetBody}>
          
          {/* 타이틀 및 닫기 버튼 */}
          <View style={styles.sheetTitleRow}>
            <Text style={styles.sheetTitle}>필터 설정</Text>
            <TouchableOpacity activeOpacity={0.7} style={styles.btnClose} onPress={onClose}>
              <Svg width="20" height="20" viewBox="0 0 20 20">
                <Path d="M15 5L5 15M5 5l10 10" stroke={Colors.text2} strokeWidth="2" strokeLinecap="round"/>
              </Svg>
            </TouchableOpacity>
          </View>

          {/* 성별 필터 */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>성별</Text>
            <View style={styles.segTab}>
              <TouchableOpacity 
                activeOpacity={0.8} 
                style={[styles.segBtn, gender === '남성' && styles.segBtnActive]}
                onPress={() => setGender('남성')}
              >
                <Text style={[styles.segBtnText, gender === '남성' && styles.segBtnTextActive]}>남성</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                activeOpacity={0.8} 
                style={[styles.segBtn, gender === '여성' && styles.segBtnActive]}
                onPress={() => setGender('여성')}
              >
                <Text style={[styles.segBtnText, gender === '여성' && styles.segBtnTextActive]}>여성</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* 연령대 필터 (3열 그리드 구조) */}
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>연령대</Text>
            <View style={styles.ageGrid}>
              {ages.map((item) => (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.7}
                  style={[styles.ageChip, age === item && styles.ageChipActive]}
                  onPress={() => setAge(item)}
                >
                  <Text style={[styles.ageChipText, age === item && styles.ageChipTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* 하단 액션 버튼 */}
          <View style={styles.sheetActions}>
            <TouchableOpacity activeOpacity={0.7} style={styles.btnReset} onPress={handleReset}>
              <Svg width="16" height="16" viewBox="0 0 24 24">
                <Path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" fill={Colors.text2} />
              </Svg>
              <Text style={styles.btnResetText}>초기화</Text>
            </TouchableOpacity>
            
            <TouchableOpacity activeOpacity={0.8} style={styles.btnApply} onPress={handleApply}>
              <Text style={styles.btnApplyText}>적용하기</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 32, // 아이폰 홈 인디케이터 여백 고려
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 20,
  },
  sheetHandleWrap: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 2,
  },
  sheetBody: {
    paddingHorizontal: 24,
    gap: 24,
  },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    position: 'relative',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 28,
  },
  btnClose: {
    position: 'absolute',
    right: -12, // 터치 영역(48px) 확장을 위해 음수 마진 사용
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterGroup: {
    gap: 12,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text1,
    lineHeight: 20,
  },
  
  /* 성별 탭 */
  segTab: {
    flexDirection: 'row',
    backgroundColor: '#E5E7EB',
    borderRadius: Layout.radiusFull,
    padding: 4,
  },
  segBtn: {
    flex: 1,
    minHeight: 48,
    borderRadius: Layout.radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segBtnActive: {
    backgroundColor: Colors.primary,
    ...Layout.shadow1,
  },
  segBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text2,
  },
  segBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  /* 연령대 칩 그리드 */
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ageChip: {
    width: '31%', // RN에서는 flexWrap과 width 퍼센트로 그리드 구현
    height: 48,
    borderRadius: Layout.radiusFull,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  ageChipActive: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(139,46,58,0.06)',
  },
  ageChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text2,
  },
  ageChipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },

  /* 하단 액션 버튼 */
  sheetActions: {
    flexDirection: 'row',
    gap: 12,
  },
  btnReset: {
    height: 52,
    paddingHorizontal: 20,
    borderRadius: Layout.radiusFull,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  btnResetText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text2,
  },
  btnApply: {
    flex: 1,
    height: 52,
    borderRadius: Layout.radiusFull,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadow1,
  },
  btnApplyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});