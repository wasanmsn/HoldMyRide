<template>
  <v-app-bar
      app  
      dark
      
    >  
  <v-tabs 
      fixed-tabs
      
    >
      <v-tab v-if='islogged'
        to="/"
      >
        Hosts
      </v-tab>
      <v-tab v-if='islogged'
        to="/customerlist"
      >
        Customer
      </v-tab>
      <v-tab v-if='islogged'
        to="/priceset"
      >
        Price Setting
      </v-tab>
    </v-tabs>
    <p class="my-3 pa-5">{{currentuser}}</p>
    <v-btn v-if="islogged" color="black" @click="loggout">Log out</v-btn>
    <v-btn v-else color="white" style="color: black;" to='/login'>Log in</v-btn>
     </v-app-bar>
</template>

<script>

import db from 'firebase'
export default {
    name:'navbar',
    data: () => ({
    islogged:false,
    currentuser:''
  }),
  created(){
    if(db.auth().currentUser){
      this.islogged = true
      this.currentuser = db.auth().currentUser.email
    }
  },
  methods:{
    loggout(){
      db.auth().signOut().then(
        () =>{
          this.$router.push('/login')
        }

      )
    }
  }
}
</script>

