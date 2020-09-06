import React, { useState } from 'react';
import { Text, View,StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import { Icon,Divider } from 'react-native-elements';
import firestore, { firebase } from '@react-native-firebase/firestore';
import Header from '../../bar';
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage';


export default function customers(){
    const [requests,setRequest] = React.useState([])
    const isFocused = useIsFocused()
    React.useEffect(   () => {
        if(isFocused){
            try {
                const ID  =  AsyncStorage.getItem('ID') 
                const data =  firestore().collection('requests').where('host','==',firestore().doc('host/'+ID)).where('status','==',false)
                var reqs = []
                const obsData = data.onSnapshot(querySnapshots => {
                    const docs = querySnapshots.docs.map(doc => doc.data())

                    setRequest(docs)
                },err => {
                    console.log(err)
                })
                obsData()
            } catch (error) {
                console.log(err)
            }
            
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
            <ScrollView >
                <View>
                    <Text>
                        Days = {requests[0]}
                    </Text>
                </View>


            </ScrollView>
        </View>
    )
    
    
}