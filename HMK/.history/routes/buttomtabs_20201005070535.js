import React from 'react';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Text, View,TouchableOpacity } from 'react-native';
import {} from 'react-native-paper'

function bottomtabs({navigation}){
    const onPress = () => {
        navigation.navigate("Profile")
    }
    return (
        <View style={{ flexDirection: 'row',backgroundColor:"#F4AF5F",height:50,borderRadius:50,justifyContent:"center",alignItems:"center",alignSelf:'flex-end' }}>
             <TouchableOpacity
            accessibilityRole="button"
            onPress={onPress}
            style={{ flex: 1 }}
            >
            <Text style={{ color:'#673ab7' }}>
              {'Profile'}
            </Text>
          </TouchableOpacity>
        </View>
      )
}
export default bottomtabs;