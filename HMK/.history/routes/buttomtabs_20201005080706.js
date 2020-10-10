import React from 'react';
import { Text } from 'react-native';
import {Appbar} from 'react-native-paper'

import Icon from 'react-native-vector-icons/FontAwesome5';

function bottomtabs(){
    return(
        <Appbar style= {
            {
                left: 0,
                right: 0,
                bottom: 25,
            }
        }>
            <Appbar.Action icon="parking"  />
            <Text style={{color:'white'}}>Parking</Text>
            <Appbar.Action icon="id-card"  />
            <Text style={{color:'white'}}>Profile</Text>
            <Appbar.Action icon="car"  />
            <Text style={{color:'white'}}>Cars</Text>
            <Appbar.Action icon="wallet"  />
            <Text style={{color:'white'}}>Wallet</Text>
        </Appbar>
    )
}
export default bottomtabs;