import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// 네비게이션 코어
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// 모든 스크린 임포트
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
import { StatisticsScreen } from './src/screens/StatisticsScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();

// ── [로그인 후 여백이 적용되는 메인 스택] ──
function MainAppStack({ route }: any) {
  // 🌟 Login/BasicInfo에서 보낸 데이터(params)를 추출합니다.
  const userParams = route.params || {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'bottom']}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* 🌟 HomeScreen에 유저 데이터를 initialParams로 확실하게 주입합니다. */}
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          initialParams={userParams} 
        />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="Map" component={Map} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="BrandSelect" component={BrandSelectScreen} />
        <Stack.Screen name="CafeDetail" component={CafeDetailScreen} />
        <Stack.Screen name="CafeMenu" component={CafeMenuScreen} />
        <Stack.Screen name="MenuDetail" component={MenuDetailScreen} />
        <Stack.Screen name="MenuScannerCamera" component={MenuScannerCamera} />
        <Stack.Screen name="Analyze" component={AnalyzeScreen} />
        <Stack.Screen name="AnalyzeFail" component={AnalyzeFailScreen} />
        <Stack.Screen name="AnalyzeResult" component={AnalyzeResultScreen} />
        <Stack.Screen name="Statistics" component={StatisticsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          
          {/* ── [인증 섹션: 여백 없음] ── */}
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="FindPassword" component={FindPassword} />
          <Stack.Screen name="FindId" component={FindId} />
          <Stack.Screen name="BasicInfo" component={BasicInfo} />

          {/* ── [메인 섹션: 여백 있음] ── */}
          <Stack.Screen name="MainTabs" component={MainAppStack} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}