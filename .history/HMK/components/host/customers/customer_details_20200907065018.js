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

    const [mapView,setMapView] = React.useState(null)
    const [payment,setpayment] = React.useState({})
    const { request } = route.params
    const [vehicels,setVehi] = React.useState({
        data:{
            name:''
        },
        id:''
    })
    const [visible,setVisible] = React.useState(false)
    const isFocused = useIsFocused()
    const toggleOverlay = () =>{
        setVisible(!visible)
    }
    const getPayment =  async () => {
        try{
            const payment = request.payment
            const payment_data = await firestore().collection('payment_History').doc(payment).get().then(async res => res.data())
            const vehicel  = { data : await payment_data.vehicel.get().then(res => res.data()),
                                id : await payment_data.vehicel.get().then(res => res.id)
            }

            return {payment_data,vehicel}
        }
        catch(err) {
            console.log(err)
        }
        
    }

    useEffect(() => {
        if(isFocused){
            getPayment().then( data => {
                console.log(data.vehicel),
                console.log(data.payment_data)
                setpayment(data.payment_data)
                setVehi(data.vehicel)
            })
        }   
        else{
            setpayment({})
            setVehi({})
        }
    },[isFocused])
    
    useEffect(() =>{
      console.log(payment,'  ',vehicels)  
    },[5000])

    //const coordinates = [{latitude:item.houseLocation._latitude,longitude:item.houseLocation._longitude},{latitude:coord.latitude,longitude:coord.longitude}]

    return(
        <View style={{flex:1}}>
            <Header />
            <ScrollView>
                <View style={styles.nAMEBOX}>
                        <View style={styles.nameNameRow}>
                            <View style={{flex:1}}>
                                <Text style={styles.nameName}>{request.name ? request.name : "This is test name"}</Text>
                            </View>               
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
      margin:15,
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
      backgroundColor: "rgba(0,102,255,1)",
      borderWidth: 1,
      borderColor: "rgba(9,0,255,1)"
    },
    back2: {
      color: "rgba(255,255,255,1)",
      marginTop: 19,
      marginLeft: 44,

    },
    overlar_btns:{
        color: "rgba(255,255,255,1)",
        marginTop: 19,
    },
    cancle_btn:{      width: 100,
                        height:50,
        backgroundColor: "rgba(0,102,255,1)",
        borderWidth: 1,
        borderColor: "rgba(9,0,255,1)",
        marginLeft: 22},
    ok_btn:{      width: 100,height:50,
        backgroundColor: "rgba(0,102,255,1)",
        borderWidth: 1,
        borderColor: "rgba(9,0,255,1)",
        marginLeft: 22},
    done_btn: {
      width: 139,
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
      marginLeft: 44,

    },
    back_btnRow: {
      flexDirection: "row",
      marginTop: 26,
      marginLeft: 29,
      marginRight: 31
    }
  });

