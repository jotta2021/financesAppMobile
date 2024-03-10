import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import Collors from './../collors.json'
import Icon from 'react-native-vector-icons/AntDesign'
import { AuthContext } from '../../src/context/contexts'

import { doc, setDoc, collection, addDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseConfig'
import MaskInput, { createNumberMask } from 'react-native-mask-input';
import LottieView from 'lottie-react-native';
import Ok from '../../assets/ok.json'
import Toast from "react-native-toast-message";
import { Button } from '@rneui/themed';
// import { Container } from './styles';

export default function ModalAdd({ CloseModal, updateRefresh, setIndex }) {
  const [selectedType, setSelectedType] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [amount, setAmount] = useState('')

  //const pra controlar o estado de carregamento da função
  const [loading, setLoading] = useState(false)
  const [desc, setDesc] = useState('')
  const { user } = useContext(AuthContext)

  function handleTypeIncome() {

    setSelectedType('income')

  }

  function handleTypeExpense() {
    setSelectedType('expense')

  }

  function handleCategory(value) {
    setSelectedCategory(value)

  }


  //formata o input para um formato monetario






  //função para remover a formatação monetraria antes de enviar pro banco de dados 





  //função para adicionar gastos ou receitas
  ///e enviar pro banco de dados
  async function handleAddAmount() {
    setLoading(true)
    setIndex(1)
    const unformatedAmount = amount.replace(/[^\d,]/g, ''); // Remove tudo exceto números e vírgulas
    const format = parseFloat(unformatedAmount.replace(',', '.')); // Substitui a vírgula por ponto e converte para float


    try {
      if (selectedType === 'income') {
        const newIncome = {
          title: desc.toUpperCase(),
          amount: format,
          type: selectedType,
          createdAt: new Date(),
          user: user.uid
        };

        console.log('nono', newIncome);
        try {
          await addDoc(collection(db, 'incomes'), newIncome);

          updateRefresh()
          setTimeout(() => {
            setIndex(2)
            setLoading(false)
            CloseModal()
            setAmount('')
            setDesc('')

          }, 3000)



        }
        catch (error) {
          console.log(error)
          Toast.show({
            type: 'error',
            text1: 'Erro na solicitação',
            text2: error
          })

          setLoading(false)
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



        setTimeout(() => {
          setIndex(2)
          setLoading(false)
          CloseModal()
          setAmount('')
          setDesc('')
        }, 3000)


      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao cadastrar'
      })
      console.log(error);
      setLoading(false)
    }
  }

  const dollarMask = createNumberMask({
    prefix: ['R', '$', ' '],
    delimiter: '.',
    separator: ',',
    precision: 2,
  })
  return (
    <KeyboardAvoidingView behavior='padding' style={{ alignItems: 'center' }}  >

      {loading ?
        <View >

          <LottieView
            source={Ok}

            loop
            autoPlay={true}
            style={{ width: 120, height: 120, marginTop: 10 }}

          />
        </View>
        :


        <View style={styles.modal}>

          <Text style={styles.title}>Adicionar Receita ou Despesa</Text>
          <Text style={{ marginBottom: 10, fontSize: 18 }}>Selecione o tipo:</Text>
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <TouchableOpacity
              onPress={handleTypeIncome}
              style={selectedType === 'income' ? styles.buttonincomePress : styles.buttonincome}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Receita</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleTypeExpense}
              style={selectedType === 'expense' ? styles.buttonExpensePress : styles.buttonExpense}
            >
              <Text style={{ color: 'white', textAlign: 'center' }}>Despesa</Text>
            </TouchableOpacity>


          </View>

          {

            selectedType === 'expense' ? (
              <View>

                <Text style={{ marginTop: 5, marginBottom: 10, textAlign: 'center' }}>Qual a categoria?</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity


                    onPress={() => handleCategory('Moradia')}
                    style={selectedCategory === 'Moradia' ? styles.buttonCategoryPress : styles.buttonCategory}
                  >
                    <Text style={{ color: 'white', textAlign: 'center' }}>Moradia</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleCategory('Alimentação')}
                    style={selectedCategory === 'Alimentação' ? styles.buttonCategoryPress : styles.buttonCategory}
                  >
                    <Text style={{ color: 'white', textAlign: 'center' }}>Alimentação</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleCategory('Saúde')}
                    style={selectedCategory === 'Saúde' ? styles.buttonCategoryPress : styles.buttonCategory}
                  >
                    <Text style={{ color: 'white', textAlign: 'center' }}>Saúde</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleCategory('Transporte')}
                    style={selectedCategory === 'Transporte' ? styles.buttonCategoryPress : styles.buttonCategory}
                  >
                    <Text style={{ color: 'white', textAlign: 'center' }}>Transporte</Text>
                  </TouchableOpacity>

                </View>

              </View>
            ) : (


              <TextInput
                style={{ marginTop: 20, borderWidth: 1, borderRadius: 10, width: 280, height: 50 }}
                placeholder='Descrição... Ex: Trabalho/horas extras'
                keyboardType='default'
                value={desc}
                onChangeText={(text) => setDesc(text)}


              />
            )
          }


          <Text style={{ marginTop: 10, marginBottom: 10 }}>Qual o valor?</Text>

          <MaskInput
            style={styles.input}
            value={amount}
            mask={dollarMask}
            onChangeText={(masked, unmasked) => {
              console.log(masked)
              setAmount(masked); // you can use the masked value as well
            }}
          />

          <View style={{ alignItems: 'center' }}>
            <Button
              onPress={handleAddAmount}
              title={'Adicionar valor'}
              buttonStyle={{ width: 300, borderRadius: 4, marginTop: 20, }}
              color={Collors[0]['new-green']}
            />
          </View>

        </View>

      }




    </KeyboardAvoidingView>
  )
}
const styles = StyleSheet.create({
  modal: {
    alignItems: 'center',
    marginTop: 20,


  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 20

  },
  buttonincome: {
    backgroundColor: '#d3d3d3',
    width: 130,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 5
  },
  buttonincomePress: {
    backgroundColor: Collors[0]['new-green'],
    width: 130,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 5

  },
  buttonExpense: {

    backgroundColor: '#d3d3d3',
    width: 130,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 5
  },
  buttonExpensePress: {
    backgroundColor: 'red',
    width: 130,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 5
  },
  buttonCategory: {

    backgroundColor: '#d3d3d3',
    width: 80,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 5,

  },
  buttonCategoryPress: {
    backgroundColor: Collors[0]['new-green'],
    width: 80,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    marginTop: 5
  }
  , input: {
    width: 300,
    height: 40,
    borderColor: Collors[0]['grey-app'],
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: Collors[0]['grey-app'],
    marginTop: 10
  },
  buttonAdd: {
    width: 200,
    height: 40,
    backgroundColor: Collors[0]['new-green'],
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30
  }

})