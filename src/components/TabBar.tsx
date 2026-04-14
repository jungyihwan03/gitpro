import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants';

interface TabBarProps {
  tabs: string[];
  activeTab: string;
  onTabPress: (tab: string) => void;
}

export default function TabBar({ tabs, activeTab, onTabPress }: TabBarProps) {
  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            style={[styles.tabItem, isActive && styles.tabItemActive]}
            onPress={() => onTabPress(tab)}
            activeOpacity={0.6}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginTop: 8,
  },
  tabItem: {
    flex: 1,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text2,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
});