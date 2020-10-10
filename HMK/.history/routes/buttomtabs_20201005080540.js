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
                justifyContent:'space-between'
            }
        }>
            <Appbar.Action icon="parking"  >
            <Text>Parking</Text>
            </Appbar.Action>
            
            <Appbar.Action icon="id-card"  />
            <Appbar.Action icon="car"  />
            <Appbar.Action icon="wallet"  />
        </Appbar>
    )
}
export default bottomtabs;