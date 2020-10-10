import React, { useState,useMemo } from 'react';
import { Text, View,StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import { Icon,Divider,Button,Image  } from 'react-native-elements';
import Header from '../../bar';
import firestorage from '@react-native-firebase/storage'
import firestore, { firebase } from '@react-native-firebase/firestore';
import {Card} from 'react-native-paper'

const defaultImg = '../../../img/account.png'


function details({route,navigation}){
    const {array,Vname,Vimge,Vid,Vdays} = route.params

    return(
        <View style={page.container}>
            <Header />
            <Card style={{flexDirection:'row',justifyContent:'space-evenly',margin:5}}> 
                <Card.Title title={`รถ ${array.Plate} ${Vname}`} />
                <Card.Content>
                    <View>
                        <Image
                                
                                source={ Vimge ? {uri : Vimge} : require(defaultImg) }
                                style={{ width: 190, height: 185 ,borderColor:'black',borderWidth:2}}
                                />  
                    </View>
                    <Divider style={{margin:5}} />
                    <View style={{padding:5}} >
                        <Text>
                            เช็คอิน {new Date(array.checkIn.seconds*1000).toLocaleDateString()} {'\n'}
                            หมดเวลาภายใน {Vdays} วัน วันที่ {new Date(array.expiredate.seconds*1000).toLocaleDateString()}
                            
                        </Text>
                    </View>

                </Card.Content>
                
            </Card>
            <View style={{flex:2,flexDirection:'row',padding:5,justifyContent: 'space-evenly',}}>
                        
                        <Button title="BACK" containerStyle={{width:100,alignSelf:'flex-end'}} onPress={() => navigation.goBack()} >

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