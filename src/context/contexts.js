import React, { createContext, useEffect, useState } from "react";
import { db, auth } from "../../services/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, collection, setDoc, getDoc, getDocs, where, orderBy, query } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "toastify-react-native";
import { useNavigation } from "@react-navigation/native";


export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [itemSelected, setItemSelected] = useState([])

  useEffect(() => {
    async function verifyUser() {
      try {
        const userData = await AsyncStorage.getItem("user");

        if (userData) {
          const { email, password } = JSON.parse(userData);
          await singUp(email, password);
          console.log('Login automático realizado com sucesso:', email, password);
          navigation.navigate('home')
        } else {
          console.log('Nenhum dado de usuário encontrado no AsyncStorage.');
        }
      } catch (error) {
        console.error('Erro ao verificar usuário no AsyncStorage:', error);
      }
    }

    verifyUser();
  }, []);


  //função para realizar o cadastro do usuario e salvar os dados no storage
  function singIn(name, email, password) {
    setLoading(true);

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        const uid = value.user.uid;

        await setDoc(doc(db, "user", uid), {
          name: name,
          email: email,
          uid: uid,
          saldo: 0,
        });

        try {
          const saveUser = {
            name: name,
            email: email,
            uid: uid,
            saldo: 0,
            password: password
          };

          await AsyncStorage.setItem("user", JSON.stringify(saveUser));
          setUser(saveUser);
          Toast.success("Usuário cadastrado");
        } catch (error) {
          Toast.error("Erro ao cadastrar usuário");
        } finally {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }

  //função para logar o usuario
  async function singUp(email, password) {
    setLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const uid = user.uid;
      const docRef = doc(db, "user", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        let data = {
          uid: uid,
          saldo: docSnap.data().saldo || 0,
          name: docSnap.data().name || "",
          email: docSnap.data().email || "",

          // adicione outros dados do usuário aqui
        };
        const saveUser = {
          email: email,
          password: password
        };
        console.log(data);
        setUser(data);
        setLoading(false);
        await AsyncStorage.setItem("user", JSON.stringify(saveUser));

        Toast.success("Bem vindo de volta");
        navigation.navigate("home");
      } else {
        Toast.error("Dados do usuário não encontrados");
        setLoading(false);
      }
    } catch (error) {
      if (error.code === "auth/invalid-credential") {
        Toast.error("Senha inválida");
      } else if (error.code === "auth/invalid-email") {
        Toast.error("Email inválido");
      }
      console.log("erro:", error);
      setLoading(false);
    }
  }
  //função pra buscar as poupoancas 
  const [poupances, setPoupances] = useState([])

  /**if (user) {
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
    })); */
  //função para buscar as poupanças existentes
  async function LoadPoupance() {
    const refDoc = collection(db, "poupance");
    setLoading(true)
    if (user) {

      const userUid = user.uid;

      try {
        const Query = query(refDoc, where("user", "==", userUid), orderBy("created", "desc"));
        const snapshot = await getDocs(Query);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          created: doc.data().created,
          title: doc.data().title,
          total_value: doc.data().total_value,
          userUid: doc.data().user,
          value: doc.data().value

        }))
        console.log(data)
        setPoupances(data)
        setLoading(false)
      }
      catch (error) {
        console.log('Erro ao buscar dados')
        Toast.show({
          type: 'error',
          text1: 'Ocorreu um erro',
          text2: error
        })
        setLoading(false)



      }

    }
  }
  return (
    <AuthContext.Provider
      value={{ singIn, loading, setLoading, signed: !!user, user, singUp, setUser, itemSelected, setItemSelected, LoadPoupance, poupances, setPoupances }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
