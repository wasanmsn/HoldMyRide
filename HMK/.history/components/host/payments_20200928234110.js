import React, { useState,useMemo,useEffect } from 'react';
import { Text, View,StyleSheet, TouchableOpacity,ScrollView } from 'react-native';
import { Divider } from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import Header from '../bar';
import AsyncStorage from '@react-native-community/async-storage';
import * as Keychain from 'react-native-keychain';
import firestorage from '@react-native-firebase/storage';
import { useIsFocused } from '@react-navigation/native'
import {Card,Dialog,Portal,Button, TextInput} from 'react-native-paper'

const defaultImg = '../../img/account.png'
function currencyFormat(num) {

    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
 }
async function addMoney(money,wallet){
    try {
        const id = await AsyncStorage.getItem("ID")
        await wallet.get().then(async res => {
            const id = res.id.replace(/\s+/g, "")
            console.log(res.id)
            console.log(id)
            await firestore().collection('wallet').doc(id).update({balance: firestore().FieldValue.increment(money)})
         })
  
    } catch (error) {
        console.log(error)
    }
}
function Payments ({navigation}){
    const [payments,setPayments] = useState([])
    const [wallet,setWallet] = useState('')
    const [balance,setBalance] = useState('$0.00')
    const isFocused = useIsFocused()
    const [visible,setvisible] = useState(false)
    const [money,setMoney] = useState(0.00)
    const showDiag = () => setvisible(true)
    const hidDiag = () => setvisible(false)
    const  getPayments = async () => {
            try {
                const id = await AsyncStorage.getItem("ID")
                await firestore().collection('payment_History').where('saler','==',firestore().doc('host/'+id)).get().then(snapshot => {
                    if(!snapshot.empty){
                        snapshot.forEach( async data => {            
                            setPayments(prev => [...prev,data.data()]) 
                        })
                       
                    }
                    console.log('No payment history')
                }).then(async () => {
                    await firestore().collection('payment_History').where('payer','==',firestore().doc('host/'+id)).get().then(snapshot => {
                        if(!snapshot.empty){
                            snapshot.forEach( async data => {            
                                setPayments(prev => [...prev,data.data()]) 
                            })
                            
                        }
                        console.log('No payment history')
                    })
                })
                await firestore().collection('host').doc(id).get().then(async res => {

                    setWallet(res.data().wallet)
                    setBalance(currencyFormat(await res.data().wallet.get().then(ress => ress.data().balance)))
                })
            } catch (error) {
                console.log(error)
               
            }
        }
    useEffect(() => {
        if(isFocused){
            getPayments()
        }   
        else{
            setPayments([])
        }
    },[isFocused])
    
    return (
        <View style={page.container}>
            <Header />
            <Card style={{margin:15}}>
               <Card.Title
                title={`ยอดเงินคงเหลือ ${balance} บาท`}
                titleStyle={{alignSelf:'flex-end',margin:10}}
               />
            </Card>
            <ScrollView style={page.box1}>

                <View>
                {
                payments.map((item,index) => 
                    
                    (<Card key={index} style={{marginVertical:15,flexDirection:'row',justifyContent:'space-between'}}   >
                        <Card.Title
                            title={`${item.payment_type}`}
                            right={(props) => <Text {...props}> {new Date(item.payment_cofirm.seconds*1000).toUTCString()} </Text>}
                        />
                        
                        <Card.Content>
                                
                                <Text style={{color:'green',fontSize:15,alignSelf:'flex-end'}}>
                                    {item.payment_type == 'ฝากรถ' ? `+` : `-` } {currencyFormat(item.price)} บาท
                                </Text>
                        </Card.Content>

                    </Card>))}
                        
                </View>
               
            </ScrollView>
            <Divider />
            <View style={[page.box2,{justifyContent:'space-evenly',margin:20,padding:15}]}>
                
                <Button contentStyle={{width:100}} mode='contained' onPress={() => navigation.goBack()}>กลับ</Button>
                <Button contentStyle={{width:100}} mode='contained' onPress={showDiag}>เติมเงิน</Button>
                </View>
            <Portal>
                <Dialog visible={visible} onDismiss={hidDiag}>
                <Dialog.Title>เติมเงิน</Dialog.Title>
                    <Dialog.Content>
                        <TextInput
                            label='จำนวนเงิน'
                            value={money}
                            placeholder='0.00'
                            keyboardType='numeric'
                            onChangeText={(value) => setMoney(value) }
                        />
                    </Dialog.Content>
                    <Dialog.Actions style={{justifyContent: 'space-around'}} >
                        <Button contentStyle={{width:75}} mode='contained' onPress={hidDiag}>ยกเลิก</Button>
                        <Button contentStyle={{width:75}} mode='contained' onPress={() => {
                            addMoney(money,wallet).then(() => {
                                hidDiag
                            })
                        }}>เติมเงิน</Button>
                    </Dialog.Actions>
                </Dialog>                
            </Portal>
        </View>
    )
}
const page = StyleSheet.create({
    container:{
        flex:1,
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
export default Payments;
