import React, { useState } from 'react'
import * as Keychain from 'react-native-keychain';
import {ScrollView,View,Text,StyleSheet} from 'react-native'
import Header from '../bar';
import AsyncStorage from '@react-native-community/async-storage';
import { Divider,Input,Button } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';


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
                Name:doc.data().Name,
                Gender:doc.data().Gender,
                Pid:doc.data().Pid,
                Age:doc.data().Age,
                DoB:doc.data().DoB != null ? new Date(doc.data().DoB.seconds*1000) : null ,
                Email:doc.data().Email,
                PhoneN:doc.data().PhoneN,
                Religion:doc.data().Religion,
                Address:doc.data().Address,
                Road:doc.data().Road,
                SubDist_Dist:doc.data().SubDist_Dist,
                Province:doc.data().Province,
                PostalCode:doc.data().PostalCode,
                registerDate:doc.data().registerDate,
				imgIcon:doc.data().imgIcon, 
                Location:doc.data().Location,
                UserName:credit.username,
                Pass:credit.password,
                Country:doc.data().Country
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
        await firestore().collection(type).doc(DocID).update(Data)
    } catch (error) {
        return console.log("Something wrong ",error)
    }
} 
function Profile( {navigation} ) {
    const [edit,setEdit] = useState(true)
    const [show,setshow] = useState(false)
    const [Data,setData] = useState({
        Name:'',
        Pid:'',
        Age:0,
        DoB:'',
        Email:'',
        PhoneN:'',
        
    })
    React.useEffect(() => {
        getProfile().then(doc => {
            setData(doc)
        })
       
        
    },[])
    const onChange = (event, selectedDate ) => {
        var currentDate = selectedDate || Data.DoB;
        const age = calculateAge(currentDate,new Date())
        setshow(false);
        currentDate.setDate(currentDate.getDate()+1)
        setData({...Data,DoB:currentDate,Age:age});
        
      };
    return(
        <View style={page.container}>
            <Header navigation = {navigation}/>
            <ScrollView style={page.box1} >
                <Text style={page.text1}>Personal Infomation</Text>
                <Divider style={{ backgroundColor: '#8C7171' }} />
                
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           ชื่อ
                        </Text>
                        <Input disabledInputStyle={{color:'black',opacity:1}} inputStyle={{fontSize:12,color:'#8C7171',bottom:-16}} onChangeText={( text => {
                            setData({...Data,Name:text})
                        })} value={Data.Name ? Data.Name : ''} disabled={edit}>
                        
                        </Input>
                    </View>
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           บัตรประชาชน
                        </Text>
                        <Input disabledInputStyle={{color:'black',opacity:1}} keyboardType='number-pad' inputStyle={{fontSize:12,color:'#8C7171',bottom:-16}} onChangeText={( text => {
                            setData({...Data,Pid:text})
                        })} value={Data.Pid ? Data.Pid : ''} disabled={edit}>
                        
                        </Input>
                    </View>
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           วันเกิด
                        </Text>
                        
                        <Input disabledInputStyle={{color:'black',opacity:1}} inputStyle={{fontSize:12,color:'#8C7171',bottom:-16}} value={Data.DoB != null ? new Date(Data.DoB).toLocaleDateString('th-TH',{
                             year: 'numeric',
                             month: 'long',
                             day: 'numeric',
                             weekday: 'long',
                        }) : null} disabled={true}>
                        
                        </Input> 
                        
                    </View>
                    <View  style={{flexDirection:'row',alignSelf:'flex-end',margin:3}}>
                   
                   <Button title="Edit Birth" containerStyle={{width:100}} buttonStyle={{height:20}} titleStyle={{fontSize:12}}  
                       onPress={() => {setshow(true)}} disabled={edit} />
                       
                    </View>
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           อายุ
                        </Text>
                        <Input disabledInputStyle={{color:'black',opacity:1}} inputStyle={{fontSize:12,color:'#8C7171',bottom:-16}} value={Data.Age ? Data.Age.toString() : ''} disabled={true}>
                        
                        </Input>
                    </View>
                   
                   
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           อีเมล
                        </Text>
                        <Input disabledInputStyle={{color:'black',opacity:1}} inputStyle={{fontSize:12,color:'#8C7171',bottom:-16}}  value={Data.Email ? Data.Email : ''} disabled={true}>
                        
                        </Input>
                    </View>
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           เบอร์มือถือ
                        </Text>
                        <Input disabledInputStyle={{color:'black',opacity:1}} keyboardType='number-pad' inputStyle={{fontSize:12,color:'#8C7171',bottom:-16}} onChangeText={( text => {
                            setData({...Data,PhoneN:text})
                        })} value={Data.PhoneN ? Data.PhoneN : ''} disabled={edit}>
                        
                        </Input>
                    </View>
         
                <Divider style={{ backgroundColor: '#8C7171' }} />
                <View style={[page.box2,{justifyContent:'space-evenly',margin:20,padding:15}]}>
                    <Button title="กลับ" containerStyle={{width:100}} onPress={() => navigation.goBack()} >

                    </Button>
                   
                    {edit ? (<Button title="แก้ไข" containerStyle={{width:100}} onPress={() => {setEdit(false)
                       }}>
                        
                        </Button>):(<Button title="DONE" containerStyle={{width:100}} onPress={() => {
                            saveProfile(Data).then(alert("Yout data has been updated.")).catch(err => console.log(err))
                            setEdit(true)
                            
                            }}>
                        
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
        color:'black',
        fontSize:18
    },
    text2:{
        padding:30,
        color:'black',
        fontSize:12
    }
})
export default Profile;