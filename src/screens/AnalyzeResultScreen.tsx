import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '../constants'; 

export default function AnalyzeResultScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  const params = route.params || {};
  const initialMenuData = params.menuData || [];
  const userData = params.user || params; 
  const userId = userData?._id;
  const userSelectedBrand = params.selectedBrands?.[0] || "카페";

  const [menuData, setMenuData] = useState<any[]>(initialMenuData);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
  const cleanUrl = backendUrl?.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditForm({ ...menuData[index] });
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    setEditForm({});
  };

  const handleSaveEdit = () => {
    if (editingIndex === null) return;
    const updated = [...menuData];
    updated[editingIndex] = { ...updated[editingIndex], ...editForm };
    setMenuData(updated);
    setEditingIndex(null);
    setEditForm({});
  };

  const handleSaveMenu = async (item: any) => {
    try {
      if (!userId) {
        Alert.alert("알림", "유저 정보를 불러올 수 없어 저장에 실패했습니다.");
        return;
      }

      const finalBrand = (item.brand === "분석됨" || item.brand === "미등록" || !item.brand) 
        ? userSelectedBrand 
        : item.brand;

      const response = await fetch(`${cleanUrl}/api/intake/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          coffeeName: item.coffeeName,
          brand: finalBrand, 
          calories: Number(item.calories) || 0,
          protein: Number(item.protein) || 0,
          caffeine: Number(item.caffeine) || 0,
          sugar: Number(item.sugar) || 0,
          emoji: item.emoji || '☕'
        }),
      });

      if (response.ok) {
        navigation.replace('RecordComplete', {
          coffeeName: item.coffeeName,
          calories: Number(item.calories) || 0,
          user: userData,
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || '서버 저장 실패');
      }
    } catch (error: any) {
      console.error("저장 에러:", error);
      Alert.alert("오류", "데이터를 저장하는 중 문제가 발생했습니다.");
    }
  };

  const renderItem = ({ item, index }: any) => {
    const isAi = item.aiGenerated;
    const displayBrand = (item.brand === "분석됨" || item.brand === "미등록" || !item.brand)
      ? userSelectedBrand
      : item.brand;

    const isEditing = editingIndex === index;

    if (isEditing) {
      return (
        <View style={styles.card}>
          <View style={styles.emojiContainer}>
            <Text style={styles.emoji}>➕</Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.brand}>{displayBrand}</Text>
            <Text style={styles.name}>{item.coffeeName}</Text>
            <View style={styles.editRow}>
              <Text style={styles.editLabel}>칼로리</Text>
              <TextInput style={styles.editInput} value={String(editForm.calories || '0')} onChangeText={t => setEditForm({...editForm, calories: t})} keyboardType="numeric" />
              <Text style={styles.editLabel}>카페인</Text>
              <TextInput style={styles.editInput} value={String(editForm.caffeine || '0')} onChangeText={t => setEditForm({...editForm, caffeine: t})} keyboardType="numeric" />
            </View>
            <View style={styles.editRow}>
              <Text style={styles.editLabel}>당</Text>
              <TextInput style={styles.editInput} value={String(editForm.sugar || '0')} onChangeText={t => setEditForm({...editForm, sugar: t})} keyboardType="numeric" />
              <Text style={styles.editLabel}>단백질</Text>
              <TextInput style={styles.editInput} value={String(editForm.protein || '0')} onChangeText={t => setEditForm({...editForm, protein: t})} keyboardType="numeric" />
            </View>
            <View style={styles.editRow}>
              <Text style={styles.editLabel}>포화지방</Text>
              <TextInput style={styles.editInput} value={String(editForm.saturatedFat || '0')} onChangeText={t => setEditForm({...editForm, saturatedFat: t})} keyboardType="decimal-pad" />
              <Text style={styles.editLabel}>나트륨</Text>
              <TextInput style={styles.editInput} value={String(editForm.sodium || '0')} onChangeText={t => setEditForm({...editForm, sodium: t})} keyboardType="numeric" />
            </View>
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelEdit}>
                <Text style={styles.cancelBtnText}>취소</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
                <Text style={styles.saveBtnText}>확인</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    }

    return (
      <TouchableOpacity 
        style={styles.card} 
        onPress={() => navigation.navigate('MenuDetail', { item, user: userData })}
        activeOpacity={0.7}
      >
        <View style={[styles.emojiContainer, isAi && styles.aiEmojiContainer]}>
          <Text style={styles.emoji}>{isAi ? '➕' : (item.emoji || '☕')}</Text>
        </View>
        <View style={styles.info}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{item.coffeeName}</Text>
            {isAi && <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>AI</Text></View>}
          </View>
          <Text style={styles.meta}>카페인 {item.caffeine}mg · {item.calories}kcal · 당 {item.sugar}g</Text>
          {isAi && <Text style={styles.aiHint}>AI 추정치 · 수정하려면 ✎ 탭</Text>}
        </View>
        <View style={styles.actionCol}>
          {isAi ? (
            <TouchableOpacity style={styles.editIconBtn} onPress={() => handleEdit(index)}>
              <Text style={styles.editIconText}>✎</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.addButton} onPress={(e) => { e.stopPropagation(); handleSaveMenu(item); }}>
            <Text style={styles.addText}>추가</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
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
    </View>
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
  actionCol: { alignItems: 'center', gap: 6 },
  editIconBtn: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#FFF8F1', borderWidth: 1, borderColor: '#FFEDD5',
    alignItems: 'center', justifyContent: 'center',
  },
  editIconText: { fontSize: 16, color: '#8B2E3A' },
  aiEmojiContainer: {
    width: 50, height: 50,
    backgroundColor: '#FFF8F1',
    borderRadius: 25, borderWidth: 1.5, borderColor: '#FFEDD5',
    justifyContent: 'center', alignItems: 'center', marginRight: 15,
  },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  aiBadge: {
    backgroundColor: '#FFF8F1', borderRadius: 4,
    paddingHorizontal: 5, paddingVertical: 1,
    borderWidth: 1, borderColor: '#FFEDD5',
  },
  aiBadgeText: { fontSize: 10, fontWeight: '700', color: '#8B2E3A' },
  aiHint: { fontSize: 11, color: '#F59E0B', marginTop: 2 },
  editRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  editLabel: { fontSize: 12, color: '#666', fontWeight: '500', width: 36 },
  editInput: {
    flex: 1, height: 36, borderWidth: 1, borderColor: '#E5E7EB',
    borderRadius: 6, paddingHorizontal: 10, paddingVertical: 0,
    fontSize: 14, color: '#333', textAlign: 'center',
    backgroundColor: '#FFF',
    underlineColorAndroid: 'transparent',
  },
  editActions: { flexDirection: 'row', gap: 8, marginTop: 10, justifyContent: 'flex-end' },
  cancelBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#F3F4F6' },
  cancelBtnText: { fontSize: 12, fontWeight: '600', color: '#666' },
  saveBtn: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, backgroundColor: '#8B2E3A' },
  saveBtnText: { fontSize: 12, fontWeight: '600', color: '#FFF' },
  emptyWrap: { flex: 1, alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#999', fontSize: 16, marginBottom: 20 },
  retryBtn: { 
    paddingVertical: 10, 
    paddingHorizontal: 20, 
    backgroundColor: Colors.border, 
    borderRadius: 8 
  },
  retryText: { color: '#666', fontWeight: '500' }
});