import React from 'react';
import { Text } from 'react-native';
import {BottomNavigation} from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

function bottomtabs(){
    const navigation = useNavigation();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'music', title: 'Music', icon: 'queue-music' },
    ]);
  
    const renderScene = BottomNavigation.SceneMap({
      music: navigation.navigate('Profile'),
    });
    return(
        <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    )
}
export default bottomtabs;