import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Colors } from '../../constants';

interface SwitchItemProps {
  headline: string;
  supporting: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  isLast?: boolean;
}

export const SwitchItem = ({ headline, supporting, value, onValueChange, isLast }: SwitchItemProps) => {
  return (
    <View style={[styles.container, isLast && styles.noBorder]}>
      <View style={styles.textContainer}>
        <Text style={styles.headline}>{headline}</Text>
        <Text style={styles.supporting}>{supporting}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.border, true: Colors.primary }}
        thumbColor={Colors.surface}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  textContainer: {
    flex: 1,
  },
  headline: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text1,
    lineHeight: 22,
    marginBottom: 3,
  },
  supporting: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.text2,
    lineHeight: 18,
  },
});