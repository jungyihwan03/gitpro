import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../../constants';

interface AvatarSectionProps {
  name: string;
  email: string;
  onEditPress?: () => void;
}

export const AvatarSection = ({ name, email, onEditPress }: AvatarSectionProps) => {
  return (
    <View style={styles.avatarSection}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatarCircle}>
          <Svg width="56" height="56" viewBox="0 0 24 24">
            <Path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill={Colors.primary} />
          </Svg>
        </View>
        <TouchableOpacity activeOpacity={0.8} style={styles.avatarEdit} onPress={onEditPress}>
          <Svg width="14" height="14" viewBox="0 0 24 24">
            <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#FFFFFF" />
          </Svg>
        </TouchableOpacity>
      </View>
      <Text style={styles.avatarName}>{name}</Text>
      <Text style={styles.avatarEmail}>{email}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarSection: {
    backgroundColor: Colors.surface,
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    gap: 10,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarCircle: {
    width: 104,
    height: 104,
    borderRadius: Layout.radiusFull,
    backgroundColor: 'rgba(139,46,58,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Layout.shadow2,
  },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: Layout.radiusFull,
    backgroundColor: Colors.primary,
    borderWidth: 2.5,
    borderColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarName: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.text1,
    marginTop: 6,
  },
  avatarEmail: {
    fontSize: 13,
    color: Colors.text2,
  },
});