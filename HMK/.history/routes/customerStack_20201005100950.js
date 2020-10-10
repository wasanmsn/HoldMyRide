
import React from 'react';

import { createDrawerNavigator,DrawerContentScrollView,DrawerItemList,DrawerItem } from '@react-navigation/drawer';
import { StyleSheet ,View,Text, TouchableOpacity} from 'react-native';
import {Divider} from 'react-native-paper'
import Home from '../components/maincustomer';
//import { AuthContext } from './stacks';
import Profile from '../components/customer/customerprofile';
import Cars from './carStack';
import { Avatar } from 'react-native-elements';
import * as Keychain from 'react-native-keychain';
import firestore ,{ firebase } from '@react-native-firebase/firestore';
import firestorage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker'
import Payments from '../components/customer/payment'
import bottomtabs from './buttomtabs'
import parkings from './parking'
import Bar from '../components/bar'
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
const defaultImg = '../../../img/uploadPic.png'
const Drawer = createDrawerNavigator(); 
var userID 


const options = {
    storageOptions: {
      skipBackup: true,
      path: 'images'
    }
  };
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
            userID = doc.id
            imgUri=doc.data().imgIcon     
           })
        })
    } catch (error) {
        return console.log("Something wrong ",error)
    }
    return imgUri
}
async function uploadImage(uri,ID){
    // Why are we using XMLHttpRequest? See:
  // https://github.com/expo/expo/issues/2402#issuecomment-443726662

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      resolve(xhr.response);
    };
    xhr.onerror = function(e) {
      reject(new TypeError('Network request failed'));
    };
    xhr.responseType = 'blob';
    xhr.open('GET', uri, true);
    xhr.send(null);
  });

  const ref = firebase
    .storage()
    .ref()
    .child(`${ID}/${ID}.jpg`);
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();
  return 
  
}

function customerStack( ){
	
	return (
		<Drawer.Navigator 
			drawerStyle={{
				backgroundColor: '#c6cbef',
				width: 240,
		  	}}
			drawerContent={(props) => <DrawerConents {...props}/>}
			>
			<Drawer.Screen name = "Parkings" component= {parkings} 
			/>
			<Drawer.Screen name = "Profile" component= {Profile}
			/>
			<Drawer.Screen name = "Cars" component= {Cars}
			/>
			<Drawer.Screen name = "Payments" component= {Payments}
			/>
		</Drawer.Navigator>
	);
	
}
function DrawerConents(props){
	const [Icon,setIcon] = React.useState(null)
	const [name,setName] = React.useState('')
	const navigation = useNavigation();
	React.useEffect(() => {
        getImg().then(
           async uri => {
			   firestorage().refFromURL(uri).getDownloadURL().then( img =>setIcon(img))
			   await firestore().collection('customer').doc(userID).get().then(res => {
				console.log(res.data().UserName)
				setName(res.data().UserName)
					})
				}
				
			)
		
	},[])
	function ImagePick(){
		ImagePicker.showImagePicker(options,(res) => {
				
			if (res.didCancel){
				console.log('User cancelled image picker')
			}
			else if (res.error){
				console.log('ImagePicker Error: ',res.error)
			}
			else{
				
			   uploadImage(res.uri,userID).then( (time) => {
					firestore().collection('customer').doc(userID).update({imgIcon:`gs://holdmybike-998ed.appspot.com/${userID}/${userID}.jpg`})
		
					setIcon(res.uri)}	
					).catch(err => console.log(err.message
				))
			}
		})
	}
	//const { signOut } = React.useContext(AuthContext);
	return(
	<DrawerContentScrollView {...props}>
		<View>
			<TouchableOpacity style={{alignSelf:'center',margin: 15,}}>
			<Avatar
				  rounded
				  size='xlarge'
  				source={{
    				uri:
					Icon ? Icon : defaultImg,
				  }}
				  showEditButton
				  containerStyle={{borderColor:'black'}}
				  onPress={() => {ImagePick()}}
				/>
			</TouchableOpacity>
			<Divider/>
			<Text style={{fontSize:32,fontWeight:'bold',alignSelf:'center'}}>{name}</Text>
		</View>
		<Divider/>
		<DrawerItem label="โฮสต์" icon={(props) => <Icon {...props} name="parking" size={20} />} onPress={() => navigation.navigate("Parkings")}/>
		<DrawerItem label="โปรไฟล์" onPress={() => navigation.navigate("Profile")}/>
		<DrawerItem label="โรงรถ" onPress={() => navigation.navigate("Cars")}/>
		<DrawerItem label="กระเป๋าเงิน" onPress={() => navigation.navigate("Payments")}/>
		<DrawerItem label="ออกจากระบบ" onPress={() => signOut()} 
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