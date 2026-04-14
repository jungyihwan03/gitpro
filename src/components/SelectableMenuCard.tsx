import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  emoji: string;
  brand: string;
  name: string;
  meta: string;
  isSelected: boolean;
  onPress: () => void;
}

export default function SelectableMenuCard({ emoji, brand, name, meta, isSelected, onPress }: Props) {
  return (
    <TouchableOpacity 
      activeOpacity={0.7} 
      style={[styles.card, isSelected && styles.cardSelected]} 
      onPress={onPress}
    >
      <View style={styles.imageWrap}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>

      <View style={styles.info}>
        <Text style={styles.brand}>{brand}</Text>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.meta}>{meta}</Text>
      </View>

      <View style={[styles.checkCircle, isSelected && styles.checkCircleSelected]}>
        {isSelected && <Ionicons name="checkmark" size={16} color="#FFFFFF" />}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: 'transparent',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  cardSelected: {
    borderColor: '#8B2E3A',
  },
  imageWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFF4EC',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 24 },
  info: { flex: 1, gap: 3 },
  brand: { fontSize: 12, color: '#999999' },
  name: { fontSize: 14, fontWeight: '700', color: '#111111' },
  meta: { fontSize: 12, color: '#999999', marginTop: 2 },
  
  checkCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleSelected: {
    backgroundColor: '#8B2E3A',
    borderColor: '#8B2E3A',
  },
});