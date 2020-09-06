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
                    setRequest(prev => [...prev,doc.data()])
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
                    requests.map((item,index) => (<TouchableOpacity key={index} style={{borderColor:'black',borderWidth:1,height:60,marginVertical:5,flexDirection:'row',justifyContent:'space-between'}} 
                   
                    >
                     <View    style={{marginVertical:5,padding:2}}>
                            <Text>
                            Client name : {item.name} {'\n'}
                            Rent time : {item.days} {'\n'}
                            Payment Method: {item.payment_method}
                            </Text>
                        </View>
                    </TouchableOpacity>))
                   :null}
                    
                </View>


            </ScrollView>
        </View>
    )
    
    
}