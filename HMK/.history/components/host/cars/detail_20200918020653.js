import React, { useState,useMemo } from 'react';
import { Text, View,StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import { Icon,Divider,Button,Image  } from 'react-native-elements';
import Header from '../../bar';
import firestorage from '@react-native-firebase/storage'
import firestore, { firebase } from '@react-native-firebase/firestore';

const defaultImg = '../../../img/account.png'



async function checkout(Plate){
    console.log(docID)
    await firestore().collection('vehicles').doc(Plate).update( {checkIn:null,expiredate:null,host:"",parkingAt:""})
    .then(() => console.log("Database has been updated")).catch((err) => console.log("Failed to update. \n Error: "+err.message))
    
}

function details({route,navigation}){
    const {array,Vname,Vimge,Vid,Vdays} = route.params

    return(
        <View style={page.container}>
            <Header />
            <View style={{flexDirection:'row',justifyContent:'space-evenly',margin:5}}> 
                <View style={{justifyContent:'space-evenly'}}>
                    <View    >
                        <Text>Plate number: {array.Plate}</Text>
                    </View>
                    <Divider style={{borderColor:'black',borderWidth:2}}/>
                    <View>
                        <Text>Manufacturer: {Vname}</Text>
                    </View>
                </View>
                <View>
                    <Image
                            
                            source={ Vimge ? {uri : Vimge} : require(defaultImg) }
                            style={{ width: 190, height: 185 ,borderColor:'black',borderWidth:2}}
                            />  
                </View>
            </View>
            <Divider />
            <View style={{padding:5}} >
                <Text>
                    Check in {new Date(array.checkIn.seconds*1000).toLocaleDateString()} {'\n'}
                    Expires in {Vdays} days at {new Date(array.expiredate.seconds*1000).toLocaleDateString()}
                    
                </Text>
            </View>
            <View style={{flex:2,flexDirection:'row',padding:5,justifyContent: 'space-evenly',}}>
                
                    <Button title="BACK" containerStyle={{width:100,alignSelf:'flex-end'}} onPress={() => navigation.goBack()} >

                    </Button>
               
              
                    <Button title="CHECKOUT" containerStyle={{width:100,alignSelf:'flex-end'}} onPress={() => {checkout(Vid)}}>

                    </Button>
                
            </View>
        </View>
    )
}
const page = StyleSheet.create({
    container:{
        flex:1,
        
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

export default details;