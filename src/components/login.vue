<template>
  <div class="login_container">
    <div class="login_box">
      <!-- logo区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRormRules" class="login_form">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="iconfont icon-user" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-3702mima" />
        </el-form-item>
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="resetLoginForm(loginForm)">重置</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 登录表单数据
      loginForm: {
        username: '',
        password: ''
      },
      //   登录表单验证
      loginRormRules: {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 11, message: '长度在 3 到 11 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    //   点击重置表单
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 点击登录
    login() {
      // 登录验证表单
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        // 验证通过发送请求
        const { data: res } = await this.$http.post('login', this.loginForm)
        console.log(res.data)
        // 登录失败
        if (res.meta.status !== 200) return this.$message.error('登录失败！')
        // 登录成功
        this.$message.success(res.meta.msg)
        window.localStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>
<style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  margin: 0 auto;
  background-color: #ffff;
}
.avatar_box {
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 130px;
  height: 130px;
  padding: 10px;
  border: 1px solid #cccc;
  border-radius: 50%;
  background-color: #ffff;
  box-shadow: 0 0 10px #ddd;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #cccc;
  }
}
.login_form {
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 100%;
  padding: 0 20px;
  margin-top: 20px;
  box-sizing: border-box;
}
</style>
