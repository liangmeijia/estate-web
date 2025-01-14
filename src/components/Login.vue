<template>
  <div class="login-container">
    <div class="login-box">
      <h2>小区物业管理系统</h2>
      <el-form :model="form" class="login-form">
        <el-form-item>
          <el-input v-model="form.name" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.password" placeholder="密码" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">登录</el-button>
          <el-button @click="register">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name:"LoginComponent",
  data() {
    return {
      form: {
        name: '',
        password: '',
      },
      rules: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 4, max: 8, message: '长度在 4 到 8 个字符', trigger: 'blur'}
        ]
      }
    };
  },
  methods: {
    login() {
      console.log(this.form.name)
      // 这是你的用户名和密码验证逻辑
      this.$axios.post(this.$httpUrl+"/login", this.form).then(res=>res.data).then(res=>{
           if(res.code === 200){
             //登录成功
             sessionStorage.setItem('cur-user',JSON.stringify(res.data))
             this.$store.commit('setMenu',res.data.menus)
             this.$router.replace('/Index')
           }else {
             this.$message.error(res.msg);
           }
      })
    },
    register(){
      console.log("注册。。。。")
    }
  }
};
</script>

<style>
/* 这里添加一些基本的样式 */
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url('@/assets/login-bg.jpg'); /* 背景图片路径 */
  background-size: cover; /* 确保图片覆盖整个背景 */
  background-position: center; /* 居中显示背景图片 */
  background-repeat: no-repeat; /* 不重复背景图片 */
}
/* 登录框样式 */
.login-box {
  width: 400px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.9); /* 半透明白色背景 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
}
.login-form .el-form-item {
  margin-bottom: 20px;
}
</style>