import * as React from 'react';
import { Button, View } from 'react-native';
import { DrawerContentScrollView,DrawerItemList,DrawerItem } from '@react-navigation/drawer';
import { AuthContext } from './stacks';


  



function MenuDrawer (props){
  const { signOut } = React.useContext(AuthContext);
    return(
      <DrawerContentScrollView {...props}>
      <Text>Tesst</Text>
      <DrawerItemList {...props} />
      <DrawerItem label="Logout" onPress={() => signOut()} />
      </DrawerContentScrollView>
    )


}
export default MenuDrawer();