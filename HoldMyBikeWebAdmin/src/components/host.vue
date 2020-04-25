<template>
	<v-container grid-list-xs>
		<v-layout row wrap>
			<v-flex xs12 pa-5  >
				<v-row style="margin:200px auto;">
					<v-col >
							<v-btn style=" height: 92.8px" tile block color="primary" dark to="/hostlist"><H3>Hosts</H3></v-btn>
					</v-col>
					<v-col>
						<v-btn style=" height: 92.8px" tile block color="primary" dark to="/hostwait"><H3>Awaiting for verification</H3></v-btn>
					</v-col>
				</v-row>

			</v-flex>
		</v-layout>
	</v-container>
</template>

<script>
	
	export default{
		name: 'host',
		
	}
</script>