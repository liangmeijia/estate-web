<template>
  <div>
    <div class="register-container">
      <div class="register-box">
        <h2>注册</h2>
        <el-form :model="form" class="register-form" :rules="rules">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="form.name" ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model="form.age"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-col :span="20">
              <el-radio-group v-model="form.sex">
                <el-radio label="男">男</el-radio>
                <el-radio label="女">女</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
          <el-form-item label="电话" prop="phone">
            <el-input v-model="form.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button  @click="login">登录</el-button>
            <el-button type="primary" @click="register">注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script >
export default {
  name:"RegisterManage",
  data(){
    return{
      form: {
        name: '',
        password: '',
        age:'',
        sex:'女',
        phone:'',
        email:''
      },
      rules: {
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 4, max: 8, message: '长度在 4 到 8 个字符', trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '手机号不能为空', trigger: 'blur'},
          {pattern:/^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/, message: '请输入正确的手机号', trigger: 'blur'}
        ]
      }
    }
  },
  methods:{
    login() {
      this.$router.replace('/')
    },
    register(){
      this.$axios.post(this.$httpUrl+"/register", this.form).then(res=>res.data).then(res=>{
        if(res.code === 200){
          //注册成功，跳转至登录界面
          this.$message.success(res.msg);
          this.$router.replace('/')
        }else {
          this.$message.error(res.msg);
        }
      })
    }
  }
}
</script>

<style>
/* 这里添加一些基本的样式 */
.register-container {
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
.register-box {
  width: 400px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.8); /* 半透明白色背景 */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  text-align: center;
}
.register-form .el-form-item {
  margin-bottom: 20px;
}
</style>