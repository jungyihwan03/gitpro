import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors, Layout } from '../constants';

interface AlertCardProps {
  title: string;
  bodyMain: string;
  highlightText: string;
  bodySub: string;
}

export default function AlertCard({ title, bodyMain, highlightText, bodySub }: AlertCardProps) {
  return (
    <View style={styles.alertCard}>
      <View style={styles.alertIconWrap}>
        <Svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <Path d="M8 1.5L14.9 14H1.1L8 1.5z" stroke={Colors.error} strokeWidth="1.3" fill="none" />
          <Path d="M8 6v4" stroke={Colors.error} strokeWidth="1.6" strokeLinecap="round" />
          <Circle cx="8" cy="11.5" r=".9" fill={Colors.error} />
        </Svg>
      </View>
      <View style={styles.alertContent}>
        <Text style={styles.alertTitle}>{title}</Text>
        <Text style={styles.alertBody}>
          {bodyMain} <Text style={styles.alertHighlight}>{highlightText}</Text>{bodySub}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  alertCard: {
    backgroundColor: Colors.alertBg,
    borderColor: Colors.alertBorder,
    borderWidth: 1,
    borderRadius: Layout.radiusLg,
    padding: 24,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
    ...Layout.shadow1,
  },
  alertIconWrap: { width: 32, height: 32, borderRadius: Layout.radiusSm, backgroundColor: 'rgba(255, 68, 68, 0.1)', alignItems: 'center', justifyContent: 'center' },
  alertContent: { flex: 1, flexDirection: 'column', gap: 6 },
  alertTitle: { fontSize: 16, fontWeight: '700', color: Colors.text1, lineHeight: 24 },
  alertBody: { fontSize: 14, color: Colors.text2, lineHeight: 24 },
  alertHighlight: { color: Colors.error, fontWeight: '700' },
});