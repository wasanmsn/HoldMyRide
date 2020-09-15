import React, { useState,useEffect } from 'react';
import {Dimensions,View, Image,TouchableOpacity, StyleSheet,Text, ScrollView, InteractionManager, Alert} from 'react-native';
import {Avatar, Input, Button, Overlay, Divider} from 'react-native-elements';
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
import RNPickerSelect from 'react-native-picker-select';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = 'AIzaSyA2VgWQCpmBg8I_GUT7rrxe1ANgGKYRq-4';
const defaultImg = '../../../img/account.png'
const geoFire = geofirestore.initializeApp(firestore())
const geoCollection = geoFire.collection('requests')

export default function customer_detail({route,navigation}){

    const [payment,setpayment] = React.useState({})
    const [img,setimge] = React.useState('')
    const { request } = route.params
    const [vehicels,setVehi] = React.useState({
        data:{
            name:'',
            Type:''
        },
        id:'',
        img:''

    })
    const [visible,setVisible] = React.useState(false)
    const [coord,setcoord] = React.useState({
        latitude:0,
        longitude:0
    })
    const [coordinates,setcoords] = React.useState([])

    const isFocused = useIsFocused()
    
    const toggleOverlay = () =>{
        setVisible(!visible)
    }
    const getPayment =  async () => {
        try{
            const payment = request.payment
            const payment_data = await firestore().collection('payment_History').doc(payment).get().then(async res => res.data())
            const vehicel  = { data : await payment_data.vehicel.get().then(res => res.data()),
                                id : await payment_data.vehicel.get().then(res => res.id),
                                img : await payment_data.vehicel.get().then(res => res.data().pic),
                               
            }
            return {payment_data,vehicel}
        }
        catch(err) {
            console.log(err)
        }
        
    }

    useEffect(() => {
        if(isFocused){
            Geolocation.getCurrentPosition( info => {
                setcoord(info.coords)
                setcoords([{latitude:info.coords.latitude,longitude:info.coords.longitude},{latitude:request.coordinates._latitude,longitude:request.coordinates._longitude}])
            })
            getPayment().then( async data => {
                console.log(data.vehicel),
                console.log(data.payment_data)
                setpayment(data.payment_data)
                const imge = await firestorage().refFromURL(data.vehicel.img).getDownloadURL()
                setimge(imge)
                setVehi(data.vehicel)
            })
        }   
        else{
            setpayment({})
            setVehi({})
        }
    },[isFocused])


    //const coordinates = [{latitude:item.houseLocation._latitude,longitude:item.houseLocation._longitude},{latitude:coord.latitude,longitude:coord.longitude}]

    return(
        <View style={{flex:1}}>
            <Header />
            <ScrollView>
                <View style={styles.nAMEBOX}>
                        <View style={styles.nameNameRow}>
                            <View style={{flex:1}}>
                                <Text style={styles.nameName}>Customer : {request.name ? request.name : "This is test name"}</Text>
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
                                    style={{borderColor:'black',borderWidth:1,height:height/1.5,marginTop:10}}
                                >
                                    {coordinates.map( (coordinate,index) => (
                                        
                                        <Marker
                                        key={`Coodinates_${index}`}
                                        coordinate={coordinate}
                                        title={index? "You are here ": "Host"}
                                       
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
                                            console.log(`coords : ${coordinates[0].latitude} ${coordinates[1].latitude}`)
                                            console.log(`Distance: ${result.distance} km`)
                                            console.log(`Duration: ${result.duration} min.`)
                                    
                                            }}
                                            onError={(errorMessage) => {
                                                console.log('GOT AN ERROR',errorMessage);
                                            }}
                                        />
                                </MapView>
                    </View>
                    <View style={{height:150,alignSelf:'stretch',borderColor:'black',borderWidth:2}}>
                        <Text style={styles.nameName} >Vehicle</Text>
                        <Text style={styles.nameName} >Plate number : {vehicels.data.Plate} Type : {vehicels.data.Type.toUpperCase()} </Text>
                        <View style={{margin:5}}>
                            <Button title='View Image' onPress={toggleOverlay} containerStyle={{width:144}}></Button>
                        </View>
                    </View>
                    <View style={{height:70,alignSelf:'stretch',borderColor:'black',borderWidth:2}}>
                        <Text style={styles.nameName} >Rent {request.days} days </Text>
                        <Text style={styles.nameName} >Pick up Service {request.pickup == 'pickUp' ? 'Yes' : 'No'} </Text>
                    </View>
                    
                    
            </ScrollView>
           <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{width:250,height:250,backgroundColor:'black'}} >
                        <View>
                        <Image
                            
                            source={ img ? {uri: img} : require(defaultImg) }
                            style={{ width: 250, height: 250,alignSelf:'center' }}
                            />  
                        </View>
           </Overlay>
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
    
  });

