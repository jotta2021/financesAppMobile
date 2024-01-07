import React from 'react';
import { View,Text,StyleSheet } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Collors from '../collors.json'
import styles from 'toastify-react-native/components/styles';
import {format} from 'date-fns'



export default function RenderAmount({item}){
const data = item.created.toDate()
const formatData = format(data,'dd/MM/yyyy')
console.log(formatData)

const amount = item.amount.toLocaleString('pt-BR',{
    style:'currency',
    currency:'BRL'
})
console.log(amount)
    return(
        <View style={style.container}>
            <View style={{flexDirection:'row',gap:10}}>
                 <FontAwesome5
        name={item.title === 'Moradia' ? 'home' : item.title ==='Saúde' ? 'heartbeat' : item.title === 'Transporte'? 'car' : item.title ==='Alimentação' ? 'utensils' : ''}
         size={24}
         color={Collors[0]['grey-app']}
         /> 
         
         
          <View>
                <Text style={style.desc}>{item.title}</Text>
                <Text style={style.date}>{formatData}</Text>
            </View>
            </View>
       
         <View >
           
            
                <Text style={style.amount} >{amount}</Text>
          
            
         </View>
        
           </View>
    )
}

const style= StyleSheet.create({
container:{
    flexDirection:'row',
    marginStart:10,
    alignItems:"center",
    marginTop:10,
    marginEnd:10,
    justifyContent:'space-between'
   
   
},
desc:{
    fontWeight:'bold',
color:Collors[0]['grey-app'],
fontSize:16

},
date:{
    fontWeight:'500',
    color:Collors[0]['grey-app'],
    fontSize:12
},
amount:{
    fontSize:16,
    fontWeight:'500',
    color: Collors[0]['grey-app']
}
})