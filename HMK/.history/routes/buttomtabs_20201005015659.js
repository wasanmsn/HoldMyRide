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
        style={{ backgroundColor: 'tomato' }}
        >
				<Tab.Screen name = "Parkings" component= {Parikings} 
                    navigationOptions={{
                        tabBarLabel: 'Parkings',
                        tabBarOptions: {
                            showIcon: true,
                            tabBarIcon:() => {
                                <MaterialCommunityIcons name="home"  size={26} />
                            },
                         },
                        
                        
                        
                      }}
                      
                />
                <Tab.Screen name = "Profile" component= {Profile}
                     navigationOptions={{
                        tabBarLabel: 'Profile',
                        tabBarColor: '#009387',
                        tabBarIcon:({color} ) => {
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        }
                      }}
                />
                <Tab.Screen name = "Cars" component= {Cars}
                     navigationOptions={{
                        tabBarLabel: 'Cars',
                        tabBarColor: '#009387',
                        tabBarIcon:({color} ) => {
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        }
                      }}
                />
                <Tab.Screen name = "Payments" component= {Payments}
                     navigationOptions={{
                        tabBarLabel: 'Payments',
                        tabBarColor: '#009387',
                        tabBarIcon:({color} ) => {
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        }
                      }}
                />
		</Tab.Navigator>
    )
}
export default bottomtabs;