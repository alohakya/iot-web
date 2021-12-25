import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import * as echarts from 'echarts'
import VueRouter from "vue-router";

//+引入组件库及相关样式
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

//让Vue使用ElementUI
Vue.use(ElementUI)
//让Vue使用VueRouter
Vue.use(VueRouter)

Vue.config.productionTip = false

// 这一步是为了能在全局直接使用this.$echarts
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
