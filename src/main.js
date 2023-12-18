import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.config.productionTip = false
axios.defaults.baseURL='http://3.81.147.106:3000/api/';
//axios.defaults.baseURL='https://contable-service.onrender.com/api/';
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
