import Vue from 'vue'
import VueRouter from 'vue-router'
// 导入login组件
// import Login from '../components/login.vue'
const Login = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
// 导入home组件
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Home.vue')
// 导入welcome组件
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// 导入Users组件
// import Users from '../components/user/Users.vue'
const Users = () => import(/* webpackChunkName: "users_rights_role" */ '../components/user/Users.vue')
// 导入Rights组件
// import Rights from '../components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName: "users_rights_role" */ '../components/power/Rights.vue')
// 导入Role组件
// import Role from '../components/power/Role.vue'
const Role = () => import(/* webpackChunkName: "users_rights_role" */ '../components/power/Role.vue')

// 导入Cate组件
// import Cate from '../components/goods/Cate.vue'
const Cate = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Cate.vue')
// 导入Params组件
// import Params from '../components/goods/Params.vue'
const Params = () => import(/* webpackChunkName: "cate_params" */ '../components/goods/Params.vue')

// 导入List组件
// import List from '../components/goods/List.vue'
const List = () => import(/* webpackChunkName: "list_add" */ '../components/goods/List.vue')
// 导入Add页面
// import Add from '../components/goods/Add.vue'
const Add = () => import(/* webpackChunkName: "list_add" */ '../components/goods/Add.vue')

// 导入Order组件
// import Order from '../components/order/Order.vue'
const Order = () => import(/* webpackChunkName: "order_report" */ '../components/order/Order.vue')
// 导入Report组件
// import Report from '../components/report/Report.vue'
const Report = () => import(/* webpackChunkName: "order_report" */ '../components/report/Report.vue')

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
      { path: '/categories', component: Cate },
      { path: '/params', component: Params },
      { path: '/goods', component: List },
      { path: '/goods/add', component: Add },
      { path: '/orders', component: Order },
      { path: '/reports', component: Report }
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
