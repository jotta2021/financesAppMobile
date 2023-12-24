import React,{useContext, useState} from 'react';
import { View ,Text,StyleSheet, FlatList, ScrollView} from 'react-native';
import Header from '../../components/header';
import {AuthContext} from './../../src/context/contexts'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Collors from './../../components/collors.json'
import Category from '../../components/category/category';
// import { Container } from './styles';

const Home = () => {

const [categorylist,setCategoryList] = useState([
{
  id: 1,
  title: 'Moradia',
  amount: 'R$ 3250,45',
  icon:  'home'
},
{
  id: 2,
  title: 'Alimentação',
  amount: 'R$ 3250,45',
  icon:  'utensils'
},
{
  id: 3,
  title: 'Transporte',
  amount: 'R$ 3250,45',
  icon:  'car'
},
{

  id: 4,
  title: 'Saúde',
  amount: 'R$ 3250,45',
  icon:  'heartbeat'
},

])
const {user}= useContext(AuthContext)

  return (
    <View>
<Header balance={user.saldo}/>
        <View style={styles.container}>
          <View style={styles.containerAmount}>
            <View style={{flexDirection:'row',gap:5}}>
              <FontAwesome5 name="arrow-alt-circle-up" size={24} color={Collors[0]['green-app']} />
               <Text style={styles.title}>Receitas</Text>
            </View>
         
          <Text style={styles.value}>R$3250,45</Text>
          </View>
          <View style={{width:1,backgroundColor:Collors[0]['grey-app'],height:35}}>

          </View>
          <View style={styles.containerAmount}>
            <View style={{flexDirection:'row',gap:5}}>
            <FontAwesome5 name="arrow-alt-circle-down" size={24} color='red' />
              <Text  style={styles.title}>Despesas</Text>
            </View>
          
          <Text style={styles.value}>R$3250,45</Text>
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.contentTitle}>Gastos por Categorias</Text>
        

          
          <FlatList
          horizontal={true}
  data={categorylist}
  keyExtractor={(item) => item.id.toString()} // Garantindo que a chave seja uma string
  renderItem={({ item }) => (
    <Category item={item} /> // Passando o item para o componente Category
  )}
/>

        </View>
    </View>
  )
}

export default Home;

const styles = StyleSheet.create({
  container: {
  flexDirection:'row',
  alignItems:'center',
  justifyContent:'space-around',
  backgroundColor:'white'
  },
  containerAmount:{
    justifyContent:'center',
    alignItems:'center',
    marginTop:10,
    marginBottom:10
   
  },
  title:{

    fontSize:14,
    fontWeight:'600',
    
  },
  value:{
    fontSize:16,
    fontWeight:'bold',
    
  },
  content:{
    marginStart:10,
    fontSize:16,
    marginTop:8
  }
})