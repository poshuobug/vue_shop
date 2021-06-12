<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" class="input-with-select" clearable>
            <el-button slot="append" icon="el-icon-search" />
          </el-input>
        </el-col>
      </el-row>
      <!-- table数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price" width="95px"></el-table-column>
        <el-table-column label="是否付款" prop="order_pay" width="95px">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.order_pay === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send" width="95px"> </el-table-column>
        <el-table-column label="下单时间" prop="create_time" width="160px">
          <template slot-scope="scope">{{ scope.row.create_time | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="操作" prop="order_number" width="160px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="addressShowDialog(scope.row)"></el-button>
            <el-button type="success" icon="el-icon-location-outline" size="mini" @click="showProgressBox"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改订单地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="setaddressDialogVisible" width="50%" @close="addressDialogClosed">
      <!-- 表单 -->
      <el-form :model="addressForm" :rules="addressFormRules" ref="addressFormRef" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader v-model="addressForm.address1" :options="cityData" expand-trigger="hover"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 展示物流进度的对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="30%">
      <!-- 时间线 -->
      <el-timeline :reverse="reverse">
        <el-timeline-item v-for="(activity, index) in progressInfo" :key="index" :timestamp="activity.time">
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      // 订单数据
      orderList: [],
      // 订单列表参数
      queryInfo: {
        // 查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 5
      },
      // 总数
      total: 0,
      // 订单地址对话框的显示与隐藏
      setaddressDialogVisible: false,
      addressForm: {
        address1: [],
        address2: ''
      },
      // 表单验证
      addressFormRules: {
        address1: [{ required: true, message: '请选择省市区县', trigger: 'blur' }],
        address2: [{ required: true, message: '请填写详细地址', trigger: 'blur' }]
      },
      cityData,
      // 控制物流进度对话框的显示与隐藏
      progressVisible: false,
      // 订单物流信息
      progressInfo: []
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    // 获取订单数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.queryInfo
      })
      console.log(res)
      if (res.meta.status !== 200) return this.$message.error('获取订单数据失败！')
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    // 监听每页条数的改变
    handleSizeChange(newPage) {
      this.queryInfo.pagesize = newPage
      this.getOrderList()
    },
    // 监听页码发生改变
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 点击显示对话框
    addressShowDialog() {
      this.setaddressDialogVisible = true
    },
    // 监听关闭对话框事件
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    async showProgressBox() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) return this.$message.error('获取物流信息失败！')
      this.progressInfo = this.data
      this.progressVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
