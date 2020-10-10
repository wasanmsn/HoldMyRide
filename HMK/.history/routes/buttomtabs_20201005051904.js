import React from 'react';
import Profile from '../components/customer/customerprofile';
import Cars from './carStack';
import Parikings from './parking'
import drawer from './customerStack'
import Payments from '../components/customer/payment'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Icon from 'react-native-vector-icons/FontAwesome5';

const Tab = createMaterialBottomTabNavigator();
function bottomtabs({navigation}){
    return(
        <Tab.Navigator
        initialRouteName="Parkings"
        tabBarOptions={{ showIcon: true, showLabel: true }}
        >
                
				<Tab.Screen name = "Parkings" component= {drawer} 
                    options={{
                        title:'Parkings',
                        tabBarLabel:'โฮสต์',
                        tabBarIcon:({color}) => (
                            <Icon name="parking" size={20} color={color} />
                        )
                    }}
                      
                />
                <Tab.Screen name = "Profile" component= {Profile}
                    options={{
                        title:'Profile',
                        tabBarLabel:'โปรไฟล์',
                        tabBarIcon:({color}) => (
                            <Icon name="id-card" size={20} color={color} />
                        )
                    }}
                />
                <Tab.Screen name = "Cars" component= {Cars}
                    options={{
                        title:'Cars',
                        tabBarLabel:'ยานพาหนะ',
                        tabBarIcon:({color}) => (
                            <Icon name="car" size={20} color={color} />
                        )
                    }}
                />
                <Tab.Screen name = "Payments" component= {Payments}
                        options={{
                        title:'Payments',
                        tabBarLabel:'วอลเล็ท',
                        tabBarIcon:({color}) => (
                            <Icon name="wallet" size={20} color={color} />
                        )
                    }}
                />
		</Tab.Navigator>
    )
}
export default bottomtabs;