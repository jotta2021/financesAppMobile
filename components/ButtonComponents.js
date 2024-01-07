import { TouchableOpacity,Text,StyleSheet } from "react-native"
import Collors from '../components/collors.json'

export default function ButtonComponent ({funcion,title}){
return(

    <TouchableOpacity style={style.button}
    onPress={funcion}
    >
    <Text style={{color:'white',fontSize:18}}>
     {title}
    </Text>
 </TouchableOpacity>

)
}
const style = StyleSheet.create({
    button:{
        width:200,
        height:35,
        borderRadius:10,
        marginTop:15,
        backgroundColor:Collors[0]['new-green'],
        justifyContent:'center',
        alignItems:'center'
      }
})