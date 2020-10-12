
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../components/login';
import Signuphost from '../components/sign_up/sign_up_host/signuphost';
import Signup from '../components/sign_up/signup';
import uploadimg from '../components/sign_up/sign_up_host/uploadImg';
const Stack = createStackNavigator();

function SignupStacks (){

    return(
        <Stack.Navigator>
                <Stack.Screen name = 'Login' component={Login}
                options={{
                    headerShown: false
                }}
                />
                <Stack.Screen name = 'Signuphost' component={Signuphost} 
                options={{
                    headerShown: false
                }}
                />
                <Stack.Screen name = 'uploadImg' component={uploadimg} options={{headerShown:false}} />
        </Stack.Navigator>

    );
    
}
export default SignupStacks;
