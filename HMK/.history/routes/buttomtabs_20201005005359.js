import React from 'react';
import Profile from '../components/customer/customerprofile';
import Cars from './carStack';
import Parikings from './parking'
import Payments from '../components/customer/payment'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();
function bottomtabs(){
    return(
        <Tab.Navigator>
				<Tab.Screen name = "Parkings" component= {Parikings} />
				<Tab.Screen name = "Profile" component= {Profile} />
				<Tab.Screen name = "Cars" component= {Cars} />
				<Tab.Screen name = "Payments" component= {Payments} />
		</Tab.Navigator>
    )
}
