import React from 'react';
import Profile from '../components/customer/customerprofile';
import Cars from './carStack';
import Parikings from './parking'
import Payments from '../components/customer/payment'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();
function bottomtabs(){
    return(
        <Tab.Navigator
        initialRouteName="Parkings"
        >
				<Tab.Screen name = "Parkings" component= {Parikings} 
                    options={{
                        tabBarLabel: 'Parkings',
                        tabBarColor: '#009387',
                        tabBarIcon:({color} ) => {
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        }
                      }}
                />
                <Tab.Screen name = "Profile" component= {Profile}
                     options={{
                        tabBarLabel: 'Profile',
                        tabBarColor: '#009387',
                      }}
                />
                <Tab.Screen name = "Cars" component= {Cars}
                     options={{
                        tabBarLabel: 'Cars',
                        tabBarColor: '#009387',
                      }}
                />
                <Tab.Screen name = "Payments" component= {Payments}
                     options={{
                        tabBarLabel: 'Payments',
                        tabBarColor: '#009387',
                      }}
                />
		</Tab.Navigator>
    )
}
export default bottomtabs;