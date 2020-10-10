import React from 'react';
import {Dimensions,View, Image,TouchableOpacity, StyleSheet,Text, ScrollView} from 'react-native';
import firestore, { firebase } from '@react-native-firebase/firestore';
import firestorage from '@react-native-firebase/storage';
import Header from '../../bar';
import Geolocation from '@react-native-community/geolocation';
import * as geofirestore from 'geofirestore'
import { useIsFocused } from '@react-navigation/native'
import axios from "axios"
import Loading from '../../loading'
import {Card,Dialog,Portal,Button, TextInput} from 'react-native-paper'
import { AuthContext } from './stacks';
	
const defaultImg = '../../../img/account.png'
const geoFire = geofirestore.initializeApp(firestore())
const geoCollection = geoFire.collection('host')
const GOOGLE_MAPS_APIKEY = 'AIzaSyA2VgWQCpmBg8I_GUT7rrxe1ANgGKYRq-4';

const { width } = Dimensions.get('window');


export default function parkings({navigation}){

    const [data,setData] = React.useState([])
    const [coord,setCord] = React.useState()
    const [img,setImge] = React.useState([])
    const isFocused = useIsFocused()
    const [isLoading,setLoading] = React.useState(true)
    const { signOut } = React.useContext(AuthContext);
    
    React.useEffect(  () => {
        if(isFocused){
            
            Geolocation.getCurrentPosition( async info => {
                setCord(info.coords)
                const query = geoCollection.near({
                    center: new firebase.firestore.GeoPoint(info.coords.latitude,info.coords.longitude),radius : 30
                })
                await query.get().then(val => {
                    val.docs.forEach(id => {
                        firestore().collection('host').doc(id.id).get().then( data => {
                            firestorage().refFromURL(data.data().imgIcon).getDownloadURL().then( img => setImge(prev => [...prev,img]))
                            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${info.coords.latitude},${info.coords.longitude}&destinations=${data.data().houseLocation._latitude},${data.data().houseLocation._longitude}&key=${GOOGLE_MAPS_APIKEY}`
                            axios.get(url).then( res => {
                                var distancematrix = {
                                    distance: res.data.rows[0].elements[0].distance,
                                    origin : res.data.origin_addresses[0],
                                    location : res.data.destination_addresses[0]
                                }
                                const datas = {...data.data(),distancematrix,ID:id.id}
                                setData(prev => [...prev,datas])
                                
                            })
                            
                        })
                    })
                    setLoading(false)
                }).catch(err => {
                    console.log(err)
                })
                
            })
            
        }   
        else{
            setData([])
        }
    },[isFocused])
    if(isLoading){
        return <Loading />
    }
    return (
        
        <View>
            <Header />
            <ScrollView style={styles.box1}>
                <View>
                {
                data.map((item,index) => 
                        (<Card key={item.UserName} style={{height:50,marginVertical:5,flexDirection:'row',justifyContent:'space-between'}} 
                        onPress={async () => {
                        const imge = img[index]
                        navigation.navigate("Detail",{ ...item,coord,imge,wallet:await item.wallet.get().then(res => res.id)  })}}
                        >
                            <Card.Content>
                                <View    style={{marginVertical:5,padding:2}}>
                                    <Text>
                                    Host name : {item.UserName} {'\n'}
                                    Distance : {item.distancematrix.distance.text} {'\n'}
                                    </Text>
                                </View>
                                <View style={{right:20,alignSelf:'flex-end',position:'relative'}}>
                                    
                                    <Image
                                    
                                    source={ img[index] ? {uri: img[index]} : require(defaultImg) }
                                    style={{ width: 50, height: 50 }}
                                    />  
                                </View>
                            </Card.Content>
                        
                    </Card>))}
                        
                </View>


            </ScrollView>
        </View>
    )
}
const styles = StyleSheet.create({
    bar:{
        flexDirection:'row',
        justifyContent:'center',
        alignSelf:'center',
        height:95,
        width:width,
        backgroundColor:'#61dafb',

        
    },
    fonts:{
        fontSize:32,
        color:'brown',
        fontWeight:'bold',
        alignSelf:'center',
        marginHorizontal:40
    },
    img:{
        width:35,
        height:35,
        margin:5,
    }
})
const Mapstyles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      height: 400,
      width: 400,
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
   });