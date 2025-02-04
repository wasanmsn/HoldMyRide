
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CustomerDetail from '../components/host/customers/customer_details'
import Customers from '../components/host/customers/customers'
import { AuthContext } from './stacks';

const Stack = createStackNavigator();

function customerReqs (){
    const { signOut } = React.useContext(AuthContext);
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
