import React from 'react';
import { Text } from 'react-native';
import {Appbar} from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

function bottomtabs(){
    const navigation = useNavigation();   
    return(
        <Appbar style= {
            {
                left: 0,
                right: 0,
                bottom: 25,
            }
        }>

            <Appbar.Action icon="parking"  onPress={() => navigation.navigate('Parkings')} />
            <Text style={{color:'white'}}>Parking</Text>
            <Appbar.Action icon="id-card" onPress={() => navigation.navigate('Profile')}  />
            <Text style={{color:'white'}}>Profile</Text>
            <Appbar.Action icon="car" onPress={() => navigation.navigate('Cars')} />
            <Text style={{color:'white'}}>Cars</Text>
            <Appbar.Action icon="wallet" onPress={() => navigation.navigate('Payments')} />
            <Text style={{color:'white'}}>Wallet</Text>
        </Appbar>
    )
}
export default bottomtabs;