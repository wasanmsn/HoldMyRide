import React, { useState } from 'react';
import { StyleSheet, Text, View, Button , TextInput } from 'react-native';
import  { AuthContext }  from '../routes/stacks';


var sha256 = require('js-sha256').sha256;

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
		<View style={page.container}>
			<Text style={page.title} >
			HoldMyBike
			</Text>

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
			<Text style={{ color:'#A83535',fontSize:14,margin:8 }}>
				Forgot password?
			</Text>

			<View style={{ margin:17,width:200}}>
				<Button title="LOGIN AS CUSTOMER" 
				onPress={() => {
					Data.type = "customer";
					if(Data.username != '' && pass != ''){
						signIn(Data);
					}
					else{
						setBC('red')
						setBC2('red')
						alert("Username and Password is empty!")
					}
				}}
				
				
				/>
			</View>
			
			<View style={{ margin:17,width:200}}>
				<Button title="LOGIN AS HOST"
				onPress={() => {
					Data.type= "host"
					signIn(Data)}}
				/>
				
			</View>

			<View style={{ margin:17,width:200}}>
				<Button color="green" title="SIGN UP" onPress={ () => {navigation.navigate("Signup")}} />
			</View>		
		</View>	
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