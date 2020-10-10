
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Cars from '../components/customer/cars/cars';
import Details from '../components/customer/cars/details';
import addCar from '../components/customer/cars/addCar';
import { AuthContext } from './stacks';

const Stack = createStackNavigator();

function carStack (){
    const { signOut } = React.useContext(AuthContext);
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
