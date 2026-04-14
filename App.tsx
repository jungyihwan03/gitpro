import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// 네비게이션 코어
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 김민경 작업물 (모든 스크린 임포트)
import { Login } from './src/screens/Login';
import { SignUp } from './src/screens/SignUp';
import { FindPassword } from './src/screens/FindPassword';
import { FindId } from './src/screens/FindId';
import { BasicInfo } from './src/screens/BasicInfo';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SearchScreen from './src/screens/SearchScreen';
import BrandSelectScreen from './src/screens/BrandSelectScreen';
import MenuDetailScreen from './src/screens/MenuDetailScreen';
import MenuScannerCamera from './src/screens/MenuScannerCamera';
import AnalyzeScreen from './src/screens/AnalyzeScreen';
import AnalyzeFailScreen from './src/screens/AnalyzeFailScreen';
import AnalyzeResultScreen from './src/screens/AnalyzeResultScreen';
import Map from './src/screens/Map';
import CafeDetailScreen from './src/screens/CafeDetailScreen';
import CafeMenuScreen from './src/screens/CafeMenuScreen';

// 백엔드 이환님 작업물
import BackendTest from './App_backup'; 

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      {/* 🌟 방패막(SafeAreaView)을 치고 상하단 안전 영역을 확보합니다. */}
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'bottom']}>
        
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            
            {/* ── [로그인 & 회원가입] ── */}
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="FindPassword" component={FindPassword} />
            <Stack.Screen name="FindId" component={FindId} />
            <Stack.Screen name="BasicInfo" component={BasicInfo} />

            {/* ── [메인 & 지도 & 기록] ── */}
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="Map" component={Map} />

            {/* ── [검색 및 카페 상세] ── */}
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="BrandSelect" component={BrandSelectScreen} />
            <Stack.Screen name="CafeDetail" component={CafeDetailScreen} />
            <Stack.Screen name="CafeMenu" component={CafeMenuScreen} />
            <Stack.Screen name="MenuDetail" component={MenuDetailScreen} />

            {/* ── [카메라 & 메뉴 분석] 새로 추가된 화면들! ── */}
            <Stack.Screen name="MenuScannerCamera" component={MenuScannerCamera} />
            <Stack.Screen name="Analyze" component={AnalyzeScreen} />
            <Stack.Screen name="AnalyzeFail" component={AnalyzeFailScreen} />
            <Stack.Screen name="AnalyzeResult" component={AnalyzeResultScreen} />

          </Stack.Navigator>
        </NavigationContainer>

      </SafeAreaView>
    </SafeAreaProvider>
  );

  // 💡 이환님이 기능 테스트하고 싶을 땐, 위 return 문을 통째로 주석 처리하고 
  // 아래 주석을 풀어서 사용하시면 됩니다!
  // return <BackendTest />; 
}