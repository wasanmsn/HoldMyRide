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
        <View style={{flex:1}}>
            <Header />
            <ScrollView >
                <View style={styles.nAMEBOX}>
                    <View style={styles.nameNameRow}>
                    <Text style={styles.nameName}>{item.name ? item.name : "This is test name"}</Text>
                    <View style={styles.aVARTAR_FRAME}>
                    <Image
                            source={ imge ? {uri: imge} : require(defaultImg) }
                            style={styles.image}
                            />
                    </View>
                    </View>
                </View>
                <View >
                            <MapView
                                initialRegion={{
                                    latitude: coord.latitude,
                                    longitude: coord.longitude,
                                    latitudeDelta: LATITUDE_DELTA,
                                    longitudeDelta: LONGITUDE_DELTA,
                                }}
                                style={{borderColor:'black',borderWidth:1,height:height/2,marginTop:10}}
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

const styles = StyleSheet.create({
    nAMEBOX: {
      width: 375,
      height: 86,
      backgroundColor: "#E6E6E6",
      flexDirection: "row",
      marginTop: 6
    },
    nameName: {
      fontFamily: "roboto-regular",
      color: "#121212",
      fontSize: 22,
      marginTop: 12
    },
    aVARTAR_FRAME: {
      width: 51,
      height: 50,
      backgroundColor: "#E6E6E6",
      borderWidth: 1,
      borderColor: "#000000",
      marginLeft: 100
    },
    image: {
      width: 50,
      height: 50,
      marginLeft: 1
    },
    nameNameRow: {
      height: 50,
      flexDirection: "row",
      flex: 1,
      marginRight: 24,
      marginLeft: 29,
      marginTop: 17
    },
    mAP: {
      top: 0,
      left: 0,
      height: 152,
      position: "absolute",
      backgroundColor: "#E6E6E6",
      right: 15
    },
    mapView: {
      position: "absolute",
      top: 0,
      left: 0,
      height: 167,
      width: 375
    },
    mAPStack: {
      height: 167,
      marginTop: 38,
      marginRight: -15
    },
    location: {
      fontFamily: "roboto-regular",
      color: "#121212",
      marginTop: -195,
      marginLeft: 29
    },
    car_picker: {
      width: 272,
      height: 38,
      backgroundColor: "#E6E6E6",
      marginTop: 205,
      marginLeft: 52
    },
    day_picker: {
      width: 272,
      height: 38,
      backgroundColor: "#E6E6E6",
      marginTop: 13,
      marginLeft: 54
    },
    service_picker: {
      width: 272,
      height: 38,
      backgroundColor: "#E6E6E6",
      marginTop: 12,
      marginLeft: 52
    },
    payment_picker: {
      width: 272,
      height: 38,
      backgroundColor: "#E6E6E6",
      marginTop: 17,
      marginLeft: 54
    },
    back_btn: {
      width: 139,
      height: 62,
      backgroundColor: "rgba(0,102,255,1)",
      borderWidth: 1,
      borderColor: "rgba(9,0,255,1)"
    },
    back2: {
      fontFamily: "roboto-regular",
      color: "rgba(255,255,255,1)",
      fontSize: 20,
      marginTop: 19,
      marginLeft: 44
    },
    done_btn: {
      width: 139,
      height: 62,
      backgroundColor: "rgba(0,102,255,1)",
      borderWidth: 1,
      borderColor: "rgba(9,0,255,1)",
      marginLeft: 22
    },
    done2: {
      fontFamily: "roboto-regular",
      color: "rgba(255,255,255,1)",
      fontSize: 20,
      marginTop: 19,
      marginLeft: 44
    },
    back_btnRow: {
      height: 62,
      flexDirection: "row",
      marginTop: 26,
      marginLeft: 29,
      marginRight: 31
    }
  });