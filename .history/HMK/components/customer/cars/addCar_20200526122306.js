import React, { useState,useMemo } from 'react';
import { Text, View,StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import { Input,Divider,Button,Image  } from 'react-native-elements';
import Header from '../../bar';

import firestore, { firebase } from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-picker'
import {Picker} from '@react-native-community/picker';


const defaultImg = '../../../img/account.png'





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
        alert("Vehicle added.")
        navigation.goBack()
        
        
    }).catch(err => console.log("Failed to add new vehicle. \n Erro: ",err.message))
    
    
}
async function uploadImage(uri,ID){
    // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662
  const time = new Date().getTime()
  console.log(time)
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



function addCar({route,navigation}){
    const { useID } = route.params
    const [imge,setImge] = useState(null)
    const [vehicle,setVehicle] = useState({
        Plate : '',
        Name:'',
        checkIn:null,
        expiredate:null,
        host:'',
        parkingAt:'',
        userID:useID,
        Type:'',
        pic:'',
        addDate:firestore.Timestamp.now()
    })
    function getImage(ID){
        
        ImagePicker.showImagePicker(options,(res) => {
            
            if (res.didCancel){
                console.log('User cancelled image picker')
            }
            else if (res.error){
                console.log('ImagePicker Error: ',res.error)
            }
            else{
                
               uploadImage(res.uri,ID).then( (time) => {
                    setVehicle({ ...vehicle,pic:`gs://holdmybike-998ed.appspot.com/carPics/${ID}/${time}.jpg` })
                    setImge(res.uri)}
                    ).catch(err => console.log(err.message
                ))
            }
        })
        
    }
    useMemo(() => {
        console.log(`this is ID: ${useID}`)
    },[])
    return(
        <View style={page.container}>
            <Header />
            <ScrollView style={{flexDirection:'column',margin:5}}> 
                <View style={{justifyContent:'space-evenly'}}>
                    <View>
                    <TouchableOpacity  style={{ borderColor:'black',borderWidth:2,alignSelf:'center'}} onPress={() => getImage(useID)} >
                        {imge == null ? ( <Text  style={{width: 190, height: 185 }}
                    >
                        Upload Image
                        </Text>   ) : <Image source={{uri:imge}} style={{ width: 190, height: 185}} />
                            
                            }
                    </TouchableOpacity>
                   
                    </View>
                    <Divider style={{borderColor:'black',borderWidth:2,margin:5}}/>
                    <View >
                    <Input
                         placeholder='Plate number'
                         onChangeText={(text) => setVehicle({...vehicle,Plate:text})}
                        />

                    </View>
                    <Divider style={{borderColor:'black',borderWidth:2}}/>
                    <View>
                        <Input
                         placeholder='Manufacturer'
                         onChangeText={(text) => setVehicle({...vehicle,Name:text})}
                        />
                       
                    </View>
                    <Divider style={{borderColor:'black',borderWidth:2}}/>
                    <View>
                        <Picker
                                selectedValue={vehicle.Type}
                                onValueChange={(itemValue, itemIndex) =>
                                    setVehicle({...vehicle,Type:itemValue})
                                }>
                                <Picker.Item  label="Car" value="car" />
                                <Picker.Item  label="Mortocycle" value="mortocycle" />
                                </Picker>
                       
                    </View>
                    <Divider style={{borderColor:'black',borderWidth:2}}/>
                </View>
               
            </ScrollView>
            
            <View style={{flex:2,flexDirection:'row',padding:5,justifyContent: 'space-evenly',}}>
                
                    <Button title="BACK" containerStyle={{width:100,alignSelf:'flex-end'}} onPress={() => navigation.goBack()} >

                    </Button>
               
             
                    <Button title="ADD" disabled={!(vehicle.Name != ''  && vehicle.Plate != '' && vehicle.Type != '' && vehicle.pic != '')} containerStyle={{width:100,alignSelf:'flex-end'}} onPress={() => {add(vehicle,navigation)}}>

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