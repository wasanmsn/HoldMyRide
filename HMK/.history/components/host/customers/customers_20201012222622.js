import React from 'react';
import { Text,ScrollView,Dimensions } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Header from '../../bar';
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from '@react-native-community/geolocation';
import {Card,Surface } from 'react-native-paper'
import LinearGradient from 'react-native-linear-gradient'
const { width, height } = Dimensions.get('window');

export default function customers({navigation}){
    const [requests,setRequest] = React.useState([])
    const [coord,setcoord] = React.useState({
        latitude:0,
        longitude:0
    })
    const isFocused = useIsFocused()
    const getReqs = async () => {
        try {
            const ID  = await AsyncStorage.getItem('ID') 
            const data = await firestore().collection('requests').where('host','==',firestore().doc('host/'+ID)).where('status','==',false)
            const obsData = data.onSnapshot(querySnapshots => {
                console.log(querySnapshots.size)
                querySnapshots.docChanges().forEach(change => {
                    if(change){
                        setRequest([])
                    }
                    const docs = querySnapshots.docs.map(doc => {
                        setRequest(prev => [...prev,{data:doc.data(),id:doc.id}])
                    })
                })
            },err => {
                console.log(err)
            })
        } catch (error) {
            console.log(err)
        }
    }
    React.useEffect( () => {
        if(isFocused){
            getReqs()
            Geolocation.getCurrentPosition( info => {
                setcoord(info.coords)               
            })
        }   
        else{
            const unsub = firestore().collection('requests').onSnapshot(() => {
            });
            unsub()            
        }
    },[isFocused])

    const MyCard = props =>{ 
        const [backgroundColor,setbackgroundColor] = React.useState('#1CA7EC')
        const [borderColor,setborderColor] = React.useState('#78d5f5')
        return (
        <Card style={{borderColor:borderColor,backgroundColor:backgroundColor,borderWidth:1,height:70,marginVertical:5,flexDirection:'row',justifyContent:'space-between'}} 
            onPress={async () => {
                console.log("Color :",borderColor,backgroundColor)
                setbackgroundColor(borderColor)
                setborderColor(backgroundColor)
                console.log("Color :",borderColor,backgroundColor)
                console.log("Color changed")
                navigation.navigate(`Customers Detail`,{
                    request:{
                        client:await props.data.client.get().then(res => res.id),
                        date :props.data.date,
                        days :props.data.days,
                        distance :props.data.distance,
                        host : await props.data.host.get().then(res => res.id),
                        coordinates :props.data.coordinates,
                        name : props.data.name,
                        payment_method :props.data.payment_method,
                        service :props.data.service,
                        status :props.data.status,
                        vehicle:await props.data.vehicle.get().then(res => res.id),
                        total:props.data.total,
                        location:props.data.location,
                        id:props.id
                    },coord
                })
            }
                
            }
        >
             <Card.Title titleStyle={{color:'#1f2f98'}} title={"ลูกค้า "+props.data.name} subtitle={"ระยะเวลา "+props.data.days+"วัน\nการจ่าย "+props.data.payment_method}/>
        </Card>
    )}
    return(
        <LinearGradient colors={['#1ca7ec','#787ff6']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={{height:height}}>
            <Header />
            <ScrollView style={{height:height*0.8}} >
                    {requests.length < 1 ? (<Surface style={{
                        padding: 8,
                        margin: 8,
                        height: 80,
                        width:width,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf:'center',
                        backgroundColor:'#787ff6',
                        elevation: 4,}}>
                    <Text>
                        ไม่มีคำขอขณะนี้
                    </Text>
                </Surface>): 
                    
                    requests.map((item,index) => (<MyCard key={index}   data={item.data} id={item.id}
                    >
                    </MyCard>))
                   }
                    
                
            </ScrollView>
        </LinearGradient>
    )
    
    
}