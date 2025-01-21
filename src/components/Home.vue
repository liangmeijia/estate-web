<template>

  <el-descriptions class="margin-top" title="个人中心" :column="3" :size="size" border>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        用户名
      </template>
      {{ user.name }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-umbrella"></i>
        年龄
      </template>
      {{user.age}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-tickets"></i>
        性别
      </template>
      {{user.sex}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        手机号
      </template>
      {{user.phone}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        邮箱
      </template>
      {{user.email}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-location-outline"></i>
        角色
      </template>
      <el-tag :type="user.roleId ==='管理员' ? 'warning' : 'info'" disable-transitions>
        {{user.roleId}}
      </el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-location-outline"></i>
        状态
      </template>
      <el-tag
          :type="user.status ==='正常' ? 'success' : 'danger'"
          disable-transitions>{{user.status}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-wallet"></i>
        余额(元)
      </template>
      {{user.balance}}
    </el-descriptions-item>

    <template slot="extra">
      <el-button type="text" size="small" @click="updatePassword">修改密码</el-button>
      <el-dialog
          title="修改密码"
          :visible.sync="dialogVisible"
          width="30%"
          center>
        <el-form ref="form" :rules="rules" :model="form" label-width="120px">
          <el-form-item label="原密码" prop="password">
            <el-col :span="20">
              <el-input v-model="form.password" type="password"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-col :span="20">
              <el-input v-model="form.newPassword" type="password"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="确认密码" prop="confirmNewPassword">
            <el-col :span="20">
              <el-input v-model="form.confirmNewPassword" type="password"></el-input>
            </el-col>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doUpdatePassword">确 定</el-button>
      </span>
      </el-dialog>
    </template>
  </el-descriptions>

</template>


<script>
export default {
  name:'HomeComponent',
  data() {
    return {
      size: 'small',
      user: JSON.parse(sessionStorage.getItem('cur-user')),
      dialogVisible:false,
      form: {
        userId:'',
        password: '',
        newPassword: '',
        confirmNewPassword: ''
      },
      rules:{
        password: [
          {required: true, message: '请输入原密码', trigger: 'blur'}
        ],
        newPassword: [
          {required: true, message: '请输入新密码', trigger: 'blur'}
        ],
        confirmNewPassword: [
          {required: true, message: '请确认新密码', trigger: 'blur'}
        ],
      }
    };
  },
  methods:{
    updatePassword(){
      this.dialogVisible = true
      this.$nextTick(()=>{
        this.$refs.form.resetFields();
      })
    },
    doUpdatePassword(){
      this.form.userId = this.user.id
      this.$axios.post(this.$httpUrl+"/user/updatePassword",this.form).then(res=>res.data).then(res=>{
        if(res.code === 200){
          this.$message.success('操作成功 '+res.msg)
          this.dialogVisible = false
        }else {
          this.$message.error('操作失败 '+res.msg)
        }

      })
    }
  }
};
</script>

<style scoped>

</style>