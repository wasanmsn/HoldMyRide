
import React from 'react';
import {Dimensions,View, Image,TouchableOpacity, StyleSheet,Text, ScrollView,RefreshControl} from 'react-native';
import firestore, { firebase } from '@react-native-firebase/firestore';
import firestorage from '@react-native-firebase/storage';
import Header from '../../bar';
import Geolocation from '@react-native-community/geolocation';
import * as geofirestore from 'geofirestore'
import { useIsFocused } from '@react-navigation/native'
import axios from "axios"
import Loading from '../../loading'
import {Card,Surface,Portal,Button, TextInput,Avatar, Divider} from 'react-native-paper'

const defaultImg = '../../../img/account.png'
const geoFire = geofirestore.initializeApp(firestore())
const geoCollection = geoFire.collection('host')
const GOOGLE_MAPS_APIKEY = 'AIzaSyA2VgWQCpmBg8I_GUT7rrxe1ANgGKYRq-4';

const { width,height } = Dimensions.get('window');
function wait(timeout) {
    return new Promise((resolve, reject) => {
      setTimeout(resolve,timeout)
    })
    
}
export default function parkings({navigation}){

    const [data,setData] = React.useState([{
        UserName:'',
        vehicles:0,
        parkingspace:0,
        distancematrix:{distance:{text:'0'}}
    }])
    const [coord,setCord] = React.useState()
    const [refres,setRefresh] = React.useState(false)
    const [img,setImge] = React.useState([])
    const isFocused = useIsFocused()
    const [isLoading,setLoading] = React.useState(true)

    const getHosts = () =>{
        var hostst = []
        Geolocation.getCurrentPosition( async info => {
            setCord(info.coords)
            const query = geoCollection.near({
                center: new firebase.firestore.GeoPoint(info.coords.latitude,info.coords.longitude),radius : 30
            })
            await query.get().then(val => {
                if(val.empty){
                    setData([])
                }
                val.docs.forEach(id => {
                    firestore().collection('host').doc(id.id).get().then( data => {
                        if(data.data().parkingspace > data.data().vehicles){
                            firestorage().refFromURL(data.data().imgIcon).getDownloadURL().then( img => setImge(prev => [...prev,img]))
                            const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${info.coords.latitude},${info.coords.longitude}&destinations=${data.data().houseLocation._latitude},${data.data().houseLocation._longitude}&key=${GOOGLE_MAPS_APIKEY}`
                            axios.get(url).then( res => {
                                var distancematrix = {
                                    distance: res.data.rows[0].elements[0].distance,
                                    origin : res.data.origin_addresses[0],
                                    location : res.data.destination_addresses[0]
                                }
                                const datas = {...data.data(),distancematrix,ID:id.id}
                                hostst.push(datas)
                                setData(hostst)
                            })
                        }
                    })
                })
                setLoading(false)
            }).then(() => {
                setRefresh(false)
            }).catch(err => {
                console.log(err)
            })
            
        })
    }
    const onRefresh = React.useCallback( () => {
        setRefresh(true)
        getHosts()
        
    },[refres])

    React.useEffect(  () => {
        if(isFocused){
            getHosts()
        }   
        else{
            setData([{
                UserName:'',
                vehicles:0,
                parkingspace:0,
                distancematrix:{distance:{text:'0'}}
            }])
        }
    },[isFocused])
    if(isLoading){
        return <Loading />
    }
    return (
        
        <View style={{}}>
            <Header />
            <ScrollView contentContainerStyle={styles.scrollView}
                refreshControl={
                    <RefreshControl refreshing={refres} onRefresh={onRefresh} />
                }
            >
                <View>
                {data.length < 1 ? (<Surface style={{
                        padding: 8,
                        margin: 8,
                        height: 80,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf:'center',
                        backgroundColor:'#e09926',
                        elevation: 4,}}>
                    <Text>
                        ไม่มีโฮต์อยู่ในระยะ 30 กิโลเมตร
                    </Text>
                </Surface>) : 
                data.map((item,index) => 
                        (<Card key={item.UserName} style={{marginVertical:5,flexDirection:'row',justifyContent:'space-between',backgroundColor:'#7197F1'}} 
                        onPress={async () => {
                        const imge = img[index]
                        navigation.navigate("Detail",{ ...item,coord,imge,wallet:await item.wallet.get().then(res => res.id)  })}}
                        >
                            <Card.Title title={`ผู้รับฝาก ${item.UserName} `}
                                right={(props) => <Avatar.Image size={50}  style={{backgroundColor:'#487AED'}} source={ img[index] ? {uri: img[index]} : require(defaultImg) } /> }
                            />
                            <Card.Content>
                                <Divider/>
                                <View    style={{marginVertical:5,padding:2}}>
                                    <Text >
                                    ที่ว่าง {item.vehicles} / {item.parkingspace} {'\n'}
                                    ระยะทาง : {item.distancematrix.distance.text} {'\n'}
                                    </Text>
                                </View>
                            </Card.Content>
                        
                    </Card>))}
                        
                </View>

                <View style={{backgroundColor:'#121211'}}>
                    <Text style={{alignSelf:'center',color:'white'}}>
                        เลื่อนค้างลงเพื่อ รีเฟรช
                    </Text>
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
    scrollView: {
        flex: 1,
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