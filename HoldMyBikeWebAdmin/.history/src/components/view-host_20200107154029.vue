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
								Total carparked: {{host.carparked}}
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
								<img height="400px" :src='imageUrl'>
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
								<img height="400px" :src='imageUrl'>
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
								<img height="400px" :src='imageUrl'>
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
				birth:null,
			}
        },
        created(){ 
            const refhost = db.collection('host').doc(this.$route.params.host_id)
            refhost.get().then(
                (doc =>{
                    this.host = doc.data();
					this.createDate = new Date(doc.data().createWhen.seconds * 1000)
					this.birth = new Date(doc.data().DoB.seconds * 1000)
                })
            )
            this.getImg()
        },
         watch:{
            '$route':'fetchData'
        },
        methods: {
            suspends(){
                this.host.Suspend = !this.host.Suspend
                const refupdate = db.collection('host').doc(this.$route.params.host_id)
                refupdate.set(this.host).then()
            },
            getImg(){
               this.$root.$storage.refFromURL('gs://holdmybike-998ed.appspot.com/account.png').getDownloadURL().then((url)=> {
                   this.imageUrl = url
                   
               })
			},
			verify(){
                this.host.verified = !this.host.verified
                const refupdate = db.collection('host').doc(this.$route.params.host_id)
                refupdate.set(this.host).then(
					alert("Verification complete!")
				)
            },
            
        },
	}
</script>