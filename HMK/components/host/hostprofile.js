import React, { useState } from 'react'
import * as Keychain from 'react-native-keychain';
import {ScrollView,View,Text,StyleSheet} from 'react-native'
import Header from '../bar';
import AsyncStorage from '@react-native-community/async-storage';
import { Divider,Input,Button } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
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
                Name:doc.data().name,
                GD:doc.data().gender,
                PID:doc.data().Pid,
                AGE:doc.data().age.toString(),
                DoB:doc.data().DoB.seconds*1000,
                Email:doc.data().email,
                PN:doc.data().PhoneN,
                RL:doc.data().religion,
                ADDR:doc.data().Address,
                Road:doc.data().Road,
                SD:doc.data().SubDist_Dist,
                PV:doc.data().Province,
                PC:doc.data().postalCode,
                parkingspace:doc.data().parkingspace.toString()
            }
        
           })
        })
    } catch (error) {
        return console.log("Something wrong ",error)
    }
    return Data
}
function Profile( {navigation} ) {
    const [edit,setEdit] = useState(true)
    const [Data,setData] = useState({})
    React.useEffect(() => {
        getProfile().then(doc => {
            setData(doc)
        })
    },[])
    const PIlist = [
        {id:1,text:'Name',value:Data.Name},
        {id:2,text:'Gender',value:Data.GD},
        {id:3,text:'Personal ID',value:Data.PID},
        {id:4,text:'Age',value:Data.AGE},
        {id:5,text:'Date of birth',value:new Date(Data.DoB).toDateString()},
        {id:6,text:'E-mail',value:Data.Email},
        {id:7,text:'Phone Number',value:Data.PN},
        {id:8,text:'Religion',value:Data.RL},
    ]
    const Addr = [
        {field:'Plot/House number, Village',value:Data.ADDR},
        {field:'Road',value:Data.Road == '' ? '-' : Data.Road},
        {field:'Subdistrict, District',value:Data.SD},
        {field:'Province Postal Code',value:Data.PV +' '+ Data.PC},
        {field:'Vehicle Capacity',value:Data.parkingspace}
    ]
    return(
        <View style={page.container}>
            <Header navigation = {navigation}/>
            <ScrollView style={page.box1}>
                <Text style={page.text1}>Personal Infomation</Text>
                <Divider style={{ backgroundColor: '#8C7171' }} />
                {PIlist.map(info => (
                    <View key={info.id} style={page.box2}>
                        <Text key={info.text} style={page.text2}>
                           {info.text}
                        </Text>
                        <Input inputStyle={{fontSize:12,color:'#8C7171',bottom:-16}} value={info.value} disabled={edit}>
                        
                        </Input>
                    </View>
                ))}
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
                        
                        </Button>):(<Button title="DONE" containerStyle={{width:100}} onPress={() => {setEdit(true)}}>
                        
                        </Button>)}
                </View>
                
            </ScrollView>
            
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