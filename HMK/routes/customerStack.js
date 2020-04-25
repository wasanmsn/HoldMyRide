
import React from 'react';

import { createDrawerNavigator,DrawerContentScrollView,DrawerItemList,DrawerItem } from '@react-navigation/drawer';
import { StyleSheet ,View,Text} from 'react-native';
import Home from '../components/maincustomer';
import { AuthContext } from './stacks';
import Profile from '../components/customer/customerprofile';

const Drawer = createDrawerNavigator(); 

function customerStack({ navigation }){
	
	return (
		<Drawer.Navigator 
			drawerContent={props => <DrawerConents {...props}/>}
			>
			<Drawer.Screen name = "Feed" component= {Home}
			/>
			<Drawer.Screen name = "Feed2" component= {Profile}
			/>
		</Drawer.Navigator>
	);
	
}
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
const styles = StyleSheet.create({
	box:{
		backgroundColor:'#61dafb',
	}
});
export default customerStack;