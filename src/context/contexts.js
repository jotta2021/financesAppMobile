import React, { createContext, useEffect, useState } from "react";
import { db, auth } from "../../services/firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Toast } from "toastify-react-native";
import { useNavigation } from "@react-navigation/native";
export const AuthContext = createContext({});

function AuthProvider({ children }) {
  const [user, setUser] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    async function verifyUser() {
      const user = await AsyncStorage.getItem("user");
      
      if (user) {
        setUser(JSON.parse(user));
        console.log('Dados recuperados  do Storage')
        console.log(user);
      }
      try {

        navigation.navigate("home");
      } catch {
        console.log("Erro ao te enviar pra home");
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
        console.log(data);
        setUser(data);
        setLoading(false);
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

  return (
    <AuthContext.Provider
      value={{ singIn, loading, setLoading, signed: !!user, user, singUp ,setUser}}
    >
      {children}
    </AuthContext.Provider>
  );
}
export default AuthProvider;
