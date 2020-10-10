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
                    options={{
                        title:'Parkings'
                    }}
                      
                />
                <Tab.Screen name = "Profile" component= {Profile}
                                        options={{
                                            title:'Parkings'
                                        }}
                />
                <Tab.Screen name = "Cars" component= {Cars}
                                        options={{
                                            title:'Parkings'
                                        }}
                />
                <Tab.Screen name = "Payments" component= {Payments}
                                         options={{
                                            title:'Parkings'
                                        }}
                />
		</Tab.Navigator>
    )
}
export default bottomtabs;