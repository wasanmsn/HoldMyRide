import React from 'react';
import Profile from '../components/customer/customerprofile';
import Cars from './carStack';
import Parikings from './parking'
import Payments from '../components/customer/payment'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import {Text} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';

const Tab = createMaterialBottomTabNavigator();
function bottomtabs(){
    return(
        <Tab.Navigator
        initialRouteName="Parkings"
        style={{ backgroundColor: 'tomato' }}
        >
				<Tab.Screen name = "Parkings" component= {Parikings} 
                    options={{
                        title:'Parkings',
                        tabBarLabel:'Parkings',
                        tabBarIcon:() => {
                            <Text>WTF</Text>
                        }
                    }}
                      
                />
                <Tab.Screen name = "Profile" component= {Profile}
                    options={{
                        title:'Profile',
                        tabBarLabel:'Profile'
                    }}
                />
                <Tab.Screen name = "Cars" component= {Cars}
                    options={{
                        title:'Cars'
                    }}
                />
                <Tab.Screen name = "Payments" component= {Payments}
                        options={{
                        title:'Payments'
                    }}
                />
		</Tab.Navigator>
    )
}
export default bottomtabs;