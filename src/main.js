import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Antd from 'ant-design-vue'
import axios from 'axios'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$form = Antd.Form

Vue.use(Antd)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
