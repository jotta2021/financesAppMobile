import React, { useState, useCallback, useMemo, useRef, useContext, useEffect } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import MoneyBag from '../../assets/money-bag.png'
import Objectives from '../../components/objetives';
import Colors from './../../components/collors.json'
// import { Container } from './styles';
import { FAB, Overlay } from '@rneui/themed';
import AddObjective from '../../components/addObjective';
import BottomSheet from '@gorhom/bottom-sheet';
import { AuthContext } from '../../src/context/contexts';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { db } from '../../services/firebaseConfig';
import { doc, getDocs, getDoc, query, collection, where, orderBy, } from 'firebase/firestore'
import Toast from 'react-native-toast-message';
import LottieView from 'lottie-react-native';
export default function Transactions() {
    //serve para simular as minhas metas
    const [metas, setMetas] = useState([
        { id: 1, valor: 1000, objetivo: 'Viagem para São Paulo', quantoEuTenho: 100 },
        { id: 2, valor: 500, objetivo: 'Nova TV', quantoEuTenho: 0.00 },
        { id: 3, valor: 2000, objetivo: 'Festa de Aniversário', quantoEuTenho: 520 }
    ]);

    const [visible, setVisible] = useState(false)
    const { user, itemSelected, setItemSelected, poupances, setPoupances, loading, setLoading, LoadPoupance } = useContext(AuthContext)

    //bottomsheet
    const bottomSheetRef = useRef(null)
    const snapPoints = useMemo(() => ['1', '30%', '75%'], [])
    const closeAction = () => bottomSheetRef.current?.close()
    const handleOpen = () => bottomSheetRef.current?.expand()

    const [index, setIndex] = useState(0)


    useEffect(() => {
        LoadPoupance()

    }, [])
    console.log(poupances)
    return (
        <View style={{ flex: 1, }}>

            {
                loading ?
                    <View style={{ flex: 1, position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={{ position: 'absolute' }}>


                            <LottieView
                                source={require('./../../assets/load.json')}
                                autoPlay loop
                                style={{ width: 120, height: 120 }}
                            />
                        </View>
                    </View>
                    :
                    <View>


                        <View style={{ alignItems: 'center', marginBottom: 20, backgroundColor: Colors[0]['new-green'], height: 'auto', borderBottomRightRadius: 50, borderBottomLeftRadius: 50 }} >


                            <Image source={MoneyBag}
                                style={{ width: 60, height: 60, marginTop: 40 }}
                            />
                            <Text style={styles.title}>O seu cantinho </Text>
                            <Text style={styles.subtitle}>para guardar dinheiro</Text>
                        </View>
                        <View style={{ marginLeft: 10, marginRight: 10, height: '100%' }}>
                            {
                                poupances.length === 0 ?
                                    <Text style={{ fontSize: 16, textAlign: 'center' }}>Você ainda não tem uma poupança...</Text>
                                    : ''
                            }
                            <FlatList
                                data={poupances}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) =>
                                    <Objectives item={item} setItemSelected={setItemSelected} />

                                }
                            />
                        </View>

                    </View>
            }
            {
                loading === true ?
                    '' :
                    <FAB
                        style={{ position: 'absolute', left: 0, right: 0, bottom: 30 }}
                        onPress={handleOpen}
                        icon={{ name: 'add', color: 'white' }}
                        size='large'
                        color={Colors[0]["new-green"]}
                    />
            }


            <BottomSheet
                ref={bottomSheetRef}
                index={index}
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: 'white' }}
                enablePanDownToClose={true}
            >
                <AddObjective Close={closeAction} load={LoadPoupance} />
            </BottomSheet>


        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: 'white'

    },
    subtitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#e6e6e6',
        marginBottom: 30
    }

})