import React from 'react';
import { StyleSheet, Text, Button , TouchableOpacity,Image} from 'react-native';
import  {AuthContext}  from '../../../routes/stacks';
import Linegrad from 'react-native-linear-gradient'
import { firebase } from '@react-native-firebase/firestore';
import {Card,Title} from 'react-native-paper'
import Icons from 'react-native-vector-icons/FontAwesome5'
import ImagePicker from 'react-native-image-picker'
import Geolocation from '@react-native-community/geolocation';
const options = {
    storageOptions: {
      skipBackup: true,
      path: 'images'
    }
  };
  var uri = []
function uploadimg({route}) {
    const {signUpData} = route.params
    const { signUpHost } = React.useContext(AuthContext);
    const [IDcard,setIDcard] = React.useState();
    const [address,setAddress] = React.useState();
    const [lincence,setLincence] = React.useState();
    const ImagePick = (name) => {
        ImagePicker.showImagePicker(options,(res) => {
            
            if (res.didCancel){
                console.log('User cancelled image picker')
            }
            else if (res.error){
                console.log('ImagePicker Error: ',res.error)
            }
            else{
                switch (name) {
                    case 'idcard':
                        setIDcard(res.uri)
                        break;
                    case 'address':
                        setAddress(res.uri)
                        break;
                    case 'licene':
                        setLincence(res.uri)
                        break;
                }
            }
        })
    }

    return(
        <Linegrad colors={['#7bd5f5','#4adede']} style={page.container} >
            <Text style={page.title}>HoldMyRide</Text>
            <Card style={{marginVertical:1,flexDirection:'row',justifyContent:'space-between',padding:5}}>
                <Card.Title title="อัปโหลด"  subtitle='การสมัครใกล้สำเร็จแล้วโปรดอัปโหลดข้อมูลดังนี้' />
                <Card.Content>
                    
                    <Title>ภาพบัตรประจำตัวประชาชน</Title>
                    <TouchableOpacity  style={{ borderColor:'black',borderWidth:2,alignSelf:'center'}} onPress={() => ImagePick('idcard')} >
                        {IDcard ? <Image source={{uri:IDcard}} style={{ width: 100, height: 100}} /> : <Icons name="camera"  size={100} /> }  
                    </TouchableOpacity>
                    <Title>ทะเบียนบ้าน</Title>
                    <TouchableOpacity  style={{ borderColor:'black',borderWidth:2,alignSelf:'center'}} onPress={() => ImagePick('address')} >
                        {address ? <Image source={{uri:address}} style={{ width: 100, height: 100}} /> : <Icons name="camera"  size={100} /> }  
                    </TouchableOpacity>
                    <Title>ใบขับขี่</Title>
                    <TouchableOpacity  style={{ borderColor:'black',borderWidth:2,alignSelf:'center'}} onPress={() => ImagePick('licene')} >
                            {lincence ? <Image source={{uri:lincence}} style={{ width: 100, height: 100}} /> : <Icons name="camera"  size={100} /> }  
                    </TouchableOpacity>
                </Card.Content>
            </Card>
            <Button title="เสร็จสิ้น" onPress={() => {
                Geolocation.getCurrentPosition(res => {
                    const location = firebase.firestore.GeoPoint(res.coords.latitude,res.coords.longitude)
                    signUpHost(signUpData,{IDcard:IDcard,address:address,lic:lincence},location)
                })
                
            }}></Button>
        </Linegrad>
    )
}
const page = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column', 
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center' ,
        padding:5
    },
    box:{
        height: 38,
        width: 208,
        borderWidth: 2,
        padding:5,
        marginVertical:14
    },
    title:{
      fontSize:46,
      color:'#8C7171',
      margin:27
      
    },
    text:{
        fontSize:25,
        color:'#8C7171',
        margin:1
    }
  
  });
export default uploadimg;