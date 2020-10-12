
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../components/login';
import Signupcust from '../components/sign_up/sign_up_cust/signupcust';

const Stack = createStackNavigator();

function SignupStacks (){

    return(
        <Stack.Navigator>
                <Stack.Screen name = 'Login' component={Login}
                options={{
                    headerShown: false
                }}
                />
                 <Stack.Screen name = 'Signupcust' component={Signupcust} 
                options={{
                    headerShown: false
                }}
                />

        </Stack.Navigator>

    );
    
}
export default SignupStacks;
