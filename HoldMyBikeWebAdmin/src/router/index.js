import Vue from 'vue'
import VueRouter from 'vue-router'
import host from '@/components/host.vue'
import vHost from '@/components/view-host.vue'
import priceset from '@/components/priceset.vue'
import customerlist from '@/components/customer-list.vue'
import hostwait from '@/components/host-wait-list.vue'
import hostlist from '@/components/host-list.vue'
import customerview from '@/components/view-customer.vue'
import login from '@/components/login.vue'
import db from 'firebase'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'host',
    component: host,
    meta:{
      requireAuth: true
    }
  },
  {
    path: '/vhost/ :host_id',
    name: 'vhost',
    component: vHost,
    meta:{
      requireAuth: true
    }
  },
  {
    path: '/priceset',
    name: 'priceset',
    component: priceset,
    meta:{
      requireAuth: true
    }

  },
  {
    path: '/customerlist',
    name: 'customerlist',
    component: customerlist,
    meta:{
      requireAuth: true
    }

  },
  {
    path: '/hostlist',
    name: 'hostlist',
    component: hostlist,
    meta:{
      requireAuth: true
    }

  },
  {
    path: '/hostwait',
    name: 'hostwait',
    component: hostwait,
    meta:{
      requireAuth: true
    }

  },
  {
    path: '/customerview/ :cust_id',
    name: 'customerview',
    component: customerview,
    meta:{
      requireAuth: true
    }

  },
  {
    path: '/login',
    name: 'login',
    component: login,
    meta:{
      requireGuest: true
    }
  },
]

const router = new VueRouter({
  routes
})
router.beforeEach((to,from,next) => {
  if(to.matched.some(rec => rec.meta.requireAuth)){
    if(!db.auth().currentUser){
      next({
        path: '/login',
        query:{
          redirect: to.fullPath
        }
      })
    }
    
    else{
       next();
    }
    
  }
  else if(to.matched.some(rec => rec.meta.requireGuest)){
      if(db.auth().currentUser){
        next({
          path:'/login',
          query:{
            redirect: to.fullPath
          }
        })
      }
      else{
        next()
      }
  }
  else{
    next()
  }
})

export default router
