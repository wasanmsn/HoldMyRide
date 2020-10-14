<template>
	<v-container grid-list-xs>
		<v-layout row wrap>
			<v-flex xs12>
				<h1 class="text-center">Customers</h1>
			</v-flex>
			<v-flex xs12>
				<v-list flat class="deep-purple lighten-3">
					<v-list-item-group class="">
						<v-list-item
							class="ma-3  deep-purple lighten-1"
							v-for="(cust,i) in custs"
							:key="i"
							@click="goto(cust.id)"
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-1"
							
								v-text="cust.cust_name"
							>
								
							</v-list-item-content>
							
						</v-list-item>
						
					</v-list-item-group>
					
				</v-list>
				<v-btn  to="/" color="success my-2">Back</v-btn>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	import db from "./firebaseInnit.js"

	export default{
		name: 'customerlist',
		data(){
			return {
				custs:[]
			}
		},
		created () {
			db.collection('customer').get().then(
				querySnapshot => {
					querySnapshot.forEach(doc => {
						const data = {
							'id': doc.id,
							'cust_name':doc.data().UserName,
						}
						this.custs.push(data)
					})
				}
			)
		},
		methods: {
			goto(id){
				this.$router.push({
					name: 'customerview',params:{
						cust_id: id
					}
				})
			}
		},
	}
</script>