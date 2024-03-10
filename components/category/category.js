import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Collors from '../collors.json'
// import { Container } from './styles';

export default function Category({ item, amount }) {
    if (!item.category) {
        return null;
    }
    return (


        <TouchableOpacity style={styles.container}>
            <View style={styles.category}>
                {
                    item.category === 'Moradia' ?
                        <FontAwesome5 name="home" size={24} color={Collors[0]['new-green']} />
                        : item.category === 'Alimentação' ?
                            <FontAwesome5 name="utensils" size={24} color={Collors[0]['new-green']} />
                            : item.category === 'Transporte' ?
                                <FontAwesome5 name="car" size={24} color={Collors[0]['new-green']} />
                                : item.category === 'Saúde' ?
                                    <FontAwesome5 name="heartbeat" size={24} color={Collors[0]['new-green']} />
                                    : null
                }
                <Text style={{ color: 'grey', fontWeight: '700' }}>{item.category}</Text>
                <Text style={{ fontWeight: '500', fontSize: 15, width: 100, textAlign: 'center' }}>{item.total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                })}</Text>


            </View>

        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',


    },
    category: {
        justifyContent: 'center',
        alignItems: "center",
        gap: 5,
        marginTop: 10,
        marginStart: 10,
        backgroundColor: 'white',
        padding: 6,
        borderRadius: 10,
        width: 100,
        height: 90
    }



})