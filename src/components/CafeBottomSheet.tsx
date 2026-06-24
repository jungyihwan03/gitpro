import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder, Animated, Dimensions, Image, Linking } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Colors, Layout } from '../constants';
import { useNavigation } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const PEAK_OFFSET = 330;

interface CafeInfo {
  name: string;
  vicinity: string;
  rating?: number;
  place_id: string;
  geometry: { location: { lat: number; lng: number } };
  opening_hours?: {
    open_now?: boolean;
    weekday_text?: string[];
  } | null;
  photo_url?: string | null;
  phone?: string | null;
  isCustom?: boolean;
}

interface CafeBottomSheetProps {
  cafe?: CafeInfo | null;
  distance?: string;
  selectionMode?: boolean;
  onSelectCafe?: (cafe: CafeInfo) => void;
  onDeleteCafe?: (cafe: CafeInfo) => void;
}

function getHoursInfo(cafe: CafeInfo | null | undefined): { text: string; isOpen: boolean | null } | null {
  if (!cafe?.opening_hours) return null;
  const oh = cafe.opening_hours;
  if (oh.weekday_text && oh.weekday_text.length > 0) {
    const today = new Date().getDay();
    const todayStr = oh.weekday_text[today];
    const closing = todayStr?.split(': ')[1];
    if (oh.open_now) {
      return { text: closing ? `${closing}에 영업 종료` : '영업 중', isOpen: true };
    } else {
      return { text: '영업 종료', isOpen: false };
    }
  }
  if (oh.open_now === true) return { text: '영업 중', isOpen: true };
  if (oh.open_now === false) return { text: '영업 종료', isOpen: false };
  return null;
}

export default function CafeBottomSheet({ cafe, distance, selectionMode, onSelectCafe, onDeleteCafe }: CafeBottomSheetProps) {
  const navigation = useNavigation<any>();

  const [interactive, setInteractive] = useState(false);
  const interactiveRef = useRef(false);
  const translateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
  const currentOffset = useRef(SCREEN_HEIGHT);
  const cafeRef = useRef(cafe);
  const distanceRef = useRef(distance);
  cafeRef.current = cafe;
  distanceRef.current = distance;

  useEffect(() => {
    if (cafe) {
      interactiveRef.current = true;
      setInteractive(true);
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        bounciness: 8,
      }).start();
      currentOffset.current = 0;
    } else {
      translateY.setValue(SCREEN_HEIGHT);
      setInteractive(false);
      interactiveRef.current = false;
    }
  }, [cafe]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => Math.abs(gestureState.dy) > 5,
      onPanResponderMove: (_, gestureState) => {
        if (!interactiveRef.current) return;
        const newOffset = Math.min(PEAK_OFFSET, currentOffset.current + gestureState.dy);
        translateY.setValue(Math.max(-200, newOffset));
      },
      onPanResponderRelease: (_, gestureState) => {
        if (!interactiveRef.current) return;
        const finalOffset = Math.max(-200, Math.min(PEAK_OFFSET, currentOffset.current + gestureState.dy));

        if (finalOffset < -100 || gestureState.vy < -0.5) {
          if (selectionMode && cafeRef.current && onSelectCafe) {
            onSelectCafe(cafeRef.current);
          } else {
            navigation.push('CafeDetail', { cafe: cafeRef.current ?? null, distance: distanceRef.current });
          }
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 8,
          }).start(() => { currentOffset.current = 0; });
        } else if (finalOffset > PEAK_OFFSET / 2) {
          Animated.spring(translateY, {
            toValue: PEAK_OFFSET,
            useNativeDriver: true,
            bounciness: 8,
          }).start(() => { currentOffset.current = PEAK_OFFSET; });
        } else {
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 8,
          }).start(() => { currentOffset.current = 0; });
        }
      },
    })
  ).current;

  const hoursInfo = getHoursInfo(cafe);
  const photoUrl = cafe?.photo_url || null;

  return (
    <Animated.View
      pointerEvents={interactive ? 'auto' : 'none'}
      style={[
        styles.bottomSheet,
        { transform: [{ translateY: translateY }] },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.sheetTail} />

      <View style={styles.sheetHandle}>
        <View style={styles.handleBar} />
      </View>

      <View style={styles.sheetContent}>
        <TouchableOpacity
          style={styles.cafeRow}
          activeOpacity={0.8}
          onPress={() => {
            if (selectionMode && cafeRef.current && onSelectCafe) {
              onSelectCafe(cafeRef.current);
            } else {
              navigation.navigate('CafeDetail', { cafe: cafeRef.current ?? null, distance: distanceRef.current });
            }
          }}
        >
          <View style={styles.cafeThumb}>
            {photoUrl ? (
              <Image source={{ uri: photoUrl }} style={styles.thumbImage} resizeMode="cover" />
            ) : (
              <View style={styles.thumbInner}>
                <Svg width="32" height="32" viewBox="0 0 24 24">
                  <Path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3z" fill="rgba(255,255,255,0.25)" />
                </Svg>
              </View>
            )}
            <View style={styles.thumbBadge}>
              <Svg width="11" height="11" viewBox="0 0 24 24">
                <Path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="#f9a825"/>
              </Svg>
              <Text style={styles.badgeText}>{cafe?.rating != null ? cafe.rating : '-'}</Text>
            </View>
          </View>

          <View style={styles.cafeInfo}>
            <Text style={styles.cafeName}>{cafe?.name || '(이름 없음)'}</Text>
            <View style={styles.cafeMeta}>
              <Text style={styles.metaText}>{distance || '(거리 없음)'}</Text>
              <View style={styles.metaDot} />
              <Text style={styles.metaText}>{cafe?.vicinity || '(주소 없음)'}</Text>
            </View>
            {hoursInfo && (
              <View style={[styles.closingTag, hoursInfo.isOpen ? styles.closingTagOpen : styles.closingTagClosed]}>
                <Svg width="13" height="13" viewBox="0 0 24 24">
                  <Path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" fill={hoursInfo.isOpen ? Colors.success : Colors.error}/>
                </Svg>
                <Text style={[styles.closingText, { color: hoursInfo.isOpen ? Colors.success : Colors.error }]}>{hoursInfo.text}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionItem} activeOpacity={0.6} onPress={() => {
            const name = cafeRef.current?.name;
            if (name) Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(name)}`);
          }}>
            <View style={[styles.iconWrap, styles.iconFilled]}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none"><Path d="M21.71 11.29l-9-9c-.39-.39-1.02-.39-1.41 0l-9 9c-.39.39-.39 1.02 0 1.41l9 9c.39.39 1.02.39 1.41 0l9-9c.39-.38.39-1.01 0-1.41zM14 14.5V12h-4v3H8v-4c0-.55.45-1 1-1h5V7.5l3.5 3.5-3.5 3.5z" fill="#fff"/></Svg>
            </View>
            <Text style={styles.actionLabel}>길 찾기</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} activeOpacity={0.6} onPress={() => { console.log('=== 전화 버튼 클릭, phone ===', cafeRef.current?.phone); if (cafeRef.current?.phone) Linking.openURL('tel:' + cafeRef.current.phone); }}>
            <View style={[styles.iconWrap, styles.iconTonal]}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none"><Path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" fill={Colors.text2}/></Svg>
            </View>
            <Text style={styles.actionLabel}>전화</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionItem} activeOpacity={0.6} onPress={() => {
            const name = cafeRef.current?.name;
            if (name) Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name)}`);
          }}>
            <View style={[styles.iconWrap, styles.iconTonal]}>
              <Svg width="24" height="24" viewBox="0 0 24 24" fill="none"><Path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" fill={Colors.text2}/></Svg>
            </View>
            <Text style={styles.actionLabel}>공유</Text>
          </TouchableOpacity>
        </View>

        {selectionMode && (
          <TouchableOpacity
            style={styles.selectBtn}
            activeOpacity={0.8}
            onPress={() => {
              if (cafe && onSelectCafe) onSelectCafe(cafe);
            }}
          >
            <Text style={styles.selectBtnText}>이 카페 선택</Text>
          </TouchableOpacity>
        )}
        {cafe?.isCustom && onDeleteCafe && (
          <TouchableOpacity
            style={styles.deleteBtn}
            activeOpacity={0.8}
            onPress={() => onDeleteCafe(cafe)}
          >
            <Text style={styles.deleteBtnText}>삭제</Text>
          </TouchableOpacity>
        )}
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
  sheetTail: {
    position: 'absolute',
    top: 100,
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
  cafeThumb: { width: 72, height: 72, borderRadius: Layout.radiusMd, overflow: 'hidden' },
  thumbImage: { width: '100%', height: '100%' },
  thumbInner: { flex: 1, backgroundColor: '#5c3317', alignItems: 'center', justifyContent: 'center' },
  thumbBadge: { position: 'absolute', bottom: 4, left: 4, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: Layout.radiusFull, paddingHorizontal: 6, paddingVertical: 2, flexDirection: 'row', alignItems: 'center', gap: 3 },
  badgeText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  cafeInfo: { flex: 1 },
  cafeName: { fontSize: 18, fontWeight: '700', color: Colors.text1, lineHeight: 28, marginBottom: 4 },
  cafeMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  metaText: { fontSize: 12, color: Colors.text2 },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: Colors.text3 },
  closingTag: { alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 4, height: 24, paddingHorizontal: 10, borderRadius: Layout.radiusFull },
  closingTagOpen: { backgroundColor: '#DCFCE7' },
  closingTagClosed: { backgroundColor: '#FEE2E2' },
  closingText: { fontSize: 11, fontWeight: '700' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-around' },
  actionItem: { alignItems: 'center', gap: 6 },
  iconWrap: { width: 56, height: 56, borderRadius: Layout.radiusSm, alignItems: 'center', justifyContent: 'center' },
  iconFilled: { backgroundColor: Colors.primary, ...Layout.shadow1 },
  iconTonal: { backgroundColor: Colors.bg },
  actionLabel: { fontSize: 12, fontWeight: '500', color: Colors.text2 },
  selectBtn: {
    marginTop: 16, height: 48, borderRadius: Layout.radiusLg,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.primary,
  },
  selectBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  deleteBtn: {
    marginTop: 10, height: 44, borderRadius: Layout.radiusLg,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FECACA',
  },
  deleteBtnText: { fontSize: 15, fontWeight: '600', color: '#DC2626' },
});
