<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input v-model="queryInfo.query" placeholder="请输入内容" class="input-with-select" clearable @clear="getUsersList">
            <el-button slot="append" icon="el-icon-search" @click="getUsersList" />
          </el-input>
        </el-col>
        <el-col :span="1">
          <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 用户数据表格 -->
      <el-table :data="usersList" style="width: 100%" border stripe>
        <el-table-column type="index" label="#" />
        <el-table-column prop="username" label="姓名" width="180" />
        <el-table-column prop="email" label="邮箱" width="180" />
        <el-table-column prop="mobile" label="电话" />
        <el-table-column prop="role_name" label="角色" />
        <el-table-column prop="mg_state" label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949" @change="stateChange(scope.row, $event)" />
          </template>
        </el-table-column>
        <el-table-column prop="role_name" label="操作">
          <template slot-scope="scope">
            <el-button-group>
              <!-- 修改 -->
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)" />
              <!-- 删除 -->
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUserById(scope.row.id)" />
              <!-- 分配角色 -->
              <el-tooltip content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)" />
              </el-tooltip>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 添加用户的对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="40%" @close="addDialogClosed">
      <!-- 表单区域 -->
      <el-form ref="addUserFormRef" :model="addUserForm" :rules="addUserRules" label-width="90px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addUserForm.password" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addUserForm.mobile" />
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="40%" @close="EditDialogClosed">
      <!-- 表单区域 -->
      <el-form ref="editUserFormRef" :model="editUserForm" :rules="editUserRules" label-width="90px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editUserForm.username" disabled />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserForm.email" />
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editUserForm.mobile" />
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog title="提示" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>
          分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"> </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'Users',
  data() {
    // 验证邮箱的规则
    const checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    const checkMobile = (rule, value, callback) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('手机号码格式不正确'))
    }
    return {
      // 用户列表数据
      usersList: [],
      // 分配角色的数据
      userInfo: {},
      // 角色列表数据
      roleList: [],
      // 已选中角色的Id
      selectedRoleId: '',
      // 用户列表参数对象
      queryInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 每页条数
        pagesize: 2
      },
      total: 0,
      // 控制添加对话框的显示与隐藏
      addDialogVisible: false,
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 分配角色对话框的显示与隐藏
      setRoleDialogVisible: false,
      // 添加用户数据
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 查询到的用户数据
      editUserForm: {},
      // 验证添加用户的表单
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 验证修改用户的表单
      editUserRules: {
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUsersList()
  },
  methods: {
    // 获取用户列表数据
    async getUsersList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取用户列表数据失败！')
      this.usersList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUsersList()
    },
    // 监听页码值得改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUsersList()
    },
    // 监听状态的改变
    async stateChange(row, event) {
      const { data: res } = await this.$http.put('users/' + row.id + '/state/' + event)
      if (res.meta.status !== 200) return this.$message.error('更新用户状态失败！')
      this.$message.success('更新用户状态成功！')
      this.getUsersList()
    },
    // 监听用户对话框关闭事件
    addDialogClosed() {
      this.$refs.addUserFormRef.resetFields()
    },
    // 点击按钮添加用户
    addUser() {
      this.$refs.addUserFormRef.validate(async valid => {
        if (!valid) return
        // 验证通过发送请求
        const { data: res } = await this.$http.post('users', this.addUserForm)
        console.log(res.data)
        if (res.meta.status !== 201) return this.$message.error('添加用户失败！')
        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUsersList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      // 获取用户信息
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('查询失败！')
      this.editUserForm = res.data
      this.editDialogVisible = true
    },
    // 监听修改用户对话框事件
    EditDialogClosed() {
      this.$refs.editUserFormRef.resetFields()
    },
    // 点击提交编辑好的信息
    editUserInfo() {
      this.$refs.editUserFormRef.validate(async vaild => {
        if (!vaild) return
        // 验证通过发送请求
        const { data: res } = await this.$http.put('users/' + this.editUserForm.id, {
          email: this.editUserForm.email,
          mobile: this.editUserForm.mobile
        })
        if (res.meta.status !== 200) return this.$message.error('更新失败！')
        this.$message.success('更新成功！')
        this.editDialogVisible = false
        this.getUsersList()
      })
    },
    // 点击删除用户
    async deleteUserById(id) {
      // 弹框询问用户是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') return this.$message.info('已取消删除')
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) return this.$message.error('删除用户失败！')
      this.$message.success('删除成功！')
      this.getUsersList()
    },
    // 展示角色对话框
    async setRole(userInfo) {
      this.userInfo = userInfo
      // 获取角色列表数据
      const { data: res } = await this.$http.get('roles')
      console.log(res.data)
      if (res.meta.status !== 200) return this.$message.error('获取角色列表数据失败！')
      this.roleList = res.data
      this.setRoleDialogVisible = true
    },
    // 点击按钮分配角色
    async saveRoleInfo() {
      if (!this.selectedRoleId) return this.$message.error('请选择要分配的角色！')
      // 发送请求
      const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { rid: this.selectedRoleId })
      if (res.meta.status !== 200) return this.$message.error(' 更新角色失败！')
      this.$message.success('更新角色成功！')
      this.getUsersList()
      this.setRoleDialogVisible = false
    },
    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  }
}
</script>
<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
.el-pagination {
  margin-top: 15px;
}
.el-button-group > .el-button:not(:last-child) {
  margin-right: 5px;
}
</style>
