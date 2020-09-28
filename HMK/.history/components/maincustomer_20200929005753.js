import React from 'react';
import { StyleSheet,View} from 'react-native';

import { Button, Image } from 'react-native-elements';
import Header from '../components/bar';


function Feed({ navigation }){
	

	return (
		<View style={page.container}>
			<Header navigation = {navigation}/>
			<View stlye={page.container2}>
				<Image source={require('../img/bg.jpg')} style={{ width: 450,
    				height: 230}} />
			</View>
			<View style={page.Bigbox}>
				<View style={page.box1}>
					<Button title="Profile" type='clear' buttonStyle={[page.box2,{backgroundColor:'#b1ff69'}]} titleStyle={page.fontbox} onPress = {() => navigation.navigate('Profile')} />
					<Button title="Cars" type='clear' buttonStyle={[page.box2,{backgroundColor:'#ff8f69'}]} titleStyle={page.fontbox} onPress={() => navigation.navigate('Cars')} />
				</View>
				<View style={page.box1}>
					<Button title="Parking"  type='clear'buttonStyle={[page.box2,{backgroundColor:'#02f59c'}]} titleStyle={page.fontbox} onPress={() => navigation.navigate('Parkings')}  />
					<Button title="Payments"  type='clear' buttonStyle={[page.box2,{backgroundColor:'#ffcb69'}]} titleStyle={page.fontbox} onPress={() => navigation.navigate('Payments')} />
				</View>
			</View>
		</View>	
	);
}
const page = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#6a1378',
  },
  container2:{
	flex: 3,
	borderWidth:2,
	borderColor:'black',
  },
  text: {
    fontSize: 30,
    color: '#000'
  },
  Bigbox:{
	  flexDirection:'row',
  },
  box1:{
	flex:2,
	flexDirection:'column',
	justifyContent: 'center',
	alignContent:'stretch'

  },
  box2:{
	borderColor:'#6a1378',
	borderWidth:1,
	height:180,
	justifyContent:'center',
  },
  fontbox:{
	  fontSize:32,
  }
});

export default Feed;