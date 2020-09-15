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
    const [vehicels,setVehi] = React.useState({})
    const [visible,setVisible] = React.useState(false)
    const isFocused = useIsFocused()
    const toggleOverlay = () =>{
        setVisible(!visible)
    }
    const getPayment =  async () => {
        try{
            const payment = request.payment
            const payment_data = await firestore().collection('payment_History').doc(payment).get().then(res => res.data() )
            return payment_data
        }
        catch(err) {
            console.log(err)
        }
        
    }
    useEffect(() => {
        if(isFocused){
            getPayment().then(async data => {
                setpayment(data)
                await data.vehicel.get().then(res => {
                    setVehi({data:res.data(),id:res.id})
                })
            } )
        }   
        else{
            setpayment({})
            setVehi({})
        }
    },[isFocused])
    
    useEffect(() =>{
      console.log(payment,'  ',vehicels)  
    },5000)

    //const coordinates = [{latitude:item.houseLocation._latitude,longitude:item.houseLocation._longitude},{latitude:coord.latitude,longitude:coord.longitude}]

    return(
        <View style={{flex:1}}>
            <Header />
            
        </View>
    )
}

