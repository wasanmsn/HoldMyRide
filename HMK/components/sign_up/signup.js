import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import Linegrad from 'react-native-linear-gradient'



function Signup({ navigation }) {
    return(
        <Linegrad colors={['#7bd5f5','#ffffff']}  style={page.container}>
			<Text style={page.title} >
			HoldMyRide
			</Text>
			<View style={{width:258, margin:26}}>
                <Button title="สมัครเป็นโฮสต์" color='#1ca7ec'
                onPress={() => {
                    navigation.navigate('Signuphost')
                }} />
			</View>
            <View style={{ width:258,margin:26}}>
				<Button title="สมัครเป็นลูกค้า" color='#4adede' onPress={() => {
                    navigation.navigate('Signupcust')
                }} 
                
                />
			</View>
      <View style={{ width:258,margin:26}}>
				<Button title="เข้าสู่ระบบ" color="#787ff6" onPress={() => {
                   navigation.goBack()
                }} 
                
                />
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
    title:{
      fontSize:46,
      color:'#8C7171',
      margin:27
      
    },
  
  });
export default Signup;