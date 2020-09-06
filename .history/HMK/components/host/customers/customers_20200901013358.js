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
    React.useEffect(  async () => {
        if(isFocused){
            try {
                const ID  = await AsyncStorage.getItem('ID') 
                const data = await firestore().collection('requests').where('host','==',firestore().doc('host/'+ID)).where('status','==',false)
                var reqs = []
                const obsData = data.onSnapshot(querySnapshots => {
                    const docs = querySnapshots.docs
                    docs.forEach(elem => {
                        reqs.push(elem.data())
                    })
                    console.log(reqs)
                    return(
                        <View>
                            <Header />
                            <ScrollView >
                                <View>
                
                                        {reqs.map(item => {
                                            <Text key={item.host} >
                                                {item.days}
                                            </Text>
                                        })}
                
                                        
                                </View>
                
                
                            </ScrollView>
                        </View>
                    )
                },err => {
                    console.log(err)
                })
            } catch (error) {
                console.log(err)
            }
            
        }   
        else{
            const unsub = firestore().collection('cities').onSnapshot(() => {
            });
            unsub()            
        }
    },[isFocused])
    return(
        <View>
            <Header />
            <ScrollView >
                <View>

                        {requests.map(item => {
                            <Text key={item.host} >
                                {item.days}
                            </Text>
                        })}

                        
                </View>


            </ScrollView>
        </View>
    )
    
    
}