import Vue from 'vue'
import { Button, Form, Input, FormItem, Message } from 'element-ui'

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
// 全局挂载弹框提示
Vue.prototype.$message = Message
