import React from 'react';
import Profile from '../components/customer/customerprofile';
import Cars from './carStack';
import Parikings from './parking'
import Payments from '../components/customer/payment'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Icon from 'react-native-vector-icons/FontAwesome5';

const Tab = createMaterialBottomTabNavigator();
function bottomtabs(){
    return(
        <Tab.Navigator
        initialRouteName="Parkings"
        tabBarOptions={{ showIcon: true, showLabel: true }}
        >
				<Tab.Screen name = "Parkings" component= {Parikings} 
                    options={{
                        title:'Parkings',
                        tabBarLabel:'Parkings',
                        tabBarIcon:({color}) => (
                            <Icon name="parking" size={20} color={color} />
                        )
                    }}
                      
                />
                <Tab.Screen name = "Profile" component= {Profile}
                    options={{
                        title:'Profile',
                        tabBarLabel:'Profile',
                        tabBarIcon:({color}) => (
                            <Icon name="id-card" size={20} color={color} />
                        )
                    }}
                />
                <Tab.Screen name = "Cars" component= {Cars}
                    options={{
                        title:'Cars',
                        tabBarIcon:({color}) => (
                            <Icon name="car" size={20} color={color} />
                        )
                    }}
                />
                <Tab.Screen name = "Payments" component= {Payments}
                        options={{
                        title:'Payments',
                        tabBarIcon:({color}) => (
                            <Icon name="wallet" size={20} color={color} />
                        )
                    }}
                />
		</Tab.Navigator>
    )
}
export default bottomtabs;