

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';


import host_list from '../components/customer/parkings/parkings'
import host_detail from '../components/customer/parkings/host_details'

const Stack = createStackNavigator();

function parkings (){
    return(
        <Stack.Navigator>
                <Stack.Screen name = 'Host list' component={host_list}
                options={{
                    headerShown: false
                }}
                />
                <Stack.Screen name = 'Detail' component={host_detail}
                options={{
                    headerShown: false
                }}
                />
        </Stack.Navigator>

    );
    
}
export default parkings;
