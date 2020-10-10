import React from 'react';
import TabNavigator from 'react-native-tab-navigator';


import Icon from 'react-native-vector-icons/FontAwesome5';
import { Text, View } from 'react-native';
import {} from 'react-native-paper'

function bottomtabs({navigation}){
    const [current,setCurrent] = React.useState('home')
    return(
        <TabNavigator>
            <TabNavigator.Item
                selected={this.state.selectedTab === 'home'}
                title="Home"
                renderIcon={() => <Icon name="parking" size={30} color='black' />}
                renderSelectedIcon={() => <Icon name="parking" size={30} color='white' />}
                onPress={() => navigation.navigate('Profile')}>
            </TabNavigator.Item>
            </TabNavigator>
    )
}
export default bottomtabs();