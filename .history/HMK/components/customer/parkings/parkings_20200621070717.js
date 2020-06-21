import React, { useState } from 'react';
import {Dimensions,View, Image,TouchableOpacity, StyleSheet,Text, ScrollView} from 'react-native';
import {Avatar} from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import firestore from '@react-native-firebase/firestore';
import firestorage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
import Header from '../../bar';

const defaultImg = '../../../img/account.png'

const windowWidth = Dimensions.get('window').width;

//queries all nearby by host show the nearest with NAME , DISTANCE 

export default function parkings(){

    const testData = [{
        name : 'Wasan',
        distance : '15 km'
        },
        {name:'Fist',
        distance : '18 km'
        }
    ]
   
    return (
        
        <View>
            <Header />
            <ScrollView style={page.box1}>
                <View>
                {
                testData.map((item,index) => 
                    
                    (<TouchableOpacity key={item.name} style={{borderColor:'black',borderWidth:1,height:50,marginVertical:15,flexDirection:'row',justifyContent:'space-between'}} 
                    >
                     <View    style={{marginVertical:15,padding:2}}>
                            <Text>
                            {item.name} {'\n'}
                            {item.distance}  {'\n'}
                            </Text>
                        </View>
                        <View style={{marginVertical:15,right:20,alignSelf:'flex-end',position:'relative'}}>
                            
                            <Image
                            
                            source={ require(defaultImg) }
                            style={{ width: 50, height: 50 }}
                            />  
                        </View>
                    </TouchableOpacity>))}
                        
                </View>
               
            </ScrollView>
            
        </View>
    )
}
const styles = StyleSheet.create({
    bar:{
        flexDirection:'row',
        justifyContent:'center',
        alignSelf:'center',
        height:95,
        width:windowWidth,
        backgroundColor:'#61dafb',

        
    },
    fonts:{
        fontSize:32,
        color:'brown',
        fontWeight:'bold',
        alignSelf:'center',
        marginHorizontal:40
    },
    img:{
        width:35,
        height:35,
        margin:5,
    }
})