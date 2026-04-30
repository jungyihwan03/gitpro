import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Image, SafeAreaView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { BACKEND_API_URL } from '../constants';

export default function AnalyzeResult() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  // 🌟 route.params가 undefined일 경우를 대비해 기본값 설정
  // 이를 통해 "Cannot read property 'menuData' of undefined" 에러를 방지합니다.
  const { menuData = [], analyzedImage = null } = route.params || {};

  // 메뉴 선택 시 DB에 저장하는 함수
  const handleSaveMenu = async (item: any) => {
    try {
      // "카페인 150mg" 문자열에서 숫자만 추출 (정규식 사용)
      const caffeineMatch = item.meta.match(/\d+/);
      const caffeineValue = caffeineMatch ? parseInt(caffeineMatch[0]) : 0;

      const response = await fetch(`${BACKEND_API_URL}/coffee/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coffeeName: item.name,
          caffeine: caffeineValue,
          brand: item.brand,
        }),
      });

      if (response.ok) {
        Alert.alert("저장 완료", `${item.name}이(가) 기록되었습니다!`);
        navigation.navigate('Home'); // 저장 후 홈으로 이동
      } else {
        throw new Error('저장 실패');
      }
    } catch (error) {
      console.error("저장 에러:", error);
      Alert.alert("오류", "데이터베이스 저장에 실패했습니다.");
    }
  };

  // 분석된 데이터가 없을 경우 보여줄 화면
  if (!menuData || menuData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>분석된 메뉴가 없습니다.</Text>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>다시 촬영하기</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => handleSaveMenu(item)}>
      <View style={styles.emojiContainer}>
        <Text style={styles.emoji}>{item.emoji || '☕'}</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.brand}>{item.brand}</Text>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.meta}>{item.meta}</Text>
      </View>
      <View style={styles.addButton}>
        <Text style={styles.addText}>추가</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>분석 결과 ({menuData.length}개)</Text>
        <Text style={styles.subtitle}>오늘 마신 음료를 선택하세요</Text>
      </View>

      <FlatList
        data={menuData}
        keyExtractor={(item, index) => item.id || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    padding: 20, 
    backgroundColor: '#FFF', 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE',
    paddingTop: 10 
  },
  closeButton: { alignSelf: 'flex-end', padding: 5 },
  closeButtonText: { fontSize: 20, color: '#999' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  list: { padding: 16 },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    // 그림자 설정
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emojiContainer: {
    width: 50,
    height: 50,
    backgroundColor: '#F1F3F5',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  emoji: { fontSize: 24 },
  info: { flex: 1 },
  brand: { fontSize: 12, color: '#8B2E3A', fontWeight: 'bold' },
  name: { fontSize: 16, color: '#222', fontWeight: '600', marginVertical: 2 },
  meta: { fontSize: 12, color: '#666' },
  addButton: { 
    backgroundColor: '#8B2E3A', 
    paddingHorizontal: 15, 
    paddingVertical: 8, 
    borderRadius: 20 
  },
  addText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  // 빈 화면 스타일
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' },
  emptyText: { fontSize: 16, color: '#666', marginBottom: 20 },
  backButton: { backgroundColor: '#333', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  backButtonText: { color: '#FFF', fontWeight: 'bold' }
});