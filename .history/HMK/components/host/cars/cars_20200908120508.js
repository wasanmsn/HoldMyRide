import React, { useState,useEffect } from 'react';
import { Text, View,StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SearchBar,Icon,Divider,Image } from 'react-native-elements';
import firestore, { firebase } from '@react-native-firebase/firestore';
import firestorage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native'
import Header from '../../bar';

const defaultImg = '../../../img/account.png'

function Cars (){
    const [vehicles,setVehicles] = useState([])
    const [length,setLength] = useState(0)
    const [imge,setImge] = useState([''])
    const [name,setName] = useState([''])
    const isFocused = useIsFocused()
    const getVehicles = async () => {
        try {
            var datas = []
            const ID  = await AsyncStorage.getItem('ID')
            const data =  firestore().collection('vehicles').where('host','==',firestore().doc('host/'+ID))
            const obsData =  data.onSnapshot(querySnapshots => {
                    setLength(querySnapshots.size)
                    querySnapshots.docChanges().forEach(async change => {

                            console.log("Chaged")
                            datas.push(change.doc.data())

                            
                         })
                         setVehicles(datas)
            },err => {
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }
    const getDatas = async (owner,imge) =>{
            var name = await owner.get().then(res => res.data().Name)
            var img = await firestorage().refFromURL(imge).getDownloadURL()
            setName(preve => [...preve,name])
            setImge(preve => [...preve,img])
            console.log(name,img)                 
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
                        {vehicles.map(array => {
                            getDatas(array.owner,array.pic)
                        })}
                        {vehicles.map(array => {
                            
                            (
                            <TouchableOpacity key={`${array.Plate}`} style={{borderColor:'black',borderWidth:1,height:85,marginVertical:15,flexDirection:'row',justifyContent:'space-evenly'}} >
                            <View style={{marginVertical:15,right:20}}>
                                   <Text>
                                   Plate number {array.Plate} {'\n'}
                                   manufacturer {array.Name} {'\n'}
                                   Customer's name  {name}
                                   </Text>
                               </View>
                               <View style={{marginVertical:15,right:20}}>
                                   <Text>
                                       { Math.floor((new Date(array.expiredate.seconds*1000).getTime() - new Date().getTime())/(1000*3600*24))} Days left
                                   </Text>
                               </View>
                               <View style={{marginVertical:15,right:20}}>
                                   <Image
                                   
                                   source={ imge ? {uri: imge} : require(defaultImg) }
                                   style={{ width: 50, height: 50 }}
                                   />  
                               </View>
                           </TouchableOpacity>
                            )})}
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
