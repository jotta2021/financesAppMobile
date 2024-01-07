import { createStackNavigator } from "@react-navigation/stack";
import Login from "../screens/login";
import Register from "../screens/register";
import Splash from "../screens/splash";
import Home from "../screens/home";
import RouterTab from "./RouterTabs";

const stack = createStackNavigator();
export default function Router() {
  return (
    <stack.Navigator>
      <stack.Screen
        component={Splash}
        name="splash"
        options={{
          headerShown: false,
        }}
      />
      <stack.Screen
        component={Login}
        name="login"
        options={{
          headerShown: false,
        }}
      />
      <stack.Screen
        component={Register}
        name="register"
        options={{
          headerShown: false,
        }}
      />
      <stack.Screen
        component={RouterTab}
        name="home"
        options={{
          headerShown: false,
        }}
      />
    </stack.Navigator>
  );
}
