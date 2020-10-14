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
import { getDistance } from 'geolib'

const defaultImg = '../../../img/account.png'
const geoFire = geofirestore.initializeApp(firestore())
const geoCollection = geoFire.collection('hosts')

const windowWidth = Dimensions.get('window').width;

//queries all nearby by host show the nearest with NAME , DISTANCE 


export default function parkings(){

    const testData = [{
        name : 'Wasan',
        distance : '15 km'
        },
        {name:'Fist',
        distance : '18 km'
        }
    ]
    
    Geolocation.getCurrentPosition(info => {
        console.log(info.coords.latitude," ",info.coords.longitude,'distance ', getDistance(
            info.coords,
            { latitude: 51.525,
                longitude: 7.4575, }
        ))
       
        const query = geoCollection.near({
            center: new firebase.firestore.GeoPoint(info.coords.latitude,info.coords.longitude),radius : 30*1000
        })
        query.get().then(val => {
            console.log(val.docs)
        })
    });
  
    return (
        
        <View>
            <Header />
            <ScrollView style={styles.box1}>
                <View>
                {
                testData.map((item,index) => 
                    
                    (<TouchableOpacity key={item.name} style={{borderColor:'black',borderWidth:1,height:50,marginVertical:5,flexDirection:'row',justifyContent:'space-between'}} 
                    >
                     <View    style={{marginVertical:5,padding:2}}>
                            <Text>
                            Host name : {item.name} {'\n'}
                            Distance : {item.distance}  {'\n'}
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