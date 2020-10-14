<template>
	<v-container>
		<v-layout row wrap>
            <v-flex xs12 class="my-3">
                <v-list flat class="deep-purple lighten-1">
                    <v-subheader class="ma-2">               
                            <img width="80" height="80" :src='imageUrl'>
                            <p class="mx-4 mt-12" style="font-size:20px;">{{host.name}}</p>
                    </v-subheader>
					<v-list-item-group >
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
						<vc-date-picker
						v-model="birth"
						:popover="{ placement: 'bottom', visibility: 'click' }">
							<button class="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded focus:outline-none " style="height: 50;">
								<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								class="w-4 h-4 fill-current">
								<path d="M1 4c0-1.1.9-2 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V4zm2 2v12h14V6H3zm2-6h2v2H5V0zm8 0h2v2h-2V0zM5 9h2v2H5V9zm0 4h2v2H5v-2zm4-4h2v2H9V9zm0 4h2v2H9v-2zm4-4h2v2h-2V9zm0 4h2v2h-2v-2z" />
								</svg>
							</button>
						</vc-date-picker>

							<input v-model="birth" placeholder="edit birth">
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
								Address: {{host.Address}}
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Province: {{host.Province}}
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Country: {{host.Country}}
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Postal Code: {{host.postalcode}}
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								E-Mail: {{host.email}}
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Religion: {{host.religion}}
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Phone Number: {{host.PhoneN}}
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Age: {{host.age}}
							</v-list-item-content>
							
						</v-list-item>
                        <v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Gender: {{host.gender}}
							</v-list-item-content>
							
						</v-list-item>
                        <v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Suspend <span v-if="host.Suspend" class="font-weight-bold red--text">SUSPENDED</span> <span v-else class="font-weight-bold green--text">NOT SUSPENDED</span>
							</v-list-item-content>
							
						</v-list-item>
                        <v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Verification <span v-if="host.verified" class="font-weight-bold green--text">VERIFIED</span> <span v-else class="font-weight-bold red--text">NOT VERIFIED</span>
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
                            <h1 class="mx-4 mt-12" > Host's parking lot </h1>
                    </v-subheader>
					<v-list-item-group >
							<v-list-item
							class="ma-5  deep-purple lighten-3"	>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Parking space: {{host.parkingspace}}
							</v-list-item-content>
							
						</v-list-item>
                        <v-list-item
							class="ma-5  deep-purple lighten-3"	>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								Total carparked: {{host.vehicles}}
							</v-list-item-content>
							
						</v-list-item>
					</v-list-item-group>
				</v-list>
            </v-flex>
			<v-flex xs12 class="my-3">
                <v-list flat class="deep-purple lighten-1">
                    <v-subheader class="ma-2">               
                            <h1 class="mx-4 mt-12" > Host's identification </h1>
                    </v-subheader>
					<v-list-item-group >
						<v-list-item>
							<v-list-item-content>
								<img height="400px" :src='idImage'>
							</v-list-item-content>
						</v-list-item>
					</v-list-item-group>
					
				</v-list>
            </v-flex>
			<v-flex xs12 class="my-3">
                <v-list flat class="deep-purple lighten-1">
                    <v-subheader class="ma-2">               
                            <h1 class="mx-4 mt-12" > Host's driver license </h1>
                    </v-subheader>
					<v-list-item-group >
						<v-list-item>
							<v-list-item-content>
								<img height="400px" :src='drivingLic'>
							</v-list-item-content>
						</v-list-item>
					</v-list-item-group>
					
				</v-list>
            </v-flex>
			<v-flex xs12 class="my-3">
                <v-list flat class="deep-purple lighten-1">
                    <v-subheader class="ma-2">               
                            <h1 class="mx-4 mt-12" > Host's house registration </h1>
                    </v-subheader>
						<v-list-item-group>
						<v-list-item>
							<v-list-item-content>
								<img height="400px" :src='houstImage'>
							</v-list-item-content>
						</v-list-item>
						</v-list-item-group>
				</v-list>
            </v-flex>
           
        <v-btn to="/" color="success">Back</v-btn>  
        
        <v-flex xs6 class="mx-3">
            <v-btn v-if="host.Suspend" @click="suspends" class="red">Suspend</v-btn>
            <v-btn v-else @click="suspends" class="green">Not Suspend</v-btn>
			<v-btn  v-show="!host.verified" @click="verify" class="green" style="right:-5px;">Verify</v-btn>
            
        </v-flex>
       
        </v-layout>
                   
	</v-container>
</template>


<script>
    import db from './firebaseInnit'
    
	export default{
		name: 'view-host',
		data(){
			return {
                host:{},
                createDate:null,
				imageUrl:null,
				idImage:null,
				houstImage:null,
				drivingLic:null,
				birth:null,
				id:this.$route.params.host_id
			}
        },
        created(){ 
            const refhost = db.collection('host').doc(this.id)
            refhost.get().then(
                (doc =>{
                    this.host = doc.data();
					this.createDate = new Date(doc.data().createWhen.seconds * 1000)
					this.birth = new Date(doc.data().DoB.seconds * 1000)
					this.$root.$storage.refFromURL(doc.data().DriverLic).getDownloadURL().then((url)=> {
						this.drivingLic = url  })
					this.$root.$storage.refFromURL(doc.data().houseregis).getDownloadURL().then((url)=> {
						this.houstImage = url })		
					this.$root.$storage.refFromURL(doc.data().Idcard).getDownloadURL().then((url)=> {
						this.idImage = url}) 	
					this.$root.$storage.refFromURL('gs://holdmybike-998ed.appspot.com/account.png').getDownloadURL().then((url)=> {
						this.imageUrl = url
						
					})				
				})
				
            )
        },
         watch:{
            '$route':'fetchData'
		},
        methods: {
            suspends(){
                var suspend = !this.host.Suspend
                const refupdate = db.collection('host').doc(this.id)
                refupdate.update({Suspend:suspend}).then()
            },
			verify(){
                const refupdate = db.collection('host').doc(this.id)
                refupdate.update({verified:true}).then(
					alert("Verification complete!")
				)
            },
            
        },
	}
</script>