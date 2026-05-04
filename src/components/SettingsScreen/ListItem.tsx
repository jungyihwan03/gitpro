import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Colors, Layout } from '../../constants';

interface ListItemProps {
  headline: string;
  supporting?: string;
  leadingIcon?: React.ReactNode;
  trailingElement?: React.ReactNode;
  isLast?: boolean;
  onPress?: () => void;
  disabled?: boolean;
}

export const ListItem = ({
  headline,
  supporting,
  leadingIcon,
  trailingElement,
  isLast = false,
  onPress,
  disabled = false,
}: ListItemProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      disabled={disabled}
      style={[styles.container, isLast && styles.noBorder]}
    >
      {leadingIcon && <View style={styles.leadingContainer}>{leadingIcon}</View>}
      
      <View style={styles.textContainer}>
        <Text style={styles.headline}>{headline}</Text>
        {supporting && <Text style={styles.supporting}>{supporting}</Text>}
      </View>

      {trailingElement && <View style={styles.trailingContainer}>{trailingElement}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  leadingContainer: {
    width: 40,
    height: 40,
    borderRadius: Layout.radiusSm, // 8dp
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  headline: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text1,
    lineHeight: 22,
  },
  supporting: {
    fontSize: 12,
    fontWeight: '400',
    color: Colors.text2,
    lineHeight: 18,
    marginTop: 2,
  },
  trailingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});