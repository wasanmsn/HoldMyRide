import React, { useState } from 'react';
import { Text, View,StyleSheet, TouchableOpacity,ScrollView,Dimensions } from 'react-native';
import { Icon,Divider } from 'react-native-elements';
import firestore, { firebase } from '@react-native-firebase/firestore';
import Header from '../../bar';
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage';

const { width, height } = Dimensions.get('window');

export default function customers({navigation}){
    const [requests,setRequest] = React.useState([])
    const isFocused = useIsFocused()
    const getReqs = async () => {
        try {
            const ID  = await AsyncStorage.getItem('ID') 
            const data = await firestore().collection('requests').where('host','==',firestore().doc('host/'+ID)).where('status','==',false)
            var reqs = []
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
                    {
                    requests.map((item,index) => (<TouchableOpacity key={index} style={{borderColor:'black',borderWidth:1,height:70,marginVertical:5,flexDirection:'row',justifyContent:'space-between'}} 
                        onPress={navigation.navigate(`Customers Detail`,{item})}
                    >
                     <View    style={{marginVertical:5,padding:2}}>
                            <Text>
                            Client name : {item.data.name} {'\n'}
                            Rent time : {item.data.days} Days {'\n'}
                            Payment Method: {item.data.payment_method} 
                            </Text>
                        </View>
                    </TouchableOpacity>))
                   }
                    
                </View>


            </ScrollView>
        </View>
    )
    
    
}