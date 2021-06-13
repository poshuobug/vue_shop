import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入font
import '../src/assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'
// 导入TreeTable
import TreeTable from 'vue-table-with-tree-grid'
// 导入富士文本
import VueQuillEditor from 'vue-quill-editor'
// 导入nprogress
import Nprogress from 'nprogress'

// 屏蔽浏览器console面板的提示信息
Vue.config.productionTip = false

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 请求拦截器
axios.interceptors.request.use(config => {
  // 展示进度条
  Nprogress.start()
  // 为当前请求配置Token认证字段
  config.headers.Authorization = window.localStorage.getItem('token')
  return config
})

// 响应拦截器
axios.interceptors.response.use(response => {
  Nprogress.done()
  return response
})

// 全局配置axios
Vue.prototype.$http = axios

Vue.component('tree-table', TreeTable)

Vue.filter('dataFormat', str => {
  const dt = new Date(str)
  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.use(VueQuillEditor)

// 创建vue实例对象
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
