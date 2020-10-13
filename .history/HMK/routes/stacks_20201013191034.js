import * as Keychain from 'react-native-keychain';
import React, { useState, createContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';

import Loading from '../components/loading';
import CustomerStack from './customerStack';
import SignupStacks from './signupStacks';



//var geohash = require('ngeohash');
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
			signUpCust: async signUpData  =>{

				const stringData = JSON.stringify({
					type:'customer',
					username:signUpData.UserName,
					pass:signUpData.Pass })
					await firestore().collection('customer').add({  
						UserName:signUpData.UserName,
						Email:signUpData.Email,
						Name:signUpData.UserName,
						Age:null,
						DoB:null,
						Pass:signUpData.Pass,   
						registerDate:firestore.Timestamp.now(),
						imgIcon:'gs://holdmybike-998ed.appspot.com/account.png', 
						Location:'',
						wallet:'',
					}).then( async (res) => {
						try{
							await firestore().collection('wallet').add({
								balance:0.00,
								owner:firestore().doc('customer/'+res.id)
							}).then(async (ress) => {
								await firestore().collection('customer').doc(res.id).update({wallet:firestore().doc('customer/'+ress.id)})
							})
							await Keychain.setGenericPassword(signUpData.UserName, signUpData.Pass);
							setUserToken('customer')
							await AsyncStorage.setItem("Type",'customer');
							setIsLoading(false)
						  }
						  catch(err){
							console.log("Some thing is not right :",err.message);
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
												<Stack.Screen name = "CustomerStack" component= {CustomerStack}
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