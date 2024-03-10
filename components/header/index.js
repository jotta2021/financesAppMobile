import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import Collors from './../collors.json'
import Icon from 'react-native-vector-icons/AntDesign'

export default function Header({ balance }) {


    const months = [
        { month: 'Janeiro', id: 1 },
        { month: 'Fevereiro', id: 2 },
        { month: 'Março', id: 3 },
        { month: 'Abril', id: 4 },
        { month: 'Maio', id: 5 },
        { month: 'Junho', id: 6 },
        { month: 'Julho', id: 7 },
        { month: 'Agosto', id: 8 },
        { month: 'Setembro', id: 9 },
        { month: 'Outubro', id: 10 },
        { month: 'Novembro', id: 11 },
        { month: 'Dezembro', id: 12 }
    ];

    const [selectedMonth, setSelectedMonth] = useState('Janeiro')
    const [atived, setAtived] = useState(false)

    function handleMonth(month) {
        console.log(month)
        setSelectedMonth(month)
        setAtived(false)
    }

    function handleAtived() {
        setAtived(true)
    }
    return (
        <SafeAreaView style={styles.header}>

            {
                atived === false ?
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: "center", marginBottom: 20 }}>
                        <TouchableOpacity onPress={handleAtived}>
                            <Icon name='down' size={24} color='white' />
                        </TouchableOpacity>

                        <Text style={{ fontSize: 18, color: 'white', }}>{selectedMonth}</Text>
                    </View> :
                    <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={months}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                onPress={() => handleMonth(item.month)}
                                style={{ marginTop: 40, marginBottom: 20, }}>
                                <Text style={{ fontSize: 18, color: 'white', marginLeft: 15 }}>{item.month}</Text>
                            </TouchableOpacity>
                        )}


                    />
            }






            <Text style={styles.balance}>Saldo Atual</Text>
            <Text style={styles.balanceValue}>R$ {balance}</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: Collors[0]["new-green"],
        alignItems: 'center',

    },
    balance: {

        fontSize: 20,
        color: 'white'
    },

    balanceValue: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20
    }
})