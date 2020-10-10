import React, { useState } from 'react';
import { Text, View,StyleSheet, TouchableOpacity,ScrollView,Dimensions } from 'react-native';
import { Icon,Divider } from 'react-native-elements';
import firestore, { firebase } from '@react-native-firebase/firestore';
import Header from '../../bar';
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {Card,Dialog,Portal, TextInput,Avatar } from 'react-native-paper'
const { width, height } = Dimensions.get('window');

export default function customers({navigation}){
    const [requests,setRequest] = React.useState([])
    const [coord,setcoord] = React.useState({
        latitude:0,
        longitude:0
    })
    const isFocused = useIsFocused()
    const getReqs = async () => {
        try {
            const ID  = await AsyncStorage.getItem('ID') 
            const data = await firestore().collection('requests').where('host','==',firestore().doc('host/'+ID)).where('status','==',false)
            const obsData = data.onSnapshot(querySnapshots => {

                querySnapshots.docChanges().forEach(change => {

                    if (change){
                        setRequest([])
                    }
                    const docs = querySnapshots.docs.map(doc => {
                        setRequest(prev => [...prev,{data:doc.data(),id:doc.id}])
                    })
                })
            },err => {
                console.log(err)
            })
        } catch (error) {
            console.log(err)
        }
    }
    React.useEffect( () => {
        if(isFocused){
            getReqs()
            Geolocation.getCurrentPosition( info => {
                setcoord(info.coords)               
            })
        }   
        else{
            const unsub = firestore().collection('requests').onSnapshot(() => {
            });
            unsub()            
        }
    },[isFocused])
    return(
        <View>
            <Header />
            <ScrollView style={{height:height*0.8}} >
                <View>
                    {requests.length < 0 ? (<Card>
                        
                        </Card>): 

                    requests.map((item,index) => (<Card key={index} style={{borderColor:'#128cb5',backgroundColor:'#1ca6d4',borderWidth:1,height:70,marginVertical:5,flexDirection:'row',justifyContent:'space-between'}} 
                        onPress={ async () => {
                            navigation.navigate(`Customers Detail`,{
                                request:{
                                    client:await item.data.client.get().then(res => res.id),
                                    date :item.data.date,
                                    days :item.data.days,
                                    distance :item.data.distance,
                                    host : await item.data.host.get().then(res => res.id),
                                    coordinates :item.data.coordinates,
                                    name : item.data.name,
                                    payment_method :item.data.payment_method,
                                    service :item.data.service,
                                    status :item.data.status,
                                    vehicle:await item.data.vehicle.get().then(res => res.id),
                                    total:item.data.total,
                                    location:item.data.location,
                                    id:item.id
                                },coord
                            })
                        }}
                    >
                        <Card.Title title={"ลูกค้า "+item.data.name} subtitle={"ระยะเวลา "+item.data.days+"วัน\nการจ่าย "+item.data.payment_method}/>

                    </Card>))
                   }
                    
                </View>


            </ScrollView>
        </View>
    )
    
    
}