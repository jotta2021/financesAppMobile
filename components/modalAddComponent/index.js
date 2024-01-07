import React ,{useState,useContext}from 'react';
import { View,Text,StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import Collors from './../collors.json'
import Icon from 'react-native-vector-icons/AntDesign'
import {AuthContext} from '../../src/context/contexts'
import ToastManager,{ Toast } from 'toastify-react-native';
import {doc,setDoc,collection, addDoc} from 'firebase/firestore'
import {db} from '../../services/firebaseConfig'

// import { Container } from './styles';

export default function ModalAdd({CloseModal,updateRefresh}){
const[selectedType,setSelectedType] = useState('')
const [selectedCategory,setSelectedCategory] = useState('')
const [amount,setAmount] = useState('')
const [desc,setDesc] = useState('')
const {user} = useContext(AuthContext)

function handleTypeIncome(){
    
    setSelectedType('income')
    console.log(selectedType)
}

function handleTypeExpense(){
    setSelectedType('expense')
    console.log(selectedType)
}

function handleCategory(value){
   setSelectedCategory(value)
   console.log(value)
}


//formata o input para um formato monetario
const formatCurrency = (value) => {
    // Remove caracteres não numéricos
    const numericValue = value.replace(/[^0-9]/g, '');

    // Formata o valor para o formato de moeda (por exemplo, R$ 1.000,00)
    let formattedValue = (parseInt(numericValue) / 100).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });

    return formattedValue;
  };

  const handleInputChange = (text) => {
    const formattedAmount = formatCurrency(text);
    setAmount(formattedAmount);
  };


  //função para remover a formatação monetraria antes de enviar pro banco de dados 


 
    


//função para adicionar gastos ou receitas
  async function handleAddAmount() {
 const unformatedAmount = amount.replace(/[^\d,.]/g, '').replace(',', '.');
 const format = parseFloat(unformatedAmount)
 console.log(format)

    try {
      if (selectedType === 'income') {
        const newIncome = {
          title: selectedCategory,
          amount: format,
          type: selectedType,
          createdAt: new Date(),
          user: user.uid
        };
  
        console.log(newIncome);
        try{
          await addDoc(collection(db, 'incomes'), newIncome);
          
          updateRefresh()
          Alert.alert(`${selectedType} Adicionado com sucesso`)
       
        await CloseModal();
        }
        catch(error){
          console.log(error)
          Alert.alert('Erro na solicitação',error)
        }
        
      } else {
        const newExpense = {
          title: selectedCategory,
          amount: format,
          type: selectedType,
          createdAt: new Date(),
          user: user.uid
        };
  
        console.log(newExpense);
        await addDoc(collection(db, 'expenses'), newExpense); 
        updateRefresh()
        Alert.alert(`${selectedType} cadastrada com sucesso`);
       
        
        CloseModal();
      }
    } catch (error) {
      Toast.error('Erro ao cadastrar');
      console.log(error);
    }
  }
  
    return(
         <KeyboardAvoidingView behavior='padding'>
            <ToastManager/>
            <View style={styles.modal}>
                <Icon
                onPress={CloseModal}
                style={{position:'absolute',right:0  ,marginTop:-15}} name='closecircle' size={30} color='red'/>
                <Text style={styles.title}>Adicionar Receita ou Despesa</Text>
                <Text style={{marginBottom:10}}>Selecione o tipo:</Text>
                <View style={{flexDirection:'row',gap:20}}>
                   <TouchableOpacity 
                   onPress={handleTypeIncome}
                   style={selectedType === 'income' ? styles.buttonincomePress: styles.buttonincome}
                   >
                    <Text style={{color:'white',textAlign:'center'}}>Receita</Text>
                </TouchableOpacity>  
                <TouchableOpacity
                onPress={handleTypeExpense}
                style={selectedType === 'expense' ? styles.buttonExpensePress: styles.buttonExpense}
                 >
                    <Text style={{color:'white',textAlign:'center'}}>Despesa</Text>
                </TouchableOpacity> 

         
                </View>

{

  selectedType === 'expense' ? (
    <View>

<Text style={{marginTop:5,marginBottom:10,textAlign:'center'}}>Qual a categoria?</Text> 
                      <View style={{flexDirection:'row',gap:10}}>
                   <TouchableOpacity 
        
                 
                  onPress={()=> handleCategory('Moradia')}
                  style={selectedCategory === 'Moradia'?  styles.buttonCategoryPress: styles.buttonCategory}
                   >
                    <Text style={{color:'white',textAlign:'center'}}>Moradia</Text>
                </TouchableOpacity>  
                <TouchableOpacity
                onPress={()=> handleCategory('Alimentação')}
                style={selectedCategory === 'Alimentação'? styles.buttonCategoryPress : styles.buttonCategory}
                 >
                    <Text style={{color:'white',textAlign:'center'}}>Alimentação</Text>
                </TouchableOpacity> 
                <TouchableOpacity
              onPress={()=> handleCategory('Saúde')}
              style={selectedCategory === 'Saúde'? styles.buttonCategoryPress : styles.buttonCategory}
                 >
                    <Text style={{color:'white',textAlign:'center'}}>Saúde</Text>
                </TouchableOpacity> 
                <TouchableOpacity
                  onPress={()=> handleCategory('Transporte')}
                  style={selectedCategory === 'Transporte'? styles.buttonCategoryPress : styles.buttonCategory}
                 >
                    <Text style={{color:'white',textAlign:'center'}}>Transporte</Text>
                </TouchableOpacity> 
         
                </View>

    </View>
  ) : (


    <TextInput
    style={{marginTop:20, borderWidth:1,borderRadius:10,width:280,height:50}}
    placeholder='Descrição... Ex: Trabalho/horas extras'
    keyboardType='default'
    value={desc}
    onChangeText={(text)=> setDesc(text)}
    
    
    />
  )
}
                
                      
                <Text style={{marginTop:10,marginBottom:10}}>Qual o valor?</Text>
                <TextInput
                style={styles.input}
                placeholder='R$ 0,00'
                keyboardType='numeric'
                onChangeText={handleInputChange}
                value={amount}
                />

                <TouchableOpacity 
                onPress={handleAddAmount}
                style={styles.buttonAdd}>
                    <Text style={{color:'white',fontSize:18}}>
                        Adicionar
                    </Text>
                </TouchableOpacity>
            </View>
</KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
modal:{
 alignItems:'center',
 marginTop:20,
 
  
},
title:{
    fontSize:18,
    fontWeight:'bold',
    marginBottom:5,
    marginTop:20
 
},
buttonincome:{
    backgroundColor: '#d3d3d3',
    width:100,
    height:25,
    borderRadius:8,
    marginTop:5
   
},
buttonincomePress:{
    backgroundColor: Collors[0]['new-green'],
    width:100,
    height:25,
    borderRadius:8,
    marginTop:5
   
},
buttonExpense:{
   
        backgroundColor: '#d3d3d3',
        width:100,
        height:25,
        borderRadius:8,
        marginTop:5
},
buttonExpensePress:{
    backgroundColor: 'red',
    width:100,
    height:25,
    borderRadius:8,
    marginTop:5
},
buttonCategory:{
    
    backgroundColor: '#d3d3d3',
    width:70,
    height:25,
    borderRadius:8,
    marginTop:5
},
buttonCategoryPress:{
    backgroundColor: Collors[0]['new-green'],
    width:70,
    height:25,
    borderRadius:8,
    marginTop:5
}
,input:{
    width:200,
    height:40,
    borderColor:Collors[0]['grey-app'],
    borderWidth:1,
    borderRadius:8,
    padding:10,
    fontSize:16,
    color:Collors[0]['grey-app'],
    marginTop:10
},
buttonAdd:{
    width:200,
    height:40,
    backgroundColor:Collors[0]['new-green'],
    borderRadius:8,
    justifyContent:'center',
    alignItems:'center',
    marginTop:20,
    marginBottom:30
}

})