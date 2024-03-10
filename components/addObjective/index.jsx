import { Button, Input } from '@rneui/themed';
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { AuthContext } from '../../src/context/contexts';
import { TextInput } from 'react-native-gesture-handler';
import MaskInput, { createNumberMask } from 'react-native-mask-input';
import Colors from '../collors.json'
import AntDesign from 'react-native-vector-icons'
import { db } from '../../services/firebaseConfig'
import { addDoc, collection, doc } from 'firebase/firestore'
import Toast from "react-native-toast-message";

// import { Container } from './styles';

/*await addDoc(collection(db, 'incomes'), newIncome);

updateRefresh()
setTimeout(() => {
  setIndex(2)
  setLoading(false)
  CloseModal()
  setAmount('')
  setDesc('')

}, 3000)*/
export default function AddObjective({ Close, load }) {
    const [objetive, setObjetive] = useState('')
    const [totalValue, setTotalValue] = useState('')
    const [valueInit, setValueInit] = useState('')
    const { user, itemSelected, setItemSelected } = useContext(AuthContext)
    console.log(user)
    //formata o input para o formato monetario
    const dollarMask = createNumberMask({
        prefix: ['R', '$', ' '],
        delimiter: '.',
        separator: ',',
        precision: 2,
    })


    function Unformat(value) {
        const unformatedAmount = value.replace(/[^\d,]/g, ''); // Remove tudo exceto números e vírgulas
        const format = parseFloat(unformatedAmount.replace(',', '.')); // Substitui a vírgula por ponto e converte para float
        return format;

    }


    //função prara criar poupança
    async function CreatePoupance() {


        //const pra armazenar os valores

        if (totalValue !== '' && objetive !== '') {
            console.log('Criando Poupança')
            const poupance = {
                title: objetive.toUpperCase(),
                total_value: Unformat(totalValue),
                value: Unformat(valueInit),
                user: user.uid,
                created: new Date()

            }

            await addDoc(collection(db, 'poupance'), poupance)
                .then(() => {
                    console.log('Sua Poupança foi criada')
                    Toast.show({
                        type: 'success',
                        text1: 'Sua Poupança foi criada'
                    })
                    setObjetive('')
                    setTotalValue('')
                    setValueInit('')
                    Close()
                    Keyboard.dismiss()
                    load()
                })
                .catch((error) => {
                    console.log('Erro ao criar poupança', error)
                    Toast.show({
                        type: 'error',
                        text1: 'Erro ao criar poupança',
                        text2: error
                    })
                })
        }
        else {
            Toast.show({
                type: 'info',
                text1: 'Preencha os campos vazios'
            })
            console.log('Preencha os campos vazios')
        }


    }
    return (
        <TouchableWithoutFeedback
            onPress={() => Keyboard.dismiss()}
        >


            <View style={{ marginTop: 10, marginStart: 10, marginEnd: 10 }}>

                <Text style={{ fontSize: 16, color: 'black', fontWeight: 500 }}>Qual o Objetivo da sua Economia?</Text>
                <TextInput
                    style={styles.input}
                    value={objetive}
                    keyboardType='default'
                    onChangeText={(text) => setObjetive(text)

                    }
                />
                <Text style={{ fontSize: 16, color: 'black', fontWeight: 500, marginTop: 10 }}>Qual o valor necessário?</Text>

                <MaskInput
                    style={styles.input}
                    value={totalValue}
                    mask={dollarMask}
                    keyboardType='numeric'
                    onChangeText={(masked, unmasked) => {

                        setTotalValue(masked); // you can use the masked value as well
                    }}

                />
                <Text style={{ fontSize: 16, color: 'black', fontWeight: 500, marginTop: 10 }}>Quanto tem para começar</Text>
                <MaskInput
                    style={styles.input}
                    value={valueInit}
                    mask={dollarMask}
                    keyboardType='numeric'
                    onChangeText={(masked, unmasked) => {

                        setValueInit(masked); // you can use the masked value as well
                    }}
                />
                <View style={{ alignItems: 'center' }}>
                    <Button
                        onPress={CreatePoupance}
                        title={'Iniciar Poupança'}
                        buttonStyle={{ width: 300, borderRadius: 4, marginTop: 20, }}
                        color={Colors[0]['new-green']}
                    />
                </View>


            </View></TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    input: {
        width: 380,
        borderColor: Colors[0]['grey-app'],
        borderBottomWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 22,
        marginTop: 10,
        color: Colors[0]['new-green'],
        fontWeight: '500'
    },

})