import React, { useState,useMemo,useEffect } from 'react';
import { Text, View,StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import { Icon,Divider,Button,Image  } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import Header from '../../bar';
import AsyncStorage from '@react-native-community/async-storage';
import * as Keychain from 'react-native-keychain';
import firestorage from '@react-native-firebase/storage';
import { useIsFocused } from '@react-navigation/native'
import {Card,Dialog,Portal, TextInput,Avatar } from 'react-native-paper'

const defaultImg = '../../../img/account.png'
function Cars ({navigation}){
    const [vehis,setVehis] = useState([])
    const [imges,setImges] = useState([])
    const isFocused = useIsFocused()
    const  getcars = async () => {
            try {
                const id = await AsyncStorage.getItem("ID")
                await firestore().collection('vehicles').where('userID','==',id).get().then(snapshot => {
                    if(snapshot.empty){
                        console.log('This user has no vehicles registered')
                    }
                    snapshot.forEach( async data => {            
                     await firestorage().refFromURL(data.data().pic).getDownloadURL().then( pic => {
                         
                         setImges(prev => [...prev,pic])
                         setVehis(prev => [...prev,data.data()]) 
                    })
                    })
                })
               
               
            } catch (error) {
                console.log(error)
               
            }
        }
    useEffect(() => {
        if(isFocused){
            getcars()
        }   
        else{
            setVehis([])
            setImges([])
        }
    },[isFocused])
    
    return (
        <View style={page.container}>
            <Header />
            
            <ScrollView style={page.box1}>
                <View>
                {
                vehis.map((item,index) => 
                    
                    (<Card key={item.Plate} style={{flexDirection:'row',justifyContent:'space-between',padding:5}} 
                    onPress={() => navigation.navigate('Detail',{item})} >
                        <Card.Title
                            title={`${item.Name} ${item.Plate}`}
                            subtitleStyle={{color:'red'}}
                            subtitle={`${item.expiredate == null ? '': "เหลือเวลาอีก "+Math.floor((new Date(item.expiredate.seconds*1000).getTime() - new Date().getTime())/(1000*3600*24))+' วัน'}`}
                            right={(props) => <Avatar.Image
                                {...props}
                                source={ imges[index] ? {uri : imges[index]} : require(defaultImg) }
                                size={50}
                                />   }
                        />
                    </Card>))}
                        
                </View>
               
            </ScrollView>
            <Divider />
            <View style={[page.box2,{justifyContent:'space-evenly',margin:20,padding:15}]}>
                    <Button title="BACK" containerStyle={{width:100}} onPress={() => navigation.goBack()} >

                    </Button>
                   <Button title="ADD" containerStyle={{width:100}} onPress={() => navigation.navigate("addCar")}  />
                </View>
        </View>
    )
}
const page = StyleSheet.create({
    container:{
        flex:1
    },
    box1:{
        flex:2,
        flexDirection:'column',
    },
    box2:{
        flexDirection:'row'
    },
    text1:{
        marginTop:28,
        padding:9,
        color:'#8C7171',
        fontSize:18
    },
    text2:{
        padding:30,
        color:'#8C7171',
        fontSize:12
    }
})
export default Cars;
