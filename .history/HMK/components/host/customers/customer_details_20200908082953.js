import React, {useEffect } from 'react';
import {Dimensions,View, Image, StyleSheet,Text, ScrollView} from 'react-native';
import {Button, Overlay} from 'react-native-elements';
import firestore, { firebase } from '@react-native-firebase/firestore';
import firestorage from '@react-native-firebase/storage';
import Header from '../../bar';
import * as geofirestore from 'geofirestore'
import { useIsFocused } from '@react-navigation/native'
import MapViewDirections from 'react-native-maps-directions';
import MapView,{ PROVIDER_GOOGLE, Marker } from 'react-native-maps'


const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_MAPS_APIKEY = 'AIzaSyA2VgWQCpmBg8I_GUT7rrxe1ANgGKYRq-4';
const defaultImg = '../../../img/account.png'
const geoFire = geofirestore.initializeApp(firestore())


export default function customer_detail({route,navigation}){

    const [img,setimge] = React.useState('')
    const {request,coord } = route.params

    const [vehicels,setVehi] = React.useState({
        data:{
            name:'',
            Type:'',
            Plate:''
        },
        id:'',
        img:''

    })
    const [visible,setVisible] = React.useState(false)
    const coordinates = [{latitude:coord.latitude,longitude:coord.longitude},{latitude:request.coordinates._latitude,longitude:request.coordinates._longitude}]
    const isFocused = useIsFocused()
    const acceptRequest = async () =>{
        try {
            const date = new Date()
            const expireDate = new Date().setDate(date.getDate()+1)
            await firestore().collection('payment_History').add({
                buyer:firestore().doc('customer/'+request.client),
                days:request.days,
                distance_km:request.distance,
                method:request.payment_method,
                payment_start:request.date,
                payment_cofirm:firestore.Timestamp.fromDate(new Date()),
                price:request.total,
                saler:firestore().doc('host/'+request.host),
                status_payment:true,
                vehicel:firestore().doc('vehicles/'+request.vehicle),
                service:request.service
            }).then(async() => {
                await firestore().collection('vehicles').doc(request.vehicle).update({
                    expiredate:firestore.Timestamp.fromMillis(expireDate),
                    checkIn:firestore.Timestamp.fromDate(date),
                    host:firestore().doc('host/'+request.host),
                    parkingAt:request.location
                
                })
            }).then(async() => {
                await firestore().collection('host').doc(request.host).get().then( async  doc => {
                    await doc.data().wallet.get().then(async res => {
                        const id = res.id.replace(/\s+/g, "")
                        console.log(res.id)
                        console.log(id)
                        await firestore().collection('wallet').doc(id).update({balance: firebase.firestore.FieldValue.increment(request.total)})
                     })
              
                     
                })
                await firestore().collection('customer').doc(request.client).get().then( async  doc => {
                    await doc.data().wallet.get().then(async res => {
                        const newBal = res.data().balance - request.total
                        await firestore().collection('wallet').doc(res.id).update({balance: newBal < 0 ? 0 : newBal})
                     })
               })
            }).then(async() => {
                await firestore().collection('requests').doc(request.id).update({status:true})
            }).catch(err => console.log(err))
            
        } catch (error) {
            console.log(error)
        }
    }
    const delclinceRequest = async () => {
        try {
            const date = new Date()
            const expireDate = new Date().setDate(date.getDate()+1)
            await firestore().collection('payment_History').add({
                buyer:firestore().doc('customer/'+request.client),
                days:request.days,
                distance_km:request.distance,
                method:request.payment_method,
                payment_start:request.date,
                payment_cofirm:firestore.Timestamp.fromDate(new Date()),
                price:request.total,
                saler:firestore().doc('host/'+request.host),
                status_payment:false,
                vehicel:firestore().doc('vehicles/'+request.vehicle),
                service:request.service
        }).then(async () => {
            await firestore().collection('requests').doc(request.id).delete()
        }).then(() => {
            navigation.goBack()
        })
        } catch (err) {
            console.log(err)
        }
    }
    const toggleOverlay = () =>{
        setVisible(!visible)
    }
    const getVehicle =  async () => {
        try{
            const vehicel  = { data :{},
                id : '',
                img : '',
                }
            await firestore().collection('vehicles').doc(request.vehicle).get().then(res => {
                vehicel.data = res.data()
                vehicel.id = res.id
                vehicel.img = res.data().pic
            })

            return vehicel
        }
        catch(err) {
            console.log(err)
        }
        
    }

    useEffect(() => {
        if(isFocused){

            console.log(request)
            getVehicle().then( async data => {
            
                const imge = await firestorage().refFromURL(data.img).getDownloadURL()
                setimge(imge)
                setVehi(data)
                console.log('wtfs',vehicels)
            })
        }   
    },[isFocused])




    return(
        <View style={{flex:1}}>
            <Header />
            <ScrollView style={{height:height*0.6}}>
                <View style={styles.nAMEBOX}>
                        <View style={styles.nameNameRow}>
                            <View style={{flex:1}}>
                                <Text style={styles.nameName}>Customer : {request.name ? request.name : "This is test name"}</Text>
                            </View>               
                        </View>

                 </View>
                 <View >
                        <MapView
                                    initialRegion={{
                                        latitude: coord.latitude,
                                        longitude: coord.longitude,
                                        latitudeDelta: LATITUDE_DELTA,
                                        longitudeDelta: LONGITUDE_DELTA,
                                    }}
                                    style={{borderColor:'black',borderWidth:1,height:height/2,marginTop:10}}
                                >
                                    {coordinates.map( (coordinate,index) => (
                                        
                                        <Marker
                                        key={`Coodinates_${index}`}
                                        coordinate={coordinate}
                                        title={index? "You are here ": "Customer"}
                                       
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
                                            console.log(`coords : ${coordinates[0].latitude} ${coordinates[1].latitude}`)
                                            console.log(`Distance: ${result.distance} km`)
                                            console.log(`Duration: ${result.duration} min.`)
                                    
                                            }}
                                            onError={(errorMessage) => {
                                                console.log('GOT AN ERROR',errorMessage);
                                            }}
                                        />
                                </MapView>
                    </View>
                    <View style={{height:170,alignSelf:'stretch',borderColor:'black',borderWidth:2}}>
                        <Text style={styles.nameName} >Vehicle</Text>
                        <Text style={styles.nameName} >Plate number : {vehicels.data.Plate} {'\n'} Type : {vehicels.data.Type.toUpperCase()} </Text>
                        <View style={{margin:5}}>
                            <Button title='View Image' onPress={toggleOverlay} containerStyle={{width:144}}></Button>
                        </View>
                    </View>
                    <View style={{height:140,alignSelf:'stretch',borderColor:'black',borderWidth:2}}>
                        <Text style={styles.nameName} >Rent {request.days} days </Text>
                        <Text style={styles.nameName} >Pick up Service: {request.service == 'pickUp' ? 'Yes' : 'No'} </Text>
                        <Text style={styles.nameName} >Payment Method: {request.payment_method.toUpperCase()} </Text>
                    </View>
                    <View style={{flexDirection:'row',justifyContent:'space-evenly',margin: 15,}}>
                    <Button title="ACCEPT"   style={styles.done2}
                        containerStyle={styles.done_btn}  onPress={() => {
                            acceptRequest()
                        }} />
                        <Button title="DECLINE"  style={styles.back2} containerStyle={styles.back_btn}  onPress={() => {
                            delclinceRequest()
                        }} />

                    </View>
                    
                    
            </ScrollView>
           <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{width:250,height:250,backgroundColor:'black'}} >
                        <View>
                        <Image
                            
                            source={ img ? {uri: img} : require(defaultImg) }
                            style={{ width: 250, height: 250,alignSelf:'center' }}
                            />  
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
    },    back_btn: {
        width: 139,
        backgroundColor: "rgba(0,102,255,1)",
        borderWidth: 1,
        borderColor: "rgba(9,0,255,1)"
      },
      back2: {
        color: "rgba(255,255,255,1)",
        marginTop: 19,

  
      },
      done_btn: {
        width: 139,
        backgroundColor: "rgba(0,102,255,1)",
        borderWidth: 1,
        borderColor: "rgba(9,0,255,1)",

      },
      done2: {
        fontFamily: "roboto-regular",
        color: "rgba(255,255,255,1)",
        fontSize: 20,
        marginTop: 19,

  
      },
    
  });

