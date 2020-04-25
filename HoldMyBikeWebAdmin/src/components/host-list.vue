<template>
	<v-container grid-list-xs>
		<v-layout row wrap>
			<v-flex xs12>
				<h1 class="text-center">Hosts</h1>
			</v-flex>
			<v-flex xs12>
				<v-list flat class="deep-purple lighten-3">
					<v-list-item-group class="">
						<v-list-item
							class="ma-3  deep-purple lighten-1"
							v-for="(host,i) in hosts"
							:key="i"
							@click="goto(host.id)"
						>
							<v-list-item-content
							class="px-2 deep-purple lighten-1"
							
								v-text="host.host_name"
							>
								
							</v-list-item-content>
							
						</v-list-item>
						
					</v-list-item-group>
					
				</v-list>
			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	import db from "./firebaseInnit.js"

	export default{
		name: 'hostlist',
		data(){
			return {
				hosts:[]
			}
		},
		created () {
			db.collection('host').where('verified','==',true).get().then(
				querySnapshot => {
					querySnapshot.forEach(doc => {
						const data = {
							'id': doc.id,
							'host_name':doc.data().name,
						}
						this.hosts.push(data)
					})
				}
			)
		},
		methods: {
			goto(id){
				this.$router.push({
					name: 'vhost',params:{
						host_id: id
					}
				})
			}
		},
	}
</script>