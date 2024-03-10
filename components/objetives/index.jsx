import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { LinearProgress } from '@rneui/themed';
// import { Container } from './styles';
import { useState,useContext } from 'react';
import { useEffect } from 'react';
import Colors from '../collors.json'
import { AuthContext } from '../../src/context/contexts';
import { useNavigation } from '@react-navigation/native';

export default function Objectives({ item }) {
    console.log(item)
    const [progress, setProgress] = useState(0)
const {itemSelected,setItemSelected} = useContext(AuthContext)
    useEffect(() => {
        // Calcular a porcentagem do valor que você tem em relação ao valor esperado
        const percentage = (item.value / item.total_value) * 100;
        setProgress(percentage > 100 ? 100 : percentage); // Limitar a 100% caso o valor seja maior que o esperado
    }, [item.value, item.total_value]);

    const navigation = useNavigation()
    return (
        <TouchableOpacity
            onPress={() => {
                setItemSelected(item)
                navigation.navigate('poupanceitem')}}
        >
            <View style={{ alignItems: 'center', marginTop: 10, flexDirection: 'row', justifyContent: 'space-between', }}>
                <View>
                    <Text style={{ fontSize: 16, fontWeight: '500', color: 'grey' }}>{item.title}</Text>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: 'black' }}>{item.value.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })}</Text>
                </View>
                <View>
                    <Text style={{ fontSize: 18, fontWeight: '500', color: 'grey' }}>{item.total_value.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                    })}</Text>
                </View>

            </View>
            <LinearProgress
                style={{ marginVertical: 10, height: 12, borderRadius: 10, }}
                value={progress / 100}
                variant="determinate"
                color={Colors[0]['green-app']}

            />
        </TouchableOpacity>
    )
}

