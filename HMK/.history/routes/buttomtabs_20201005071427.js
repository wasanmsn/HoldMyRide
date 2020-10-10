import React from 'react';
import TabNavigator from 'react-native-tab-navigator';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { Text, View,TouchableWithoutFeedback } from 'react-native';
import {} from 'react-native-paper'
import Animated from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
function bottomtabs(){
    const navigation = useNavigation();
    const onPress = () => {
        navigation.navigate("Profile")
    }
    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <Animated.View
                style={{
                    flexGrow:1,
                    flexDirection:'row',
                    alignItems:'center',
                    height:100,
                    backgroundColor:'blue',
                    borderRadius:100/2,
                    padding:4
                }}
            >
                <View style={{
                    height:50,
                    alignContent:'center',
                    justifyContent:'center'
                }}>
                    <Icon name="parking" size={20} color='black' />
                </View>
                <Text>
                    Profile
                </Text>
            </Animated.View>
        </TouchableWithoutFeedback>
      )
}
export default bottomtabs;