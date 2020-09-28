
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Cars from '../components/host/cars/cars';
import Details from '../components/host/cars/detail';
import { AuthContext } from './stacks';

const Stack = createStackNavigator();

function host_cars (){
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
        </Stack.Navigator>

    );
    
}
export default host_cars;
