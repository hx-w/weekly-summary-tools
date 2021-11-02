import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue'
import axios from 'axios'
import 'ant-design-vue/dist/antd.css'

Vue.config.productionTip = false
Vue.prototype.$http = axios
Vue.prototype.$fetchAPI = async function (url, params, action, show) {
  let data = {}
  axios
    .get(url, { params: params })
    .then((resp) => {
      if (show) {
        this.$message.success(`${action}成功`)
      }
      data = resp.data
      return data
    })
    .catch((error) => {
      this.$message.error(`${action}失败：${error}`)
    })
}

Vue.use(Antd)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
