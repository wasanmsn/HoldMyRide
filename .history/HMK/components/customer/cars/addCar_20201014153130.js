import React, { useState } from 'react';
import {  View,StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import { Input,Divider,Button,Image  } from 'react-native-elements';
import Header from '../../bar';

import firestore, { firebase } from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-picker'
import {Picker} from '@react-native-community/picker';
import AsyncStorage from '@react-native-community/async-storage';


const defaultImg = '../../../img/uploadPic.png'






const options = {
    storageOptions: {
      skipBackup: true,
      path: 'images'
    }
  };

async function add(vehicle,navigation){
    await firestore().collection('vehicles').add(vehicle
    ).then(() => {
        console.log("Vehicle added.")
        alert("ทำการเพิ่มสำเร็จ.")
        navigation.goBack()
        
        
    }).catch(err => console.log("Failed to add new vehicle. \n Erro: ",err.message))  
}
async function uploadImage(uri,ID){
    // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662

  const time = new Date().getTime()

  const blob = await new Promise((resolve, reject) => {

    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      console.log(e);
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child(`carPics/${ID}/${time}.jpg`);

  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();
  return time
  
}



function addCar({navigation}){
    const [imge,setImge] = useState(null)
    const [vehicle,setVehicle] = useState({
        Plate : '',
        Name:'',
        checkIn:null,
        expiredate:null,
        host:'',
        parkingAt:'',
        userID:'',
        Type:'',
        pic:'',
        addDate:firestore.Timestamp.now(),
        status:'available'
    })
    async function getImage(){
        const id = await AsyncStorage.getItem("ID")

        ImagePicker.showImagePicker(options,(res) => {
            
            if (res.didCancel){
                console.log('User cancelled image picker')
            }
            else if (res.error){
                console.log('ImagePicker Error: ',res.error)
            }
            else{
                
               uploadImage(res.uri,id.replace(/\s+/g, "")).then( (time) => {
                    console.log('hello',id)
                    setVehicle({ ...vehicle,pic:`gs://holdmybike-998ed.appspot.com/carPics/${id}/${time}.jpg`,userID:id,owner:firestore().doc('customer/'+id) })
                    console.log(vehicle)
                    setImge(res.uri)}
                    ).catch(err => console.log(err.message
                ))
            }
        })
        
    }
    return(
        <View style={page.container}>
            <Header />
            <ScrollView style={{flexDirection:'column',margin:5}}> 
                <View style={{justifyContent:'space-evenly'}}>
                    <View>
                    <TouchableOpacity  style={{ borderColor:'black',borderWidth:2,alignSelf:'center'}} onPress={() => getImage()} >
                        {imge == null ? ( <Image source={require(defaultImg)} style={{ width: 190, height: 185}} />   ) : <Image source={{uri:imge}} style={{ width: 190, height: 185}} />
                            
                            }
                    </TouchableOpacity>
                   
                    </View>
                    <Divider style={{borderColor:'black',borderWidth:2,margin:5}}/>
                    <View >
                    <Input
                         placeholder='ป้ายทะเบียน'
                         onChangeText={(text) => setVehicle({...vehicle,Plate:text})}
                        />

                    </View>
                    <Divider style={{borderColor:'black',borderWidth:2}}/>
                    <View>
                        <Input
                         placeholder='ยี่ห้อ'
                         onChangeText={(text) => setVehicle({...vehicle,Name:text})}
                        />
                       
                    </View>
                    <Divider style={{borderColor:'black',borderWidth:2}}/>
                    <View>
                        <Picker
                                selectedValue={vehicle.Type }
                                onValueChange={(itemValue, itemIndex) =>
                                    setVehicle({...vehicle,Type:itemValue})
                                    
                                }>
                                <Picker.Item  label="รถยนต์" value="car" />
                                <Picker.Item  label="มอเตอร์ไซต์" value="mortocycle" />
                                </Picker>
                       
                    </View>
                    <Divider style={{borderColor:'black',borderWidth:2}}/>
                </View>
               
            </ScrollView>
            
            <View style={{flex:2,flexDirection:'row',padding:5,justifyContent: 'space-evenly',}}>
                
                    <Button title="กลับ" containerStyle={{width:100,alignSelf:'flex-end'}} onPress={() => navigation.goBack()} >

                    </Button>
               
             
                    <Button title="เพิ่มรถ" disabled={vehicle.Name == '' || vehicle.Plate == '' || vehicle.pic == ''} containerStyle={{width:100,alignSelf:'flex-end'}} onPress={() => {
                        add(vehicle,navigation)
                        }}>

                    </Button>
              
            </View>
        </View>
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

export default addCar;