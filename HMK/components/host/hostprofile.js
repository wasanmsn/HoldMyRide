import React, { useState } from 'react'
import {ScrollView,View,Text,StyleSheet} from 'react-native'
import Header from '../bar';
import AsyncStorage from '@react-native-community/async-storage';
import { Divider,Input,Button } from 'react-native-elements';

function Profile( {navigation} ) {
    const [edit,setEdit] = useState(true)
    const formatted = new Date("2016-02-29");
    const options = { year: 'numeric', month: 'short', day: '2-digit'};
    const _resultDate = new Intl.DateTimeFormat('en-GB',options).format(formatted)
   
    const PIlist = [
        {id:1,text:'First Name',value:'Wasan'},
        {id:2,text:'Last Name',value:'Chat'},
        {id:3,text:'Gender',value:'Male'},
        {id:4,text:'Personal ID',value:'0123456789123'},
        {id:5,text:'Age',value:'23'},
        {id:6,text:'Date of birth',value:_resultDate},
        {id:7,text:'E-mail',value:'wasangg@gmail.com'},
        {id:8,text:'Phone Number',value:'0918819211'},
        {id:9,text:'Religion',value:'Buddha'},
    ]
    const Addr = [
        {field:'Plot/House number, Village',value:'144/4 M.5 Ban Tham'},
        {field:'Road',value:'-'},
        {field:'Subdistrict, District',value:'Chiang Dao'},
        {field:'Province Postal Code',value:'Chiang Mai 50170'},
        {field:'Parking Capacity',value:'23'}
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