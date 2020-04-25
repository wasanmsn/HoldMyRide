import * as Keychain from 'react-native-keychain';
import React, { useState, createContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import firestore from '@react-native-firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import Loading from '../components/loading';
import CustomerStack from './customerStack';
import HostStack from './hostStack';
import SignupStacks from './signupStacks';


const AuthContext = createContext();
const Stack = createStackNavigator();
function createStack(){
	const [isLoading,setIsLoading] = useState(true)
	const [userToken,setUserToken] = useState(false)

	const auth = React.useMemo(() => {
		return{
			signIn: async Data =>{
				setIsLoading(false);		
				await firestore().
				collection(Data.type)
				.where("UserName", "==", Data.username).where("Pass","==",Data.pass)
				.get().then(async snapshot  => {
					console.log('User exists: ', !snapshot.empty);
					if(!snapshot.empty){
						  try{
							await Keychain.setGenericPassword(Data.username, Data.pass);
							const credentials = await Keychain.getGenericPassword();
							
							setUserToken(JSON.stringify(credentials))
							console.log('LOGIN '+userToken)
						  }
						  catch(err){
							console.log("Some thing is not right :",err);
						  }
					}
					else{
						alert("User does not exist!.")
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
						Name:null,
						Gender:null,
						Age:null,
						DoB:null,
						Pid:null,
						PhoneN:null,
						Religion:null,
						Address:null,
						Province:null,
						PostalCode:null,
						Pass:signUpData.Pass,
						Country:null,     
						registerDate:firestore.Timestamp.now(),
						imgIcon:null, 
						Location:null
					}).then( async () => {
						try{
							await Keychain.setGenericPassword(Data.username, Data.pass,{ service: "customer" });
							setUserToken(JSON.parse(await Keychain.getGenericPassword()))
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
						name:null,
						gender:null,
						age:null,
						DoB:null,
						Pid:null,
						PhoneN:null,
						religion:null,
						Address:null,
						Province:null,
						postalcode:null,
						Pass:signUpData.Pass,
						Country:null,     
						createWhen:firestore.Timestamp.now(),
						imgIcon:null, 
						houseLocation:null,
						houseregis:null,
						Suspend:false,
						parkingspace:null,
						verified:false,
						selimg:null
					}).then( async () => {
						try{
							await Keychain.setGenericPassword(Data.username, Data.pass,{ service: "host" });
							setUserToken(JSON.parse(await Keychain.getGenericPassword()))
							setIsLoading(false);
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
				setUserToken(false);
			},
			toggleMenu: ({navigation}) =>{
				navigation.toggleDrawer();
			}
		}

	}, [])

	React.useEffect(()=>{
		setTimeout(async () => {
			try {
				const credentials = await Keychain.getGenericPassword();			
				setUserToken(JSON.stringify(credentials))
				console.log('AuLOGIN '+userToken)
				
			} catch (error) {
				console.log("Keychain couldn't be accessed!", error);	
			}
			setIsLoading(false);
		}, 500);
	})
	if(isLoading){
		
		return <Loading/>
	}
	const objToken = userToken
	console.log("obj "+userToken)
	return (
		<AuthContext.Provider value={auth} >
			<NavigationContainer>
				{userToken == null || userToken == false ? (<Stack.Navigator>
											<Stack.Screen name = "SignupStacks" component= {SignupStacks} 
												options={{
													headerShown: false
												}}
											/>
									</Stack.Navigator>) 
									: (<Stack.Navigator 
			
										>
											{ objToken.service == "customer" ?  (
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