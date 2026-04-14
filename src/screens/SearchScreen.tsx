import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { Colors } from '../constants';

// 분리한 컴포넌트 임포트
import NavHeader from '../components/NavHeader';
import SearchBar from '../components/SearchBar';
import FilterChip from '../components/FilterChip';
import MenuCard from '../components/MenuCard';

export default function SearchScreen() {
  const [selectedBrand, setSelectedBrand] = useState('프랜차이즈');
  const [selectedCategory, setSelectedCategory] = useState('');

  const brands = ['프랜차이즈', '편의점', '믹스커피', '개인카페'];
  const categories = ['커피', '논커피', '스무디/프라푸치노', '티(Tea)', '베이커리/디저트'];

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      
      <View style={styles.container}>
        {/* 네비게이션 헤더 */}
        <NavHeader title="메뉴 검색" onBack={() => console.log('뒤로가기')} />

        <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
          {/* 1. 검색바 */}
          <SearchBar placeholder="메뉴를 검색해보세요" />

          {/* 2. 브랜드 필터 */}
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>브랜드</Text>
              <TouchableOpacity activeOpacity={0.6}>
                <Text style={styles.textBtn}>전체보기</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {brands.map((item) => (
                <FilterChip 
                  key={item} 
                  label={item} 
                  isSelected={selectedBrand === item} 
                  onPress={() => setSelectedBrand(item)} 
                />
              ))}
            </ScrollView>
          </View>

          {/* 3. 카테고리 필터 */}
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>카테고리</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {categories.map((item) => (
                <FilterChip 
                  key={item} 
                  label={item} 
                  isSelected={selectedCategory === item} 
                  onPress={() => setSelectedCategory(item)} 
                />
              ))}
            </ScrollView>
          </View>

          {/* 4. 즐겨찾는 메뉴 */}
          <View style={styles.favSection}>
            <View style={styles.favHeader}>
              <Svg width="20" height="22" viewBox="0 -2 22 22" fill="none">
                <Path d="M11 18.5S1 12 1 5.5A5 5 0 0111 3a5 5 0 0110 2.5C21 12 11 18.5 11 18.5z" fill={Colors.error} />
              </Svg>
              <Text style={styles.favTitle}>즐겨찾는 메뉴</Text>
            </View>

            {/* 카드 목록 */}
            <MenuCard 
              imgEmoji="☕" 
              brand="스타벅스" 
              name="아이스 아메리카노 (Grande)" 
              kcal="15 kcal" 
              initialFav={true} 
            />
            <MenuCard 
              imgEmoji="🍵" 
              brand="메가커피" 
              name="제주 말차 라떼" 
              kcal="280 kcal" 
              initialFav={true} 
            />
            <MenuCard 
              imgEmoji="🍓" 
              brand="투썸플레이스" 
              name="스트로베리 피치 프라페" 
              kcal="320 kcal" 
              initialFav={false} 
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface, // 상태바 영역 배경색을 흰색으로 통일
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bg, // 메인 화면 배경색
  },
  scrollArea: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
    gap: 24,
  },
  filterSection: {
    flexDirection: 'column',
    gap: 12,
  },
  filterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  filterTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 28,
  },
  textBtn: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.primary,
    lineHeight: 20,
  },
  chipRow: {
    gap: 8,
    paddingRight: 24, // 스크롤 끝 여백
  },
  favSection: {
    flexDirection: 'column',
    gap: 16,
  },
  favHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  favTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text1,
    lineHeight: 28,
  },
});