import React from 'react';
import { StyleSheet,View,Text,Image } from 'react-native';
import Grad from 'react-native-linear-gradient'
var loadingImg =  '../assets/holdmyride-logo.png'
function loading(){
    return(
        <Grad colors={['#78d5f5','#787ff6']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={page.container}>
            <Image source={require(loadingImg)} style={{height:90,width:250}} />
        </Grad>
    )
}
const page = StyleSheet.create({
    container:{
        flex: 1,
        flexDirection: 'column', 
        justifyContent:'center',
        alignItems:'center',
        alignContent:'center' 
    }
})

export default loading;