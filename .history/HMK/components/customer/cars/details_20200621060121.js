import React, { useState,useMemo } from 'react';
import { Text, View,StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import { Icon,Divider,Button,Image  } from 'react-native-elements';
import Header from '../../bar';
import firestorage from '@react-native-firebase/storage'
import firestore, { firebase } from '@react-native-firebase/firestore';

const defaultImg = '../../../img/account.png'



async function checkout(Plate){
    var PlateId=''
    await firestore().collection('vehicles').where("Plate","==",Plate).get().then( docs => {
        docs.forEach( doc => {
            PlateId = doc.id
            
        } )
    })
    console.log(docID)
    await firestore().collection('vehicles').doc(PlateId).update( {checkIn:null,expiredate:null,host:"",parkingAt:""})
    .then(() => console.log("Database has been updated")).catch((err) => console.log("Failed to update. \n Error: "+err.message))
    
}

async function removeCar(Plate){
    var PlateId=''
    await firestore().collection('vehicles').where("Plate","==",Plate).get().then( docs => {
        docs.forEach( async doc => {
            var pic = doc.data().pic
            var name = pic.slice(-17)
            var carPicRef = firebase.storage().ref().child(`carPics/${doc.id}/${name}`)
            await firestore().collection('vehicles').doc(doc.id).delete().then(() => {
                carPicRef.delete().then(() => {
                    console.log("Data deleted")
                }).catch(err => {
                    console.log("Cannot delete data\nErr:",err)
                })
            }).catch(err => {
                console.log('Cannot delete data\nErr:',err)
            })
        } )
    })
}

function details({route,navigation}){
    const { item } = route.params
    const [imges,setImges] = useState(null)
    useMemo(() => {
        firestorage().refFromURL(item.pic).getDownloadURL().then( uri => {
            setImges(uri)
        })
    },[])
    return(
        <View style={page.container}>
            <Header />
            <View style={{flexDirection:'row',justifyContent:'space-evenly',margin:5}}> 
                <View style={{justifyContent:'space-evenly'}}>
                    <View    >
                        <Text>Plate number: {item.Plate}</Text>
                    </View>
                    <Divider style={{borderColor:'black',borderWidth:2}}/>
                    <View>
                        <Text>Manufacturer: {item.Name}</Text>
                    </View>
                </View>
                <View>
                    <Image
                            
                            source={ imges ? {uri : imges} : require(defaultImg) }
                            style={{ width: 190, height: 185 ,borderColor:'black',borderWidth:2}}
                            />  
                </View>
            </View>
            <Divider />
            <View style={{padding:5}} >
                <Text>
                    {item.host ? Math.floor((new Date(item.expiredate.seconds*1000).getTime() - new Date().getTime())/(1000*3600*24)) + " Days left \n\n\n Check in date : "+  new Date (item.checkIn.seconds*1000).toDateString()  : "Not Parking" }
                </Text>
            </View>
            <View style={{flex:2,flexDirection:'row',padding:5,justifyContent: 'space-evenly',}}>
                
                    <Button title="BACK" containerStyle={{width:100,alignSelf:'flex-end'}} onPress={() => navigation.goBack()} >

                    </Button>
               
               {item.host ? 
                    <Button title="CHECKOUT" containerStyle={{width:100,alignSelf:'flex-end'}} onPress={() => {checkout(item.Plate)}}>

                    </Button>
                : <Button title="REMOVE" containerStyle={{width:100,alignSelf:'flex-end'}} onPress={() => removeCar(item.Plate)} >

                </Button>}
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