import Vue from 'vue'
import {
  Button,
  Form,
  Input,
  FormItem,
  Message,
  Container,
  Aside,
  Main,
  Header,
  Row,
  Col,
  Submenu,
  MenuItemGroup,
  MenuItem,
  Menu,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  ButtonGroup,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader
} from 'element-ui'

Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
// 全局挂载弹框提示
Vue.prototype.$message = Message
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Row)
Vue.use(Col)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Menu)
Vue.use(BreadcrumbItem)
Vue.use(Breadcrumb)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(ButtonGroup)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.prototype.$confirm = MessageBox.confirm

