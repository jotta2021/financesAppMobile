import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native'
import Router from './router/RouterStack';
import AuthProvider from './src/context/contexts';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      <NavigationContainer>

        <AuthProvider>



          <Router />
          <Toast />
        </AuthProvider>

      </NavigationContainer>
    </GestureHandlerRootView>
  )
}