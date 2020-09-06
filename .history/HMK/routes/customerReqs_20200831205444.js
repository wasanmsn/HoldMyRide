
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Customers from '../components/host/customers/customers'

const Stack = createStackNavigator();

function customerReqs (){

    return(
        <Stack.Navigator>
                <Stack.Screen name = 'Customers list' component={Customers}
                options={{
                    headerShown: false
                }}
                />
        </Stack.Navigator>

    );
    
}
export default parkings;
