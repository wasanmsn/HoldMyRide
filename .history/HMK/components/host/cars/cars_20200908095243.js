import React, { useState,useEffect } from 'react';
import { Text, View,StyleSheet, TouchableOpacity } from 'react-native';
import { SearchBar,Icon,Divider } from 'react-native-elements';
import firestore, { firebase } from '@react-native-firebase/firestore';
import firestorage from '@react-native-firebase/storage';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native'
import Header from '../../bar';

function Cars (){
    const [Search,setSearch] = useState([])
    const [vehicles,setVehicles] = useState([])
    const [vehiclesSet,setVehicle] = useState([])
    const [Start,setStart] = useState(0)
    const [End,setEnd] = useState(5)
    const [length,setLength] = useState(0)
    const [img,setimge] = React.useState('')
    const isFocused = useIsFocused()
    const getVehicles = async () => {
        try {
            const ID  = await AsyncStorage.getItem('ID')
            const data =  firestore().collection('vehicles').where('host','==',firestore().doc('host/'+ID))
            const obsData = data.onSnapshot(querySnapshots => {
                    setLength(querySnapshots.size)
                    querySnapshots.docs.forEach(doc => {
                        setVehicles(prev => [...prev,doc])
                    })
                    const docs = querySnapshots.docs.map( doc => {
                         firestorage().refFromURL(doc.data().pic).getDownloadURL().then((res) =>{
                            setimge(prev => [...prev,res])
                        })
                  
                    })
              
            },err => {
                console.log(err)
            })
        } catch (error) {
            console.log(error)
        }
    }
    const showVehicles = async () => {
        var array = vehicles
        var start =  Start
        var end 
        if(length > End ){
            end = End
        }
        else{
            console.log(length)
            end = length
        }
        console.log(end)

        for (start; start < end; start++) {
            console.log(array[1]._data.expiredate.seconds*1000)
            console.log(start)
            const name = await array[start]._data.owner.get().then(res => res.data().Name)
            const date =  Math.floor((new Date(array[start]._data.expiredate.seconds*1000).getTime() - new Date().getTime())/(1000*3600*24))
            setVehicle(prev => [...prev,
                <TouchableOpacity key={`${start}_${array[start]._data.Plate}`} style={{borderColor:'black',borderWidth:1,height:85,marginVertical:15,flexDirection:'row',justifyContent:'space-evenly'}} >
                     <View style={{marginVertical:15,right:20}}>
                            <Text>
                            Car Plate number {array[start]._data.Plate} {'\n'}
                            Car manufacturer {array[start]._data.Name} {'\n'}
                            Customer's name  {name}
                            </Text>
                        </View>
                        <View style={{marginVertical:15,right:20}}>
                            <Text>
                                {date} Days left
                            </Text>
                        </View>
                        {/* <View style={{marginVertical:15,right:20}}>
                            <Image
                            
                            source={ img[index] ? {uri: img[index]} : require(defaultImg) }
                            style={{ width: 50, height: 50 }}
                            />  
                        </View> */}
                    </TouchableOpacity>
            ]
                
            )
        }
        setStart(start)
        console.log('hi',start)
        return vehicles
    }
    
    useEffect(() => {
            if(isFocused){
                getVehicles().then(() => {
                    showVehicles()
                })
                
            }   
        },[isFocused])
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
                    {vehiclesSet}
                        
                </View>
               
            </View>
            <Divider />
            <View style={{flexDirection:'row',justifyContent:'space-evenly'}}>
                <View style={{flexDirection:'row'}}>
                <Icon
                    containerStyle={{marginHorizontal:20}}
                    name='chevron-left'
                    type='font-awesome'
                    onPress={() => {
                        setEnd(End > length ? End-5 : length)
                        console.log(End)
                        showVehicles()
                    }}
                    />
                  <Icon
                    containerStyle={{marginHorizontal:20}}
                     name='chevron-right'
                     type='font-awesome'
                     onPress={() => {
                        setEnd(End < length ? End+5 : length )
                        console.log(End)
                        showVehicles()
                    }}
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
