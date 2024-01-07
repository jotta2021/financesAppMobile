import React from 'react';
import { View,Text,StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Collors from '../collors.json'
// import { Container } from './styles';

export default function Category({item,amount}){
    return(

        
        <TouchableOpacity style={styles.container}>
        <View style={styles.category}>
        {
            item.icon === 'home'?
            <FontAwesome5 name="home" size={24} color={Collors[0]['new-green']} />
            :item.icon === 'utensils'?
            <FontAwesome5 name="utensils" size={24} color={Collors[0]['new-green']} />
            :item.icon === 'car'?
            <FontAwesome5 name="car" size={24} color={Collors[0]['new-green']} />
            :item.icon === 'heartbeat'?
            <FontAwesome5 name="heartbeat" size={24} color={Collors[0]['new-green']} />
            :null
        }
        <Text>{item.title}</Text>
        <Text>{item.amount}</Text>
        
        </View>
        
      </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
container:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-around',
  
},
category:{
    justifyContent:'center',
    alignItems:"center",
    gap:5,
   marginTop:10,
  marginStart:10,
  backgroundColor:'white',
  padding:6,
  borderRadius:10,
}



})