import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Subscriber from "../views/Subscriber";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/subscriber',
    name: 'Subscriber',
    component: Subscriber,
  },
]

const router = new VueRouter({
  routes
})
export default router