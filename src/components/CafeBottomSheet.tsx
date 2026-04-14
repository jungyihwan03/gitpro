import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, PanResponder, Animated, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../constants';
import { useNavigation } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function CafeBottomSheet() {
  const [memo, setMemo] = useState('');
  const navigation = useNavigation<any>();

  // 🌟 애니메이션 값 (0에서 시작)
  const translateY = useRef(new Animated.Value(0)).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        // 위로 올릴 때(dy < 0)만 움직이게 제한
        if (gestureState.dy < 0) {
          translateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        // 120픽셀 이상 올리거나 속도가 빠르면 상세로 이동
        if (gestureState.dy < -120 || gestureState.vy < -0.5) {
          navigation.navigate('CafeDetail');
          // 화면 전환 후 시트는 부드럽게 제자리로
          Animated.timing(translateY, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        } else {
          // 조금만 올렸으면 다시 자석처럼 아래로 툭
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 8,
          }).start();
        }
      },
    })
  ).current;

  return (
    <Animated.View 
      style={[
        styles.bottomSheet, 
        { transform: [{ translateY: translateY }] } 
      ]} 
      {...panResponder.panHandlers}
    >
      {/* 하얀 바닥면이 끊기지 않게 밑으로 길게 늘리는 보이지 않는 꼬리 */}
      <View style={styles.sheetTail} />

      {/* 핸들 바 */}
      <View style={styles.sheetHandle}>
        <View style={styles.handleBar} />
      </View>

      <View style={styles.sheetContent}>
        {/* 카페 메인 정보 (기존 디자인 100% 복구) */}
        <TouchableOpacity 
          style={styles.cafeRow} 
          activeOpacity={0.8} 
          onPress={() => navigation.navigate('CafeDetail')}
        >
          <View style={styles.cafeThumb}>
            <View style={styles.thumbInner}>
              <Svg width="32" height="32" viewBox="0 0 24 24">
                <Path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3z" fill="rgba(255,255,255,0.25)" />
              </Svg>
            </View>
            <View style={styles.thumbBadge}>
              <Svg width="11" height="11" viewBox="0 0 24 24">
                <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#f9a825"/>
              </Svg>
              <Text style={styles.badgeText}>4.8</Text>
            </View>
          </View>

          <View style={styles.cafeInfo}>
            <Text style={styles.cafeName}>미드나잇 에스프레소</Text>
            <View style={styles.cafeMeta}>
              <Text style={styles.metaText}>250m</Text>
              <View style={styles.metaDot} />
              <Text style={styles.metaText}>강남구 테헤란로 123</Text>
            </View>
            <View style={styles.closingTag}>
              <Svg width="13" height="13" viewBox="0 0 24 24">
                <Path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill={Colors.error}/>
              </Svg>
              <Text style={styles.closingText}>22:00에 영업 종료</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* 메모 입력 필드 */}
        <View style={styles.memoField}>
          <TextInput
            style={styles.memoInput}
            placeholder="이 장소에 대한 메모를 남겨보세요."
            placeholderTextColor={Colors.text3}
            multiline
            value={memo}
            onChangeText={setMemo}
          />
          <TouchableOpacity style={styles.memoEditBtn} activeOpacity={0.6}>
            <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <Path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill={Colors.text2}/>
            </Svg>
          </TouchableOpacity>
        </View>

        {/* 액션 버튼 */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionItem} activeOpacity={0.6}>
            <View style={[styles.iconWrap, styles.iconFilled]}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none"><Path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z" fill="#fff"/></Svg>
            </View>
            <Text style={styles.actionLabel}>길 찾기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} activeOpacity={0.6}>
            <View style={[styles.iconWrap, styles.iconTonal]}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none"><Path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill={Colors.text2}/></Svg>
            </View>
            <Text style={styles.actionLabel}>전화</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} activeOpacity={0.6}>
            <View style={[styles.iconWrap, styles.iconTonal]}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none"><Path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" fill={Colors.text2}/></Svg>
            </View>
            <Text style={styles.actionLabel}>공유</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bottomSheet: { 
    position: 'absolute', 
    bottom: 80, 
    left: 0, 
    right: 0, 
    backgroundColor: Colors.surface, 
    borderTopLeftRadius: Layout.radiusLg, 
    borderTopRightRadius: Layout.radiusLg, 
    zIndex: 15, 
    ...Layout.shadow3,
    paddingBottom: 20, 
  },
  // 🌟 핵심: 시트를 끌어올릴 때 하얀색이 끊기지 않도록 아래로 1000px 늘려주는 배경
  sheetTail: {
    position: 'absolute',
    top: 100, // 시트 상단으로부터 아래쪽으로
    left: 0,
    right: 0,
    height: 1000,
    backgroundColor: Colors.surface,
    zIndex: -1,
  },
  sheetHandle: { paddingVertical: 12, alignItems: 'center' },
  handleBar: { width: 36, height: 4, borderRadius: 2, backgroundColor: Colors.border },
  sheetContent: { paddingHorizontal: 24, paddingBottom: 20 },
  cafeRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  cafeThumb: { width: 72, height: 72, borderRadius: Layout.radiusMd, backgroundColor: '#1a0a00', overflow: 'hidden' },
  thumbInner: { flex: 1, backgroundColor: '#5c3317', alignItems: 'center', justifyContent: 'center' },
  thumbBadge: { position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: Layout.radiusFull, paddingHorizontal: 6, paddingVertical: 2, flexDirection: 'row', alignItems: 'center', gap: 3 },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  cafeInfo: { flex: 1 },
  cafeName: { fontSize: 18, fontWeight: '700', color: Colors.text1, lineHeight: 28, marginBottom: 4 },
  cafeMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  metaText: { fontSize: 12, color: Colors.text2 },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.text3 },
  closingTag: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, height: 24, paddingHorizontal: 10, borderRadius: Layout.radiusFull, backgroundColor: '#FEE2E2' },
  closingText: { fontSize: 11, fontWeight: '700', color: Colors.error },
  memoField: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Layout.radiusMd, borderWidth: 1.5, borderColor: Colors.border, paddingLeft: 16, paddingRight: 12, minHeight: 52, marginBottom: 16 },
  memoInput: { flex: 1, fontSize: 14, color: Colors.text1, paddingVertical: 14, maxHeight: 80 },
  memoEditBtn: { width: 32, height: 32, alignItems: 'center', justifyContent: 'center' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around' },
  actionItem: { alignItems: 'center', gap: 6 },
  iconWrap: { width: 56, height: 56, borderRadius: Layout.radiusSm, alignItems: 'center', justifyContent: 'center' },
  iconFilled: { backgroundColor: Colors.primary, ...Layout.shadow1 },
  iconTonal: { backgroundColor: Colors.bg },
  actionLabel: { fontSize: 12, fontWeight: '500', color: Colors.text2 },
});