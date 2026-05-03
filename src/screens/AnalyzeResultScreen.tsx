import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
// 🌟 표준 SafeAreaView 사용 (react-native-safe-area-context)
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '../constants'; 

export default function AnalyzeResultScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  // 🌟 이전 화면(Camera)에서 넘겨준 파라미터 수신
  const params = route.params || {};
  const menuData = params.menuData || [];
  const userData = params.user || params; 
  const userId = userData?._id;
  
  // 🌟 [핵심] 사용자가 선택했던 브랜드 정보를 가져옵니다. (첫 번째 선택 브랜드 기준)
  const userSelectedBrand = params.selectedBrands?.[0] || "카페";

  /**
   * 메뉴 저장 함수
   * @param item 선택된 메뉴 객체
   */
  const handleSaveMenu = async (item: any) => {
    try {
      // 🛑 userId가 없으면 저장 불가 (세션 방어)
      if (!userId) {
        console.log("❌ 유저 정보 누락됨. Params:", params);
        Alert.alert("알림", "유저 정보를 불러올 수 없어 저장에 실패했습니다. 다시 시도해주세요.");
        return;
      }

      const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
      const cleanUrl = backendUrl?.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
      
      // 🌟 [중요] 사용자가 선택한 브랜드로 데이터를 보정하여 전송합니다.
      // 서버에서 잘못 매칭(예: 스타벅스)했더라도 여기서 선택한 브랜드로 덮어씌웁니다.
      const finalBrand = (item.brand === "분석됨" || item.brand === "미등록" || !item.brand) 
        ? userSelectedBrand 
        : item.brand;

      const response = await fetch(`${cleanUrl}/api/intake/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId,
          coffeeName: item.coffeeName,
          brand: finalBrand, 
          calories: Number(item.calories) || 0,
          protein: Number(item.protein) || 0,
          caffeine: Number(item.caffeine) || 0,
          emoji: item.emoji || '☕'
        }),
      });

      if (response.ok) {
        Alert.alert("기록 완료", `${item.coffeeName}이(가) 타임라인에 저장되었습니다!`, [
          {
            text: "확인",
            onPress: () => {
              // 🏠 홈 화면으로 이동 시 유저 정보를 유지하여 무한 로딩 방지
              navigation.navigate('MainTabs', { 
                screen: 'Home', 
                params: { user: userData } 
              });
            }
          }
        ]);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '서버 저장 실패');
      }
    } catch (error: any) {
      console.error("저장 에러:", error);
      Alert.alert("오류", "데이터를 저장하는 중 문제가 발생했습니다.");
    }
  };

  /**
   * 리스트 아이템 렌더링
   */
  const renderItem = ({ item, index }: any) => {
    // 🌟 화면 표시 시에도 사용자가 선택한 브랜드를 우선적으로 보여줍니다.
    const displayBrand = (item.brand === "분석됨" || item.brand === "미등록" || !item.brand)
      ? userSelectedBrand
      : item.brand;

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => handleSaveMenu(item)}
        activeOpacity={0.7}
      >
        <View style={styles.emojiContainer}>
          <Text style={styles.emoji}>{item.emoji || '☕'}</Text>
        </View>
        <View style={styles.info}>
          <Text style={styles.brand}>{displayBrand}</Text>
          <Text style={styles.name}>{item.coffeeName}</Text>
          <Text style={styles.meta}>카페인 {item.caffeine}mg · {item.calories}kcal</Text>
        </View>
        <View style={styles.addButton}>
          <Text style={styles.addText}>추가</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>메뉴 선택</Text>
        <Text style={styles.subtitle}>
          {userSelectedBrand}에서 인식된 메뉴입니다.
        </Text>
      </View>

      {/* 결과 리스트 */}
      <FlatList
        data={menuData}
        keyExtractor={(item, index) => `result-${index}-${item.coffeeName}`}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyWrap}>
            <Text style={styles.emptyText}>분석된 결과가 없습니다.</Text>
            <TouchableOpacity 
              style={styles.retryBtn}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.retryText}>다시 촬영하기</Text>
            </TouchableOpacity>
          </View>
        }
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
  closeButtonText: { fontSize: 24, color: '#999' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  subtitle: { fontSize: 14, color: '#666', marginTop: 4 },
  list: { padding: 16, paddingBottom: 40 },
  card: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    borderRadius: 15, 
    padding: 16, 
    marginBottom: 12, 
    alignItems: 'center', 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3
  },
  emojiContainer: { 
    width: 50, 
    height: 50, 
    backgroundColor: '#F1F3F5', 
    borderRadius: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15 
  },
  emoji: { fontSize: 24 },
  info: { flex: 1 },
  brand: { fontSize: 12, color: '#8B2E3A', fontWeight: 'bold' },
  name: { fontSize: 16, color: '#222', fontWeight: '600' },
  meta: { fontSize: 12, color: '#666', marginTop: 2 },
  addButton: { 
    backgroundColor: '#8B2E3A', 
    paddingHorizontal: 15, 
    paddingVertical: 8, 
    borderRadius: 20 
  },
  addText: { color: '#FFF', fontSize: 12, fontWeight: 'bold' },
  emptyWrap: { flex: 1, alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#999', fontSize: 16, marginBottom: 20 },
  retryBtn: { 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    backgroundColor: Colors.border, 
    borderRadius: 8 
  },
  retryText: { color: '#666', fontWeight: '600' }
});