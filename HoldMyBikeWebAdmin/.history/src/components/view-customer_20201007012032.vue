<template>
	<v-container>
		<v-layout row wrap>
            <v-flex xs12 class="my-3">
                <v-list flat class="deep-purple lighten-1">
                    <v-subheader class="ma-2">               
                            <img width="80" height="80" :src='imageUrl'>
                            <p class="mx-4 mt-12" style="font-size:20px;">{{cust.UserName}}</p>
                    </v-subheader>
					<v-list-item-group >
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Name: {{cust.Name}}
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Address: {{cust.Address}}
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								E-Mail: {{cust.Email}}
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Phone Number: {{cust.PhoneN}}
							</v-list-item-content>
							
						</v-list-item>
                        <v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Date of birth: {{birth}}
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Age: {{cust.Age}}
							</v-list-item-content>
							
						</v-list-item>
                        <v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Gender: {{cust.Gender}}
							</v-list-item-content>
							
						</v-list-item>
                        <v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Create Date: {{createDate}}
							</v-list-item-content>
							
						</v-list-item>
						
					</v-list-item-group>
					
				</v-list>
            </v-flex>
			<v-flex xs12 class="my-3">
				<v-list flat class="deep-purple lighten-1">
                    <v-subheader class="ma-2">               
                            <p class="mx-4 mt-12" style="font-size:20px;">Vehicles Detail</p>
                    </v-subheader>
					<v-list-item-group >
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
							v-for="c in car " :key="c.plate"
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							
							>
								Car: {{c.name}} {{c.plate}} 
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							v-for="b in bike " :key="b.plate"
							>
								Bike: {{b.name}} {{b.plate}} 
							</v-list-item-content>
							
						</v-list-item>
					</v-list-item-group>

				</v-list>
				
			</v-flex>
            
           
        <v-btn to="/customerlist" color="success">Back</v-btn>  
        </v-layout>
                   
	</v-container>
</template>


<script>
    import db from './firebaseInnit'
    
	export default{
		name: 'view-host',
		data(){
			return {
                cust:{},
                createDate:null,
				imageUrl:null,
				idImage:null,
				houstImage:null,
				birth:null,
				car:[],
				bike:[],
			}
        },
        created(){ 
			this.getCustomer()
			this.getCar()
			this.getBike()
            this.getImg()
        },
         watch:{
            '$route':'fetchData'
        },
        methods: {
            getImg(){
               this.$root.$storage.refFromURL('gs://holdmybike-998ed.appspot.com/account.png').getDownloadURL().then((url)=> {
                   this.imageUrl = url
                   
               })
			},
			getCustomer(){
				const refhost = db.collection('customer').doc(this.$route.params.cust_id)
				
				refhost.get().then(
					( doc =>{
						console.log(doc.data())
						this.cust = doc.data()
						this.createDate = new Date(doc.data().registerDate.seconds * 1000)
						this.birth = new Date(doc.data().DoB.seconds * 1000)
					})
				)
				
				
			},
			getCar(){
				db.collection('vehicles').where("userID","==",this.$route.params.cust_id).where("Type","==","car").get().then(
					querySnapshot => {
					querySnapshot.forEach(doc => {
						const data = {
							'name':doc.data().Name,
							'plate':doc.data().Plate,
							'type':doc.data().Type,
						}
						this.car.push(data)
					})
				}
				)
			},
			getBike(){
				db.collection('vehicles').where("userID","==",this.$route.params.cust_id).where("Type","==","bike").get().then(
					querySnapshot => {
					querySnapshot.forEach(doc => {
						const data = {
							'name':doc.data().Name,
							'plate':doc.data().Plate,
							'type':doc.data().Type,
						}
						this.bike.push(data)
					})
				}
				)
			},
            
        },
	}
</script>