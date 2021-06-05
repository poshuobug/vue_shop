import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入login组件
import Login from '../components/login.vue'
// 导入home组件
import Home from '../components/Home.vue'
// 导入welcome组件
import Welcome from '../components/Welcome.vue'
// 导入Users组件
import Users from '../components/user/Users.vue'
// 导入Rights组件
import Rights from '../components/power/Rights.vue'
// 导入Role组件
import Role from '../components/power/Role.vue'
import Cate from '../components/goods/Cate.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Role },
      { path: '/categories', component: Cate }
    ]
  }
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
