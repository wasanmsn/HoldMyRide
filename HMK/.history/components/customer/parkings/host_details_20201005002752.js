import React, { useEffect } from 'react';
import {Dimensions,View, Image,TouchableOpacity, StyleSheet,Text, ScrollView, InteractionManager, Alert} from 'react-native';
import { Input, Button, Overlay } from 'react-native-elements';
import {Card,Dialog,Portal, TextInput,Avatar, Divider} from 'react-native-paper'

import firestore, { firebase } from '@react-native-firebase/firestore';

import AsyncStorage from '@react-native-community/async-storage';
import Header from '../../bar';

import * as geofirestore from 'geofirestore'

import { useIsFocused } from '@react-navigation/native'
import MapViewDirections from 'react-native-maps-directions';
import MapView,{ PROVIDER_GOOGLE, Marker } from 'react-native-maps'

import RNPickerSelect from 'react-native-picker-select';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = 'AIzaSyA2VgWQCpmBg8I_GUT7rrxe1ANgGKYRq-4';
const defaultImg = '../../../img/account.png'
const geoFire = geofirestore.initializeApp(firestore())
const geoCollection = geoFire.collection('requests')


export default function host_details({route,navigation}){


    const [price,setPrice] = React.useState({})
    const [middle,setMiddle] = React.useState({
        longitude:0,
        latitude:0
    })
    const { coord,imge } = route.params
    const item = route.params
    const [vehicels,setVehi] = React.useState([])
    const [visible,setVisible] = React.useState(false)
    const [data,setData] = React.useState({
        checkIn:null,
        expiredate:null,
        host:route.params?.UserName,
        parkingAt:item.distancematrix.location,
        Days:0,
        Service:null,
        PaymentMethod:null,
        Total:0,
        PaymentDate:null,
        ID:item.ID,//host ID maybe do something later
        vehicle:{  data:{
            Plate:''
        }  }

    })
    const isFocused = useIsFocused()
    const sendRequest = async () =>{
        try {
                                 
            const id = await AsyncStorage.getItem("ID")
            geoCollection.add({
                client:firestore().doc('customer/'+id),
                date :firestore.Timestamp.fromDate(new Date()),
                days :data.Days,
                distance :item.distancematrix.distance.value * 0.001,
                host :firestore().doc('host/'+data.ID),
                coordinates :new firebase.firestore.GeoPoint(coord.latitude, coord.longitude),
                name : await firestore().doc('customer/'+id).get().then(res => res.data().Name),
                vehicle :firestore().doc('vehicles/'+data.vehicle.ID),
                payment_method :data.PaymentMethod,
                service :data.Service,
                status :false,
                total:data.Total,
                location:data.parkingAt
            }).then(async() => {
                await firestore().collection('vehicles').doc(data.vehicle.ID).update({status:'pending'})
            })
            .then(() =>{
                Alert.alert('Request is sent.','Your request is on the way to the host right now. Please wait for your host to confirm your request.',[{text:'OK',onPress: () => navigation.navigate('Home')}],{ cancelable: false })
            })
        } catch (error) {
            console.log(error)
        }
    }
    const toggleOverlay = () =>{
        setVisible(!visible)
    }
    const getPrice = async () => {
        try {
            await firestore().collection('priceset').get().then( price => {
                price.forEach( item => {
                   setPrice(item.data())
                })
            })       
        } catch (error) {
            console.log(error)
        }
    }
    const getCars =  async () => {
        var data = []
        try{
                await firestore().collection('host').doc(data.ID).get().then((res) => {
                if(!(res.data().parkingspace > res.data().vehicles)){
                    console.log("WTF")
                    Alert.alert('','ที่จอดเต็มแล้ว',[{text:'OK',onPress: () => navigation.navigate('Home')}],{ cancelable: false })
                }
            })     
            const id = await AsyncStorage.getItem("ID")
            await firestore().collection('vehicles').where('userID','==',id).where('status','==','available').get().then(snapshot => {
                if(snapshot.empty){
                    Alert.alert('You do not have any available vehicles right now.',[{text:'OK',onPress: () => navigation.goBack()}],{ cancelable: false })
                }
                snapshot.forEach( vehicle => {
                        data.push({label:`${vehicle.data().Name} ${vehicle.data().Plate}`,value:{data:{Type:vehicle.data().Type,Plate:vehicle.data().Plate},ID:vehicle.id}})      
                })
            })
        }
        catch(err) {
            console.log(err)
        }
        return data
    }
    useEffect(() => {
        if(isFocused){
            
            var middle = {
                longitude: (item.houseLocation._longitude+coord.longitude)/2,
                latitude:(item.houseLocation._latitude+coord.latitude)/2
            }
            setMiddle(middle)
            getCars().then(data => {
                console.log(data)
                setVehi(data)
            })
            getPrice()

        }   
        else{
            setVehi([])
        }
    },[isFocused])

    const coordinates = [{latitude:item.houseLocation._latitude,longitude:item.houseLocation._longitude},{latitude:coord.latitude,longitude:coord.longitude}]

    return(
        <View style={{flex:1}}>
            <Header />
            <ScrollView >
                <Card style={{marginVertical:5,flexDirection:'row',justifyContent:'space-between',backgroundColor:'#7197F1'}} >
                    <Card.Title
                        title={item.name ? item.name : "This is test name"}
                        right={(props) => <Image {...props}
                            source={ imge ? {uri: imge} : require(defaultImg) }
                            style={styles.image}
                            /> }
                    />
                    <Card.Content>
                    <View >
                        <View >
                            <Text>ระยะทาง: {item.distancematrix.distance.value * 0.001} กิโลเมตร </Text>
                        </View>
                    </View>
                    </Card.Content>
                    
                </Card>
                <Card >
                            <MapView
                                initialRegion={{
                                    latitude:middle.latitude,
                                    longitude: middle.longitude,
                                    latitudeDelta: LATITUDE_DELTA,
                                    longitudeDelta: LONGITUDE_DELTA,
                                }}
                                scrollEnabled={false}
                                style={{borderColor:'black',borderWidth:1,height:height/2,marginTop:10}}
                            >
                                {coordinates.map( (coordinate,index) => (
                                    
                                     <Marker
                                    key={`Coodinates_${index}`}
                                    coordinate={coordinate}
                                    title={index? "You are here ": "Host"}
                                    description={index  ? item.distancematrix.origin : item.distancematrix.location}
                                    />
                                ))}
                                    <MapViewDirections
                                        origin={coordinates[0]}
                                        waypoints={ coordinates}
                                        destination={coordinates[1]}
                                        apikey={GOOGLE_MAPS_APIKEY}
                                        strokeWidth={3}
                                        strokeColor="hotpink"
                                        optimizeWaypoints={true}
                                        onStart={(params) => {
                                        console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                                        }}
                                        onReady={result => {
                                        console.log(`Distance: ${result.distance} km`)
                                        console.log(`Duration: ${result.duration} min.`)
                                
                                        }}
                                        onError={(errorMessage) => {
                                            console.log('GOT AN ERROR',errorMessage);
                                        }}
                                    />
                            </MapView>
                </Card>
                <View style={styles.car_picker} >
                    <RNPickerSelect
                        onValueChange={(value) => setData({...data,vehicle:value})}
                        items={vehicels
                        }
                    />
                </View>
                <View style={styles.day_picker}>
                    <Input
                        placeholder='Days'
                        onChangeText={(text) => setData({...data,Days:parseInt(text)})}
                    >
                    </Input>

                </View>
                <View style={styles.service_picker}>
                    <RNPickerSelect
                            onValueChange={(value) => setData({...data,Service:value})}
                            items={[{label:"None",value:"none"},{label:"Pick Up",value:"pickUp"}]
                            }
                        />
                </View>
                <View style={styles.payment_picker}>
                    <RNPickerSelect
                            onValueChange={(value) => {setData({...data,PaymentMethod:value})
                            }}
                            items={[{label:"Online",value:"online"},{label:"Offline",value:'offline'}]
                            }
                        />
                </View>
                <View style={styles.back_btnRow}>
                        <Button title="BACK" style={styles.back2} containerStyle={styles.back_btn} onPress={() => {
                            navigation.goBack()
                        }} />
                        <Button 
                        style={styles.done2}
                        containerStyle={styles.done_btn}
                        title="DONE"
                        onPress={() => {
                            console.log(data)
                            const distance = item.distancematrix.distance.value * 0.001
                            var kilo_price = distance < price.distance_rate_k ? parseFloat(price.below_distance_rate) :price.distance_price_k*distance
                            var day_price = data.vehicle.data.Type == "car" ? 100.00*data.Days : 27.00*data.Days
                            console.log(`${kilo_price}, ${day_price}, ${distance}`)
                            setData({...data,Total:data.Service ? kilo_price+day_price : day_price})
                            console.log(data)
                            toggleOverlay()
                        }}
                        />
                </View>

            </ScrollView>            
            <Overlay isVisible={visible} onBackdropPress={toggleOverlay} >
                        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                            <Text style={{color:'green',fontSize:18,alignSelf:'flex-start',marginVertical:10}} >Please confirm the request.</Text>
                            <View style={{height:1,alignSelf:'stretch',borderColor:'blue',borderWidth:2}}></View>
                            <Text style={{color:'#0800FF',marginVertical:5}}>Plate Number : {data.vehicle.data.Plate} {'\n'}
                            Vehicle type : {data.vehicle.data.Type}{'\n'}
                            Stay for : {data.Days} days : {data.vehicle.data.Type == "car" ? 100.00*data.Days : 27.00*data.Days} ฿ {'\n'}
                            Service : {data.Service} {'\n'}
                            { data.Service == 'none' ? null :  `Distance : ${item.distancematrix.distance.value * 0.001 < price.distance_rate_k ? item.distancematrix.distance.value * 0.001 + 'KM : ' + price.below_distance_rate +'฿' :item.distancematrix.distance.value * 0.001 + 'KM : ' +item.distancematrix.distance.value * 0.001*price.distance_price_k +'฿'} ${'\n'}`}
                            Total : {data.Total} ฿ {'\n'}
                            Payment method: {data.PaymentMethod} {'\n'}
                             </Text>
                            <View style={{height:1,alignSelf:'stretch',borderColor:'blue',borderWidth:2}}></View>
                            <View style={{flexDirection:'row',marginVertical:20}}>
                                <Button title="CANCLE" style={styles.overlar_btns} containerStyle={{width:100}} onPress={() => {
                                    toggleOverlay()
                                }} />
                                <Button title="OK" style={styles.overlar_btns} containerStyle={{width:100,marginLeft:15}} onPress={ () => {
                                   sendRequest()
                                }} />                                
                            </View>
                        </View>
            </Overlay>
        </View>
    )
}

const styles = StyleSheet.create({
    nAMEBOX: {
        borderWidth: 1,
        borderColor: "#000000",
        width: 360,
        height: 86,
      flexDirection: "row",
      marginTop: 6
    },
    nameName: {
      fontFamily: "roboto-regular",
      color: "#121212",
      fontSize: 22,
      marginTop: 12
    },
    aVARTAR_FRAME: {
      width: 51,
      height: 50,
      backgroundColor: "#E6E6E6",
      borderWidth: 1,
      borderColor: "#000000",
      marginLeft: 100
    },
    image: {
      width: 50,
      height: 50,
      marginLeft: 1
    },
    nameNameRow: {
      height: 50,
      flexDirection: "row",
      flex: 1,
      margin:15,
    },
    car_picker: {
      width: 272,
      height: 38,
      backgroundColor: "#E6E6E6",
      marginTop: 10,
      marginLeft: 52
    },
    day_picker: {
      width: 272,
      height: 38,
      backgroundColor: "#E6E6E6",
      marginTop: 13,
      marginLeft: 54
    },
    service_picker: {
      width: 272,
      height: 38,
      backgroundColor: "#E6E6E6",
      marginTop: 12,
      marginLeft: 52
    },
    payment_picker: {
      width: 272,
      height: 38,
      backgroundColor: "#E6E6E6",
      marginTop: 17,
      marginLeft: 54
    },
    back_btn: {
      width: 139,
      backgroundColor: "rgba(0,102,255,1)",
      borderWidth: 1,
      borderColor: "rgba(9,0,255,1)"
    },
    back2: {
      color: "rgba(255,255,255,1)",
      marginTop: 19,
      marginLeft: 44,

    },
    overlar_btns:{
        color: "rgba(255,255,255,1)",
        marginTop: 19,
    },
    cancle_btn:{      width: 100,
                        height:50,
        backgroundColor: "rgba(0,102,255,1)",
        borderWidth: 1,
        borderColor: "rgba(9,0,255,1)",
        marginLeft: 22},
    ok_btn:{      width: 100,height:50,
        backgroundColor: "rgba(0,102,255,1)",
        borderWidth: 1,
        borderColor: "rgba(9,0,255,1)",
        marginLeft: 22},
    done_btn: {
      width: 139,
      backgroundColor: "rgba(0,102,255,1)",
      borderWidth: 1,
      borderColor: "rgba(9,0,255,1)",
      marginLeft: 22
    },
    done2: {
      fontFamily: "roboto-regular",
      color: "rgba(255,255,255,1)",
      fontSize: 20,
      marginTop: 19,
      marginLeft: 44,

    },
    back_btnRow: {
      flexDirection: "row",
      marginTop: 26,
      marginLeft: 29,
      marginRight: 31
    }
  });