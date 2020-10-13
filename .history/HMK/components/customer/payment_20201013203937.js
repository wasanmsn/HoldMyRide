import React, { useState,useEffect } from 'react';
import { Text, View,StyleSheet, ScrollView } from 'react-native';
import { Divider } from 'react-native-elements';
import firestore, { firebase } from '@react-native-firebase/firestore';
import Header from '../bar';
import AsyncStorage from '@react-native-community/async-storage';
import { useIsFocused } from '@react-navigation/native'
import {Card,Dialog,Portal, TextInput,Button} from 'react-native-paper'
import  LinearGradient  from 'react-native-linear-gradient'

function currencyFormat(num) {

    return '$' + num.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
 }
async function addMoney(money,wallet){
    console.log(money)
    try {
        const id = await AsyncStorage.getItem("ID")
        await wallet.get().then(async res => {
            const id = res.id.replace(/\s+/g, "")
            await firestore().collection('wallet').doc(id).update({balance: firebase.firestore.FieldValue.increment(parseFloat(money))})
         })
        await firestore().collection('payment_History').add({
            payment_cofirm:firestore.Timestamp.fromDate(new Date()),
            price:parseFloat(money),
            payer:firestore().doc('customer/'+id),
            payment_type:'เติมเงิน'
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
                var arrays = []
                const id = await AsyncStorage.getItem("ID")
                await firestore().collection('payment_History').where('buyer','==',firestore().doc('customer/'+id)).orderBy('payment_cofirm','desc').get().then(snapshot => {
                    if(!snapshot.empty){
                        snapshot.forEach( async data => {         
                            arrays.push(data.data())   
                        })
                       
                    }
                    console.log('No payment history')
                }).then(async () => {
                    await firestore().collection('payment_History').where('payer','==',firestore().doc('customer/'+id)).orderBy('payment_cofirm').get().then(snapshot => {
                        if(!snapshot.empty){
                            snapshot.forEach( async data => {     
                                arrays.push(data.data())       
                            })
                            
                        }
                        console.log('No payment history')
                    }).then(() => {
                        const sortedActivities = arrays.sort((a, b) =>new Date(b.payment_cofirm.seconds*1000) - new Date(a.payment_cofirm.seconds*1000))
                        setPayments(sortedActivities)

                    })
                })
                await firestore().collection('customer').doc(id).get().then(async res => {
                    console.log(res.data().wallet)
                    setWallet(res.data().wallet)
                    console.log((await res.data().wallet.get().then(ress => ress.data())))
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
            const unsub = firestore().collection('cities').onSnapshot(() => {
            });
            unsub()            
            setPayments([])
        }
    },[isFocused])
    
    return (
        <LinearGradient colors={['#1ca7ec','#4adede']} start={{x: 0, y: 0}} end={{x: 1, y: 1}} style={page.container}>
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
                            title={`${item.payment_type ? item.payment_type : 'ฝากรถ'}`}
                            right={(props) => <Text {...props} style={{color:'grey'}}> {new Date(item.payment_cofirm.seconds*1000).toUTCString()} </Text>}
                        />
                        
                        <Card.Content>
                                
                                <Text style={{color: item.payment_type == 'ฝากรถ' ? 'red' : 'green',fontSize:15,alignSelf:'flex-end'}}>
                                    {item.payment_type == 'ฝากรถ' ? '-' : '+'} {currencyFormat(item.price)} บาท
                                </Text>
                        </Card.Content>

                    </Card>))}
                        
                </View>
               
            </ScrollView>
            <Divider />
            <View style={[page.box2,{justifyContent:'space-evenly',margin:20,padding:15}]}>
                
                <Button  contentStyle={{width:100,backgroundColor:'#1f2798'}} mode='contained' onPress={() => navigation.goBack()}  >กลับ </Button>
                <Button  contentStyle={{width:100,backgroundColor:'#1f2798'}} mode='contained' onPress={showDiag}  > เติมเงิน</Button>
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
                        <Button contentStyle={{width:100,backgroundColor:'#1f2798'}} mode='contained'  onPress={hidDiag}>ยกเลิก</Button>
                        <Button contentStyle={{width:100,backgroundColor:'#1f2798'}} mode='contained'   onPress={() => {
                            addMoney(money,wallet).then(async () => {
                                const id = await AsyncStorage.getItem("ID")
                                hidDiag()
                                await firestore().collection('customer').doc(id).get().then(async res => {
                                    setBalance(currencyFormat(await res.data().wallet.get().then(ress => ress.data().balance)))
                                })
                            })
                        }}>เติมเงิน</Button>
                    </Dialog.Actions>
                </Dialog>                
            </Portal>
        </LinearGradient>
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
