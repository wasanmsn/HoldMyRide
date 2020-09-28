import React, { useState } from 'react'
import * as Keychain from 'react-native-keychain';
import {ScrollView,View,Text,StyleSheet} from 'react-native'
import Header from '../bar';
import AsyncStorage from '@react-native-community/async-storage';
import { Divider,Input,Button } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Picker} from '@react-native-community/picker';

var geohash = require('ngeohash');
let DocID = ''
function calculateAge (birthDate, otherDate) {
    birthDate = new Date(birthDate);
    otherDate = new Date(otherDate);

    var years = (otherDate.getFullYear() - birthDate.getFullYear());

    if (otherDate.getMonth() < birthDate.getMonth() || 
        otherDate.getMonth() == birthDate.getMonth() && otherDate.getDate() < birthDate.getDate()) {
        years--;
    }

    return years;
}
async function getProfile() {
    let Data = {}
    try {
        const credit = await Keychain.getGenericPassword()
        const type = await AsyncStorage.getItem("Type")
        await firestore().collection(type).where('UserName',"==",credit.username).get().then( snapshot => {
           if(snapshot.empty){
               console.log("No matching docs")
               return
           }
           snapshot.forEach(doc => {
           Data  = {
            UserName:credit.username,
            email:doc.data().email,
            name:doc.data().name,
            gender:doc.data().gender,
            age:doc.data().age,//.toString()
            DoB:doc.data().DoB != null ? new Date(doc.data().DoB.seconds*1000) : null ,
            Pid:doc.data().Pid,
            PhoneN:doc.data().PhoneN,
            religion:doc.data().religion,
            Address:doc.data().Address,
            Province:doc.data().Province,
            postalcode:doc.data().postalcode,
            Pass:credit.password,
            Country:doc.data().Country,
            createWhen:doc.data().createWhen,
            imgIcon:doc.data().imgIcon,
            houseLocation:doc.data().houseLocation,
            houseregis:doc.data().houseregis,
            Suspend:doc.data().Suspend,
            parkingspace:doc.data().parkingspace,//.toString()
            verified:doc.data().verified,
            selimg:doc.data().selimg,
            SubDist_Dist:doc.data().SubDist_Dist,
            Road:doc.data().Road,
            }
           DocID = doc.id
           })
        })
    } catch (error) {
        return console.log("Something wrong ",error)
    }
    return Data
}
async function saveProfile(Data){
    Data = {
        ...Data,
        DoB:firestore.Timestamp.fromDate(new Date(Data.DoB))
    }
    try {
        const type = await AsyncStorage.getItem("Type")
        await firestore().collection(type).doc(DocID).set(Data)
    } catch (error) {
        return console.log("Something wrong ",error)
    }
} 
function Profile( {navigation} ) {
    const [edit,setEdit] = useState(true)
    const [show,setshow] = useState(false)
    const [Data,setData] = useState({
        name:'',
        gender:'',
        Pid:'',
        age:'',
        DoB:'',
        email:'',
        PhoneN:'',
        religion:'',
        
        Address:'',
        Road:'',
        SubDist_Dist:'',
        Province:'',
        postalcode:'',
        parkingspace:0,
        verified:false
        
    })
    React.useEffect(() => {
        getProfile().then(doc => {
            setData(doc)
        })
    },[])
    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || Data.DoB;
        const age = calculateAge(currentDate,new Date())
        setshow(false);
        setData({...Data,DoB:currentDate,age:age});
        
      };
    const Addr = [
        {field:'Plot/House number, Village',value:Data.Address},
        {field:'Road',value:Data.Road == '' ? '-' : Data.Road},
        {field:'Subdistrict, District',value:Data.SubDist_Dist},
        {field:'Province Postal Code',value:Data.Province +' '+ Data.postalcode},
    ]
    return(
        <View style={page.container}>
            <Header navigation = {navigation}/>
            <ScrollView style={page.box1}>
            <Text style={page.text1}>Personal Infomation</Text>
            <View style={{backgroundColor:(Data.verified ? '#32e361':'red'),height:50,width:100,flexDirection:'column',justifyContent:'center',margin:5,borderColor:'black',borderWidth:2.5,borderRadius:5}}>
                <Text style={{alignSelf:'center'}}>
                    {Data.verified ? "Verified" : "Not Verified"}
                </Text>
            </View> 
                <Divider style={{ backgroundColor: '#8C7171' }} />
                
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           Name
                        </Text>
                        <Input  inputStyle={{fontSize:12,color:'#8C7171',bottom:-16}} onChangeText={( text => {
                            setData({...Data,name:text})
                        })} value={Data.name ? Data.name : ''} disabled={edit}>
                        
                        </Input>
                    </View>
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                            Gender
                        </Text>
                        <Picker
                                selectedValue={Data.gender}
                                style={{height: 25, width: 150,color:'#8C7171',bottom:-25}}
                                
                                enabled={!edit}
                                onValueChange={(itemValue, itemIndex) =>
                                    setData({...Data,gender: itemValue})
                                }>
                                <Picker.Item  label="Male" value="Male" />
                                <Picker.Item  label="Female" value="Female" />
                                </Picker>
                        
                        
                    </View>
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           Personal ID
                        </Text>
                        <Input keyboardType='number-pad' inputStyle={{fontSize:12,color:'#8C7171',bottom:-16}} onChangeText={( text => {
                            setData({...Data,Pid:text})
                        })} value={Data.Pid ? Data.Pid : ''} disabled={edit}>
                        
                        </Input>
                    </View>
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           Date of birth
                        </Text>
                        
                        <Input inputStyle={{fontSize:12,color:'#8C7171',bottom:-16}} value={Data.DoB != null ? new Date(Data.DoB).toDateString() : null} disabled={true}>
                        
                        </Input> 
                        
                    </View>
                    <View  style={{flexDirection:'row',alignSelf:'flex-end',margin:3}}>
                   
                   <Button title="Edit Birth" containerStyle={{width:100}} buttonStyle={{height:20}} titleStyle={{fontSize:12}}  
                       onPress={() => {setshow(true)}} disabled={edit} />
                       
                    </View>
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           Age
                        </Text>
                        <Input inputStyle={{fontSize:12,color:'#8C7171',bottom:-16}} value={Data.age ? Data.age.toString() : 0 } disabled={true}>
                        
                        </Input>
                    </View>
                   
                   
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           E-mail
                        </Text>
                        <Input inputStyle={{fontSize:12,color:'#8C7171',bottom:-16}} onChangeText={( text => {
                            setData({...Data,email:text})
                        })} value={Data.email ? Data.email : ''} disabled={edit}>
                        
                        </Input>
                    </View>
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           Phone Number
                        </Text>
                        <Input keyboardType='number-pad' inputStyle={{fontSize:12,color:'#8C7171',bottom:-16}} onChangeText={( text => {
                            setData({...Data,PhoneN:text})
                        })} value={Data.PhoneN ? Data.PhoneN : ''} disabled={edit}>
                        
                        </Input>
                    </View>
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           Religion
                        </Text>
                        <Input inputStyle={{fontSize:12,color:'#8C7171',bottom:-16}} onChangeText={( text => {
                            setData({...Data,religion:text})
                        })} value={Data.religion ? Data.religion : ''} disabled={edit}>
                        
                        </Input>
                    </View>
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           Parking Capacity
                        </Text>
                        <Input inputStyle={{fontSize:12,color:'#8C7171',bottom:-16}} onChangeText={( text => {
                            setData({...Data,parkingspace:parseInt(text)})
                        })} value={Data.parkingspace ? Data.parkingspace.toString(): ''} disabled={edit}>
                        
                        </Input>
                    </View>
         
                <Divider style={{ backgroundColor: '#8C7171' }} />
                <Text style={page.text1}>Residential Infomation</Text>
                <Divider style={{ backgroundColor: '#8C7171' }} />
                {Addr.map(info => (
                     <View key={info.field} style={page.box2}>
                        <Text style={page.text2} >{info.field} </Text>
                        <Input inputStyle={{fontSize:12,color:'#8C7171',bottom:-16}} value={info.value} disabled={edit}>
                        
                        </Input>
                    </View>
                ))}
                <Divider style={{ backgroundColor: '#8C7171' }} />
                <View style={[page.box2,{justifyContent:'space-evenly',margin:20,padding:15}]}>
                    <Button title="BACK" containerStyle={{width:100}} onPress={() => navigation.goBack()} >

                    </Button>
                    {edit ? (<Button title="EDIT" containerStyle={{width:100}} onPress={() => {setEdit(false)
                       }}>
                        
                        </Button>):(<Button title="DONE" containerStyle={{width:100}} onPress={() => {
                           saveProfile(Data).then(alert("Yout data has been updated.")).catch(alert("Your data has not been updated."))
                            setEdit(true)}}>
                        
                        </Button>)}
                </View>
                
            </ScrollView>
            {show && (<DateTimePicker mode="date" value={Data.DoB != null ? Data.DoB : new Date()} onChange={onChange} />)}
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
export default Profile;