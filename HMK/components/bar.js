import React from 'react';
import {Dimensions,View, Image,TouchableOpacity, StyleSheet,Text} from 'react-native';
import {Avatar} from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';


const windowWidth = Dimensions.get('window').width;
const menuImg = '../img/open-menu.png'
const UserImg = '../img/account.png'

const styles = StyleSheet.create({
    bar:{
        flexDirection:'row',
        justifyContent:'center',
        alignSelf:'center',
        height:95,
        width:windowWidth,
        backgroundColor:'#61dafb',

        
    },
    fonts:{
        fontSize:32,
        color:'brown',
        fontWeight:'bold',
        alignSelf:'center',
        marginHorizontal:40
    },
    img:{
        width:35,
        height:35,
        margin:5,
    }
})
export default function Bar(){
    const navigation = useNavigation();
    return (
        
        <View style={styles.bar}>
            <TouchableOpacity style={{alignSelf:'center'}} onPress={() => navigation.toggleDrawer()} >
                <Image style={styles.img}  source={require(menuImg)}/>
            </TouchableOpacity>
            <Text style={styles.fonts}>HoldMyBike</Text>
            <Avatar rounded containerStyle={{alignSelf:'center'}} source={require(UserImg)}/>
            
            
        </View>
    )
}