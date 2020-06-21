import React, { useState } from 'react';
import { Text, View,StyleSheet, TouchableOpacity } from 'react-native';
import { SearchBar,Icon,Divider } from 'react-native-elements';
import Header from '../../bar';

function Cars (){
    const [Search,setSearch] = useState('')
    return (
        <View style={page.container}>
            <Header />
            <View style={{flexDirection:'row',justifyContent:'center'}}>
                <View style={{alignSelf:'center',width:208,margin: 12,}}>
                <SearchBar
                 placeholder="Search..."
                 onChangeText={(text) => setSearch(text)}
                 value={Search}
                 round
                 searchIcon={false}
                 clearIcon={true}
                 lightTheme={true}
                 containerStyle={{backgroundColor:'transparent',borderBottomColor:'transparent',borderTopColor:'transparent'}}
                >
                </SearchBar>  
              
                </View>
                <View style={{alignSelf:'center'}}>
                <Icon
                    name='search'
                    type='evilicon'
                     color='#517fa4'
                     size={50}
                    />
                </View>
               
            </View>
            <Divider />
            <View style={page.box1}>
                <View   >
                    <TouchableOpacity style={{borderColor:'black',borderWidth:1,height:85,marginVertical:15,flexDirection:'row',justifyContent:'space-evenly'}} >
                     <View style={{marginVertical:15,right:20}}>
                            <Text>
                            Car Plate number {'\n'}
                            Car manufacturer {'\n'}
                            Customer's name
                            </Text>
                        </View>
                        <View style={{marginVertical:15,right:20}}>
                            <Text>
                                # Days left
                            </Text>
                        </View>
                        <View style={{marginVertical:15,right:20}}>
                            <Text>
                                Car Pic
                            </Text>
                        </View>
                    </TouchableOpacity>
                        
                </View>
               
            </View>
            <Divider />
            <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                <View style={{flexDirection:'row'}}>
                <Icon
                    containerStyle={{marginHorizontal:20}}
                    name='chevron-left'
                    type='font-awesome'
                    />
                  <Icon
                    containerStyle={{marginHorizontal:20}}
                     name='chevron-right'
                     type='font-awesome'
                    />
                    
                </View>
            </View>
        </View>
    )
}
const page = StyleSheet.create({
    container:{
        flex:1
    },
    box1:{
        flex:2,
        flexDirection:'column',
    },
    box2:{
        flexDirection:'row'
    },
    text1:{
        marginTop:28,
        padding:9,
        color:'#8C7171',
        fontSize:18
    },
    text2:{
        padding:30,
        color:'#8C7171',
        fontSize:12
    }
})
export default Cars;
