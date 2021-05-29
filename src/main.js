import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
// 导入全局样式
import './assets/css/global.css'
// 导入font
import './assets/fonts/iconfont.css'
// 导入axios
import axios from 'axios'

// 屏蔽浏览器console面板的提示信息
Vue.config.productionTip = false

// 配置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// 全局配置axios
Vue.prototype.$http = axios

// 创建vue实例对象
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
