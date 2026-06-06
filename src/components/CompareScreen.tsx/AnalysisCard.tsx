import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Layout } from '../../constants';

interface AnalysisCardProps {
  title: string;
  status: 'LOWER' | 'HIGHER';
  compareText: string;
  descText: string;
  highlightText: string;
  highlightType: 'success' | 'error' | 'warning';
}

export const AnalysisCard = ({ title, status, compareText, descText, highlightText, highlightType }: AnalysisCardProps) => {
  
  // 타입에 따른 뱃지 및 하이라이트 색상 설정
  const getHighlightColor = () => {
    switch (highlightType) {
      case 'success': return '#16A34A'; // success-dk
      case 'error': return '#C53030';
      case 'warning': return '#D97706';
      default: return Colors.text1;
    }
  };

  const isLower = status === 'LOWER';

  return (
    <View style={styles.analysisCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.analysisName}>{title}</Text>
        <View style={[styles.badge, isLower ? styles.badgeLower : styles.badgeHigher]}>
          <Text style={[styles.badgeText, isLower ? styles.badgeTextLower : styles.badgeTextHigher]}>
            {status}
          </Text>
        </View>
      </View>
      <Text style={styles.analysisCompare}>{compareText}</Text>
      <Text style={styles.analysisDesc}>
        평균보다 <Text style={[styles.highlight, { color: getHighlightColor() }]}>{highlightText}</Text> {descText}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  analysisCard: {
    backgroundColor: Colors.surface,
    borderRadius: Layout.radiusLg,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
    ...Layout.shadow1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  analysisName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 22,
  },
  badge: {
    height: 24,
    paddingHorizontal: 10,
    borderRadius: Layout.radiusFull,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeLower: { backgroundColor: '#DCFCE7' },
  badgeHigher: { backgroundColor: 'rgba(197,48,48,0.08)' },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badgeTextLower: { color: '#16A34A' },
  badgeTextHigher: { color: '#C53030' },
  analysisCompare: {
    fontSize: 12,
    color: Colors.text2,
    lineHeight: 16,
  },
  analysisDesc: {
    fontSize: 14,
    fontWeight: '400',
    color: Colors.text1,
    lineHeight: 24,
  },
  highlight: {
    fontWeight: '700',
  },
});