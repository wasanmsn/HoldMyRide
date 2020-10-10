import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';




function Signup({ navigation }) {
    return(
        <View style={page.container}>
			<Text style={page.title} >
			HoldMyBike
			</Text>
			<View style={{width:258, margin:26}}>
                <Button title="สมัครเป็นโฮสต์"
                onPress={() => {
                    navigation.navigate('Signuphost')
                }} />
			</View>
            <View style={{ width:258,margin:26}}>
				<Button title="สมัครเป็นลูกค้า" onPress={() => {
                    navigation.navigate('Signupcust')
                }} 
                
                />
			</View>
      <View style={{ width:258,margin:26}}>
				<Button title="เข้าสู่ระบบ" onPress={() => {
                   navigation.goBack()
                }} 
                
                />
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
    title:{
      fontSize:46,
      color:'#8C7171',
      margin:27
      
    },
  
  });
export default Signup;