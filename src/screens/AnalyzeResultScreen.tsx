import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

// 🌟 네비게이션 도구 임포트
import { useNavigation } from '@react-navigation/native';

import NavHeader from '../components/NavHeader';
import ResultPhotoPreview from '../components/ResultPhotoPreview';
import SelectableMenuCard from '../components/SelectableMenuCard';
import { Colors } from '../constants';

// 📋 가상의 결과 데이터
const RESULT_MENUS = [
  { id: '1', emoji: '☕', brand: '스타벅스', name: '아이스 아메리카노', meta: 'Tall · 15kcal · 카페인 150mg' },
  { id: '2', emoji: '🥛', brand: '스타벅스', name: '카페 라떼', meta: 'Tall · 180kcal · 카페인 75mg' },
  { id: '3', emoji: '🍮', brand: '스타벅스', name: '카라멜 마키아또', meta: 'Tall · 240kcal · 카페인 75mg' },
  { id: '4', emoji: '🧋', brand: '스타벅스', name: '콜드 브루', meta: 'Tall · 5kcal · 카페인 155mg' },
  { id: '5', emoji: '🍫', brand: '스타벅스', name: '자바 칩 프라푸치노', meta: 'Tall · 430kcal · 카페인 105mg' },
];

export default function AnalyzeResultScreen() {
  const navigation = useNavigation<any>(); // 🌟 네비게이션 장착
  
  // ✨ 하나만 선택하도록 기억하는 상태 (id를 저장합니다)
  const [selectedId, setSelectedId] = useState<string | null>('1'); 

  const handleSubmit = () => {
    if (!selectedId) {
      Alert.alert('알림', '메뉴를 먼저 선택해주세요!');
      return;
    }
    
    // 🌟 [기능 연결] 선택한 메뉴 정보를 가지고 상세 화면으로 이동합니다.
    const selectedMenu = RESULT_MENUS.find(m => m.id === selectedId);
    console.log('기록할 메뉴:', selectedMenu?.name);

    navigation.navigate('MenuDetail', { 
      menuId: selectedId,
      menuName: selectedMenu?.name 
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <NavHeader 
        title="AI 인식 결과" 
        onBack={() => navigation.goBack()} 
      />

      <ScrollView 
        style={styles.scrollArea}
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
      >
        <ResultPhotoPreview />

        {/* 💡 AI 배너 */}
        <View style={styles.aiBanner}>
          <View style={styles.aiIconWrap}>
            <Ionicons name="sparkles" size={16} color="#8B2E3A" />
          </View>
          <View>
            <Text style={styles.aiBannerText}>분석 완료 · 메뉴판에서 5개 메뉴를 찾았어요</Text>
            <Text style={styles.aiBannerSub}>드신 메뉴를 선택해주세요</Text>
          </View>
        </View>

        {/* 📄 본문 콘텐츠 */}
        <View style={styles.content}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.resultTitle}>어떤 메뉴를{'\n'}드셨나요?</Text>
            <Text style={styles.resultSub}>메뉴판에서 인식된 메뉴 목록이에요. 드신 것을 선택해주세요.</Text>
          </View>

          <View>
            <Text style={styles.sectionTitle}>인식된 메뉴</Text>
            <View style={styles.menuList}>
              {RESULT_MENUS.map((menu) => (
                <SelectableMenuCard
                  key={menu.id}
                  emoji={menu.emoji}
                  brand={menu.brand}
                  name={menu.name}
                  meta={menu.meta}
                  isSelected={selectedId === menu.id}
                  onPress={() => setSelectedId(menu.id)} 
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* 🛑 하단 고정 버튼 (Footer) */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btnPrimary} onPress={handleSubmit} activeOpacity={0.8}>
          <Ionicons name="checkmark" size={20} color="#FFFFFF" />
          <Text style={styles.btnPrimaryText}>선택한 메뉴 기록하기</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.btnOutlined} 
          activeOpacity={0.6}
          onPress={() => navigation.navigate('Search')} // 직접 검색으로 이동
        >
          <Text style={styles.btnOutlinedText}>목록에 없어요, 직접 검색할게요</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F6F6' },
  scrollArea: { flex: 1 },
  
  aiBanner: {
    backgroundColor: '#FFF8F1',
    borderBottomWidth: 1,
    borderBottomColor: '#FFEDD5',
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  aiIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(139,46,58,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aiBannerText: { fontSize: 14, fontWeight: '700', color: '#8B2E3A' },
  aiBannerSub: { fontSize: 12, color: '#999999', marginTop: 1 },
  
  content: { padding: 24, gap: 24 },
  headerTextWrap: { gap: 4 },
  resultTitle: { fontSize: 22, fontWeight: '700', color: '#111111', lineHeight: 32, letterSpacing: -0.3 },
  resultSub: { fontSize: 14, color: '#999999', lineHeight: 22 },
  
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111111', marginBottom: 16 },
  menuList: { gap: 12 },
  
  footer: {
    position: 'absolute',
    bottom: 0, left: 0, right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 28, 
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    gap: 10,
    elevation: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
  },
  btnPrimary: {
    width: '100%',
    height: 52,
    borderRadius: 9999,
    backgroundColor: '#8B2E3A',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnPrimaryText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  btnOutlined: {
    width: '100%',
    height: 48,
    borderRadius: 9999,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlinedText: { fontSize: 14, fontWeight: '500', color: '#999999' },
});