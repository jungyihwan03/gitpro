import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants';

interface SectionHeaderProps {
  title: string;
  icon: React.ReactNode;
}

export const SectionHeader = ({ title, icon }: SectionHeaderProps) => {
  return (
    <View style={styles.container}>
      {icon}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: -8, // gap 24dp에서 헤더↔카드 간격 보정
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 28,
  },
});