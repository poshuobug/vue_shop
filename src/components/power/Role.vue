<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 添加角色 -->
      <el-button type="primary">添加角色</el-button>
      <!-- 数据表格 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1, i1) in scope.row.children" :key="item1.id" :class="['bdbotton', i1 === 0 ? 'bdtop' : '', 'vcenter']">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag @close="removeRightById(scope.row, item1)" closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限和三级 -->
              <el-col :span="19">
                <!-- 二级权限 -->
                <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag @close="removeRightById(scope.row, item2)" closable type="success">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                    </el-col>
                  <el-col :span="18">
                      <el-tag @close="removeRightById(scope.row, item3)" v-for="(item3) in item2.children" :key="item3.id" closable type="warning">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button-group>
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRoleById(scope.row.id)">删除</el-button>
            <el-button type="warning" size="mini" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </el-button-group>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限的对话框 -->
    <el-dialog
  title="提示"
  @close="setRightDialogClosed"
  :visible.sync="setRightDialogVisible"
  width="50%">
  <!-- 树形组件 -->
  <el-tree
  :data="rightList"
  show-checkbox
  node-key="id"
  :default-expand-all="true"
  :default-checked-keys="defKeys"
  :props="treeProps"
  ref="treeRef">
</el-tree>
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 角色列表数据
      rolesList: [],
      // 所有权限数据
      rightList: [],
      // 分配权限对话框的显示与隐藏
      setRightDialogVisible: false,
      // 属性控件绑定对象
      treeProps: {
        children: 'children',
        label: 'authName'
      },
      // 默认选中的节点Id值数组
      defKeys: [],
      // 即将分配权限的id
      roleId: ''
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.error('获取权限列表数据失败！')
      console.log(res.data)
      this.rolesList = res.data
    },
    // 点击删除角色
    deleteRoleById(id) {
      console.log(id)
    },
    // 根据id删除对应的权限
    async removeRightById(role, item3) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除!')
      }
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${item3.id}`)
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('删除角色失败！')
      role.children = res.data
    },
    // 展示分配权限的对话框
    async showSetRightDialog(role) {
      this.roleId = role.id
      // 获取所有权限的数据
      const { data: res } = await this.$http.get('rights/tree')
      console.log(res)
      if (res.meta.status !== 200) return this.$$message.error('获取权限列表失败！')
      this.rightList = res.data

      // 递归获取三级节点的id
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id,并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点不包含children属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      })
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击为角色分配权限
    async allotRights() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const idStr = keys.join(',')

      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) return this.$message.error('分配权限失败！')
      console.log(res)
      this.$message.success('分配权限成功！')
      this.getRolesList()
      this.setRightDialogVisible = false
    }
  }
}
</script>
<style lang="less" scoped>
.el-table {
  margin-top: 15px;
}
.el-button-group>.el-button+.el-button {
  margin-left: 10px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbotton {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
.el-tag {
  margin: 7px;
}
</style>
