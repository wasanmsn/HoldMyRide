import React, { useState } from 'react';
import { StyleSheet, Text, View, Button , TextInput, ScrollView,Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import  {AuthContext}  from '../../../routes/stacks';
import Linegrad from 'react-native-linear-gradient'
var logo = '../../../assets/holdmyride-logo.png'

var sha256 = require('js-sha256').sha256;

function Signupcust({ navigation } ) {
    
    const [ Username ,setUsername]= useState('');
    const [Pass,setPass]= useState('');
    const [Email,setEmail]= useState('');
    const [ConfirmPass,setConfirmPass] = useState('');
    const { signUpCust } = React.useContext(AuthContext);
    const [box1,setBox1] = useState('blue')
    const [box2,setBox2] = useState('blue')
    const [box3,setBox3] = useState('blue')
    const [box4,setBox4] = useState('blue')
    const [userText,setUserText] = useState('')
    const [passText,setPassText] = useState('gray')
    const [conPassText,setconPassText] = useState('')
    const [emailText,setemailText] = useState('')
    const [checkUsername,setCU] = useState(false)
    const [checkPass,setCP] = useState(false)
    const [checkConPass,setCCP] = useState(false)
    const [checkEmail,setCE] = useState(false)

    let passExp = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/g)
    let emailExp = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g)


    
    const signUpData = {
        UserName:Username,
        Email:Email,
        Pass:sha256(Pass),
    }; 
    return(
        <Linegrad colors={['#7bd5f5','#ffffff']} style={page.container}>
            <View style={{marginBottom:20,top:20}}>
				<Image source={require(logo)} style={{height:90,width:250}}  />
			</View>
            <ScrollView>
                <View style={{margin:20}}></View>
			<TextInput placeholder="Username"
            style={[page.box,{borderColor:box1}]}
            onChangeText={Username => setUsername(Username)}
            textContentType='username'
            onBlur={async () => {
                await firestore().collection("customer").where("UserName","==",Username).get().then((doc)=>{
                    if(!doc.empty){
                    setUserText("ไอดีนี้ถูกไช้ไปแล้ว")
                    setBox1('red')
                    }
                    else{
                        setUserText("ไช้ไอดีนี้ได้")
                        setBox1('green')
                        setCU(true)
                    }
                    
                }).catch((err) => {
                    console.log(err.message)
                })
            }} 
			/>
            {userText ? <Text style={{fontSize:9,color:box1}} >{userText}</Text> : null }
            

			<TextInput placeholder="Password"
            style={[page.box,{borderColor:box2}]}
            onChangeText={Pass => {
                setPass(Pass)
                if(Pass.match(passExp)){
                    setPassText("green")
                    setBox2("green")
                    setCP(true)
                }
                else{
                    setPassText("red")
                    setBox2("red")
                   
                }
            }}
			textContentType='password'
			secureTextEntry={true}
			onBlur={ () => {
                if(Pass.match(passExp)){
                    setPassText("green")
                    setBox2("green")
                    setCP(true)
                }
                else{
                    setPassText("red")
                    setBox2("red")
                   
                }
            }}
            
			/>
            <Text style={{fontSize:13,color:passText,width:208}}>
                รหัสผ่านของท่านต้องมี{"\n"}
                      {"\t"} ตัวอักษรภาษาอังกฤษพิมพ์ไหญ่และพิมพ์เล็กอย่างน้อย 1 ตัว{"\n"}
                      {"\t"} ตัวเลขอย่างน้อย 1 ตัว{"\n"}
                      {"\t"} อักขระตามนี้อย่างน้อย 1 ตัว (@,#,$,%,&).{"\n"}
                      {"\t"} ความยาวมากกว่าหรือเท่ากับ 8 ตัวอักษร{"\n"}
                    
            </Text>
            <TextInput placeholder="Confirm Password"
            style={[page.box,{borderColor:box3}]}
            onChangeText={ConfirmPass =>{
                 setConfirmPass(ConfirmPass)
                 if(Pass == ConfirmPass && checkPass){
                    setBox3('green')
                    setCCP(true)
                }
                else{
                    setconPassText("รหัสไม่ตรง")
                    setBox3('red')
                    
                }
                }}
			textContentType='password'
            secureTextEntry={true}
            onBlur={() => {
                if(Pass == ConfirmPass && checkPass){
                    setBox3('green')
                    setCCP(true)
                }
                else{
                    setconPassText("รหัสไม่ตรง")
                    setBox3('red')
                    
                }
            }}
			
			/>
            {conPassText ? <Text style={{color:box3,fontSize:9}}>
                {conPassText}
            </Text> : null }
            <TextInput placeholder="E-mail"
			style={[page.box,{borderColor:box4}]}
            onChangeText={Email => setEmail(Email)}
            keyboardType='email-address'
            textContentType='emailAddress'
            onBlur = {async () => {
                if(!Email.match(emailExp)){
                    setBox4('red')
                    setemailText('ไม่ไช่รูปแบบอีเมล')
                }
                else{
                    await firestore().collection('customer').where('Email','==',Email).get().then((doc) => {
                        if(!doc.empty){
                            setemailText("อีเมลนี้ถูกไช้ไปแล้ว")
                            setBox4('red')
                            }
                            else{
                                setemailText("ไช้ได้")
                                setBox4('green')
                                setCE(true)
                            }
                    }).catch((err) => {
                        console.log(err.message)
                    })
                }
            }}
			/>
            {emailText ? <Text style={{color:box4,fontSize:9}}>{emailText}</Text> : null}
            </ScrollView>
            
            <View style={{ flexDirection: 'row' }}>
                <View style={{ margin:17, width:150}}>
				    <Button color="#3e5294" title="กลับ" onPress={ () => {navigation.goBack()}} />
			    </View>	

                <View style={{ margin:17, width:150}}>
				    <Button title="สมัคร" disabled={!(checkConPass && checkEmail && checkUsername && checkPass)} onPress={ () => {

                            signUpCust(signUpData)

                            
                       }} />
			    </View>	

            </View>
            
					
		</Linegrad>	
    );
}
const page = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column', 
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center' 
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

export default Signupcust;