import React, { useState } from 'react'
import * as Keychain from 'react-native-keychain';
import {ScrollView,View,Text,StyleSheet} from 'react-native'
import Header from '../bar';
import AsyncStorage from '@react-native-community/async-storage';
import { Divider,Input } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import DateTimePicker from '@react-native-community/datetimepicker';
import LinearGradient from 'react-native-linear-gradient'
import {Button} from 'react-native-paper'
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
                Pid:doc.data().Pid,
                Age:doc.data().Age,
                DoB:doc.data().DoB != null ? new Date(doc.data().DoB.seconds*1000) : null ,
                Email:doc.data().Email,
                PhoneN:doc.data().PhoneN,
                registerDate:doc.data().registerDate,
				imgIcon:doc.data().imgIcon, 
                Location:doc.data().Location,
                UserName:credit.username,
                Pass:credit.password,
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
    const [temp,setTemp] = useState({})
    const [thaidate,setThaidate] = useState('')
    const [Data,setData] = useState({
        Name:'',
        Pid:'',
        Age:0,
        DoB:'',
        Email:'',
        PhoneN:'',
        
    })
    const convertToString = (date) => {
        var dateString = new Date(date).toLocaleDateString('th-TH',{
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long',
       })
       var split_date = dateString.split(' ')
       console.log(split_date)
       var concate_date = split_date[0] +" "+ split_date[1]+" " + split_date[2]+" " + " พ.ศ. "+split_date[3]
       return concate_date
    }
    React.useEffect(() => {
        getProfile().then(doc => {
            setData(doc)
            
           setThaidate(convertToString(doc.DoB))
        })
       
        
    },[])
    const onChange = (event, selectedDate ) => {
        var currentDate = selectedDate || Data.DoB;
        const age = calculateAge(currentDate,new Date())
        setshow(false);
        currentDate.setDate(currentDate.getDate()+1)
        setThaidate(convertToString(currentDate))
        setData({...Data,DoB:currentDate,Age:age});
        
      };
    return(
        <LinearGradient colors={['#1ca7ec','#4adede']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={page.container}>
            <Header navigation = {navigation}/>
            <ScrollView style={page.box1} >
                <Text style={page.text1}>ข้อมูลส่วนตัว</Text>
                <Divider style={{ backgroundColor: '#8C7171' }} />
                
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           ชื่อ
                        </Text>
                        <Input disabledInputStyle={{color:'black',opacity:1}}  inputStyle={{fontSize:12,color:'black',bottom:-16}} onChangeText={( text => {
                            setData({...Data,Name:text})
                        })} value={Data.Name ? Data.Name : ''} disabled={edit}>
                        
                        </Input>
                    </View>
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           บัตรประชาชน
                        </Text>
                        <Input disabledInputStyle={{color:'black',opacity:1}} keyboardType='number-pad' inputStyle={{fontSize:12,color:'black',bottom:-16}} onChangeText={( text => {
                            setData({...Data,Pid:text})
                        })} value={Data.Pid ? Data.Pid : ''} disabled={edit}>
                        
                        </Input>
                    </View>
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           วันเกิด
                        </Text>
                        
                        <Input disabledInputStyle={{color:'black',opacity:1}} inputStyle={{fontSize:12,color:'black',bottom:-16}} value={Data.DoB != null ? thaidate : null} disabled={true}>
                        
                        </Input> 
                        
                    </View>
                    <View  style={{flexDirection:'row',alignSelf:'flex-end',margin:3}}>
                   
                   <Button title="แก้วันเกิด" containerStyle={{width:100}} buttonStyle={{height:20}} titleStyle={{fontSize:12}}  
                       onPress={() => {setshow(true)}} disabled={edit} />
                       
                    </View>
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           อายุ
                        </Text>
                        <Input disabledInputStyle={{color:'black',opacity:1}} keyboardType='number-pad' inputStyle={{fontSize:12,color:'#000000',bottom:-16}} value={Data.Age ? Data.Age.toString() : ''} disabled={true}>
                        
                        </Input>
                    </View>
                   
                   
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           อีเมล
                        </Text>
                        <Input disabledInputStyle={{color:'black',opacity:1}} keyboardType='email-address' inputStyle={{fontSize:12,color:'#000000',bottom:-16}}  value={Data.Email ? Data.Email : ''} disabled={true}>
                        
                        </Input>
                    </View>
                    <View  style={page.box2}>
                        <Text  style={page.text2}>
                           เบอร์มือถือ
                        </Text>
                        <Input disabledInputStyle={{color:'black',opacity:1}} keyboardType='number-pad' inputStyle={{fontSize:12,color:'#000000',bottom:-16}} onChangeText={( text => {
                            setData({...Data,PhoneN:text})
                        })} value={Data.PhoneN ? Data.PhoneN : ''} disabled={edit}>
                        
                        </Input>
                    </View>
         
                <Divider style={{ backgroundColor: '#8C7171' }} />
                <View style={[page.box2,{justifyContent:'space-evenly',margin:20,padding:15}]}>
                    {edit ? (<Button color={'white'}  contentStyle={{width:100,backgroundColor:'#1f2798'}} onPress={() => navigation.goBack()} >
                    กลับ
                    </Button>):(<Button color={'white'}  contentStyle={{width:100,backgroundColor:'#1f2798'}} onPress={() => {
                        setData(temp)
                        setThaidate(convertToString(temp.DoB))
                        setEdit(true)
                    }} >
                        ยกเลิก
                    </Button>)}
                   
                    {edit ? (<Button color={'white'} contentStyle={{width:100,backgroundColor:'#1f2798'}} onPress={() => {
                        setTemp(Data)
                        setEdit(false)
                       }}>
                           แก้ไข
                        </Button>):(<Button color={'white'} contentStyle={{width:100,backgroundColor:'#1f2798'}} onPress={() => {
                            saveProfile(Data).then(alert("ข้อมูลของคุณได้ถูกเปลี่ยนแปลงแล้ว")).catch(err => console.log(err))
                            setEdit(true)
                            
                            }}>
                                เสร็จสื้น
                        </Button>)}
                </View>
                
            </ScrollView>
            {show && (<DateTimePicker mode="date" value={Data.DoB != null ? Data.DoB : new Date()} onChange={onChange} />)}
        </LinearGradient>

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