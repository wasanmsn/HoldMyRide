import React, { useState,useEffect } from 'react';
import { Text, View,StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SearchBar,Icon,Divider,Image } from 'react-native-elements';
import firestore, { firebase } from '@react-native-firebase/firestore';
import firestorage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native'
import Header from '../../bar';
import {Card,Dialog,Portal, TextInput,Avatar } from 'react-native-paper'

const defaultImg = '../../../img/account.png'


function Cars ({route,navigation}){
    const [vehicles,setVehicles] = useState([])
    const [imge,setImge] = useState([''])
    const [name,setName] = useState([''])
    const [id,setId] = useState([''])
    const isFocused = useIsFocused()
    const getVehicles = async () => {
        try {
            var datas = []
            const ID  = await AsyncStorage.getItem('ID')
            const data =  firestore().collection('vehicles').where('host','==',firestore().doc('host/'+ID))
            const obsData =  data.onSnapshot(querySnapshots => {
                    querySnapshots.docChanges().forEach(async change => {
                            datas.push(change.doc.data())
                         })
                         datas.forEach(async data => {
                            var name = await data.owner.get().then(res => {
                                setName(prev => [...prev,res.data().Name])
                                setId(prev => [...prev,res.id])
                            })
                            var img = await firestorage().refFromURL(data.pic).getDownloadURL().then( url => {
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
        if(date1 > date2){
            return Math.round(difference_ms/ONEDAY);
        }
        return -Math.round(difference_ms/ONEDAY);
    }
    useEffect(() => {
            if(isFocused){
                getVehicles()
                   
            }   
            else{
                const unsub = firestore().collection('vehicles').onSnapshot(() => {
                });
                unsub()   
                setVehicles([])
            }
        },[isFocused])
    const MyCard = props =>{ 
            const [press,setPress] = React.useState(false)
            return (
            <Card style={{borderColor:press ? "#1ca6d4" :"#128cb5" ,backgroundColor:press ? "#128cb5":"#1ca6d4",borderWidth:1,height:70,marginVertical:5,flexDirection:'row',justifyContent:'space-between'}} 
                onPress={ () => {
                    setPress(true)
                    var date = new Date()
                    const array = props.data
                    const Vname = name[props.index+1]
                    const Vimge = imge[props.index+1]
                    const Vid = id[props.index+1]
                    const Vdays = daysdifference(new Date(props.data.expiredate.seconds*1000),new Date())
                    setTimeout(() => {
                        console.log("1")
                        navigation.navigate('Detail',{array,Vname,Vimge,Vid,Vdays})
                        setPress(false)
                    }, 300);
                    
                    
                }}
            >
                <Card.Title
                            title={`${props.data.Name} ${props.data.Plate}`}
                            subtitleStyle={{color:props.data.expiredate == null ? 'black' : new Date(props.data.expiredate.seconds*1000) < new Date() ? 'red':'green'}}
                            subtitle={`${props.data.expiredate == null ? '': "เหลือเวลาอีก "+Math.floor((new Date(props.data.expiredate.seconds*1000).getTime() - new Date().getTime())/(1000*3600*24))+' วัน'}`}
                            right={(props) => <Avatar.Image
                                {...props}
                                source={ imge[props.idex] ? {uri : imge[props.idex]} : require(defaultImg) }
                                size={50}
                                />   }
                />
            </Card>
        )}
    return (
        <View style={page.container}>
            <Header />
            <View style={page.box1}>
                <ScrollView>
                    <View  >
                        {vehicles.map((array,index) => 
                            (
                            <MyCard key={`${array.Plate}`}  data={array} index={index}
                            >
                           </MyCard>
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
