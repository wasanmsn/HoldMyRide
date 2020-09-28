
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Payments from '../components/host/payments'


const Stack = createStackNavigator();

function payments (){

    return(
        <Stack.Navigator>
                <Stack.Screen name = 'Payments' component={Payments}
                options={{
                    headerShown: false
                }}
                />
        </Stack.Navigator>

    );
    
}
export default payments;
