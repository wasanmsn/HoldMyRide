import React, { useState,useMemo,useEffect } from 'react';
import { Text, View,StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import { Icon,Divider,Button,Image  } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import Header from '../../bar';
import AsyncStorage from '@react-native-community/async-storage';
import * as Keychain from 'react-native-keychain';
import firestorage from '@react-native-firebase/storage';


const defaultImg = '../../../img/account.png'
let useID = ''
function Cars ({navigation}){
    const [vehis,setVehis] = useState([])
    const [imges,setImges] = useState([])
    useEffect(async () => {
        try {
       
            const credit = await Keychain.getGenericPassword()
            const type = await AsyncStorage.getItem("Type")
            const vehicles =  []
            await firestore().collection(type).where('UserName',"==",credit.username).get().then(snapshot => {
                if(!snapshot.empty){
                    snapshot.forEach( data => {
                        useID = data.id
                    })
                }
                
            })
            await firestore().collection('vehicles').where('userID','==',useID).get().then(snapshot => {
                if(snapshot.empty){
                    console.log('This user has no vehicles registered')
                }
                snapshot.forEach( async data => {            
                 await firestorage().refFromURL(data.data().pic).getDownloadURL().then( pic => {
                     setImges([...imges,pic])
                     setVehis([...vehis,data.data()]) 
                })
                 console.log("time")
                })
            })
           
            
        } catch (error) {
            console.log(error)
        }
        
    },[1])
    
    return (
        <View style={page.container}>
            <Header />
            
            <ScrollView style={page.box1}>
                <View>
                {
                vehis.map((item,index) => 
                    
                    (<TouchableOpacity key={item.Plate} style={{borderColor:'black',borderWidth:1,height:85,marginVertical:15,flexDirection:'row',justifyContent:'space-between'}} 
                    onPress={() => navigation.navigate('Detail',{item})} >
                     <View    style={{marginVertical:15,padding:2}}>
                            <Text>
                            {item.Plate} {index} {'\n'}
                            {item.Name}  {'\n'}
                            {item.parkingAt}
                            </Text>
                        </View>
                        <View style={{marginVertical:15,right:20}}>
                            <Text>
                              {item.expiredate == null ? '': "Expires in "+Math.floor((new Date(item.expiredate.seconds*1000).getTime() - new Date().getTime())/(1000*3600*24))+' Days'}
                            </Text>
                            
                        </View>
                        <View style={{marginVertical:15,right:20,alignSelf:'flex-end',position:'relative'}}>
                            
                            <Image
                            
                            source={ imges[index] ? {uri : imges[index]} : require(defaultImg) }
                            style={{ width: 50, height: 50 }}
                            />  
                        </View>
                    </TouchableOpacity>))}
                        
                </View>
               
            </ScrollView>
            <Divider />
            <View style={[page.box2,{justifyContent:'space-evenly',margin:20,padding:15}]}>
                    <Button title="BACK" containerStyle={{width:100}} onPress={() => navigation.goBack()} >

                    </Button>
                   <Button title="ADD" containerStyle={{width:100}} onPress={() => navigation.navigate("addCar",{ useID })}  />
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
