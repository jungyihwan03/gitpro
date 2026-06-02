import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants';

export interface MenuItem {
  id: string;
  name: string;
  kcal: string;
  price?: string;
  thumbColor?: string;
  iconFill?: string;
}

interface MenuSection {
  category: string;
  items: MenuItem[];
}

interface CafeMenuListProps {
  selectedId: string | null;
  onSelect: (id: string) => void;
  menuData?: MenuSection[];
}

const DEFAULT_MENU_DATA: MenuSection[] = [
  {
    category: '에스프레소',
    items: [
      { id: '1', name: '카페 아메리카노', kcal: '10 kcal', price: '4,500원', thumbColor: '#5c3317', iconFill: '#fff' },
      { id: '2', name: '카페 라떼', kcal: '150 kcal', price: '5,000원', thumbColor: '#5c3317', iconFill: '#fff' },
      { id: '3', name: '바닐라 라떼', kcal: '210 kcal', price: '5,500원', thumbColor: '#5c3317', iconFill: '#fff' },
    ]
  },
  {
    category: '프라페 / 블렌디드',
    items: [
      { id: '4', name: '자바 칩 프라페', kcal: '480 kcal', price: '6,500원', thumbColor: '#BAE6FD', iconFill: '#0369A1' },
      { id: '5', name: '민트 초코 블렌디드', kcal: '320 kcal', price: '6,300원', thumbColor: '#BAE6FD', iconFill: '#0369A1' },
    ]
  },
  {
    category: '티 / 리프레셔',
    items: [
      { id: '6', name: '유자 민트 티', kcal: '50 kcal', price: '5,500원', thumbColor: '#BBF7D0', iconFill: '#15803D' },
      { id: '7', name: '히비스커스 티', kcal: '15 kcal', price: '5,000원', thumbColor: '#BBF7D0', iconFill: '#15803D' },
    ]
  }
];

export default function CafeMenuList({ selectedId, onSelect, menuData }: CafeMenuListProps) {
  const data = menuData ?? DEFAULT_MENU_DATA;

  return (
    <View style={styles.container}>
      {data.map((section, index) => (
        <View key={index} style={styles.menuCard}>
          <Text style={styles.sectionLabel}>{section.category}</Text>
          
          <View style={styles.menuList}>
            {section.items.map((item, itemIndex) => {
              const isSelected = selectedId === item.id;

              return (
                <TouchableOpacity 
                  key={item.id} 
                  activeOpacity={0.7} 
                  onPress={() => onSelect(item.id)}
                  style={[
                    styles.menuItem, 
                    itemIndex === section.items.length - 1 && { borderBottomWidth: 0 },
                    isSelected && styles.menuItemSelected
                  ]}
                >
                  <View style={[styles.menuThumb, { backgroundColor: item.thumbColor || '#5c3317' }]}>
                    <Svg width="26" height="26" viewBox="0 0 24 24" style={{ opacity: 0.8 }}>
                      <Path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3z" fill={item.iconFill || '#fff'}/>
                    </Svg>
                  </View>

                  <View style={styles.menuText}>
                    <Text style={[styles.menuName, isSelected && { color: Colors.primary }]}>
                      {item.name}
                    </Text>
                    <Text style={styles.menuKcal}>{item.kcal}</Text>
                    {item.price ? <Text style={styles.menuPrice}>{item.price}</Text> : null}
                  </View>

                  <View style={[
                    styles.menuAddBtn, 
                    isSelected && { backgroundColor: Colors.primary }
                  ]}>
                    <Svg width="18" height="18" viewBox="0 0 24 24">
                      <Path 
                        d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" 
                        fill={isSelected ? "#FFFFFF" : Colors.primary}
                      />
                    </Svg>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 24,
  },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 28,
    marginBottom: 16,
  },
  menuList: {
    flexDirection: 'column',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderRadius: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuItemSelected: {
    backgroundColor: 'rgba(139,46,58,0.05)',
    borderBottomColor: 'transparent',
  },
  menuThumb: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuText: {
    flex: 1,
    gap: 3,
  },
  menuName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text1,
    lineHeight: 22,
  },
  menuKcal: {
    fontSize: 12,
    color: Colors.text2,
    lineHeight: 18,
  },
  menuPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 20,
  },
  menuAddBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(139,46,58,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
