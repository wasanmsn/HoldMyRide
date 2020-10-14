import React, { useState,useMemo } from 'react';
import { Text, View,StyleSheet, Alert } from 'react-native';
import { Divider,Image  } from 'react-native-elements';
import {Button,Card} from 'react-native-paper'
import Header from '../../bar';
import firestorage from '@react-native-firebase/storage'
import firestore, { firebase } from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient'
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




function details({route,navigation}){
    const { item } = route.params
    const [imges,setImges] = useState(null)
    const removeCar = async(Plate) =>{
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
                        
                    }).catch(err => {
                        console.log("Cannot delete data\nErr:",err)
                    })
                }).catch(err => {
                    console.log('Cannot delete data\nErr:',err)
                }).then(()=>{
                    Alert.alert('','ได้ทำการเอารถของท่านออกจากระบบแล้ว',[{text:'OK',onPress: () => navigation.goBack()}],{ cancelable: false })
                })
            } )
        })
    
    }
    const checkout = async(Plate,date) =>{
        var diffdate = Math.abs(daysdifference(new Date(date),new Date()))
        var PlateId =''
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
                               status:'available',
                               payment_cofirm:firestore.Timestamp.fromDate(new Date())
                           }).then(async () =>{
                               await firestore().collection('vehicles').doc(doc.id).update( {checkIn:null,expiredate:null,host:"",parkingAt:"",status:"available"})
                               .then(() => console.log("Database has been updated")).catch((err) => console.log("Failed to update. \n Error: "+err.message))
                               
                           }).then( async () => {
                             
                               await doc.data().host.get().then(async doc => {
                                    const host_id = doc.id
                                    await firestore().collection('host').doc(host_id).update({vehicles:firebase.firestore.FieldValue.increment(-1)})
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
                Alert.alert('','Done',[{text:'OK',onPress: () => navigation.goBack()}],{ cancelable: false })
            })
            }  
            catch(err){
                console.log(err)
            } 
        }
        else{
            try{
                var host_id = ''
                await firestore().collection('vehicles').where("Plate","==",Plate).get().then( docs => {
                docs.forEach( async doc => {
                    PlateId = doc.id
                    await doc.data().host.get().then(async doc => {
                        host_id = doc.id
                        await firestore().collection('host').doc(host_id).update({vehicles:firebase.firestore.FieldValue.increment(-1)})
                    })
                    
                } )
            })
            await firestore().collection('vehicles').doc(PlateId).update( {checkIn:null,expiredate:null,host:"",parkingAt:"",status:"available"})
            .then(() => console.log("Database has been updated")).then(()=>{
                Alert.alert('','เช็คเอ้าท์เรียบร้อย',[{text:'OK',onPress: () => navigation.goBack()}],{ cancelable: false })
            }).catch((err) => console.log("Failed to update. \n Error: "+err.message))}
            catch(err){
                console.log(err)
            }
        }
        
        
    }
    useMemo(() => {
        firestorage().refFromURL(item.pic).getDownloadURL().then( uri => {
            setImges(uri)
        })
    },[])
    return(
        <LinearGradient colors={['#78d5f5','#787ff6']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={page.container}>
            <Header />
            <Card style={{flexDirection:'row',justifyContent:'space-evenly',margin:5}}> 
                <Card.Title title={`${item.Plate} ${item.Name}`} />
                <Card.Content>
                <View>
                    <Image
                            
                            source={ imges ? {uri : imges} : require(defaultImg) }
                            style={{ width: 190, height: 185 ,borderColor:'black',borderWidth:2}}
                            />  
                </View>
                <View style={{padding:5}} >
                <Text>
                    เหลืออีก {item.host ? Math.floor((new Date(item.expiredate.seconds*1000).getTime() - new Date().getTime())/(1000*3600*24)) + " วัน \n\n เช็คอินเมื่อ : "+  new Date (item.checkIn.seconds*1000).toDateString()  : "ไม่ได้ฝาก" }
                </Text>        
                </View>
                <View style={{padding:5}} >
                    <Text>
                        จอดที่ {item.parkingAt}
                    </Text>
                </View>
                </Card.Content>
            </Card>
            <Divider />
            
           
            <View style={{flexDirection:'row',padding:5,justifyContent: 'space-evenly',}}>
                
                    <Button  contentStyle={{width:100,backgroundColor:'#1f2798'}} mode='contained' onPress={() => navigation.goBack()} >
                    กลับ
                    </Button>
               
               {item.host ? 
                    <Button  contentStyle={{width:100,backgroundColor:'#1f2798'}} mode='contained' onPress={() => {checkout(item.Plate,item.expiredate.seconds*1000)}}>
                        เช็คเอ้าท์
                    </Button>
                : <Button  contentStyle={{width:100,backgroundColor:'#1f2798'}} mode='contained' onPress={() => removeCar(item.Plate)} >
                    ลบ
                </Button>}
            </View>
        </LinearGradient>
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