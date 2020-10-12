import React, { useState } from 'react';
import {Dimensions,TouchableOpacity, StyleSheet,Text} from 'react-native';
import {Avatar} from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import firestore from '@react-native-firebase/firestore';
import firestorage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
import Icons from 'react-native-vector-icons/Feather'
import {createIconSetFromFontello} from 'react-native-vector-icons'
import LinearGradient from 'react-native-linear-gradient'
const windowWidth = Dimensions.get('window').width;
import { useIsFocused } from '@react-navigation/native'
import { useIsDrawerOpen } from '@react-navigation/drawer';
import fontellConfig from './config.json'
const Logo = createIconSetFromFontello(fontellConfig)

async function getImg() {
    let imgUri = null 
    try {
        const credit = await Keychain.getGenericPassword()
        const type = await AsyncStorage.getItem("Type")
        await firestore().collection(type).where('UserName',"==",credit.username).get().then( snapshot => {
           if(snapshot.empty){
               console.log("No matching docs")
               return 
           }
           snapshot.forEach(doc => {    
            
            imgUri=doc.data().imgIcon 
           })
        })
    } catch (error) {
        return console.log("Something wrong ",error)
    }


    return imgUri
}
const styles = StyleSheet.create({
    bar:{
        flexDirection:'row',
        justifyContent:'center',
        alignSelf:'center',
        height:95,
        width:windowWidth,
        backgroundColor:'#4ADEDE',

        
    },
    fonts:{
        fontSize:32,
        color:'brown',
        fontWeight:'bold',
        alignSelf:'center',
        marginHorizontal:40,
        color:'#1CA7EC'
    },
    img:{
        width:35,
        height:35,
        margin:5,
    }
})
export default function Bar(){
    const navigation = useNavigation();
    const [Img,setImg] = useState('');
    const [Icon,setIcon] = useState(null);
    const isFocused = useIsFocused()
    const isDrawerOpen = useIsDrawerOpen();

    React.useEffect(() => {
        if(isFocused){
            getImg().then(
                uri => {
                   firestorage().refFromURL(uri).getDownloadURL().then( img => setIcon(img))
                    }
                )
        } 
        else{
            console.log('User is not focused.')
        }
    },[isFocused])
    React.useEffect(() => {
        if(!isDrawerOpen){
            getImg().then(
                uri => {
                   firestorage().refFromURL(uri).getDownloadURL().then( img => setIcon(img))
                    }
                )
        } 
    },[isDrawerOpen])
    return (
        
        <LinearGradient colors={['#7Bd5f5','#4adede']} start={{x: 0, y: 0}} end={{x: 1, y: 1}}  style={styles.bar}>
            <TouchableOpacity style={{alignSelf:'center'}} onPress={() => navigation.toggleDrawer()} >
                <Icons name='menu' size={50} color='#1F2F98' />
            </TouchableOpacity>
            <Logo name="garage" size={50} color="#1CA7EC" />
            <Text style={styles.fonts}>HoldMyRide</Text>
            <Avatar rounded size='medium' containerStyle={{alignSelf:'center'}} source={{uri:Icon}} />
            
            
        </LinearGradient>
    )
}