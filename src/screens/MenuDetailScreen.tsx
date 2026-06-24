import React, { useState, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../constants';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';

import NavHeader from '../components/NavHeader'; 
import { PrimaryButton } from '../components/PrimaryButton';
import CalorieCard from '../components/CalorieCard';             
import NutritionListCard from '../components/NutritionListCard';

export default function MenuDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  
  const { item, user, cafe, mode, fromTimeline } = route.params || {};
  const isCreateMode = mode === 'create';
  const canEdit = isCreateMode || fromTimeline || item?.aiGenerated === true;

  const [isFav, setIsFav] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(isCreateMode);

  const [editBrand, setEditBrand] = useState(isCreateMode ? (cafe?.name || '') : (item?.brand || ''));
  const [editCoffeeName, setEditCoffeeName] = useState(isCreateMode ? '' : (item?.coffeeName || ''));
  const [editEmoji, setEditEmoji] = useState(item?.emoji || '☕');
  const [editCategory, setEditCategory] = useState(item?.category || '카페');

  const [editNuts, setEditNuts] = useState([
    String(item?.calories || 0),
    String(item?.sugar || 0),
    String(item?.protein || 0),
    String(item?.caffeine || 0),
    String(item?.saturatedFat || 0),
    String(item?.sodium || 0),
  ]);

  const [isAiLoading, setIsAiLoading] = useState(false);

  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_API_URL;
  const cleanUrl = backendUrl?.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;

  const checkFav = useCallback(() => {
    if (isCreateMode || !user?._id) return;
    if (fromTimeline) {
      if (!item?.coffeeName) return;
      fetch(`${cleanUrl}/api/coffee/list`)
        .then(r => r.json())
        .then(data => {
          const list = Array.isArray(data) ? data : (data?.data || []);
          const match = list.find((c: any) =>
            c.coffeeName === item.coffeeName && c.brand === item.brand
          );
          if (match?._id) {
            fetch(`${cleanUrl}/api/favorite/check/${user._id}/menu/${match._id}`)
              .then(r => r.json())
              .then(d => setIsFav(d.favorited))
              .catch(() => {});
          }
        })
        .catch(() => {});
      return;
    }
    if (!item?._id) return;
    fetch(`${cleanUrl}/api/favorite/check/${user._id}/menu/${item._id}`)
      .then(r => r.json())
      .then(data => setIsFav(data.favorited))
      .catch(e => console.warn('checkFav fail', e));
  }, [user?._id, item?._id, item?.coffeeName, item?.brand, cleanUrl, isCreateMode, fromTimeline]);

  useFocusEffect(checkFav);

  const doToggleFav = (targetId: string) => {
    if (!user?._id) return;
    fetch(`${cleanUrl}/api/favorite/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user._id,
        targetType: 'menu',
        targetId,
        name: editCoffeeName || '',
        brand: editBrand || '',
        emoji: editEmoji || '☕',
        calories: Number(editNuts[0]) || 0,
        caffeine: Number(editNuts[3]) || 0,
      }),
    }).then(r => r.json()).then(data => setIsFav(data.favorited)).catch(() => {});
  };

  const toggleFav = () => {
    if (!user?._id) return;
    if (fromTimeline) {
      if (!item?.coffeeName) return;
      fetch(`${cleanUrl}/api/coffee/list`)
        .then(r => r.json())
        .then(data => {
          const list = Array.isArray(data) ? data : (data?.data || []);
          const match = list.find((c: any) =>
            c.coffeeName === item.coffeeName && c.brand === item.brand
          );
          if (match?._id) doToggleFav(match._id);
        })
        .catch(() => {});
      return;
    }
    if (!item?._id) return;
    doToggleFav(item._id);
  };

  const nutritionData = [
    { label: '칼로리 (kcal)', value: editNuts[0], isHighlight: true },
    { label: '당류 (g)', value: editNuts[1] },
    { label: '단백질 (g)', value: editNuts[2] },
    { label: '카페인 (mg)', value: editNuts[3] },
    { label: '포화지방 (g)', value: editNuts[4] },
    { label: '나트륨 (mg)', value: editNuts[5] },
  ];

  const handleNutChange = (index: number, value: string) => {
    const next = [...editNuts];
    next[index] = value;
    setEditNuts(next);
  };

  const handleAiHelp = async () => {
    if (!editCoffeeName.trim() || isAiLoading) return;
    setIsAiLoading(true);
    try {
      const res = await fetch(`${cleanUrl}/api/analyze-by-name`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coffeeName: editCoffeeName.trim(), brand: editBrand || '' }),
      });
      if (!res.ok) throw new Error('AI 분석 실패');
      const data = await res.json();
      setEditNuts([
        String(data.calories || 0),
        String(data.sugar || 0),
        String(data.protein || 0),
        String(data.caffeine || 0),
        String(data.saturatedFat || 0),
        String(data.sodium || 0),
      ]);
      if (data.category) setEditCategory(data.category);
    } catch (e) {
      Alert.alert('오류', 'AI 분석에 실패했습니다.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSaveMenu = async () => {
    if (isSubmitting) return;
    const isAiItem = item?.aiGenerated === true;
    setIsSubmitting(true);
    try {
      if (isCreateMode) {
        // create mode: 섭취 기록만 저장 (커피 DB 등록 안 함)
        const userId = user?._id;
        if (userId) {
          const res = await fetch(`${cleanUrl}/api/intake/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              coffeeName: editCoffeeName,
              brand: editBrand,
              calories: Number(editNuts[0]) || 0,
              caffeine: Number(editNuts[3]) || 0,
              protein: Number(editNuts[2]) || 0,
              sugar: Number(editNuts[1]) || 0,
              emoji: editEmoji || '☕',
              aiGenerated: item?.aiGenerated || false,
              location: cafe?.lat || cafe?.lng ? { lat: cafe.lat, lng: cafe.lng } : undefined,
            }),
          });
          if (!res.ok) { Alert.alert('오류', '저장에 실패했습니다.'); return; }
        }
        navigation.navigate('RecordComplete', {
          coffeeName: editCoffeeName || '메뉴',
          calories: Number(editNuts[0]) || 0,
          user,
        });
        return;
      }
      if (fromTimeline) {
        // 타임라인 항목 수정: 기존 섭취 기록 업데이트 (즐겨찾기 하지 않음)
        const res = await fetch(`${cleanUrl}/api/intake/update/${item._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            coffeeName: editCoffeeName,
            brand: editBrand,
            calories: Number(editNuts[0]) || 0,
            caffeine: Number(editNuts[3]) || 0,
            protein: Number(editNuts[2]) || 0,
            sugar: Number(editNuts[1]) || 0,
            emoji: editEmoji || '☕',
          }),
        });
        if (res.ok) {
          Alert.alert("수정 완료", "섭취 기록이 수정되었습니다.");
          navigation.goBack();
        } else {
          Alert.alert("오류", "수정 중 문제가 발생했습니다.");
        }
        return;
      }
      // AI 추정 메뉴 수정 → 개인 섭취 기록만 저장 (Coffee DB 수정 안 함)
      if (isAiItem) {
        const userId = user?._id;
        if (userId) {
          const res = await fetch(`${cleanUrl}/api/intake/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId,
              coffeeName: editCoffeeName,
              brand: editBrand,
              calories: Number(editNuts[0]) || 0,
              caffeine: Number(editNuts[3]) || 0,
              protein: Number(editNuts[2]) || 0,
              sugar: Number(editNuts[1]) || 0,
              emoji: editEmoji || '☕',
              aiGenerated: true,
            }),
          });
          if (!res.ok) { Alert.alert('오류', '저장에 실패했습니다.'); return; }
        }
        navigation.navigate('RecordComplete', {
          coffeeName: editCoffeeName || '메뉴',
          calories: Number(editNuts[0]) || 0,
          user,
        });
        return;
      }
      // 일반 메뉴 → 사용자가 수정한 값으로 업데이트
      await fetch(`${cleanUrl}/api/coffee/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coffeeName: editCoffeeName,
          brand: editBrand,
          category: editCategory,
          subCategory: item?.subCategory || '',
          calories: Number(editNuts[0]) || 0,
          protein: Number(editNuts[2]) || 0,
          sugar: Number(editNuts[1]) || 0,
          saturatedFat: Number(editNuts[4]) || 0,
          sodium: Number(editNuts[5]) || 0,
          caffeine: Number(editNuts[3]) || 0,
          emoji: editEmoji || '☕',
          aiGenerated: false,
        }),
      });
      setIsEditing(false);
      Alert.alert("저장 완료", "메뉴가 수정되었습니다.");
    } catch (error) {
      Alert.alert("오류", "저장 중 문제가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🌟 섭취 기록 저장 함수
  const handleSaveIntake = async () => {
    if (isSubmitting) return;
    const userId = user?._id;
    if (!userId) {
      Alert.alert("알림", "로그인 정보가 유효하지 않습니다. 다시 로그인해주세요.");
      return;
    }
    setIsSubmitting(true);
    try {
      if (fromTimeline) {
        // 타임라인 항목: 기존 기록 업데이트 (섭취 기록 새로 만들지 않음)
        const res = await fetch(`${cleanUrl}/api/intake/update/${item._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            coffeeName: editCoffeeName,
            brand: editBrand,
            calories: Number(editNuts[0]) || 0,
            caffeine: Number(editNuts[3]) || 0,
            protein: Number(editNuts[2]) || 0,
            sugar: Number(editNuts[1]) || 0,
            emoji: editEmoji || '☕',
          }),
        });
        if (res.ok) {
          Alert.alert("수정 완료", "섭취 기록이 수정되었습니다.");
          navigation.goBack();
        }
        return;
      }
      const response = await fetch(`${cleanUrl}/api/intake/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          coffeeName: editCoffeeName,
          brand: editBrand,
          calories: Number(editNuts[0]) || 0,
          caffeine: Number(editNuts[3]) || 0,
          protein: Number(editNuts[2]) || 0,
          sugar: Number(editNuts[1]) || 0,
          emoji: editEmoji || '☕',
          aiGenerated: item?.aiGenerated || false,
          location: cafe?.lat || cafe?.lng ? { lat: cafe.lat, lng: cafe.lng } : undefined,
        }),
      });
      if (response.ok) {
        navigation.navigate('RecordComplete', {
          coffeeName: editCoffeeName || '메뉴',
          calories: Number(editNuts[0]) || 0,
          user,
        });
      }
    } catch (error) {
      Alert.alert("오류", "서버와 통신할 수 없습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteIntake = async () => {
    if (!fromTimeline || !item?._id) return;
    try {
      const res = await fetch(`${cleanUrl}/api/intake/delete/${item._id}`, { method: 'DELETE' });
      if (!res.ok) { Alert.alert('오류', '서버 오류로 삭제되지 않았습니다.'); return; }
      navigation.navigate('RecordComplete', {
        coffeeName: editCoffeeName || '메뉴',
        isDelete: true,
        user,
      });
    } catch (e) {
      Alert.alert('오류', '삭제 중 문제가 발생했습니다.');
    }
  };

  const handleOpenMap = () => {
    const lat = item?.location?.lat;
    const lng = item?.location?.lng;
    if (lat && lng) {
      Linking.openURL(`https://maps.google.com/?q=${lat},${lng}`);
    }
  };

  const FavButton = (
    <TouchableOpacity activeOpacity={0.6} style={styles.favBtn} onPress={toggleFav}>
      <Svg width="24" height="24" viewBox="0 -2 24 24" fill="none">
        {isFav ? (
          <Path d="M12 21S2 14 2 7.5A5.5 5.5 0 0112 4a5.5 5.5 0 0110 3.5C22 14 12 21 12 21z" fill={Colors.error} />
        ) : (
          <Path d="M12 21S2 14 2 7.5A5.5 5.5 0 0112 4a5.5 5.5 0 0110 3.5C22 14 12 21 12 21z" stroke={Colors.text3} strokeWidth="1.8" fill="none" />
        )}
      </Svg>
    </TouchableOpacity>
  );

  const hasLocation = item?.location?.lat && item?.location?.lng;
  const LocationBtn = hasLocation ? (
    <TouchableOpacity activeOpacity={0.6} style={{ width: 36, height: 48, alignItems: 'center', justifyContent: 'center' }} onPress={handleOpenMap}>
      <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <Path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill={Colors.text3} />
      </Svg>
    </TouchableOpacity>
  ) : null;

  const headerRight = isCreateMode ? undefined : (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {FavButton}
      {LocationBtn}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.headerArea}>
        <NavHeader 
          title={isCreateMode ? "직접 입력" : "메뉴 상세 정보"} 
          onBack={() => navigation.goBack()} 
          rightAction={headerRight}
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {/* 상단 이미지 영역 */}
        <TouchableOpacity
          style={styles.heroImgWrap}
          activeOpacity={isEditing ? 0.6 : 1}
          onPress={() => {
            if (isEditing) {
              const emojis = ['☕', '🥤', '🧋', '🍵', '🫖', '🥛', '🧃', '⚡'];
              Alert.alert(
                '이모지 선택',
                editEmoji,
                emojis.map((e) => ({
                  text: `${e}`,
                  onPress: () => setEditEmoji(e),
                })),
              );
            }
          }}
        >
          <Text style={styles.heroEmoji}>{editEmoji}</Text>
          {isEditing && (
            <Text style={styles.editEmojiHint}>탭하여 변경</Text>
          )}
        </TouchableOpacity>

        <View style={styles.contentArea}>
          {/* 메뉴 기본 정보 카드 */}
          <View style={styles.menuInfoCard}>
            {isEditing ? (
              <>
                <TextInput
                  style={[styles.menuBrand, styles.editInput, { textAlign: 'center' }]}
                  value={editBrand}
                  onChangeText={setEditBrand}
                  placeholder="브랜드명"
                  placeholderTextColor={Colors.text3}
                />
                <TextInput
                  style={[styles.menuName, styles.editInput, { textAlign: 'center' }]}
                  value={editCoffeeName}
                  onChangeText={setEditCoffeeName}
                  placeholder="메뉴명"
                  placeholderTextColor={Colors.text3}
                />
                <View style={styles.sizeChip}>
                  <TouchableOpacity
                    onPress={() =>
                      Alert.alert('카테고리 선택', '', [
                        { text: '카페', onPress: () => setEditCategory('카페') },
                        { text: '편의점', onPress: () => setEditCategory('편의점') },
                        { text: '기타', onPress: () => setEditCategory('기타') },
                      ])
                    }
                  >
                    <Text style={styles.sizeChipText}>
                      기준: {editCategory === '편의점' ? '1개입' : 'Tall 사이즈'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.menuBrand}>{editBrand || "브랜드 정보 없음"}</Text>
                <Text style={styles.menuName}>{editCoffeeName || "메뉴명 정보 없음"}</Text>
                <View style={styles.sizeChip}>
                  <Text style={styles.sizeChipText}>
                    기준: {editCategory === '편의점' ? '1개입' : 'Tall 사이즈'}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* 칼로리 강조 카드 */}
          <CalorieCard value={editNuts[0]} />

          {isCreateMode && (
            <TouchableOpacity
              style={styles.aiHelpBtn}
              onPress={handleAiHelp}
              disabled={isAiLoading || !editCoffeeName.trim()}
            >
              <Text style={styles.aiHelpIcon}>🤖</Text>
              <Text style={styles.aiHelpText}>
                {isAiLoading ? 'AI 분석 중...' : '영양성분을 모르시나요? AI의 도움을 받아보세요!'}
              </Text>
            </TouchableOpacity>
          )}

          {/* 세부 영양 성분 리스트 */}
          <NutritionListCard
            data={nutritionData}
            editable={isEditing}
            onValueChange={handleNutChange}
          />
        </View>
      </ScrollView>

      {/* 하단 고정 버튼 */}
      <View style={styles.ctaWrap}>
        {isEditing ? (
          <View style={styles.editBtnRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                if (isCreateMode || fromTimeline) { navigation.goBack(); return; }
                setIsEditing(false);
                setEditBrand(item?.brand || '');
                setEditCoffeeName(item?.coffeeName || '');
                setEditEmoji(item?.emoji || '☕');
                setEditCategory(item?.category || '카페');
                setEditNuts([
                  String(item?.calories || 0),
                  String(item?.sugar || 0),
                  String(item?.protein || 0),
                  String(item?.caffeine || 0),
                  String(item?.saturatedFat || 0),
                  String(item?.sodium || 0),
                ]);
              }}
            >
              <Text style={styles.cancelBtnText}>취소</Text>
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <PrimaryButton
                title={isSubmitting ? "저장 중..." : isCreateMode ? "섭취 기록하기" : fromTimeline ? "변경 저장" : "섭취 기록하기"}
                onPress={handleSaveMenu}
              />
            </View>
          </View>
        ) : (
          <View style={styles.editBtnRow}>
            {fromTimeline ? (
              item?.aiGenerated === true ? (
                <>
                  <TouchableOpacity
                    style={[styles.cancelBtn, { borderColor: '#FECACA' }]}
                    onPress={handleDeleteIntake}
                  >
                    <Svg width="18" height="18" viewBox="0 0 24 24" fill="#DC2626">
                      <Path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </Svg>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#DC2626', marginLeft: 4 }}>삭제</Text>
                  </TouchableOpacity>
                  <View style={{ flex: 1 }}>
                    <TouchableOpacity
                      style={styles.editToggleBtn}
                      onPress={() => setIsEditing(true)}
                    >
                      <Text style={styles.editToggleBtnText}>수정</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <TouchableOpacity
                  style={[styles.cancelBtn, { borderColor: '#FECACA', flex: 1 }]}
                  onPress={handleDeleteIntake}
                >
                  <Svg width="18" height="18" viewBox="0 0 24 24" fill="#DC2626">
                    <Path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                  </Svg>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#DC2626', marginLeft: 4 }}>삭제</Text>
                </TouchableOpacity>
              )
            ) : canEdit ? (
              <>
                <View style={{ flex: 0.4, marginRight: 8 }}>
                  <TouchableOpacity
                    style={styles.editToggleBtn}
                    onPress={() => setIsEditing(true)}
                  >
                    <Text style={styles.editToggleBtnText}>수정</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 0.6 }}>
                  <PrimaryButton
                    title={isSubmitting ? "기록 중..." : "섭취 기록하기"}
                    onPress={handleSaveIntake}
                  />
                </View>
              </>
            ) : (
              <View style={{ flex: 1 }}>
                <PrimaryButton
                  title={isSubmitting ? "기록 중..." : "섭취 기록하기"}
                  onPress={handleSaveIntake}
                />
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  headerArea: { backgroundColor: Colors.surface },
  favBtn: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  scrollArea: { flexGrow: 1, paddingBottom: 100 },
  heroImgWrap: { 
    width: '100%', 
    aspectRatio: 4 / 3, 
    backgroundColor: '#FFF4EC', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  heroEmoji: { fontSize: 80 },
  editEmojiHint: { fontSize: 11, fontWeight: '400', color: Colors.text3, marginTop: 4 },
  contentArea: { flexDirection: 'column', gap: 24, paddingTop: 24, paddingHorizontal: 24 },
  menuInfoCard: { 
    backgroundColor: Colors.surface, 
    borderRadius: Layout.radiusLg, 
    padding: 24, 
    alignItems: 'center', 
    gap: 8, 
    ...Layout.shadow1 
  },
  menuBrand: { fontSize: 14, fontWeight: '500', color: Colors.primary, lineHeight: 20 },
  menuName: { fontSize: 24, fontWeight: '700', color: Colors.text1, lineHeight: 32, textAlign: 'center' },
  editInput: { borderBottomWidth: 1, borderBottomColor: Colors.border, paddingVertical: 2, paddingHorizontal: 4, color: Colors.text1 },
  sizeChip: { 
    height: 32, 
    paddingHorizontal: 12, 
    borderRadius: Layout.radiusFull, 
    borderWidth: 1, 
    borderColor: Colors.border, 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginTop: 4 
  },
  sizeChipText: { fontSize: 12, fontWeight: '500', color: Colors.text2 },
  ctaWrap: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    paddingTop: 12, 
    paddingHorizontal: 24, 
    paddingBottom: 24, 
    backgroundColor: Colors.surface, 
    borderTopWidth: 1, 
    borderTopColor: Colors.divider 
  },
  editBtnRow: { flexDirection: 'row', alignItems: 'center' },
  cancelBtn: {
    height: 52, paddingHorizontal: 20, borderRadius: Layout.radiusLg,
    alignItems: 'center', justifyContent: 'center', marginRight: 8,
    borderWidth: 1, borderColor: Colors.border, backgroundColor: Colors.surface,
  },
  cancelBtnText: { fontSize: 16, fontWeight: '700', color: Colors.text2 },
  editToggleBtn: {
    height: 52, borderRadius: Layout.radiusLg,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: Colors.primary, backgroundColor: Colors.surface,
  },
  editToggleBtnText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  aiHelpBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#FDE68A',
    backgroundColor: '#FFFBEB',
    gap: 8,
  },
  aiHelpIcon: { fontSize: 20 },
  aiHelpText: { fontSize: 13, fontWeight: '600', color: '#B45309' },
});