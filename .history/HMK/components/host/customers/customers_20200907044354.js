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
    const getReqs = async () => {
        try {
            const ID  = await AsyncStorage.getItem('ID') 
            const data = await firestore().collection('requests').where('host','==',firestore().doc('host/'+ID)).where('status','==',false)
            var reqs = []
            const obsData = data.onSnapshot(querySnapshots => {
                console.log(querySnapshots.size)
                const docs = querySnapshots.docs.map(doc => {
                    
                    setRequest(prev => [...prev,{data:doc.data(),id:doc.id}])
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
            <ScrollView style={{position: 'absolute'}} >
                <View>
                    {
                    requests.map((item,index) => (<TouchableOpacity key={index} style={{borderColor:'black',borderWidth:1,height:70,marginVertical:5,flexDirection:'row',justifyContent:'space-between'}} 
                   
                    >
                     <View    style={{marginVertical:5,padding:2}}>
                            <Text>
                            Client name : {item.data.name} {'\n'}
                            Rent time : {item.data.days} Days {requests[10] ? `hello` : `no` } {'\n'}
                            Payment Method: {item.data.payment_method} {index} {item.id}
                            </Text>
                        </View>
                    </TouchableOpacity>))
                   }
                    
                </View>


            </ScrollView>
        </View>
    )
    
    
}