// src/constants.ts

// 직접 적었던 키 대신 process.env를 사용합니다.
export const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
export const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
export const BACKEND_API_URL = process.env.EXPO_PUBLIC_BACKEND_API_URL;

// 카페 데이터 타입
export interface CafeData {
  name: string;
  vicinity: string;
  rating?: number;
  place_id: string;
  geometry: { location: { lat: number; lng: number; } };
}

// 프랜차이즈 브랜드 색상 및 정보
export const BRAND_STYLES = [
  { keywords: ['스타벅스', 'Starbucks'], color: '#006241', short: 'S', name: '스타벅스' },
  { keywords: ['이디야', 'Ediya'], color: '#2C3E91', short: 'E', name: '이디야' },
  { keywords: ['투썸', 'Twosome'], color: '#D3232A', short: 'T', name: '투썸' },
  { keywords: ['메가커피', 'Mega', 'MGC', '메가MGC', '메가'], color: '#FFD000', short: 'M', name: '메가커피' },
  { keywords: ['빽다방', 'Paik'], color: '#003399', short: 'P', name: '빽다방' },
  { keywords: ['컴포즈', 'Compose'], color: '#FFCC00', short: 'C', name: '컴포즈' },
  { keywords: ['할리스', 'Hollys'], color: '#BA0000', short: 'H', name: '할리스' },
  { keywords: ['커피빈', 'Coffee Bean'], color: '#381E15', short: 'B', name: '커피빈' },
  { keywords: ['블루보틀', 'Blue'], color: '#00A4E4', short: 'B', name: '블루보틀' },
  { keywords: ['폴바셋', 'Paul'], color: '#000000', short: 'P', name: '폴바셋' },
];

export const DEFAULT_STYLE = { color: '#8D6E63', short: 'C', name: '일반카페' };

export const getBrandInfo = (storeName: string) => {
  const found = BRAND_STYLES.find(brand => brand.keywords.some(keyword => storeName.includes(keyword)));
  if (found) return { ...found, isFranchise: true };
  return { ...DEFAULT_STYLE, isFranchise: false };
};

//------------------------------------------------------------------------

//색상이 변경될 때 이 파일만 수정하면 앱 전체에 반영됩니다.
export const Colors = {
  primary: '#8B2E3A', // 앱의 메인 브랜드 컬러
  bg: '#F6F6F6',      // 스크롤 영역 등 기본 배경색
  surface: '#FFFFFF', // 카드, 버튼 등 UI 요소의 표면색
  text1: '#111111',   // 가장 진한 기본 텍스트 (제목 등)
  text2: '#999999',   // 보조 텍스트 (설명, 플레이스홀더 등)
  text3: '#CCCCCC',   // 비활성 텍스트
  error: '#FF4444',   // 에러 색상 추가
  border: '#E5E7EB',  // 인풋박스, 버튼 등의 테두리 색상
  divider: '#F0F0F0', // 구분선 색상
  kakao: '#FEE500',   // 카카오 소셜 로그인 배경색
  naver: '#03C75A',   // 네이버 소셜 로그인 배경색
  google: '#FFFFFF',  // 구글 소셜 로그인 배경색

  // 홈 화면 및 기타 알림 UI를 위한 추가 색상
  warning: '#F59E0B', 
  success: '#22C55E',
  alertBg: '#FFF8F1',     // 경고 카드 배경
  alertBorder: '#FFEDD5', // 경고 카드 테두리
  avatarBg: '#FFEDD5',    // 기본 아바타 배경
  avatarIcon: '#8B5E3C',  // 기본 아바타 아이콘
  iconDark: '#333333',    // 상태바 등 어두운 아이콘 색상
};

// 여백, 라운드(border-radius), 그림자 등 레이아웃 관련 수치를 관리합니다.
export const Layout = {
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 24,
  radiusFull: 9999, // 완전한 원형이나 알약 형태를 만들 때 사용
  
  // React Native에서 그림자는 Android(elevation)와 iOS(shadow~) 속성이 다릅니다.
  // 이를 공통 객체로 만들어 StyleSheet에서 전개 연산자(...)로 쉽게 적용합니다.
  shadow1: {
    elevation: 2, // Android 전용 그림자 깊이
    shadowColor: '#000000', // iOS 전용
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  // (지도 마커, 컨트롤 버튼용)
  shadow2: {
    elevation: 4,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  
  // (바텀 시트, 검색바용)
  shadow3: {
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
  },
  
  shadow4: {
    elevation: 8, // 조금 더 깊은 그림자 (로그인 버튼용)
    shadowColor: '#8B2E3A', 
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },

  // 하단 네비게이션 바를 위한 위로 퍼지는 그림자
  shadowNav: {
    elevation: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.04,
    shadowRadius: 16,
  }
};