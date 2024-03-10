import React, { useContext, useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal,
  Button,
  Dimensions,
  RefreshControl
} from "react-native";
import Header from "../../components/header";
import { AuthContext } from "./../../src/context/contexts";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import Collors from "./../../components/collors.json";
import Category from "../../components/category/category";
import AntDesign from "react-native-vector-icons/AntDesign";
import {
  setDoc,
  collection,
  getDocs,
  doc,
  query,
  where,
  orderBy
} from "firebase/firestore";
import { db } from "../../services/firebaseConfig";
import ModalAdd from "../../components/modalAddComponent";
import RenderAmount from "../../components/renderListAmount";
import BottomSheet from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from "react-native-gesture-handler";
// import { Container } from './styles';
import Toast from "react-native-toast-message";
//importação do Fab ,. botao de adicção
import { FAB } from "@rneui/themed";
import LottieView from "lottie-react-native";
import LogoutIcon from 'react-native-vector-icons/MaterialCommunityIcons'

const Home = () => {
  const [loading, setLoading] = useState(true)
  const [categorylist, setCategoryList] = useState([
    {
      id: 1,
      title: "Moradia",
      amount: "R$ 3250,45",
      icon: "home",
    },
    {
      id: 2,
      title: "Alimentação",
      amount: "R$ 3250,45",
      icon: "utensils",
    },
    {
      id: 3,
      title: "Transporte",
      amount: "R$ 3250,45",
      icon: "car",
    },
    {
      id: 4,
      title: "Saúde",
      amount: "R$ 3250,45",
      icon: "heartbeat",
    },
  ]);
  const { user, setUser } = useContext(AuthContext);
  const [visibleModal, setVisibleModal] = useState(false);
  const [incomesData, setIncomesData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [totalIncomes, setTotalIncomes] = useState("");
  const [totalExpenses, setTotalExpenses] = useState("");
  const [totalpCategoria, setTotalCategoria] = useState([])
  //criando constante que vai combinar as despesas e receitas em uma unica lista
  const [sortedList, setSortedList] = useState([])


  const width = Dimensions.get('window').width;
  //bottomsheet
  const bottomSheetRef = useRef(null)
  const snapPoints = useMemo(() => ['1', '30%', '80%'], [])
  const closeAction = () => bottomSheetRef.current?.close()
  const handleOpen = () => bottomSheetRef.current?.expand()
  const [index, setIndex] = useState(0)

  //função load values

  async function LoadValues() {
    setLoading(true)
    const refDocIncomes = collection(db, "incomes");
    const refDocExpenses = collection(db, "expenses");
    if (user) {
      const userUid = user.uid;
      const incomesQuery = query(refDocIncomes, where("user", "==", userUid), orderBy("createdAt", "desc"));
      const incomesSnapshot = await getDocs(incomesQuery);
      const incomeData = incomesSnapshot.docs.map((doc) => ({
        id: doc.id,
        amount: doc.data().amount,
        created: doc.data().createdAt,
        title: doc.data().title,
        type: doc.data().type,
        userUid: userUid,
      }));

      const expensesQuery = query(refDocExpenses, where("user", "==", userUid), orderBy("createdAt", 'desc'));
      const expensesSnapshot = await getDocs(expensesQuery);
      const expensesData = expensesSnapshot.docs.map((doc) => ({
        id: doc.id,
        amount: doc.data().amount,
        created: doc.data().createdAt,
        title: doc.data().title,
        type: doc.data().type,
        userUid: userUid,
      }));


      setIncomesData(incomeData);
      setExpensesData(expensesData);

    }
    try {
      //somando expenses
      let someExpense = 0;
      expensesData.forEach((expensesData) => {
        someExpense += expensesData.amount;
      });
      const formate = someExpense.toFixed(2);

      setTotalExpenses(formate);


      //somando todos os incomes
      let some = 0;
      incomesData.forEach((incomesData) => {
        some += incomesData.amount;
      });
      const someFormate = some.toFixed(2);

      setTotalIncomes(someFormate);


      //somando dados por categoria
      //armazena os totais de categforias
      let someCategory = {};
      expensesData.forEach((item) => {
        if (item.title in someCategory) {
          someCategory[item.title] += item.amount;
        } else {
          someCategory[item.title] = item.amount
        }

      })

      // Combine and sort incomes and expenses
      const combinedList = [...incomesData, ...expensesData];
      combinedList.sort((a, b) => b.created.toDate() - a.created.toDate());

      setSortedList(combinedList);
      setTotalCategoria(someCategory)
      setLoading(false)


    }
    catch (error) {
      setLoading(false)
      console.log('erro', error)
      Toast.show({
        type: 'error',
        text1: 'Erro ao buscar dados do banco',
        text2: error
      })
    }

  }

  //quando calcular as categorias, a gente envia pro flatlist
  useEffect(() => {
    Categoryfunction()
  }, [totalpCategoria])
  //salva o total nessa state, pra nao ficar em loop infinito
  const [categorias, setCategorias] = useState([])
  function Categoryfunction() {
    const categorias = Object.keys(totalpCategoria).map((categoria) => ({
      category: categoria,
      total: totalpCategoria[categoria] // Obtenha o total correspondente à categoria
    }));
    setCategorias(categorias)


  }
  //Função para recuperar os incomes e expenses do usuario logado
  useEffect(() => {
    LoadValues();
  }, [user]);

  //sempre que totalexpenses sofrer alteração esse e feito o calculo do saldo do usuario
  useEffect(() => {
    if (user) {
      const saldototal = totalIncomes - totalExpenses;


      const userUpdate = { ...user, saldo: saldototal.toFixed(2) };
      setUser(userUpdate);
    }


  }, [totalExpenses, totalIncomes]);

  //função pra abrir e fechar modal para adicionar valores

  function openModal() {
    setVisibleModal(!visibleModal);
  }
  function CloseModal() {
    setVisibleModal(false);
  }



  return (
    <GestureHandlerRootView style={{ flex: 1 }}>

      {loading ?




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
        <View style={{ flex: 1 }}>
          <Header balance={user.saldo} />
          <View style={styles.container}>
            <View style={styles.containerAmount}>

              <FontAwesome5
                name="arrow-alt-circle-up"
                size={30}
                color={Collors[0]["green-app"]}
              />
              <View >
                <Text style={styles.title}>Receitas</Text>
                <Text style={styles.value}>R${totalIncomes}</Text>
              </View>


            </View>
            <View
              style={{
                width: 1,
                backgroundColor: Collors[0]["grey-app"],
                height: 35,
              }}
            ></View>
            <View style={styles.containerAmount}>

              <FontAwesome5 name="arrow-alt-circle-down" size={30} color="red" />

              <View >
                <Text style={styles.title}>Despesas</Text>
                <Text style={styles.value}>R${totalExpenses}</Text>
              </View>
            </View>
          </View>
          <View style={styles.content}>
            <Text style={styles.contentTitle}>Gastos por Categorias</Text>

            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal={true}
              data={categorias}
              keyExtractor={(item) => item.category} // Garantindo que a chave seja uma string
              renderItem={({ item }) => (
                <Category item={item} /> // Passando o item para o componente Category
              )}
            />
          </View>

          <Text style={[styles.contentTitle, { marginStart: 10, marginTop: 10 }]}>Histórico Recente</Text>

          {expensesData.length > 0 ?

            <FlatList
              showsVerticalScrollIndicator={false}
              data={sortedList.slice(0, 10)}
              keyExtractor={(item) => item.id.toString()} // Certifique-se de que a chave seja uma string
              renderItem={({ item }) => (
                <RenderAmount item={item} />

              )}
              refreshControl={
                <RefreshControl
                  refreshing={loading}
                  onRefresh={LoadValues}
                />
              }
            />
            : <Text style={{ textAlign: 'center', marginTop: 100, fontSize: 16 }}>Você ainda não tem nada registrado...</Text>
          }




        </View>



      }

      {
        loading ? '' :
          <FAB
            style={{ position: 'absolute', left: 0, right: 0, bottom: 30 }}
            onPress={handleOpen}
            icon={{ name: 'add', color: 'white' }}
            size='large'
            color={Collors[0]["new-green"]}
          />

      }

      <BottomSheet
        ref={bottomSheetRef}
        index={index}
        snapPoints={snapPoints}
        backgroundStyle={{ backgroundColor: 'white' }}
        enablePanDownToClose={true}
      >
        <View>
          <ModalAdd CloseModal={closeAction} updateRefresh={LoadValues} setIndex={setIndex} />
        </View>
      </BottomSheet>
    </GestureHandlerRootView >
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "white",

  },
  containerAmount: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    gap: 5
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    marginStart: 10,
    fontSize: 16,
    marginTop: 8,
  },
  tab: {
    position: 'absolute',
    padding: 10,
    marginTop: 560,
    right: 50,
    left: 160,

  },
  modal: {
    backgroundColor: "white",
    alignItems: "center",

    width: "80%",

    position: "absolute",
    left: "10%", // Ajuste a posição horizontal (esquerda) para alinhar o modal
    top: 20, // Ajuste a posição vertical (topo) para alinhar o modal
    borderRadius: 10,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    position: "absolute",
    top: 0,
    bottom: -100,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  contentTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 5
  }
});
