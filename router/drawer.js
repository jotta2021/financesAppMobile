import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from '../screens/home';
import RouterTab from './RouterTabs';
import Colors from '../components/collors.json'

import Exit from '../components/exit';


const Drawer = createDrawerNavigator();

export default function DrawerRoute() {
    return (
        <Drawer.Navigator>
            <Drawer.Screen name="Home" component={RouterTab}
                options={{
                    title: 'Principal',
                    headerTitle: '',
                    headerStyle: { backgroundColor: Colors[0]['new-green'] },
                    headerTintColor: 'white',
                    drawerActiveTintColor: Colors[0]['new-green']
                }}
            />
            <Drawer.Screen name="Sair" component={Exit}
                options={{
                    title: 'Sair',
                    headerTitle: '',
                    headerStyle: { backgroundColor: Colors[0]['new-green'] },
                    headerTintColor: 'white',
                    drawerActiveTintColor: Colors[0]['new-green']
                }}
            />

        </Drawer.Navigator>
    );
}