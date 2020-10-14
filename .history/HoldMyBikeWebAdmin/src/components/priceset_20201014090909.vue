<template>
	<v-container grid-list-xs>
		<v-layout row wrap>
			<v-flex xs12>
				<h1 class="text-center">ตั่งค่าราคา</h1>
			</v-flex>
			<v-flex xs12 class="px-2  deep-purple lighten-4"
              
            >
                <h2> บริการรับส่ง </h2>
                                <v-subheader>กิโลเริ่มต้น</v-subheader>
                                <v-text-field
                                    
                                    label="Amount"
                                    v-model="prices.drk"
                                    suffix="kilometer(s)"
                                    type="number"
                                    :readonly="!edit"
                                ></v-text-field>
                                <v-subheader>เริ่มที่ {{prices.drk}} กิโลเมตร</v-subheader>
                                <v-text-field
                                    
                                    label="Amount"
                                    v-model="prices.dpk"
                                    suffix="bath/k"
                                    type="number"
                                    :readonly="!edit"
                                ></v-text-field>
                                 <v-subheader>ราคาคิดหลังจาก {{prices.drk}} กิโลเมตร</v-subheader>
                                <v-text-field
                                    
                                    label="Amount"
                                    v-model="prices.bdr"
                                    suffix="bath/k"
                                    type="number"
                                    :readonly="!edit"
                                ></v-text-field>           
			</v-flex>
            <v-flex xs12 class = "my-4 px-2 py-5 deep-purple lighten-4" >
                <h2> ราคาฝาก </h2>
                                <v-subheader>รถยนต์ </v-subheader>
                                <v-text-field
                                    
                                    label="Amount"
                                    v-model="prices.pc"
                                    suffix="bath/day"
                                    type="number"
                                    :readonly="!edit"
                                ></v-text-field>
                                 <v-subheader>มอเตอร์ไซต์</v-subheader>
                                <v-text-field
                                    
                                    label="Amount"
                                    v-model="prices.pb"
                                    suffix="bath/day"
                                    type="number"
                                    :readonly="!edit"
                                ></v-text-field>
                
            </v-flex>
             <v-flex xs12 class="px-2 py-5">
                 <v-row >
                     <v-column class="px-1">
                         <v-btn v-if="edit" color="red" @click="edits">CANCEL</v-btn>
                         <v-btn v-else color="green" @click="edits">EDIT</v-btn>
                     </v-column>
                     <v-column>
                         <v-btn color="green" @click="save">SAVE</v-btn>
                     </v-column>
                 </v-row>
             </v-flex>
		</v-layout>
	</v-container>
</template>

<script>
import db from "./firebaseInnit.js"

	export default{
		name: 'pricest',
		data(){
			return {
                edit:false,
				prices:{
                    pb:null,
                    pc:null,            
                    bdr:null,
                    drk:null,
                    dpk:null,
                },
                
			}
		},
		created () {
            this.getPrice()
		},
		methods: {
			edits(){
                
                if(this.edit == true){
                    this.getPrice()
                 
                }
                else{
                    window.scrollTo(0,0)
                }
                this.edit = !this.edit
            },
            save(){
                this.edit = false
                const pb = parseInt(this.prices.pb)
                const pc =  parseInt(this.prices.pc)
                const bdr =  parseInt(this.prices.bdr)
                const drk =  parseInt(this.prices.drk)
                const dpk =  parseInt(this.prices.dpk)
                const dbref = db.collection('priceset').doc('X5JKG57nYDlyO7XxFEvd')
                dbref.set({
                    pb: pb,
                    pc: pc,
                    below_distance_rate: bdr,
                    distance_rate_k: drk,
                    distance_price_k: dpk,
                })
            },
            getPrice(){
                db.collection('priceset').doc('X5JKG57nYDlyO7XxFEvd').get().then(
                doc => {
                    if(!doc.exists) {
                        console.log('No such document')
                        
                    }
                    else{
                        console.log('Document data: ',doc.data())
                        this.prices.pb = doc.data().pb
                        this.prices.pc = doc.data().pc
                       
                        this.prices.bdr = doc.data().below_distance_rate
                        this.prices.drk = doc.data().distance_rate_k
                        this.prices.dpk = doc.data().distance_price_k

                    }
                }
             )
             .catch(err => {
                 console.log('Error getting document ', err)
             })
            }
		},
	}
</script>