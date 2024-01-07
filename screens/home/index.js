import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Modal,
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
// import { Container } from './styles';

const Home = () => {
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

  //criando constante que vai combinar as despesas e receitas em uma unica lista
  const combinedList = [...incomesData, ...expensesData];

  //função load values

  async function LoadValues() {
    const refDocIncomes = collection(db, "incomes");
    const refDocExpenses = collection(db, "expenses");
    if (user) {
      const userUid = user.uid;
      const incomesQuery = query(refDocIncomes, where("user", "==", userUid),orderBy("createdAt","desc"));
      const incomesSnapshot = await getDocs(incomesQuery);
      const incomeData = incomesSnapshot.docs.map((doc) => ({
        id: doc.id,
        amount: doc.data().amount,
        created: doc.data().createdAt,
        title: doc.data().title,
        type: doc.data().type,
        userUid: userUid,
      }));

      const expensesQuery = query(refDocExpenses, where("user", "==", userUid),orderBy("createdAt","desc"));
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
      console.log(expensesData)
    } 
    try{
      //somando expenses
    let someExpense = 0;
    expensesData.forEach((expensesData) => {
      someExpense += expensesData.amount;
    });
    const formate = someExpense.toFixed(2);
    console.log("expensesTotal:", formate);
    setTotalExpenses(formate);
  

    //somando todos os incomes
    let some = 0;
    incomesData.forEach((incomesData) => {
      some += incomesData.amount;
    });
    const someFormate = some.toFixed(2);
    console.log("incomesTotal", someFormate);
    setTotalIncomes(someFormate);
}
catch(error){
  console.log('erro',error)
}
   
    }

    

  //Função para recuperar os incomes e expenses do usuario logado
  useEffect(() => {
    LoadValues();
  }, [user]);

  //sempre que totalexpenses sofrer alteração esse e feito o calculo do saldo do usuario
  useEffect(() => {
    const saldototal = totalIncomes - totalExpenses;
    console.log(saldototal.toFixed(2));

    const userUpdate = { ...user, saldo: saldototal.toFixed(2) };
    setUser(userUpdate);
    console.log(user);
  }, [totalExpenses, totalIncomes]);

  //função pra abrir e fechar modal para adicionar valores

  function openModal() {
    setVisibleModal(!visibleModal);
  }
  function CloseModal() {
    setVisibleModal(false);
  }

  

  return (
    <View style={{flex:1}}>
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
          horizontal={true}
          data={categorylist}
          keyExtractor={(item) => item.id.toString()} // Garantindo que a chave seja uma string
          renderItem={({ item }) => (
            <Category item={item} /> // Passando o item para o componente Category
          )}
        />
      </View>
    
        <Text style={[styles.contentTitle,{marginStart:10,marginTop:10}]}>Gastos Recentes</Text>

        {expensesData.length> 0 ? 
        
       <FlatList
          data={expensesData.slice(-5)}
          keyExtractor={(item) => item.id.toString()} // Certifique-se de que a chave seja uma string
          renderItem={({ item }) => (
            <RenderAmount item={item}/>
          )}
        />
      : <Text style={{textAlign:'center',marginTop:100,fontSize:16}}>Você ainda não tem nada registrado...</Text>
      }
       
 
      <TouchableOpacity onPress={openModal} style={styles.tab}>
        <AntDesign
          name="pluscircle"
          size={60}
          color={Collors[0]["new-green"]}
        />
      </TouchableOpacity>

      {visibleModal ? (
        <>
          <View style={styles.overlay} />
          <Modal animationType="fade" transparent={true}>
            <View style={styles.modal}>
              <ModalAdd CloseModal={CloseModal} updateRefresh={LoadValues} />
            </View>
          </Modal>
        </>
      ) : null}
    </View>
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
    flexDirection:'row',
    gap:5
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
    position:'absolute',
    padding: 10,
    marginTop: 560,
    right:50,
    left:160,
    
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
  contentTitle:{
    fontSize:18,
    fontWeight:'500',
    marginBottom:5
  }
});
