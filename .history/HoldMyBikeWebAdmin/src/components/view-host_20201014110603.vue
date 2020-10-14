<template>
	<v-container>
		<v-layout row wrap>
            <v-flex xs12 class="my-3">
                <v-list flat class="deep-purple lighten-1">
                    <v-subheader class="ma-2">               
                            <img width="80" height="80" :src='imageUrl'>
                            <p class="mx-4 mt-12" style="font-size:20px;">{{host.UserName}}</p>
                    </v-subheader>
					<v-list-item-group >
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								<v-text-field
									v-model="host.name"
									label="ชื่อ"
								></v-text-field>
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								<v-text-field
									v-model="host.Pid"
									label="รหัสบัตรประจำตัวประชาชน"
								></v-text-field>
							</v-list-item-content>
							
						</v-list-item>												
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
						<vc-date-picker
						v-model="birth"
						:popover="{ placement: 'bottom', visibility: 'click' }">
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
							<v-row>
								<v-col
									cols="12"
									sm="6"
									md="8">วันเกิด: {{birth?birth.toLocaleDateString('th-TH',{
										year: 'numeric',
										month: 'long',
										day: 'numeric',
										weekday: 'long',
								}):'0'}}</v-col>
								<v-col cols="6" md="4"><v-icon large color="black">
									mdi-calendar
								</v-icon></v-col>
								
							</v-row>

							</v-list-item-content>

						</vc-date-picker>

							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								<v-text-field
									v-model="host.Address"
									label="ที่อยู่"
								></v-text-field>
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								<v-text-field
									v-model="host.Province"
									counter="25"
									label="จังหวัด"
								></v-text-field>
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								<v-text-field
									v-model="host.postalcode"
									counter="25"
									label="รหัสไปรษณีย์"
								></v-text-field>
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								<v-text-field
									v-model="host.Country"
									counter="25"
									label="ประเทศ"
								></v-text-field>
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
								<v-text-field
									v-model="host.religion"
									counter="25"
									label="ศาสนา"
								></v-text-field>
							</v-list-item-content>
							
						</v-list-item>
						<v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								<v-text-field
									v-model="host.age"
									counter="25"
									label="อายุ"
									type="number"
								></v-text-field>							
							</v-list-item-content>
							
						</v-list-item>
                        <v-list-item
							class="ma-3  deep-purple lighten-3"	
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								<v-select
								:items="genders"
								v-model="host.gender"
								label="เพศ"
								solo
								></v-select>						
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
								ยืนยัน <span v-if="host.verified" class="font-weight-bold green--text">VERIFIED</span> <span v-else class="font-weight-bold red--text">NOT VERIFIED</span>
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
                            <h1 class="mx-4 mt-12" >โรงรถ </h1>
                    </v-subheader>
					<v-list-item-group >
							<v-list-item
							class="ma-5  deep-purple lighten-3"	>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								พื้นที่จอด: {{host.parkingspace}}
							</v-list-item-content>
							
						</v-list-item>
                        <v-list-item
							class="ma-5  deep-purple lighten-3"	>
							<v-list-item-content
							class="px-2 deep-purple lighten-3"
							>
								จำนวนรถที่จอด: {{host.vehicles}}
							</v-list-item-content>
							
						</v-list-item>
					</v-list-item-group>
				</v-list>
            </v-flex>
			<v-flex xs12 class="my-3">
                <v-list flat class="deep-purple lighten-1">
                    <v-subheader class="ma-2">               
                            <h1 class="mx-4 mt-12" > บัตรประชาชน </h1>
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
                            <h1 class="mx-4 mt-12" > ใบขับขี่ </h1>
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
                            <h1 class="mx-4 mt-12" >ทะเบียนบ้าน </h1>
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
			<v-btn  @click="edit" class="green" style="right:-5px;">Update</v-btn>
            
        </v-flex>
       
        </v-layout>
                   
	</v-container>
</template>


<script>
    import db from './firebaseInnit'
    import firebase from 'firebase/app'
	import 'firebase/firestore'
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
				id:this.$route.params.host_id,
				genders:['เพศหญิง','เพศชาย']
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
                this.host.Suspend = !this.host.Suspend

			},
			edit(){
				date = new Date(this.birth)
				this.host.DoB = new firebase.firestore.Timestamp(date)
				const refupdate = db.collection('host').doc(this.id)
                refupdate.update(this.host).then(() => {
					alert('ทำการอัพเดทข้อมูลแล้ว')
				})
			},
			verify(){
				this.host.verified = !this.host.verified
            },
            
        },
	}
</script>