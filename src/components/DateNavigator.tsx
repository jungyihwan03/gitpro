// src/components/DateNavigator.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants';

interface DateNavigatorProps {
  title: string;
  dateText: string;
  onPrevPress: () => void;
  onNextPress: () => void;
  isNextDisabled?: boolean;
}

export default function DateNavigator({ 
  title, 
  dateText, 
  onPrevPress, 
  onNextPress, 
  isNextDisabled = false 
}: DateNavigatorProps) {
  return (
    <View style={styles.pageHeader}>
      <Text style={styles.pageTitle}>{title}</Text>
      
      <View style={styles.dateRow}>
        <TouchableOpacity style={styles.dateArrow} activeOpacity={0.6} onPress={onPrevPress}>
          <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <Path d="M15 18l-6-6 6-6" stroke={Colors.text2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
        
        <Text style={styles.dateText}>{dateText}</Text>
        
        <TouchableOpacity 
          style={[styles.dateArrow, isNextDisabled && styles.dateArrowDisabled]} 
          activeOpacity={0.6} 
          onPress={onNextPress}
          disabled={isNextDisabled}
        >
          <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <Path d="M9 18l6-6-6-6" stroke={Colors.text2} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </Svg>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pageHeader: { flexDirection: 'column', gap: 2 },
  pageTitle: { fontSize: 24, fontWeight: '700', color: Colors.text1, letterSpacing: -0.3, lineHeight: 32 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  dateText: { fontSize: 14, fontWeight: '400', color: Colors.text2 },
  dateArrow: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  dateArrowDisabled: { opacity: 0.3 },
});