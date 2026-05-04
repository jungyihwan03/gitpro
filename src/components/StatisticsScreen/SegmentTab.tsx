import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Layout } from '../../constants';

export const SegmentTab = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const tabs = ['일간', '주간', '월간'];

  return (
    <View style={styles.segTab}>
      {tabs.map((tab, index) => {
        const isActive = index === activeIndex;
        return (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.6}
            style={[styles.segBtn, isActive && styles.segBtnActive]}
            onPress={() => setActiveIndex(index)}
          >
            <Text style={[styles.segBtnText, isActive && styles.segBtnTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  segTab: {
    backgroundColor: Colors.border, // #E5E7EB
    borderRadius: Layout.radiusLg,
    padding: 4,
    flexDirection: 'row',
    width: '100%',
  },
  segBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Layout.radiusLg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segBtnActive: {
    backgroundColor: Colors.primary,
    ...Layout.shadow1, // 기존에 만들어두신 Layout 활용
  },
  segBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text2,
  },
  segBtnTextActive: {
    color: Colors.surface,
  },
});