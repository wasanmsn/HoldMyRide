import React from 'react';
import { Text } from 'react-native';
import {BottomNavigation} from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';

function bottomtabs(){
   
    const navigation = useNavigation();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
      { key: 'parkings', title: 'Parkings', icon: 'parking' },
      { key: 'profile', title: 'Profile', icon: 'address-card' },
      { key: 'cars', title: 'Cars', icon: 'car' },
      { key: 'payments', title: 'Wallets', icon: 'wallet' },
    ]);
    const renderScene = BottomNavigation.SceneMap({
        parkings: ParkingsRoute,
        profile: ProfileRoute,
        cars: CarsRoute,
        payments:PatmentsRoute
      });   
      const ParkingsRoute = () => navigation.navigate('Parkings')
      const ProfileRoute = () => navigation.navigate('Profile')
      const CarsRoute = () => navigation.navigate('Cars')
      const PatmentsRoute = () => navigation.navigate('Payments')
    return(
        <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    )
}
export default bottomtabs;