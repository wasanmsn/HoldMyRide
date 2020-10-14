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
								ชื่อ: {{cust.Name}}
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
								วันเกิด: {{birth.toLocaleDateString('th-TH',{
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										weekday: 'long',
								})}}
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								อายุ: {{cust.Age}}
							</v-list-item-content>
							
						</v-list-item>
                        <v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								วันสมัคร: {{createDate.toLocaleDateString('th-TH',{
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										weekday: 'long',
								})}}
							</v-list-item-content>
							
						</v-list-item>
						
					</v-list-item-group>
					
				</v-list>
            </v-flex>
			<v-flex xs12 class="my-3">
				<v-list flat class="deep-purple lighten-1">
                    <v-subheader class="ma-2">               
                            <p class="mx-4 mt-12" style="font-size:20px;">รายชื่อยานพาหนะ</p>
                    </v-subheader>
					<v-list-item-group >
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
							v-for="c in car " :key="c.Plate"
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							
							>
								{{c.Type}}: {{c.Name}} {{c.Plate}} 
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
			}
        },
        created(){ 
			this.getCustomer()
			this.getCar()
			this.getBike()
        },
         watch:{
            '$route':'fetchData'
        },
        methods: {
			getCustomer(){
				const refhost = db.collection('customer').doc(this.$route.params.cust_id)
				refhost.get().then(
					( doc =>{
						console.log(doc.data())
						this.cust = doc.data()
						this.createDate = doc.data().registerDate ? new Date(doc.data().registerDate.seconds * 1000) : 0
						this.birth = doc.data().DoB ?  new Date(doc.data().DoB.seconds * 1000) : 0
						this.$root.$storage.refFromURL(doc.data().imgIcon).getDownloadURL().then((url)=> {
							this.imageUrl = url
							
						})
					})
				)
				
				
			},
			getCar(){
				db.collection('vehicles').where("userID","==",this.$route.params.cust_id).get().then(snapshots => {
					snapshots.forEach(element => {
						this.car.push(element.data())
					});
				})
			},
            
        },
	}
</script>