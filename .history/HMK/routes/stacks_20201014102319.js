import * as Keychain from 'react-native-keychain';
import React, { useState, createContext,useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import * as geofirestore from 'geofirestore'
import Loading from '../components/loading';
import HostStack from './hostStack';
import SignupStacks from './signupStacks';

const geoFire = geofirestore.initializeApp(firestore())
const geoCollection = geoFire.collection('host')
const AuthContext = createContext();
const Stack = createStackNavigator();

async function uploadImage(uri,ID,name){
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
    .child(`${ID}/${name}/${ID}.jpg`);
  const snapshot = await ref.put(blob);

  // We're done with the blob, close and release it
  blob.close();
  return 
  
}

function createStack(){
	const [isLoading,setIsLoading] = useState(true)
	const [userToken,setUserToken] = useState(null)

	const auth = React.useMemo(() => {
		return{
			signIn: async Data =>{
				await firestore().
				collection(Data.type)
				.where("UserName", "==", Data.username).where("Pass","==",Data.pass)
				.get().then(async snapshot  => {
					
					if(!snapshot.empty){
						  try{
							await Keychain.setGenericPassword(Data.username, Data.pass);
							setUserToken(Data.type)
							await AsyncStorage.setItem("Type",Data.type);
							snapshot.forEach( async element => {
								await AsyncStorage.setItem("ID",element.id)
							});
							setIsLoading(false);
						  }
						  catch(err){
							return console.log("Some thing is not right :",err);
						  }
					}
					else{
						return	alert("User does not exist!.")
					}
				});
				
			},
			signUpHost: async (signUpData,uri,coords)  =>{
				console.log(uri)
				const stringData = JSON.stringify({
					type:'host',
					username:signUpData.UserName,
					pass:signUpData.Pass })
						console.log(info.coords)
						await geoCollection.add({  
							UserName:signUpData.UserName,
							email:signUpData.Email,
							name:'',
							gender:'',
							age:null,
							DoB:'',
							Pid:'',
							PhoneN:'',
							religion:'',
							Address:'',
							Province:'',
							postalcode:'',
							Pass:signUpData.Pass,
							Country:'',     
							createWhen:firestore.Timestamp.now(),
							imgIcon:'gs://holdmybike-998ed.appspot.com/account.png', 
							houseLocation:coords,
							houseregis:'',
							Suspend:false,
							parkingspace:'',
							verified:false,
							selimg:'',
							SubDist_Dist:'',
							Road:'',
							vehicles:0,
							Idcard:'',
							DriverLic:'',
							wallet:''
						}).then( async (res) => {
							try{
								await firestore().collection('wallet').add({
									balance:0.00,
									owner:firestore().doc('host/'+res.id)
								}).then(async (ress) => {
									await firestore().collection('host').doc(res.id).update({wallet:firestore().doc('wallet/'+ress.id)})
								})
								await Keychain.setGenericPassword(signUpData.UserName, signUpData.Pass);
								setUserToken('host')
								await AsyncStorage.setItem("Type",'host');
								setIsLoading(false);
								uploadImage(uri.IDcard,res.id,'idcard').then( (time) => {
									firestore().collection('host').doc(res.id).update({Idcard:`gs://holdmybike-998ed.appspot.com/${res.id}/idcard/${res.id}.jpg`})
									
									}	
									).catch(err => console.log(err.message
								))
								uploadImage(uri.address,res.id,'houseregis').then( (time) => {
									firestore().collection('host').doc(res.id).update({houseregis:`gs://holdmybike-998ed.appspot.com/${res.id}/houseregis/${res.id}.jpg`})
									
									}	
									).catch(err => console.log(err.message
								))
								uploadImage(uri.lic,res.id,'drivelicence').then( (time) => {
									firestore().collection('host').doc(res.id).update({DriverLic:`gs://holdmybike-998ed.appspot.com/${res.id}/drivelicence/${res.id}.jpg`})
									
									}	
									).catch(err => console.log(err.message
								))
							  }
							  catch(err){
								console.log("Some thing is not right :",err.message);
								return
							  }
						})
					
					
				
			},
			signOut: async () =>{
				setIsLoading(false);
				try{
					await Keychain.resetGenericPassword();
				  }
				  catch(err){
					console.log("Some thing is not right :",err.message);
				  }
				await AsyncStorage.removeItem("Type")
				await AsyncStorage.removeItem("ID")
				setUserToken(null);
				
			}
		}

	}, [])

	React.useEffect(()=>{
		setTimeout(async () => {
			try {	
				const credentials = await Keychain.getGenericPassword();	
				const Type = await AsyncStorage.getItem("Type")
				const data = {
					username:credentials.username,
					pass:credentials.password,
					type:Type
				}
				if(credentials.username && Type){
					auth.signIn(data)

				}
				else{
					setIsLoading(false)
				}
				
				
			} catch (error) {
				console.log("Keychain couldn't be accessed!", error);	
			}
			
		}, 1000);
	})
	if(isLoading){
		
		return <Loading/>
	}
	return (
		<AuthContext.Provider value={auth} >
			<NavigationContainer>
				{userToken == null ? (<Stack.Navigator>
											<Stack.Screen name = "SignupStacks" component= {SignupStacks} 
												options={{
													headerShown: false
													
												}}
											/>
									</Stack.Navigator>) 
									: (<Stack.Navigator 
			
										>
												<Stack.Screen name = "HostStack" component= {HostStack}
													options={{
														headerShown: false
													}}
													/>
									</Stack.Navigator>)}
			
			</NavigationContainer>
		</AuthContext.Provider>
	);
	
}
const styles = StyleSheet.create({
	box:{
		backgroundColor:'#61dafb',
	}
});
export default createStack;
export {AuthContext};