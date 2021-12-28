import Vue from 'vue'
import VueRouter from 'vue-router'
import ChinaMap from "../views/ChinaMap";
import ChinaOverView from "../views/ChinaOverView";
import ChinaConfirmedLine from "../views/ChinaConfirmedLine";
import WorldMap from "../views/WorldMap";
import AllCountry from "../views/AllCountry";
import Country from "../views/Country";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'ChinaMap',
    component: ChinaMap,
  },
  {
    path: '/ChinaConfirmedLine',
    name: 'ChinaConfirmedLine',
    component: ChinaConfirmedLine
  },
  {
    path: '/ChinaOverview',
    name: 'ChinaMapOverview',
    component: ChinaOverView
  },
  {
    path: '/WorldMap',
    name: 'WorldMap',
    component: WorldMap
  },
  {
    path: '/AllCountry',
    name: 'AllCountry',
    component: AllCountry
  },
  {
    path: '/Country/:name',
    name: 'Country',
    component: Country
  },
]

const router = new VueRouter({
  routes
})
export default router