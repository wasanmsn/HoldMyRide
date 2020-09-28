import React, { useState,useMemo } from 'react';
import { Text, View,StyleSheet, TouchableOpacity,ScrollView, Alert } from 'react-native';
import { Icon,Divider,Button,Image  } from 'react-native-elements';
import Header from '../../bar';
import firestorage from '@react-native-firebase/storage'
import firestore, { firebase } from '@react-native-firebase/firestore';

const defaultImg = '../../../img/account.png'


function daysdifference(date1, date2) {
    // The number of milliseconds in one day
    var ONEDAY = 1000 * 60 * 60 * 24;
    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms);

    // Convert back to days and return
    if(date1 > date2){
        return Math.round(difference_ms/ONEDAY);
    }
    return -Math.round(difference_ms/ONEDAY);
}
async function checkout(Plate,date){
    var diffdate = Math.abs(daysdifference(new Date(date),new Date()))
    if(diffdate){
        try{
            await firestore().collection('vehicles').where("Plate","==",Plate).get().then(  docs => {
            docs.forEach(async doc => {
                await firestore().collection('priceset').get().then( price => {
                    price.forEach( async item => {
                       var prices = item.data()
                       const total = doc.data().Type == "car" ? Math.abs( diffdate*prices.pc) : Math.abs(diffdate*prices.pb)
                       await firestore().collection('payment_History').add({
                           buyer:doc.data().owner,
                           days:diffdate,
                           method:'rent_expired',
                           price:total,
                           saler:doc.data().host,
                           status_payment:true,
                           vehicel:firestore().doc('vehicles/'+doc.id),
                       }).then(async () =>{
                           await firestore().collection('vehicles').doc(doc.id).update( {checkIn:null,expiredate:null,host:"",parkingAt:""})
                           .then(() => console.log("Database has been updated")).catch((err) => console.log("Failed to update. \n Error: "+err.message))
                           
                       }).then( async () => {
                         
                           await doc.data().host.get().then(async doc => {
                               await doc.data().wallet.get().then(async res => {
                                   const id = res.id.replace(/\s+/g, "")
                                   await firestore().collection('wallet').doc(id).update({balance: firebase.firestore.FieldValue.increment(total)})
                                })
                           })
                           await doc.data().owner.get().then( async  doc => {
                               await doc.data().wallet.get().then(async res => {
                                   const newBal = res.data().balance - total
                                   await firestore().collection('wallet').doc(res.id).update({balance: newBal < 0 ? 0 : newBal})
                                })
                          })
                       }) 
                    })
                })   
            })
        }).then(()=>{
            Alert.alert('Done',[{text:'OK',onPress: () => navigation.navigate('Home')}],{ cancelable: false })
        })
        }  
        catch(err){
            console.log(err)
        } 
    }
    else{
        try{await firestore().collection('vehicles').where("Plate","==",Plate).get().then( docs => {
            docs.forEach( doc => {
                PlateId = doc.id
                
            } )
        })
        await firestore().collection('vehicles').doc(PlateId).update( {checkIn:null,expiredate:null,host:"",parkingAt:""})
        .then(() => console.log("Database has been updated")).then(()=>{
            Alert.alert('Done',[{text:'OK',onPress: () => navigation.navigate('Home')}],{ cancelable: false })
        }).catch((err) => console.log("Failed to update. \n Error: "+err.message))}
        catch(err){
            console.log(err)
        }
    }
    
    
}

async function removeCar(Plate,navigation){
    var PlateId=''
    const id = await AsyncStorage.getItem("ID")
    await firestore().collection('vehicles').where("Plate","==",Plate).get().then( docs => {
        docs.forEach( async doc => {
            var pic = doc.data().pic
            var name = pic.slice(-17)
            var carPicRef = firebase.storage().ref().child(`carPics/${id}/${name}`)
            await firestore().collection('vehicles').doc(doc.id).delete().then(() => {
                carPicRef.delete().then(() => {
                    console.log("Data deleted")
                    navigation.goBack()
                    
                }).catch(err => {
                    console.log("Cannot delete data\nErr:",err)
                })
            }).catch(err => {
                console.log('Cannot delete data\nErr:',err)
            }).then(()=>{
                Alert.alert('Your vehicle has been removed.',[{text:'OK',onPress: () => navigation.navigate('Home')}],{ cancelable: false })
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
                <Text>
                    Parking At {item.parkingAt}
                </Text>
            </View>
            <View style={{flex:2,flexDirection:'row',padding:5,justifyContent: 'space-evenly',}}>
                
                    <Button title="BACK" containerStyle={{width:100,alignSelf:'flex-end'}} onPress={() => navigation.goBack()} >

                    </Button>
               
               {item.host && new Date(item.expiredate.seconds*1000) <= new Date() ? 
                    <Button title="CHECKOUT" containerStyle={{width:100,alignSelf:'flex-end'}} onPress={() => {checkout(item.Plate,item.expiredate.seconds*1000)}}>

                    </Button>
                : <Button title="REMOVE" containerStyle={{width:100,alignSelf:'flex-end'}} onPress={() => removeCar(item.Plate,navigation)} >

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