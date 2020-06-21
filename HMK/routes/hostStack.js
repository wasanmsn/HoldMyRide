
import React from 'react';

import { StyleSheet,Text } from 'react-native';
import Home from '../components/mainhost';
import { AuthContext } from './stacks';
import { createDrawerNavigator,DrawerContentScrollView,DrawerItemList,DrawerItem } from '@react-navigation/drawer';
import Profile from '../components/host/hostprofile';
import Cars from '../components/host/cars/cars';

function DrawerConents(props){
	const { signOut } = React.useContext(AuthContext);
	return(
	<DrawerContentScrollView {...props}>
		<Text>Texts</Text>
		<DrawerItemList {...props} />
		<DrawerItem label="Logout" onPress={() => signOut()} />
	  </DrawerContentScrollView>
	)
}

const Drawer = createDrawerNavigator(); 
function customerStack(){
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
const styles = StyleSheet.create({
	box:{
		backgroundColor:'#61dafb',
	}
});
export default customerStack;