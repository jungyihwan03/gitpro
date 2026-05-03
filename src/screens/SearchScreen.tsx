import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, Layout } from '../constants';

import NavHeader from '../components/NavHeader';
import SearchBar from '../components/SearchBar';
import FilterChip from '../components/FilterChip';
import MenuCard from '../components/MenuCard';

// 🌟 커피 데이터 타입 정의 (인덱스 시그니처 추가로 never 에러 완벽 방지)
interface CoffeeItem {
  _id: string;
  coffeeName: string;
  brand: string;
  category: string;
  calories: number;
  protein: number;
  caffeine: number;
  emoji?: string;
  [key: string]: string | number | undefined; // 🌟 동적 키 접근을 위한 타입 정의
}

export default function SearchScreen() {
  const navigation = useNavigation<any>(); 
  const route = useRoute<any>();

  const params = route.params || {};
  const userData = params.user || params; 

  const [loading, setLoading] = useState(true);
  
  // 🌟 핵심 해결: 빈 배열 [] 만 넣으면 never[]로 추론되므로 타입을 명시함
  const [rawListData, setRawListData] = useState<CoffeeItem[]>([]); 
  const [filteredData, setFilteredData] = useState<CoffeeItem[]>([]); 
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [displayNutrient, setDisplayNutrient] = useState('calories');

  const brands = ['스타벅스', '메가커피', '투썸플레이스', '빽다방', '편의점'];
  const categories = ['카페', '편의점', '믹스'];
  const nutrientTabs = [
    { label: '칼로리', value: 'calories', unit: 'kcal' },
    { label: '단백질', value: 'protein', unit: 'g' },
    { label: '카페인', value: 'caffeine', unit: 'mg' },
  ];

  // 서버에서 커피 리스트 불러오기
  const fetchCoffeeList = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
      // URL 끝에 /가 중복되지 않도록 처리
      const cleanUrl = backendUrl?.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
      const response = await fetch(`${cleanUrl}/api/coffee/list`); 
      
      const data = await response.json();
      const list = Array.isArray(data) ? data : [];
      
      setRawListData(list);
      setFilteredData(list);
    } catch (error) {
      console.error("❌ 데이터 로딩 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoffeeList();
  }, []);

  // 검색 및 필터링 로직 (성능을 위해 useMemo를 사용할 수도 있지만 useEffect로도 충분)
  useEffect(() => {
    if (!rawListData) return;

    let result = [...rawListData];

    // 검색어 필터링 (공백 제거 후 비교)
    if (searchQuery) {
      const target = searchQuery.replace(/\s+/g, '').toLowerCase();
      result = result.filter(item => 
        item.coffeeName?.replace(/\s+/g, '').toLowerCase().includes(target)
      );
    }

    // 브랜드 필터링
    if (selectedBrand) {
      result = result.filter(item => item.brand === selectedBrand);
    }

    // 카테고리 필터링
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }

    setFilteredData(result);
  }, [searchQuery, selectedBrand, selectedCategory, rawListData]);

  const toggleBrand = (brand: string) => {
    setSelectedBrand(prev => (prev === brand ? '' : brand));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategory(prev => (prev === category ? '' : category));
  };

  const getMetaText = (item: CoffeeItem) => {
    const activeTab = nutrientTabs.find(t => t.value === displayNutrient);
    const value = item[displayNutrient] || 0;
    return `${value} ${activeTab?.unit || ''}`;
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        {/* 네비게이션 헤더 */}
        <NavHeader title="메뉴 검색" onBack={() => navigation.goBack()} />

        <ScrollView 
          contentContainerStyle={styles.scrollArea} 
          showsVerticalScrollIndicator={false}
        >
          {/* 검색 바 */}
          <SearchBar 
            placeholder="메뉴를 검색해보세요" 
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* 표시 정보 필터 (칼로리, 단백질, 카페인) */}
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>표시 정보</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {nutrientTabs.map((tab) => (
                <FilterChip 
                  key={tab.value} 
                  label={tab.label} 
                  isSelected={displayNutrient === tab.value} 
                  onPress={() => setDisplayNutrient(tab.value)} 
                />
              ))}
            </ScrollView>
          </View>

          {/* 브랜드 필터 */}
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>브랜드</Text>
              <TouchableOpacity onPress={() => setSelectedBrand('')}>
                <Text style={styles.resetBtn}>초기화</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {brands.map((brand) => (
                <FilterChip 
                  key={brand} 
                  label={brand} 
                  isSelected={selectedBrand === brand} 
                  onPress={() => toggleBrand(brand)} 
                />
              ))}
            </ScrollView>
          </View>

          {/* 카테고리 필터 */}
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>카테고리</Text>
              <TouchableOpacity onPress={() => setSelectedCategory('')}>
                <Text style={styles.resetBtn}>초기화</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
              {categories.map((cat) => (
                <FilterChip 
                  key={cat} 
                  label={cat} 
                  isSelected={selectedCategory === cat} 
                  onPress={() => toggleCategory(cat)} 
                />
              ))}
            </ScrollView>
          </View>

          {/* 검색 결과 리스트 */}
          <View style={styles.listSection}>
            <Text style={styles.listTitle}>검색 결과 ({filteredData?.length || 0})</Text>
            {loading ? (
              <ActivityIndicator color={Colors.primary} style={{ marginTop: 40 }} />
            ) : (
              filteredData && filteredData.length > 0 ? (
                filteredData.map((item) => (
                  <MenuCard 
                    key={item._id}
                    imgEmoji={item.emoji || "☕"} 
                    brand={item.brand} 
                    name={item.coffeeName} 
                    kcal={getMetaText(item)} 
                    onPress={() => {
                      // 상세 페이지 이동 시 유저 정보를 안전하게 전달
                      navigation.navigate('MenuDetail', { item, user: userData });
                    }}
                  />
                ))
              ) : (
                <View style={styles.emptyWrap}>
                  <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
                </View>
              )
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.surface },
  container: { flex: 1, backgroundColor: Colors.bg },
  scrollArea: { 
    flexGrow: 1, 
    paddingHorizontal: 24, 
    paddingTop: 24, 
    paddingBottom: 80, 
    gap: 28 
  },
  filterSection: { gap: 12 },
  filterHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  filterTitle: { fontSize: 16, fontWeight: '700', color: Colors.text1 },
  resetBtn: { fontSize: 12, color: Colors.primary, fontWeight: '600' },
  chipRow: { flexDirection: 'row', gap: 8 },
  listSection: { gap: 16 },
  listTitle: { fontSize: 18, fontWeight: '700', color: Colors.text1 },
  emptyWrap: { alignItems: 'center', marginTop: 60, paddingBottom: 40 },
  emptyText: { color: Colors.text3, fontSize: 14 },
});