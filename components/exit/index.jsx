import React ,{useContext, useEffect}from 'react';
import { View } from 'react-native';
import { auth } from '../../services/firebaseConfig';
import { signOut } from 'firebase/auth'
import { AuthContext } from '../../src/context/contexts';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

export default function Exit(){
    //quando o usuario clicar em sair no drawer navigation, ele e renderizado pra essapagina
    //que assim que carregada, faz o logout do usuario

    const {user,setUser} = useContext(AuthContext)
    const navigation = useNavigation()
async function Logout(){
    
await signOut(auth)
.then(()=> {
    console.log('Usuário deslogado com sucesso')
    setUser([])
    Toast.show({
        type:'success',
        text1:'Usuário deslogado'
    })
    navigation.navigate('login')
    

})
.catch((error)=> {
    console.log('erro ao deslogar usuário',error)
    Toast.show({
        type:'error',
        text1:'Erro ao deslogar usuário',
        text2:error
    })
})
}
useEffect(()=> {
Logout()

},[])

    return(
        <View>

        </View>
    )
}