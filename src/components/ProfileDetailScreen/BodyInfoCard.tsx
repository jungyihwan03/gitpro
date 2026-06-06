import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../../constants';
import { InputField } from '../InputField'; // 🌟 첫 번째에 수정한 공통 컴포넌트 재사용

interface BodyInfoCardProps {
  gender: 'male' | 'female';
  onGenderChange: (gender: 'male' | 'female') => void;
  height: string;
  onHeightChange: (text: string) => void;
  weight: string;
  onWeightChange: (text: string) => void;
  age: string;
  onAgeChange: (text: string) => void;
  onSavePress?: () => void;
}

export const BodyInfoCard = ({
  gender,
  onGenderChange,
  height,
  onHeightChange,
  weight,
  onWeightChange,
  age,
  onAgeChange,
  onSavePress,
}: BodyInfoCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardTitleRow}>
        <Svg width="20" height="20" viewBox="0 0 24 24">
          <Path d="M13.49 5.48c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 7 1.4z" fill={Colors.text2} />
        </Svg>
        <Text style={styles.cardTitle}>신체 정보</Text>
      </View>

      <Text style={styles.helperText}>
        일일 권장 카페인 섭취량을 정확하게 계산하기 위해 필요한 정보입니다. 언제든지 수정할 수 있습니다.
      </Text>

      {/* 성별 세그먼트 */}
      <View style={[styles.fieldGroup, { marginBottom: 20 }]}>
        <Text style={styles.fieldLabel}>성별</Text>
        <View style={styles.segWrap}>
          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.segOption, gender === 'male' && styles.segOptionActive]}
            onPress={() => onGenderChange('male')}
          >
            {gender === 'male' && (
              <Svg width="14" height="14" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#FFFFFF" />
              </Svg>
            )}
            <Text style={[styles.segText, gender === 'male' && styles.segTextActive]}>남성</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.9}
            style={[styles.segOption, gender === 'female' && styles.segOptionActive, { borderLeftWidth: 1.5, borderColor: Colors.border }]}
            onPress={() => onGenderChange('female')}
          >
            {gender === 'female' && (
              <Svg width="14" height="14" viewBox="0 0 24 24" style={{ marginRight: 4 }}>
                <Path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" fill="#FFFFFF" />
              </Svg>
            )}
            <Text style={[styles.segText, gender === 'female' && styles.segTextActive]}>여성</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 키 입력창 */}
      <View style={{ marginBottom: 16 }}>
        <InputField label="키" value={height} suffix="cm" onChangeText={onHeightChange} />
      </View>

      {/* 몸무게 & 나이 가로 배치 */}
      <View style={styles.fields2Col}>
        <InputField label="몸무게" value={weight} suffix="kg" onChangeText={onWeightChange} />
        <InputField label="나이" value={age} suffix="세" onChangeText={onAgeChange} />
      </View>

      {/* 저장 버튼 */}
      <TouchableOpacity activeOpacity={0.8} style={styles.saveBtn} onPress={onSavePress}>
        <Svg width="20" height="20" viewBox="0 0 24 24">
          <Path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" fill="#FFFFFF" />
        </Svg>
        <Text style={styles.saveBtnText}>저장 및 권장량 재계산</Text>
      </TouchableOpacity>
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
  helperText: {
    fontSize: 12,
    color: Colors.text2,
    lineHeight: 18,
    marginTop: -8,
    marginBottom: 20,
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
  segWrap: {
    flexDirection: 'row',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Layout.radiusFull,
    overflow: 'hidden',
    height: 44,
  },
  segOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  segOptionActive: {
    backgroundColor: Colors.primary,
  },
  segText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text2,
  },
  segTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  fields2Col: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  saveBtn: {
    width: '100%',
    height: 52,
    borderRadius: Layout.radiusFull,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 4,
  },
  saveBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});