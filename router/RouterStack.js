import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/login";
import Register from "../screens/register";
import Splash from "../screens/splash";
import Home from "../screens/home";
import RouterTab from "./RouterTabs";
import { AuthContext } from "../src/context/contexts";
import { useContext } from "react";
import PoupanceItem from "../screens/poupanceItem";
import Colors from '../components/collors.json'
import DrawerRoute from './drawer';
const stack = createStackNavigator();
export default function Router() {

  const { user } = useContext(AuthContext);
  return (
    <stack.Navigator>
      <stack.Screen
        component={Splash}
        name="splash"
        options={{
          headerShown: false,
        }}
      />
      {
        user ?
          <stack.Screen
            component={DrawerRoute}
            name="home"
            options={{
              headerShown: false,
            }}
          /> :
          <stack.Screen
            component={Register}
            name="register"
            options={{
              headerShown: false,
            }}
          />
      }


      <stack.Screen
        component={Login}
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <stack.Screen
        component={PoupanceItem}
        name="poupanceitem"
        options={{
          title: 'Detalhes da Poupança',
          headerTintColor: 'white',
          headerStyle: {
            backgroundColor: Colors[0]['new-green']
          }
        }}
      />



    </stack.Navigator>
  );
}
