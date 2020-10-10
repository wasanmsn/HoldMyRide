import React from 'react';
import Profile from '../components/customer/customerprofile';
import Cars from './carStack';
import Parikings from './parking'
import Payments from '../components/customer/payment'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createMaterialBottomTabNavigator();
function bottomtabs(){
    return(
        <Tab.Navigator
        initialRouteName="Parkings"
        style={{ backgroundColor: 'tomato' }}
        >
				<Tab.Screen name = "Parkings" component= {Parikings} 
                            screenOptions={({ route }) => ({
                                tabBarIcon: ({ focused, color, size }) => {
                                  let iconName;
                      
                                  if (route.name === 'Parkings') {
                                    iconName = focused
                                      ? 'information-circle'
                                      : 'information-circle-outline';
                                  } else if (route.name === 'Cars') {
                                    iconName = focused ? 'list-box' : 'list';
                                  }
                      
                                  // You can return any component that you like here!
                                  return <Ionicons name={iconName} size={size} color={color} />;
                                },
                              })}
                              tabBarOptions={{
                                activeTintColor: 'tomato',
                                inactiveTintColor: 'gray',
                              }}
                />
                <Tab.Screen name = "Profile" component= {Profile}
                     navigationOptions={{
                        tabBarLabel: 'Profile',
                        tabBarColor: '#009387',
                        tabBarIcon:({color} ) => {
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        }
                      }}
                />
                <Tab.Screen name = "Cars" component= {Cars}
                     navigationOptions={{
                        tabBarLabel: 'Cars',
                        tabBarColor: '#009387',
                        tabBarIcon:({color} ) => {
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        }
                      }}
                />
                <Tab.Screen name = "Payments" component= {Payments}
                     navigationOptions={{
                        tabBarLabel: 'Payments',
                        tabBarColor: '#009387',
                        tabBarIcon:({color} ) => {
                            <MaterialCommunityIcons name="home" color={color} size={26} />
                        }
                      }}
                />
		</Tab.Navigator>
    )
}
export default bottomtabs;