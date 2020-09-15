
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Cars from '../components/customer/cars/cars';
import Details from '../components/customer/cars/details';
import addCar from '../components/customer/cars/addCar';

const Stack = createStackNavigator();

function carStack (){

    return(
        <Stack.Navigator>
                <Stack.Screen name = 'Cars' component={Cars}
                options={{
                    headerShown: false
                }}
                />
                <Stack.Screen name = 'Detail' component={Details}
                options={{
                    headerShown: false
                }}
                />
                <Stack.Screen name = 'addCar' component={addCar}
                options={{
                    headerShown: false
                }}
                />

        </Stack.Navigator>

    );
    
}
export default carStack;
