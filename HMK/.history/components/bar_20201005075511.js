import React, { useState } from 'react';
import {Dimensions,View, Image,TouchableOpacity, StyleSheet,Text} from 'react-native';
import {Avatar} from 'react-native-elements';
import { Appbar } from 'react-native-paper'
import { useNavigation } from '@react-navigation/native';
import * as Keychain from 'react-native-keychain';
import firestore from '@react-native-firebase/firestore';
import firestorage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
import Icons from 'react-native-vector-icons/FontAwesome5';
const windowWidth = Dimensions.get('window').width;
const menuImg = '../img/open-menu.png'
import { useIsFocused } from '@react-navigation/native'
import { useIsDrawerOpen } from '@react-navigation/drawer';

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
        flexDirection:'column',
        width:windowWidth,
        backgroundColor:'#61dafb', 
    },
    minibar:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignSelf:'flex-start',
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
    },
    bottom: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
      },
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
        <Appbar.Header style={{flexDirection:'row'}}>
            <Appbar.Action icon="bars"  />
            <Appbar.Action icon="parking"  />
            <Appbar.Action icon="id-card"  />
            <Appbar.Action icon="car"  />
            <Appbar.Action icon="wallet"  />
            <Avatar rounded size='medium' containerStyle={{alignSelf:'flex-end'}} source={{uri:Icon}}/>
      </Appbar.Header>
        // <Appbar.Header style={styles.bar}>
        //         <View style={{flexDirection:'row'}}>
        //             <TouchableOpacity style={{alignSelf:'center'}} onPress={() => navigation.toggleDrawer()} >
        //                 <Image style={styles.img}  source={require(menuImg)}/>
        //             </TouchableOpacity>
        //             <Text style={styles.fonts}>HoldMyBike</Text>
        //             <Avatar rounded size='medium' containerStyle={{alignSelf:'center'}} source={{uri:Icon}}/>
                    
        //         </View>
        //         <View style={{flexDirection:'row'}} >
        //             <Appbar.Action
        //             icon="parking"
        //             onPress={() => console.log('Pressed archive')}
        //             />
        //             <Appbar.Action icon="id-card" onPress={() => console.log('Pressed mail')} />
        //             <Appbar.Action icon="car" onPress={() => console.log('Pressed label')} />
        //             <Appbar.Action
        //             icon="wallet"
        //             onPress={() => console.log('Pressed delete')}
        //             />
            
        //         </View>
                
        // </Appbar.Header>
    )
}