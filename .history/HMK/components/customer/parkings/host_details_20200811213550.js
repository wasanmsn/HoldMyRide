import React, { useState } from 'react';
import {Dimensions,View, Image,TouchableOpacity, StyleSheet,Text, ScrollView} from 'react-native';
import {Avatar} from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import firestore, { firebase } from '@react-native-firebase/firestore';
import firestorage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../../bar';
import Geolocation from '@react-native-community/geolocation';
import * as geofirestore from 'geofirestore'
import { getPreciseDistance } from 'geolib'
import { useIsFocused } from '@react-navigation/native'
import MapViewDirections from 'react-native-maps-directions';
import MapView,{ PROVIDER_GOOGLE, Marker } from 'react-native-maps'
import axios from "axios"

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function host_details({route,navigation}){
    const { item,coord } = route.params
    const origin = {latitude:coord.latitude,longitude:coord.longitude}
    const desti = {latitude:item.houselocation._latitude,longitude:item.houselocation._longitude}
    console.log(item)
    return(
        <View>
            <Header />
            <View >
                <View style={{borderColor:'black',borderWidth:1,height:height/2}}>
                            <MapView
                                initialRegion={{
                                    latitude: coord.latitude,
                                    longitude: coord.longitude,
                                    latitudeDelta: LATITUDE_DELTA,
                                    longitudeDelta: LONGITUDE_DELTA,
                                }}
                                style={StyleSheet.absoluteFill}

                            >
                                <Marker
                                 coordinate={origin}
                                 title={"U R HERE"}
                                 description={item.distancematrix.origin}
                                >
                                <Marker
                                 coordinate={desti}
                                 title={"Host"}
                                 description={item.distancematrix.location}                                
                                >

                                </Marker>
                               
                                </Marker>
                            </MapView>
                            

                </View>
                <Text>
                    Hellow
                </Text>
            </View>            

        </View>
    )
}