import React, { useState,useEffect } from 'react';
import {Dimensions,View, Image,TouchableOpacity, StyleSheet,Text, ScrollView, InteractionManager} from 'react-native';
import {Avatar, Input} from 'react-native-elements';
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
import Loading from '../../loading'
import RNPickerSelect from 'react-native-picker-select';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = 'AIzaSyA2VgWQCpmBg8I_GUT7rrxe1ANgGKYRq-4';
const defaultImg = '../../../img/account.png'



export default function host_details({route,navigation}){
    const [isLoading,setLoading] = React.useState(true)
    const [mapView,setMapView] = React.useState(null)
    const [price,setPrice] = React.useState({})
    const { item,coord,imge } = route.params
    const [vehicels,setVehi] = React.useState([])
    const [data,setData] = React.useState({
        checkIn:null,
        expiredate:null,
        host:item.UserName,
        parkingAt:item.distancematrix.location,
        Days:0,
        Service:null,
        PaymentMethod:null,
        Total:0,
        PaymentDate:null,
        ID:item.id,//host ID maybe do something later
        vehicle:null

    })
    const isFocused = useIsFocused()
    const getPrice = async () => {
        try {
            await firestore().collection('priceset').get().then( price => {
                price.forEach( item => {
                   setPrice(item.data())
                })
            })       
        } catch (error) {
            console.log(error)
        }
    }
    const getCars =  async () => {
        var data = []
        try{
            const id = await AsyncStorage.getItem("ID")
            await firestore().collection('vehicles').where('userID','==',id).get().then(snapshot => {
                if(snapshot.empty){
                    console.log('This user has no vehicles registered')
                }
                snapshot.forEach( vehicle => {
                        data.push({label:`${vehicle.data().Name} ${vehicle.data().Plate}`,value:{data:vehicle.data(),ID:vehicle.id}})      
                })
            })
        }
        catch(err) {
            console.log(err)
        }
        return data
    }
    useEffect(() => {
        if(isFocused){
            getCars().then(data => {
                console.log(data)
                setVehi(data)
            })
            getPrice()

        }   
        else{
            setVehi([])
        }
    },[isFocused])
    useEffect(() => {
        setTimeout(() => {
            setLoading(false)
        }, 5000);
    })
    if(isLoading){
        return <Loading />
    }
    const coordinates = [{latitude:item.houseLocation._latitude,longitude:item.houseLocation._longitude},{latitude:coord.latitude,longitude:coord.longitude}]

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
                <View style={styles.car_picker} >
                    <RNPickerSelect
                        onValueChange={(value) => setData({...data,vehicle:value})}
                        items={vehicels
                        }
                    />
                </View>
                <View style={styles.day_picker}>
                    <Input
                        placeholder='Days'
                        onChangeText={(text) => setData({...data,Days:parseInt(text)})}
                    >
                    </Input>

                </View>
                <View style={styles.service_picker}>
                    <RNPickerSelect
                            onValueChange={(value) => setData({...data,Service:value})}
                            items={[{label:"None",value:0},{label:"Pick Up",value:1}]
                            }
                        />
                </View>
                <View style={styles.payment_picker}>
                    <RNPickerSelect
                            onValueChange={(value) => {setData({...data,PaymentMethod:value})
                            }}
                            items={[{label:"Online",value:0},{label:"Ofline",value:1}]
                            }
                        />
                </View>
                <View style={styles.back_btnRow}>
                    <View style={styles.back_btn}>
                        <Text style={styles.back2} onPress={() => {
                            console.log(data)
                        }} >BACK</Text>
                    </View>
                    <View style={styles.done_btn}>
                        <Text style={styles.done2}
                        onPress={() => {
                            console.log(data)
                            const distance = item.distancematrix.distance.value * 0.001
                            var kilo_price = distance < price.distance_rate_k ? parseFloat(price.below_distance_rate) :price.distance_price_k*distance
                            var day_price = data.vehicle.data.Type == "car" ? 100.00*data.Days : 27.00*data.Days
                            console.log(`${kilo_price}, ${day_price}, ${tot}, ${distance}`)
                            setData({...data,Total:data.Service ? kilo_price+day_price : day_price})
                            console.log(data)
                        }}
                        >DONE</Text>
                    </View>
                </View>

            </ScrollView>            

        </View>
    )
}

const styles = StyleSheet.create({
    nAMEBOX: {
        borderWidth: 1,
        borderColor: "#000000",
        width: 360,
        height: 86,
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
    car_picker: {
      width: 272,
      height: 38,
      backgroundColor: "#E6E6E6",
      marginTop: 10,
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