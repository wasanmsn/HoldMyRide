
import React from 'react';
import { Avatar } from 'react-native-elements';
import * as Keychain from 'react-native-keychain';
import firestore ,{ firebase } from '@react-native-firebase/firestore';
import firestorage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker from 'react-native-image-picker'
import { AuthContext } from './stacks';
import { createDrawerNavigator,DrawerContentScrollView,DrawerItemList,DrawerItem } from '@react-navigation/drawer';
import { StyleSheet ,View,Text, TouchableOpacity} from 'react-native';
import {Divider} from 'react-native-paper'


import Profile from '../components/host/hostprofile';
import Cars from './host_cars';
import Customers from './customerReqs'
import Payment from './payment'
import { useNavigation } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/FontAwesome5';

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
      console.log(e);
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

function customerStack(){
	return (
		<Drawer.Navigator 
			drawerStyle={{
			backgroundColor: '#1ca7ec',
			borderColor:'#78d5f5',
			width: 240,
		 	}}
		drawerContent={props => <DrawerConents {...props}/>}
		>
			<Drawer.Screen name = "Customers" component= {Customers}
				options={{
					drawerLabel:'ลูกค้า',
					drawerIcon: () => (
						<Icons  name="parking" size={20} style={{alignSelf:'center',marginRight:6,paddingLeft:2}} />					)
				}}
			
				/>
			<Drawer.Screen name = "Profile" component= {Profile}
				options={{
					drawerLabel:'โปรไฟล์',
					drawerIcon: () => (
						<Icons  name="user-alt" size={20} style={{alignSelf:'center',marginRight:6,paddingLeft:2}} />					)
				}}
			
				/>
			<Drawer.Screen name = "Cars" component= {Cars}
				options={{
					drawerLabel:'โรงรถ',
					drawerIcon: () => (
						<Icons  name="car" size={20} style={{alignSelf:'center',marginRight:6,paddingLeft:2}} />					)
				}}
			
				/>

			<Drawer.Screen name = "Payment" component= {Payment}
				options={{
					drawerLabel:'กระเป๋าเงิน',
					drawerIcon: () => (
						<Icons  name="wallet" size={20} style={{alignSelf:'center',marginRight:6,paddingLeft:2}} />					)
				}}
				
			
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
				console.log(uri)
			   firestorage().refFromURL(uri).getDownloadURL().then( img =>setIcon(img))
			   await firestore().collection('host').doc(userID).get().then(res => {
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
					firestore().collection('host').doc(userID).update({imgIcon:`gs://holdmybike-998ed.appspot.com/${userID}/${userID}.jpg`})
					setIcon(res.uri)}	
					).catch(err => console.log(err.message
				))
			}
		})
	}
	const { signOut } = React.useContext(AuthContext);
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
		<View style={{justifyContent:'space-between',padding:10}}>
		<DrawerItemList activeBackgroundColor={'#78D5F5'} {...props} />
		<DrawerItem  labelStyle={{fontSize:16}} label="ออกจากระบบ" icon={(props) => <Icons {...props} name="sign-out-alt" size={20} color={'black'}  style={{alignSelf:'center',marginRight:6,paddingLeft:2}}  />} onPress={() => signOut()}  />
		</View>
	  </DrawerContentScrollView>
	)
}
const styles = StyleSheet.create({
	box:{
		backgroundColor:'#61dafb',
	}
});
export default customerStack;