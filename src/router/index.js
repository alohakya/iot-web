import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Subscriber from "../views/Subscriber";
import One from "../views/One";
import TWO from "../views/TWO";
import ChinaMap from "../views/ChinaMap";
import ChinaOverView from "../views/ChinaOverView";

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
  {
    path: '/One',
    name: 'One',
    component: One
  },
  {
    path: '/Two',
    name: 'Two',
    component: TWO
  },
  {
    path: '/ChinaMap',
    name: 'ChinaMap',
    component: ChinaMap
  },
  {
    path: '/ChinaOverview',
    name: 'ChinaMapOverview',
    component: ChinaOverView
  },
]

const router = new VueRouter({
  routes
})
export default router