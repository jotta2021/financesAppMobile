import React from 'react';
import { View ,Text, SafeAreaView,StyleSheet} from 'react-native';
import Collors from './../collors.json'
// import { Container } from './styles';

export default function Header({balance}){
    return(
        <SafeAreaView style={styles.header}>
            <Text style={styles.balance}>Saldo Atual</Text>
            <Text style={styles.balanceValue}>R$ {balance}</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
header:{
    backgroundColor: Collors[0]["green-app"],
    alignItems:'center',
   
},
balance:{
    marginTop:30,
    fontSize:20,
    color:'white'
},

balanceValue:{
    fontSize:30,
    fontWeight:'bold',
    color:'white',
    marginBottom:10
}
})