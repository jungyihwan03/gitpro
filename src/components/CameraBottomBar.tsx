// src/components/CameraBottomBar.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CameraBottomBarProps {
  onGalleryPress?: () => void;
  onShutterPress?: () => void;
  onSwitchCamera?: () => void;
}

export default function CameraBottomBar({ onGalleryPress, onShutterPress, onSwitchCamera }: CameraBottomBarProps) {
  return (
    <View style={styles.bottomBar}>
      <TouchableOpacity style={styles.galleryThumb} activeOpacity={0.8} onPress={onGalleryPress}>
        <Text style={{ fontSize: 22 }}>🖼️</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.shutter} activeOpacity={0.8} onPress={onShutterPress}>
        <View style={styles.shutterInner} />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.flashIndicator} activeOpacity={0.7} onPress={onSwitchCamera}>
        <Ionicons name="camera-reverse-outline" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 32,
    paddingHorizontal: 40,
    paddingBottom: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.3)', // gradient 대신 반투명 배경
  },
  galleryThumb: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'transparent',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shutterInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
  },
  flashIndicator: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});