import * as Keychain from 'react-native-keychain';
import React, { useState, createContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore, { firebase } from '@react-native-firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import Loading from '../components/loading';
import CustomerStack from './customerStack';
import HostStack from './hostStack';
import SignupStacks from './signupStacks';

//var geohash = require('ngeohash');
const AuthContext = createContext();
const Stack = createStackNavigator();
function createStack(){
	const [isLoading,setIsLoading] = useState(true)
	const [userToken,setUserToken] = useState(null)
	function setToken(val){
		setUserToken(val)
	}
	const auth = React.useMemo(() => {
		return{
			signIn: async Data =>{
				setIsLoading(false);		
				await firestore().
				collection(Data.type)
				.where("UserName", "==", Data.username).where("Pass","==",Data.pass)
				.get().then(async snapshot  => {
					
					if(!snapshot.empty){
						  try{
							await Keychain.setGenericPassword(Data.username, Data.pass);
							setUserToken(Data.type)
							await AsyncStorage.setItem("Type",Data.type);
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
						Name:'',
						Gender:'',
						Age:null,
						DoB:null,
						Pid:'',
						PhoneN:'',
						Religion:'',
						Address:'',
						Province:'',
						PostalCode:'',
						Pass:signUpData.Pass,
						Country:'',
						SubDist_Dist:'',
						Road:'',     
						registerDate:firestore.Timestamp.now(),
						imgIcon:'gs://holdmybike-998ed.appspot.com/account.png', 
						Location:''
					}).then( async () => {
						try{
							await Keychain.setGenericPassword(stringData.username, stringData.pass);
							setUserToken('customer')
							await AsyncStorage.setItem("Type",'customer');
							setIsLoading(false);
						  }
						  catch(err){
							console.log("Some thing is not right :",err.message);
						  }
					})
				
			},signUpHost: async signUpData  =>{
				const stringData = JSON.stringify({
					type:'host',
					username:signUpData.UserName,
					pass:signUpData.Pass })
					await firestore().collection('host').add({  
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
						houseLocation:null,
						houseregis:'',
						Suspend:false,
						parkingspace:'',
						verified:false,
						selimg:'',
						SubDist_Dist:'',
						Road:'',
					}).then( async () => {
						try{
							await Keychain.setGenericPassword(signUpData.UserName, signUpData.Pass);
							setUserToken('host')
							await AsyncStorage.setItem("Type",'host');
							setIsLoading(false);
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
				setUserToken(null);
				await AsyncStorage.removeItem("Type")
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
				if(credentials.username){
					auth.signIn(data)
				}
				
				
			} catch (error) {
				console.log("Keychain couldn't be accessed!", error);	
			}
			setIsLoading(false);
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
											{ userToken == "customer" ?  (
												<Stack.Screen name = "CustomerStack" component= {CustomerStack}
												options={{
													headerShown: false
												}}
										
											/>):(
												<Stack.Screen name= "HostStack" component = {HostStack}
												options={{
													headerShown: false
												}}/>
											)}
									
								
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