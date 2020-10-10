import React, { useState,useMemo } from 'react';
import { Text, View,StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import { Icon,Divider,Image  } from 'react-native-elements';
import Header from '../../bar';
import firestorage from '@react-native-firebase/storage'
import firestore, { firebase } from '@react-native-firebase/firestore';
import {Card,Button} from 'react-native-paper'
import Linergrade from 'react-native-linear-gradient'
const defaultImg = '../../../img/account.png'



function details({route,navigation}){
    const {array,Vname,Vimge,Vid,Vdays} = route.params
    const convertToString = (date) => {
        var dateString = new Date(date).toLocaleDateString('th-TH',{
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
       })
       var split_date = dateString.split(' ')
       console.log(split_date)
       var concate_date = split_date[0] +" "+ split_date[1]+" " + split_date[2]+" " + " พ.ศ. "+split_date[3]
       return concate_date
    }
    return(
        <Linergrade  colors={['#78d5f5','#787ff6']} start={{x: 0, y: 0}} end={{x: 1, y: 1}}  style={page.container}>
            <Header />
            <Card style={{flexDirection:'row',margin:5,backgroundColor:'#1ca7ec'}}> 
                <Card.Title title={`รถ ${array.Plate} ${Vname}`} />
                <Card.Content>
                    <View>
                        <Image
                                
                                source={ Vimge ? {uri : Vimge} : require(defaultImg) }
                                containerStyle={{alignSelf:'center'}}
                                style={{ width: 190, height: 185 ,borderColor:'black',borderWidth:2,alignSelf:'center'}}
                                />  
                    </View>
                    <Divider style={{margin:5}} />
                    <View style={{padding:5}} >
                        <Text>
                            เช็คอิน {convertToString(new Date(array.checkIn.seconds*1000))} {'\n'}
                            หมดเวลาภายใน {Vdays} วัน วันที่ {convertToString(array.expiredate.seconds*1000)}
                            
                        </Text>
                    </View>
                    <Button>
                        test
                    </Button>

                </Card.Content>
                
            </Card>
            <View>
                <Button contentStyle={{width:100,backgroundColor:'#1f2798'}} mode='contained' onPress={() => navigation.goBack()} > กลับ </Button> 
            </View>
                                 
        </Linergrade>
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