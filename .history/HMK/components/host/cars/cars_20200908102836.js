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
    const [Search,setSearch] = useState([])
    const [vehicles,setVehicles] = useState([])
    const [vehiclesSet,setVehicle] = useState([])
    const [length,setLength] = useState(0)
    const [img,setimge] = React.useState('')
    const isFocused = useIsFocused()
    const getVehicles = async () => {
        try {
            const ID  = await AsyncStorage.getItem('ID')
            const data =  firestore().collection('vehicles').where('host','==',firestore().doc('host/'+ID))
            const obsData = data.onSnapshot(querySnapshots => {
                    setLength(querySnapshots.size)
                    querySnapshots.docChanges().forEach(change => {
                        if(change){
                            setVehicles([])
                            setimge([])
                        }
                        const docs = querySnapshots.docs.forEach( doc => {
                            firestorage().refFromURL(doc.data().pic).getDownloadURL().then((res) =>{
                               setimge(prev => [...prev,res]) 
                           })
                           setVehicles(prev => [...prev,doc])
                     
                       })
                    })
                    showVehicles()
              
            },err => {
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }
    const showVehicles = async () => {
        setVehicle([])
        var array = vehicles
        var start =  0

        for (start; start < length; start++) {
            const name = await array[start]._data.owner.get().then(res => res.data().Name)
            const date =  Math.floor((new Date(array[start]._data.expiredate.seconds*1000).getTime() - new Date().getTime())/(1000*3600*24))
            setVehicle(prev => [...prev,
                <TouchableOpacity key={`${start}_${array[start]._data.Plate}`} style={{borderColor:'black',borderWidth:1,height:85,marginVertical:15,flexDirection:'row',justifyContent:'space-evenly'}} >
                     <View style={{marginVertical:15,right:20}}>
                            <Text>
                            Plate number {array[start]._data.Plate} {'\n'}
                            manufacturer {array[start]._data.Name} {'\n'}
                            Customer's name  {name}
                            </Text>
                        </View>
                        <View style={{marginVertical:15,right:20}}>
                            <Text>
                                {date} Days left
                            </Text>
                        </View>
                        <View style={{marginVertical:15,right:20}}>
                            <Image
                            
                            source={ img[start] ? {uri: img[start]} : require(defaultImg) }
                            style={{ width: 50, height: 50 }}
                            />  
                        </View>
                    </TouchableOpacity>
            ]
                
            )
        }
        console.log('hi',start)
    }
    
    useEffect(() => {
            if(isFocused){
                getVehicles().then(() => {
                   
                })
                
            }   
        },[isFocused])
    return (
        <View style={page.container}>
            <Header />
            <View style={page.box1}>
                <ScrollView>
                    <View  >
                        {vehiclesSet}  
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
