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
import { CafeReviewScreen } from './src/screens/CafeReviewScreen';
import { CafeMyRecordScreen } from './src/screens/CafeMyRecordScreen';
import { StatisticsScreen } from './src/screens/StatisticsScreen';
import { CompareScreen } from './src/screens/CompareScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { ProfileDetailScreen } from './src/screens/ProfileDetailScreen';

const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();

// ── [로그인 후 여백이 적용되는 메인 스택] ──
function MainAppStack({ route }: any) {
  const userParams = route.params || {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }} edges={['top', 'bottom']}>
      <MainStack.Navigator screenOptions={{ headerShown: false }}>
        <MainStack.Screen 
          name="Home" 
          component={HomeScreen} 
          initialParams={userParams} 
        />
        <MainStack.Screen name="History" component={HistoryScreen} />
        <MainStack.Screen name="Map" component={Map} />
        <MainStack.Screen name="Search" component={SearchScreen} />
        <MainStack.Screen name="BrandSelect" component={BrandSelectScreen} />
        <MainStack.Screen name="CafeDetail" component={CafeDetailScreen} />
        <MainStack.Screen name="CafeMenu" component={CafeMenuScreen} />
        <MainStack.Screen name="MenuDetail" component={MenuDetailScreen} />
        <MainStack.Screen name="MenuScannerCamera" component={MenuScannerCamera} />
        <MainStack.Screen name="Analyze" component={AnalyzeScreen} />
        <MainStack.Screen name="AnalyzeFail" component={AnalyzeFailScreen} />
        <MainStack.Screen name="AnalyzeResult" component={AnalyzeResultScreen} />
        <MainStack.Screen name="Statistics" component={StatisticsScreen} />
        <MainStack.Screen name="Settings" component={SettingsScreen} />
        <MainStack.Screen name="ProfileDetail" component={ProfileDetailScreen} />
      </MainStack.Navigator>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <NavigationContainer>
        <AuthStack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
          
          <AuthStack.Screen name="Login" component={Login} />
          <AuthStack.Screen name="SignUp" component={SignUp} />
          <AuthStack.Screen name="FindPassword" component={FindPassword} />
          <AuthStack.Screen name="FindId" component={FindId} />
          <AuthStack.Screen name="BasicInfo" component={BasicInfo} />

          <AuthStack.Screen name="MainTabs" component={MainAppStack} />

        </AuthStack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}