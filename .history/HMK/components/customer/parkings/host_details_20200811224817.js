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
const GOOGLE_MAPS_APIKEY = 'AIzaSyA2VgWQCpmBg8I_GUT7rrxe1ANgGKYRq-4';
const defaultImg = '../../../img/account.png'
export default function host_details({route,navigation}){
    const [mapView,setMapView] = React.useState(null)
    const { item,coord,imge } = route.params

    const coordinates = [{latitude:item.houseLocation._latitude,longitude:item.houseLocation._longitude},{latitude:coord.latitude,longitude:coord.longitude}]
    console.log(coordinates)
    return(
        <View>
            <Header />
            <ScrollView >
                <View >
                        <View style={{height:200,flexDirection:'row'}}>
                            <Text>
                            Name : {item.name ? item.name : "This is test name"}
                            </Text>
                            <Image
                            
                            source={ imge ? {uri: imge} : require(defaultImg) }
                            style={{ width: 50, height: 50 ,alignSelf:'flex-end'}}
                            />  
                        </View>
                            <MapView
                                initialRegion={{
                                    latitude: coord.latitude,
                                    longitude: coord.longitude,
                                    latitudeDelta: LATITUDE_DELTA,
                                    longitudeDelta: LONGITUDE_DELTA,
                                }}
                                style={{borderColor:'black',borderWidth:1,height:height/2}}
                            >
                                {coordinates.map( (coordinate,index) => (
                                    
                                     <Marker
                                    key={`Coodinates_${index}`}
                                    coordinate={coordinate}
                                    title={index? "You are here ": "Host"}
                                    description={index  ? item.distancematrix.origin : item.distancematrix.location}
                                    />
                                ))}
                                    <MapViewDirections
                                        origin={coordinates[0]}
                                        waypoints={ coordinates}
                                        destination={coordinates[1]}
                                        apikey={GOOGLE_MAPS_APIKEY}
                                        strokeWidth={3}
                                        strokeColor="hotpink"
                                        optimizeWaypoints={true}
                                        onStart={(params) => {
                                        console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                                        }}
                                        onReady={result => {
                                        console.log(`Distance: ${result.distance} km`)
                                        console.log(`Duration: ${result.duration} min.`)
                                
                                        }}
                                        onError={(errorMessage) => {
                                            console.log('GOT AN ERROR',errorMessage);
                                        }}
                                    />

                            </MapView>
                            

                </View>

            </ScrollView>            

        </View>
    )
}