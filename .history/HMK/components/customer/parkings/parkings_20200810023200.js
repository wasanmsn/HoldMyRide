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
import googleMatrix from 'react-native-google-matrix'
const defaultImg = '../../../img/account.png'
const geoFire = geofirestore.initializeApp(firestore())
const geoCollection = geoFire.collection('host')

const windowWidth = Dimensions.get('window').width;

//queries all nearby by host show the nearest with NAME , DISTANCE 

export default function parkings(){

    const [data,setData] = React.useState([])
    const isFocused = useIsFocused()
    
    React.useEffect(() => {
        if(isFocused){
            Geolocation.getCurrentPosition(info => {
                console.log(info.coords.latitude," ",info.coords.longitude,'distance ', getPreciseDistance(
                    info.coords,
                    { latitude: 14.958995,
                        longitude: 102.044434, },100
                )/1000)
                const origin = toString(info.coords.latitude)+','+toString(info.coords.longitude)
                googleMatrix.get({
                    origin: '-7.841879,110.409193',
                     destination: '-7.741194,110.342588'
                },((err,data) => {
                    if (err) return console.log(err)
                    console.log(data)
                }))

            });
            const query = geoCollection.near({
                center: new firebase.firestore.GeoPoint(14.9017649,102.0082811),radius : 30
            })
            query.get().then(val => {
                val.docs.forEach(id => {
                    firestore().collection('host').doc(id.id).get().then( data => {
                        setData(prev => [...prev,data.data()])
                    })
                })
            }).catch(err => {
                console.log(err)
            })
            console.log("WTF",data)
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
        width:windowWidth,
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