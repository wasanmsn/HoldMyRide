import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';
import firebase from 'firebase/app';
import nav from '@/components/navbar.vue'
import 'firebase/firestore'
import 'firebase/storage'
import './components/firebaseInnit'

Vue.prototype.$db = firebase.firestore()
Vue.prototype.$storage = firebase.storage()
Vue.config.productionTip = false
Vue.component('navbar',nav)
let app;
firebase.auth().onAuthStateChanged(() => {
  if(!app){
      app = new Vue({
        router,
        vuetify,
        render: h => h(App)
      }).$mount('#app')
  }
});

