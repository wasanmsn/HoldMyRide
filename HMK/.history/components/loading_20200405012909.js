import React from 'react';
import { StyleSheet,View,Text } from 'react-native';

function loading(){
    return(
        <View style={page.container}>
            <Text>
                Loading...
            </Text>
        </View>
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