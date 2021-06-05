import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入font
import '../src/assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
// 导入TreeTable
import TreeTable from 'vue-table-with-tree-grid'

// 屏蔽浏览器console面板的提示信息
Vue.config.productionTip = false

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 请求拦截器
axios.interceptors.request.use(config => {
  // 为当前请求配置Token认证字段
  config.headers.Authorization = window.localStorage.getItem('token')
  return config
})

// 全局配置axios
Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)

// 创建vue实例对象
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
