import React, { useState } from 'react';
import { Text, View,StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import { Icon,Divider } from 'react-native-elements';
import firestore, { firebase } from '@react-native-firebase/firestore';
import Header from '../../bar';
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage';

async function getReqs(){

}

export default function customers(){
    const [requests,setRequest] = React.useState([])
    const isFocused = useIsFocused()
    const getReqs = async () => {
        try {
            const ID  = await AsyncStorage.getItem('ID') 
            const data = await firestore().collection('requests').where('host','==',firestore().doc('host/'+ID)).where('status','==',false)
            var reqs = []
            const obsData = data.onSnapshot(querySnapshots => {
                const docs = querySnapshots.docs.map(doc => {
                    setRequest(prev => [...prev,{status:doc.data().status}])
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
                    {requests.length != 0 ? 
                    requests.map((item,index) => (
                        <Text>
                        Days = {item.status ? 4 : 5}
                        
                        </Text>
                    ))
                   :null}
                    
                </View>


            </ScrollView>
        </View>
    )
    
    
}