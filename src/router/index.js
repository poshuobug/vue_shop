import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入login组件
import Login from '../components/login.vue'
// 导入home组件
import Home from '../components/Home.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

// 创建路由对象
const router = new VueRouter({
  routes
})

// 声明全局导航守卫
router.beforeEach((to, from, next) => {
  // 读取token
  const token = window.localStorage.getItem('token')
  // 如果访问后台主页且token不存在
  if (to.path === '/login') return next()
  if (!token) return next('/login')
  next()
})

export default router
