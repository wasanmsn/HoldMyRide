import React, { useState } from 'react';
import { StyleSheet, Text, View, Button , TextInput, Image } from 'react-native';
import  { AuthContext }  from '../routes/stacks';
import Lingrad from 'react-native-linear-gradient'
var sha256 = require('js-sha256').sha256;
var logo = '../assets/holdmyride-logo.png'
function Login({ navigation }){
	const [text,setText] = useState('');
	const [pass,setPass] = useState('');
	const [BorderColor,setBC]  = useState('#7773FF');
	const [BorderColor2,setBC2]  = useState('#7773FF');
	const { signIn } = React.useContext(AuthContext);
	const Data = {
		type:null,
		username:text,
		pass:sha256(pass)
	}


	return (
		<Lingrad colors={['#7bd5f5','#ffffff']}  style={page.container}>
			<View style={{margin:10,top:0}}>
				<Image source={require(logo)} style={{height:90,width:250}}  />
			</View>
			
			<TextInput placeholder="Username"
			style={[page.box,{borderColor:BorderColor}]}
			onChangeText={text => {
				setText(text);
				setBC('#7773FF')

			} }
			defaultValue={text}
			/>

			<TextInput placeholder="Password"
			style={[page.box,{borderColor:BorderColor2}]}
			textContentType='password'
			secureTextEntry={true}
			onChangeText={ pass => {
				setPass(pass);
				setBC2('#7773FF')
		
			}}
		
			/>
			<View style={{ margin:17,width:200}}>
				<Button title="เข้าสู่ระบบ" 
				color='#1ca7ec'
				onPress={() => {
					Data.type = "customer";
					if(Data.username != '' && pass != ''){
						signIn(Data);
					}
					else{
						setBC('red')
						setBC2('red')
						alert("ไอดีหรือรหัสผ่านไม่ถูกต้อง")
					}
				}}
				
				
				/>
			</View>
			<View style={{ margin:17,width:200}}>
				<Button color="#787ff6" title="สมัครสมาชิก" onPress={ () => {navigation.navigate("Signupcust")}} />
			</View>		
		</Lingrad>	
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

});


export default Login;