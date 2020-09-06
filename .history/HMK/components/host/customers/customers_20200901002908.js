import React, { useState } from 'react';
import { Text, View,StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import { Icon,Divider } from 'react-native-elements';
import Header from '../../bar';

export default function customers(){
    return(
        <View>
            <Header />
            <ScrollView >
                <View>
                    <Text>
                        customers
                    </Text>
                        
                </View>


            </ScrollView>
        </View>
    )
    
    
}