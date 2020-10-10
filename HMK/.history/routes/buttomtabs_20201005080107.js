import React from 'react';
import {Appbar} from 'react-native-paper'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

import Icon from 'react-native-vector-icons/FontAwesome5';

const Tab = createMaterialBottomTabNavigator();
function bottomtabs(){
    return(
        <Appbar style= {
            {
                position: 'absolute',
                bottom: 0,
            }
        }>
            <Appbar.Action icon="bars"  />
            <Appbar.Action icon="parking"  />
            <Appbar.Action icon="id-card"  />
            <Appbar.Action icon="car"  />
            <Appbar.Action icon="wallet"  />
        </Appbar>
    )
}
export default bottomtabs;