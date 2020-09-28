import React, { useState,useEffect } from 'react';
import { Text, View,StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SearchBar,Icon,Divider,Image } from 'react-native-elements';
import firestore, { firebase } from '@react-native-firebase/firestore';
import firestorage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native'
import Header from '../../bar';

const defaultImg = '../../../img/account.png'


function Cars ({route,navigation}){
    const [vehicles,setVehicles] = useState([])
    const [imge,setImge] = useState([''])
    const [name,setName] = useState([''])
    const isFocused = useIsFocused()
    const getVehicles = async () => {
        try {
            var datas = []
            const ID  = await AsyncStorage.getItem('ID')
            const data =  firestore().collection('vehicles').where('host','==',firestore().doc('host/'+ID))
            const obsData =  data.onSnapshot(querySnapshots => {
                    querySnapshots.docChanges().forEach(async change => {
                            console.log("Chaged")
                            datas.push(change.doc.data())
                         })
                         datas.forEach(async data => {
                            var name = await data.owner.get().then(res => {
                                setName(prev => [...prev,res.data().Name])
                            })
                            var img = await firestorage().refFromURL(data.pic).getDownloadURL().then( url => {
                                console.log(data.pic,`\n`,data.Plate)
                                setImge(imge => [...imge,url])
                            })
                            
                            
                         })
                         setVehicles(datas)
            },err => {
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }
    function daysdifference(date1, date2) {
        // The number of milliseconds in one day
        var ONEDAY = 1000 * 60 * 60 * 24;
        // Convert both dates to milliseconds
        var date1_ms = date1.getTime();
        var date2_ms = date2.getTime();
        // Calculate the difference in milliseconds
        var difference_ms = Math.abs(date1_ms - date2_ms);

        // Convert back to days and return
        return Math.round(difference_ms/ONEDAY);
    }
    useEffect(() => {
            if(isFocused){
                console.log('hello')
                getVehicles()
                   
            }   
            else{
                console.log('byte')
                const unsub = firestore().collection('vehicles').onSnapshot(() => {
                });
                unsub()   
                console.log(vehicles.length)
            }
        },[isFocused])
    return (
        <View style={page.container}>
            <Header />
            <View style={page.box1}>
                <ScrollView>
                    <View  >
                        {vehicles.map((array,index) => 
                            (
                            <TouchableOpacity key={`${array.Plate}`} style={{borderColor:'black',borderWidth:1,height:85,marginVertical:15,flexDirection:'row',justifyContent:'space-evenly'}} 
                                onPress={() => {
                                    navigation.navigate('Detail',{array,name,imge})
                                }}
                            >
                            <View style={{marginVertical:15,right:20}}>
                                   <Text>
                                   Plate number {array.Plate} {'\n'}
                                   manufacturer {array.Name} {'\n'}
                                   Customer's name {name[index]} 
                                   </Text>
                               </View>
                               <View style={{marginVertical:15,right:20}}>
                                   <Text>
            
                                       {daysdifference(new Date(array.expiredate.seconds*1000),new Date())}
                                        {'\t'}Days left
                                   </Text>
                               </View>
                               <View style={{marginVertical:15,right:20}}>
                                   <Image
                                   
                                   source={ imge[index] ? {uri: imge[index]} : require(defaultImg) }
                                   style={{ width: 50, height: 50 }}
                                   />  
                               </View>
                           </TouchableOpacity>
                            ))}
                    </View>
                </ScrollView>

               
            </View>
            <Divider />
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
