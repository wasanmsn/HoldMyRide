
import React from 'react';

import { createDrawerNavigator,DrawerContentScrollView,DrawerItemList,DrawerItem } from '@react-navigation/drawer';
import { StyleSheet ,View,Text, TouchableOpacity} from 'react-native';
import Home from '../components/maincustomer';
import { AuthContext } from './stacks';
import Profile from '../components/customer/customerprofile';
import Cars from './carStack';
import { Avatar } from 'react-native-elements';
import * as Keychain from 'react-native-keychain';
import firestore from '@react-native-firebase/firestore';
import firestorage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';


const Drawer = createDrawerNavigator(); 
async function getImg() {
    let imgUri = null 
    try {
        const credit = await Keychain.getGenericPassword()
        const type = await AsyncStorage.getItem("Type")
        await firestore().collection(type).where('UserName',"==",credit.username).get().then( snapshot => {
           if(snapshot.empty){
               console.log("No matching docs")
               return 
           }
           snapshot.forEach(doc => {    
			 imgUri = doc.data().imgIcon
            
           })
        })
    } catch (error) {
        return console.log("Something wrong ",error)
	}
	console.log(imgUri)
    return imgUri
}
function customerStack({ navigation }){
	
	return (
		<Drawer.Navigator 
			drawerContent={props => <DrawerConents {...props}/>}
			>
			<Drawer.Screen name = "Home" component= {Home}
			/>
			<Drawer.Screen name = "Profile" component= {Profile}
			/>
			<Drawer.Screen name = "Cars" component= {Cars}
			/>
		</Drawer.Navigator>
	);
	
}
async function DrawerConents(props){
	
	const img = await getImg()
	const dlImg = await firestorage().refFromURL(img).getDownloadURL()
	//const { signOut } = React.useContext(AuthContext);
	return(
	<DrawerContentScrollView {...props}>
		<View>
			<TouchableOpacity>
				<Text>
				<Avatar
  					rounded
  					source={{
    					uri:
						dlImg,
  					}}
					/>
				</Text>
			</TouchableOpacity>
		</View>
		<DrawerItemList {...props} />
		<DrawerItem label="Logout" //onPress={() => signOut()} 
		/>
	  </DrawerContentScrollView>
	)
}
const styles = StyleSheet.create({
	box:{
		backgroundColor:'#61dafb',
	}
});
export default customerStack;