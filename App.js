import React from 'react';
import { View, Text } from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import Router from './router/RouterStack';
import AuthProvider from './src/context/contexts';
import ToastManager from 'toastify-react-native'
export default function App(){
  return(

    <NavigationContainer>
   
<AuthProvider>
  <Router/>
</AuthProvider>
      
    </NavigationContainer>
  )
}