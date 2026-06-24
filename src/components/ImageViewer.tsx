import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Modal, StatusBar } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants';

interface ImageViewerProps {
  visible: boolean;
  uri: string;
  onClose: () => void;
}

export const ImageViewer = ({ visible, uri, onClose }: ImageViewerProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <StatusBar barStyle="light-content" />
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Svg width="28" height="28" viewBox="0 0 24 24">
            <Path d="M18 6L6 18M6 6l12 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
          </Svg>
        </TouchableOpacity>
        <Image source={{ uri }} style={styles.image} resizeMode="contain" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  closeBtn: { position: 'absolute', top: 50, right: 16, zIndex: 10, width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  image: { width: '96%', height: '96%', borderWidth: 2, borderColor: '#000' },
});
