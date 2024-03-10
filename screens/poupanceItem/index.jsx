import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
import * as Progress from 'react-native-progress'
import { useRoute } from '@react-navigation/native';
import Colors from '../../components/collors.json'
import { Button } from '@rneui/themed';
import { db } from '../../services/firebaseConfig';
import { collection, addDoc, doc, updateDoc, where, query, orderBy, getDocs } from 'firebase/firestore'
import { Overlay } from '@rneui/themed';
import MaskInput, { createNumberMask } from 'react-native-mask-input';
import Toast from 'react-native-toast-message';
// import { Container } from './styles';
import { useContext } from 'react';
import { AuthContext } from '../../src/context/contexts';
import { useNavigation } from '@react-navigation/native';
import { format } from 'date-fns';
export default function PoupanceItem() {

    const { itemSelected, setItemSelected, LoadPoupance, user } = useContext(AuthContext)

    const [progress, setProgress] = useState(0)
    const [newValue, setNewValue] = useState('')
    const [visible, setVisible] = useState(false)
    const [congrulations, setCongrulations] = useState(false)
    const [historic, setHistoric] = useState([])
    const [loading, setLoading] = useState(false)
    const navigation = useNavigation()
    //const pra monitorar sempre que um valor e adicionado na poupanca
    const [add, setAdd] = useState(false)

    useEffect(() => {
        // Calcular a porcentagem do valor que você tem em relação ao valor esperado
        const percentage = (itemSelected.value / itemSelected.total_value) * 100;
        setProgress(percentage > 100 ? 100 : percentage); // Limitar a 100% caso o valor seja maior que o esperado
    }, [itemSelected.value, itemSelected.total_value]);


    const updateValue = itemSelected.value + Unformat(newValue);

    function FormatData(value) {
        const data = value.toDate()
        const form = format(data, 'dd/MM/yyyy')
        return form;
    }
    //função para buscar o historico de depositos

    async function LoadHistoric() {
        setLoading(true)
        const refDoc = collection(db, 'poupanceValues')
        const Query = query(refDoc, where("id_poupance", "==", itemSelected.id), orderBy("date", "desc"));
        const snapshot = await getDocs(Query);
        const data = snapshot.docs.map((doc) => ({
            date: doc.data().date,
            value: doc.data().value
        }))
        if (data) {
            setHistoric(data)
            setLoading(false)
        } else {
            Toast.show({
                text1: 'Erro ao buscar historico',
                type: 'error'
            })
            setLoading(false)
        }

        console.log(data)
    }
    useEffect(() => { LoadHistoric() }, [])

    //função para adicionar um valor no
    async function AddValue() {

        if (newValue !== '') {
            if (updateValue > itemSelected.total_value) {
                console.log('Você já atingiu sua meta')
                Toast.show({
                    type: 'info',
                    text1: 'Você já atingiu sua meta',
                    text2: 'Não é possivel adicionar novo valor',

                })
            } else {
                const response = await addDoc(collection(db, 'poupanceValues'), {
                    value: Unformat(newValue),
                    date: new Date(),
                    id_poupance: itemSelected.id
                }).then(() => {
                    console.log('Valor depositado na sua poupança')
                    setAdd(!add)
                    setVisible(false)
                    setNewValue('')
                    LoadPoupance()
                    Update()
                    Toast.show({
                        type: 'success',
                        text1: 'Parabéns!',
                        text2: `Você adicionou ${newValue} à poupança `
                    })
                })
                    .catch((error) => {
                        console.log('Erro ao adicionar valor', error)
                        Toast.show({
                            type: 'error',
                            text1: 'Parece que algo deu errado',
                            text2: error
                        })
                    })
            }

        } else {
            Toast.show({
                type: 'info',
                text1: 'Preencha os campos vazios'
            })
        }

    }




    //apos adicionar um novo valor, ele soma esse valor ma so valor que ja tinha no banco e atualiza o campo value no banco

    async function Update() {

        const docRef = doc(db, 'poupance', itemSelected.id)
        try {
            await updateDoc(docRef, {
                value: updateValue //adicionando o novo valor
            })

            // Se o novo valor exceder ou igual à meta, exiba a mensagem de parabéns
            if (updateValue >= itemSelected.total_value) {
                setCongrulations(true);

            }

            setTimeout(() => {
                LoadPoupance()
                navigation.navigate('planejament');
            }, 2000)




        } catch (error) {
            console.log(error, 'erro ao atualizar saldo no banco')
        }
    }




    //função pra buscar todo o historico ja feito



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
    return (
        <View style={styled.container}>
            <View style={{ alignItems: 'center' }}>


                <Progress.Circle size={180} progress={progress / 100}
                    color={Colors[0]['new-green']}
                    showsText
                    animated

                />
                <Text style={{ fontSize: 18, marginTop: 10 }}>{itemSelected.title}</Text>
                <View style={styled.containerText}>
                    <View>
                        <Text style={styled.title}>Meta</Text>
                        <Text style={styled.value}>{itemSelected.total_value.toLocaleString('pt-BR', {
                            currency: 'BRL',
                            style: 'currency'
                        })}</Text>
                    </View>
                    <View>
                        <Text style={styled.title}>Valor Atual</Text>
                        <Text style={styled.value}>{itemSelected.value.toLocaleString('pt-BR', {
                            currency: 'BRL',
                            style: 'currency'
                        })}</Text>
                    </View>
                </View>

            </View>
            <Text style={{
                fontSize: 18,
                fontWeight: '500',
                marginBottom: 5,
                textAlign: 'left',
                marginTop: 10

            }}>Histórico </Text>
            {
                historic.length === 0
                    ?
                    <Text style={{ fontSize: 16, }}>Você ainda não adicionou um valor...</Text>
                    : ''}
            {
                loading ?
                    <ActivityIndicator style={{ alignItems: 'center' }} size='small' />
                    :
                    <FlatList
                        data={historic}
                        keyExtractor={(item) => item.date}
                        renderItem={({ item }) =>
                            <View style={{
                                flexDirection: 'row', justifyContent: 'space-between', width: '100%',
                                borderBottomWidth: 1, borderBottomColor: Colors[0]['new-green'], marginBottom: 5
                            }}>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: 'grey' }}>{FormatData(item.date)}</Text>
                                <Text style={{ fontSize: 16, fontWeight: '500', color: Colors[0]['new-green'] }}>{item.value.toLocaleString('pt-BR', {
                                    style: 'currency',
                                    currency: 'BRL'
                                })}</Text>
                            </View>
                        } />
            }

            <Overlay
                animationType='fade'
                isVisible={visible}
                onBackdropPress={() => setVisible(!visible)}
            >

                <View style={{ width: 300, height: 180 }}>
                    <Text style={{ fontSize: 16, fontWeight: '500' }}>Quanto você quer adicionar a sua poupança?</Text>
                    <MaskInput
                        style={styled.input}
                        value={newValue}
                        mask={dollarMask}
                        keyboardType='numeric'
                        onChangeText={(masked, unmasked) => {

                            setNewValue(masked); // you can use the masked value as well
                        }}

                    />
                    <Button title='Adicionar'
                        onPress={AddValue}
                        buttonStyle={{ width: 300, borderRadius: 4, marginTop: 20, }}
                        color={Colors[0]['new-green']}
                    />
                </View>
            </Overlay>
            <View style={{ alignItems: 'center', bottom: 30, position: 'absolute', left: 0, right: 0 }}>
                <Button
                    onPress={() => setVisible(true)}
                    title={'Adicionar valor'}
                    buttonStyle={{ width: 300, borderRadius: 4, marginTop: 20, }}
                    color={Colors[0]['new-green']}

                />
            </View>

            <Overlay
                isVisible={congrulations}
                onBackdropPress={() => setCongrulations(!congrulations)}
            >
                <View style={{ width: 380, height: 350, alignItems: 'center', justifyContent: 'center' }}>
                    <Image style={{ width: 200, height: 200 }} source={require('../../assets/congratulation.png')} />
                    <Text style={{ fontSize: 20, fontWeight: '700' }}>Parabéns!</Text>
                    <Text style={{ fontSize: 20, fontWeight: '700' }}>Você atingiu sua meta!</Text>
                    <Button
                        onPress={() => setCongrulations(false)}
                        title={'Fechar'}
                        buttonStyle={{ width: 300, borderRadius: 4, marginTop: 20, }}
                        color={Colors[0]['new-green']}

                    />
                </View>
            </Overlay>
        </View>
    )
}

const styled = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 20,
        marginStart: 10,
        marginEnd: 10
    },
    containerText: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: 'grey'
    },
    value: {
        fontSize: 16,
        fontWeight: '700',

    },
    input: {
        width: '100%',
        borderColor: Colors[0]['grey-app'],
        borderBottomWidth: 1,
        borderRadius: 8,
        padding: 10,
        fontSize: 18,
        marginTop: 10,
        fontWeight: '500'
    },

})