import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Colors, Layout } from '../constants';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import NavHeader from '../components/NavHeader';

export default function MyCustomCafesScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const userData = route.params?.user || {};

  const [cafes, setCafes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
  const cleanUrl = backendUrl?.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

  const fetchCafes = useCallback(() => {
    async function load() {
      if (!userData._id) return;
      setLoading(true);
      try {
        const res = await fetch(`${cleanUrl}/api/user-cafe/list/${userData._id}`);
        const data = await res.json();
        setCafes(Array.isArray(data) ? data : []);
      } catch (e) {
        console.warn('fetchCafes fail', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [userData._id, cleanUrl]);

  useFocusEffect(fetchCafes);

  const handleDelete = (id: string, name: string) => {
    Alert.alert('삭제 확인', `"${name}"을(를) 삭제하시겠습니까?`, [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await fetch(`${cleanUrl}/api/user-cafe/delete/${id}`, { method: 'DELETE' });
            setCafes(prev => prev.filter(c => c._id !== id));
          } catch (e) {
            Alert.alert('오류', '삭제 중 문제가 발생했습니다.');
          }
        },
      },
    ]);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) {
      Alert.alert('알림', '카페 이름을 입력해주세요.');
      return;
    }
    try {
      const res = await fetch(`${cleanUrl}/api/user-cafe/update/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName.trim(), address: editAddress.trim() }),
      });
      const result = await res.json();
      if (result.success) {
        setCafes(prev => prev.map(c => c._id === id ? result.item : c));
        setEditingId(null);
      }
    } catch (e) {
      Alert.alert('오류', '수정 중 문제가 발생했습니다.');
    }
  };

  return (
    <View style={styles.container}>
      <NavHeader title="내가 추가한 카페" onBack={() => navigation.goBack()} />
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>
      ) : cafes.length === 0 ? (
        <View style={styles.emptyWrap}>
          <Text style={styles.emptyText}>추가한 카페가 없습니다.</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
          {cafes.map((cafe: any) => (
            <View key={cafe._id} style={styles.card}>
              {editingId === cafe._id ? (
                <>
                  <TextInput
                    style={styles.editInput}
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="카페 이름"
                    placeholderTextColor={Colors.text3}
                  />
                  <TextInput
                    style={styles.editInput}
                    value={editAddress}
                    onChangeText={setEditAddress}
                    placeholder="위치 (주소)"
                    placeholderTextColor={Colors.text3}
                  />
                  <View style={styles.editBtnRow}>
                    <TouchableOpacity style={styles.editCancelBtn} onPress={() => setEditingId(null)} activeOpacity={0.7}>
                      <Text style={styles.editCancelText}>취소</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editSaveBtn} onPress={() => handleSaveEdit(cafe._id)} activeOpacity={0.7}>
                      <Text style={styles.editSaveText}>저장</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => navigation.navigate('SimpleCafeDetail', {
                      cafe: { name: cafe.name, address: cafe.address, _id: cafe._id, isCustom: true },
                      user: userData,
                    })}
                  >
                    <Text style={styles.cafeName}>{cafe.name}</Text>
                    {cafe.address ? <Text style={styles.cafeAddress}>{cafe.address}</Text> : null}
                  </TouchableOpacity>
                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() => {
                        setEditingId(cafe._id);
                        setEditName(cafe.name);
                        setEditAddress(cafe.address || '');
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.editBtnText}>수정</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => handleDelete(cafe._id, cafe.name)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.deleteBtnText}>삭제</Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  loadingWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontSize: 14, color: Colors.text3 },
  scrollArea: { padding: 24, gap: 12, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.surface, borderRadius: Layout.radiusLg, padding: 20,
    ...Layout.shadow1, gap: 10,
  },
  cafeName: { fontSize: 16, fontWeight: '700', color: Colors.text1 },
  cafeAddress: { fontSize: 13, color: Colors.text2, marginTop: 2 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  editBtn: { height: 36, paddingHorizontal: 16, borderRadius: Layout.radiusMd, borderWidth: 1, borderColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  editBtnText: { fontSize: 13, fontWeight: '600', color: Colors.text2 },
  deleteBtn: { height: 36, paddingHorizontal: 16, borderRadius: Layout.radiusMd, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' },
  deleteBtnText: { fontSize: 13, fontWeight: '600', color: Colors.error },
  editInput: { height: 44, borderWidth: 1, borderColor: Colors.border, borderRadius: Layout.radiusMd, paddingHorizontal: 12, fontSize: 14, color: Colors.text1 },
  editBtnRow: { flexDirection: 'row', gap: 8 },
  editCancelBtn: { flex: 1, height: 40, borderRadius: Layout.radiusMd, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: Colors.border },
  editCancelText: { fontSize: 14, fontWeight: '600', color: Colors.text2 },
  editSaveBtn: { flex: 1, height: 40, borderRadius: Layout.radiusMd, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary },
  editSaveText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
});
