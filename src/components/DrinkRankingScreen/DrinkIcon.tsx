import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';

interface DrinkIconProps {
  type: string;
}

export default function DrinkIcon({ type }: DrinkIconProps) {
  switch (type) {
    case 'latte': 
      return <View style={[styles.icon, { backgroundColor: '#FFF3E0' }]}><Text style={styles.emoji}>☕</Text></View>;
    case 'espresso': 
      return <View style={[styles.icon, { backgroundColor: '#F5F0EE' }]}><Text style={styles.emoji}>🍵</Text></View>;
    case 'greentea': 
      return <View style={[styles.icon, { backgroundColor: '#E8F5E9' }]}><Text style={styles.emoji}>🍃</Text></View>;
    case 'americano': 
      return (
        <View style={[styles.icon, { backgroundColor: '#FFF8E1' }]}>
          <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <Rect x="4" y="8" width="14" height="11" rx="2" stroke="#8B2E3A" strokeWidth="1.6"/>
            <Path d="M18 10h1a3 3 0 010 6h-1" stroke="#8B2E3A" strokeWidth="1.6" strokeLinecap="round"/>
            <Path d="M8 5v3M12 5v3" stroke="#8B2E3A" strokeWidth="1.4" strokeLinecap="round"/>
          </Svg>
        </View>
      );
    case 'cappuccino': 
      return (
        <View style={[styles.icon, { backgroundColor: '#F3E5F5' }]}>
          <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <Path d="M5 9h14l-1.5 8A2 2 0 0115.5 19h-7a2 2 0 01-1.98-1.7L5 9z" stroke="#7B3F9E" strokeWidth="1.6"/>
            <Path d="M8 9c0-2 1.5-3 4-3s4 1 4 3" stroke="#7B3F9E" strokeWidth="1.4" strokeLinecap="round"/>
          </Svg>
        </View>
      );
    case 'vanilla': 
      return (
        <View style={[styles.icon, { backgroundColor: '#FFF3E0' }]}>
          <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <Rect x="5" y="8" width="14" height="11" rx="2" stroke="#E65100" strokeWidth="1.6"/>
            <Path d="M8 8V6a4 4 0 018 0v2" stroke="#E65100" strokeWidth="1.4" strokeLinecap="round"/>
            <Path d="M9 13c1-1.5 5-1.5 6 0" stroke="#E65100" strokeWidth="1.2" strokeLinecap="round"/>
          </Svg>
        </View>
      );
    case 'coldbrew': 
      return (
        <View style={[styles.icon, { backgroundColor: '#E3F2FD' }]}>
          <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <Path d="M12 4a4 4 0 014 4c0 2-1 3-1 5s1 3 1 5H8c0-2 1-3 1-5s-1-3-1-5a4 4 0 014-4z" stroke="#1565C0" strokeWidth="1.6"/>
            <Path d="M9 20h6" stroke="#1565C0" strokeWidth="1.4" strokeLinecap="round"/>
          </Svg>
        </View>
      );
    case 'icetea': 
      return (
        <View style={[styles.icon, { backgroundColor: '#FCE4EC' }]}>
          <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <Rect x="6" y="7" width="12" height="13" rx="3" stroke="#C62828" strokeWidth="1.6"/>
            <Path d="M9 7V5M15 7V5" stroke="#C62828" strokeWidth="1.4" strokeLinecap="round"/>
            <Path d="M9 12h6M9 15h4" stroke="#C62828" strokeWidth="1.2" strokeLinecap="round"/>
          </Svg>
        </View>
      );
    case 'hongtea': 
      return (
        <View style={[styles.icon, { backgroundColor: '#E8F5E9' }]}>
          <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <Path d="M18 8h1a4 4 0 010 8h-1M4 8h14v9a4 4 0 01-4 4H8a4 4 0 01-4-4V8z" stroke="#2E7D32" strokeWidth="1.6" strokeLinecap="round"/>
            <Path d="M8 4c0 2 2 2 2 4M12 4c0 2 2 2 2 4" stroke="#2E7D32" strokeWidth="1.2" strokeLinecap="round"/>
          </Svg>
        </View>
      );
    case 'energy': 
      return (
        <View style={[styles.icon, { backgroundColor: '#EDE7F6' }]}>
          <Svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <Path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#6A1B9A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </Svg>
        </View>
      );
    default:
      return null;
  }
}

const styles = StyleSheet.create({
  icon: { width: 52, height: 52, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 24 },
});