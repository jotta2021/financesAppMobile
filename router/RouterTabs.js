import React from 'react';
import { View } from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Home from '../screens/home';
import Transactions from '../screens/transactions';
import Collors from '../components/collors.json'
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/FontAwesome5';

// import { Container } from './styles';
const tab = createBottomTabNavigator()
export default function RouterTab(){
    return(
<tab.Navigator
screenOptions={{
    headerShown:false,
    tabBarLabelStyle:{color:'grey'},
    
}}
>
    <tab.Screen  name='Home'component={Home}
    options={{
        title:'Principal',
        tabBarIcon:({color,size,focused})=>{
       if(focused){
        return( 
            <Icon name='home' size={size} color={Collors[0]['new-green']}/>
        )
       } else{
            return(
              <Icon name='home-outline' color={color} size={size}/>  
            )
            
        }
        }
    }}
    />
    <tab.Screen name='Transactions' component={Transactions}
     options={{
        title:'Transações',
        tabBarIcon:({color,size,focused})=>{
       if(focused){
        return( 
            <Icon2 name='money-check-alt' size={size} color={Collors[0]['new-green']}/>
        )
       } else{
            return(
              <Icon2 name='money-check-alt' color={color} size={size}/>  
            )
            
        }
        }
    }}
    />
</tab.Navigator>
    )
}