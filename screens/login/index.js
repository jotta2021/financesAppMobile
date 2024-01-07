import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from "react-native";
import ComponenttextInput from "../../components/inputComponent"; // Update the path here
import Logo from "../../assets/splash.png";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";
import ButtonComponent from "../../components/ButtonComponents";
import { AuthContext } from "./../../src/context/contexts";
import ToastManager, { Toast } from "toastify-react-native";

const Login = () => {
  const [visible, setVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation();
  const { singUp, loading, signed } = useContext(AuthContext);

  function handleVisible() {
    setVisible(!visible);
    console.log(visible);
  }

  function login() {
    if (email !== "" && password !== "") {
      singUp(email, password);
    } else {
      Toast.warn("Preencha os campos vazios");
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ToastManager />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={style.container}>
          <Image source={Logo} style={style.logo} />
          <Text style={style.textLogo}>Simplifica</Text>
          <View>
            <Text style={style.title}>Login</Text>
          </View>
          <View style={style.containerInputs}>
            <Text style={style.label}>Email</Text>
            <ComponenttextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <Text style={style.label}>Senha</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <ComponenttextInput
                value={password}
                placeholder="Digite sua senha"
                visible={visible}
                onChangeText={setPassword}
              />
              <Icon
                onPress={handleVisible}
                style={{ position: "absolute", right: 10 }}
                color="grey"
                name={visible ? "visibility" : "visibility-off"}
                size={24}
              />
            </View>
          </View>

          <ButtonComponent
            title={loading ? <ActivityIndicator  color='white'/> : "Login"}
            funcion={login}
          />

          <View style={{ marginTop: 10, alignItems: "center" }}>
            <Text>Ainda não possui uma conta?</Text>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("register");
              }}
            >
              <Text style={{ fontWeight: "600" }}>Crie agora mesmo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Login;

const style = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,

    alignItems: "center",
  },
  containerInputs: {
    gap: 10,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },
  textLogo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  title: {
    marginBottom: 20,
    fontSize: 20,
  },
  label: {
    fontSize: 16,
  },
});
