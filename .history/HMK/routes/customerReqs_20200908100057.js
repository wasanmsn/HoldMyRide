
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CustomerDetail from '../components/host/customers/customer_details'
import Customers from '../components/host/customers/customers'
import { AuthContext } from './stacks';
const { signOut } = React.useContext(AuthContext);
const Stack = createStackNavigator();

function customerReqs (){

    return(
        <Stack.Navigator>
                <Stack.Screen name = 'Customers list' component={Customers}
                options={{
                    headerShown: false
                }}
                />
                <Stack.Screen name = 'Customers Detail' component={CustomerDetail}
                options={{
                    headerShown: false
                }}
                />
        </Stack.Navigator>

    );
    
}
export default customerReqs;
