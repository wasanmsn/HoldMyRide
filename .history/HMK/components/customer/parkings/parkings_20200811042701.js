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
import MapView,{ PROVIDER_GOOGLE } from 'react-native-maps'
import axios from "axios"

const defaultImg = '../../../img/account.png'
const geoFire = geofirestore.initializeApp(firestore())
const geoCollection = geoFire.collection('host')

const origin = {latitude: 37.3318456, longitude: -122.0296002};
const destination = {latitude: 37.771707, longitude: -122.4053769};
const GOOGLE_MAPS_APIKEY = 'AIzaSyA2VgWQCpmBg8I_GUT7rrxe1ANgGKYRq-4';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



export default function parkings(){

    const [data,setData] = React.useState([])
    const [coord,setCord] = React.useState()
    const isFocused = useIsFocused()
    
    React.useEffect(  () => {
        if(isFocused){
            
            Geolocation.getCurrentPosition( async info => {
                setCord(info.coords)
                const query = geoCollection.near({
                    center: new firebase.firestore.GeoPoint(info.coords.latitude,info.coords.longitude),radius : 30
                })
                await query.get().then(val => {
                    val.docs.forEach(id => {
                        firestore().collection('host').doc(id.id).get().then( data => {
                            console.log(data.data().houseLocation._latitude)
                            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${info.coords.latitude},${info.coords.longitude}&destinations=${data.data().houseLocation._latitude},${data.data().houseLocation._longitude}&key=${GOOGLE_MAPS_APIKEY}`
                            axios.get(url).then( res => {
                                console.log(res)
                                setData(prev => [...prev,data.data()])
                            })
                            
                        })
                    })
                }).catch(err => {
                    console.log(err)
                })
                
            })
        }   
        else{
            setData([])
        }
    },[isFocused])
    return (
        
        <View>
            <Header />
            <ScrollView style={styles.box1}>
                <View>
                {
                data.map((item,index) => 
                    
                    (<TouchableOpacity key={item.UserName} style={{borderColor:'black',borderWidth:1,height:50,marginVertical:5,flexDirection:'row',justifyContent:'space-between'}} 
                    >
                     <View    style={{marginVertical:5,padding:2}}>
                            <Text>
                            Host name : {item.UserName} {'\n'}
                            Distance :
                            </Text>
                        </View>
                        <View style={{right:20,alignSelf:'flex-end',position:'relative'}}>
                            
                            <Image
                            
                            source={ require(defaultImg) }
                            style={{ width: 50, height: 50 }}
                            />  
                        </View>
                    </TouchableOpacity>))}
                        
                </View>


            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    bar:{
        flexDirection:'row',
        justifyContent:'center',
        alignSelf:'center',
        height:95,
        width:width,
        backgroundColor:'#61dafb',

        
    },
    fonts:{
        fontSize:32,
        color:'brown',
        fontWeight:'bold',
        alignSelf:'center',
        marginHorizontal:40
    },
    img:{
        width:35,
        height:35,
        margin:5,
    }
})
const Mapstyles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: 400,
      width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
   });