import React, { useState,useContext, useEffect } from 'react';
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
  ActivityIndicator
  
} from 'react-native';
import ComponenttextInput from '../../components/inputComponent'; // Update the path here
import Logo from '../../assets/splash.png';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import ButtonComponent from '../../components/ButtonComponents';
import {AuthContext} from '../../src/context/contexts'
import ToastManager, { Toast } from 'toastify-react-native';

const Register = () => {

  const [visible, setVisible] = useState(false);
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const {singIn,loading,setLoading,user} = useContext(AuthContext)
  const navigation = useNavigation()
  function handleVisible() {
    setVisible(!visible);
    console.log(visible);
  }


  //FUNÇÃO PARA VERIFICAR SE TEM UM USUARIO SALVO NO ASYNC STORAGE, SE TIVER, ELA JA ENVIA O USUARIO DIRETO 

/*useEffect(()=> {
  if(user){
    console.log('Usuario identificado')
    navigation.navigate('home')
  }
})*/

  async function SingIn() {
    console.log(email, name, password);
    if (email !== '' && name !== '' && password !== '') {
   
      await singIn(name,email,password); // Passando todos os dados para a função signIn
    } else {
      setLoading(false)
      Toast.warn('Preencha os campos vazios')
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
    <ToastManager width={200}/>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={style.container}>
            <Image source={Logo} style={style.logo} />
            <Text style={style.textLogo}>Simplifica</Text>
            <View>
             
              <Text style={style.title}>Criar uma conta</Text>
            </View>
            <View style={style.containerInputs}>
              <Text style={style.label}>Nome</Text>
              <ComponenttextInput placeholder="Digite seu nome" 
              value={name}
              onChangeText={setName}
              
              />
              <Text style={style.label}>Email</Text>
              <ComponenttextInput placeholder="Email"
              value={email}
              onChangeText={setEmail}
              />
              <Text style={style.label}>Senha</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <ComponenttextInput
                value={password}
                  placeholder="Crie uma senha"
                  visible={visible}
                  onChangeText={setPassword}
                />
                <Icon
                  onPress={handleVisible}
                  style={{ position: 'absolute', right: 10 }}
                  color="grey"
                  name={visible ? 'visibility' : 'visibility-off'}
                  size={24}
                />
              </View>
            </View>
          
             
         <ButtonComponent
         funcion={SingIn}
         title= {loading ? <ActivityIndicator color='white' /> : 'Criar conta'}
         />
             
            
            
          <View style={{marginTop:10,alignItems:'center'}}>
            <Text>Já possui uma conta?</Text>
         <TouchableOpacity onPress={()=> { navigation.navigate('login') }} >
          <Text style={{fontWeight:'600',}}>
            Entre agora mesmo
          </Text>
          </TouchableOpacity>
          </View>
          </View>
        </TouchableWithoutFeedback>
 
    </SafeAreaView>
  );
};

export default Register;

const style = StyleSheet.create({
  container: {
   flex:1,
   marginTop:50,
   
    alignItems: 'center',
  },
  containerInputs: {
    gap: 10,
  },
  logo: {
    width:50,
    height: 50,
    resizeMode: 'contain',
    
  },
  textLogo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  title: {
    marginBottom: 20,
    fontSize: 20,
  },
  label:{
    fontSize:16
  }
 
});
