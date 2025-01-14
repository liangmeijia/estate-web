<template>
  <div style="display: flex">
    <div >
      <i :class="icon" style="font-size: 15px;cursor:pointer" @click="collapse"></i>
    </div>
    <div style="flex: 1;text-align: center;font-size: 20px">
      <span>小区物业管理系统</span>
    </div>
    <span style="font-size: 15px">{{user.name}}</span>
    <el-dropdown>
      <i class="el-icon-arrow-down" style="margin-left: 10px;cursor:pointer"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item @click.native="toUser">个人中心</el-dropdown-item>
        <el-dropdown-item @click.native="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

  </div>
</template>
<script>
  export default {
    name:"headerComponent",
    props:{
      icon:String
    },
    data(){
      return{
        user: JSON.parse(sessionStorage.getItem('cur-user'))
      }
    },
    methods:{
      toUser(){
        this.$router.push('/Home')
      },
      logout(){
        this.$confirm('您确认要退出登录吗？','提示',{
          confirmButtonText:'确认',
          type: "warning",
          center:true
        }).then(()=>{
          this.$message({
            message: '退出成功',
            type: 'success'
          });
          //跳转到登录页面
          this.$router.push('/')
          //清空当前登录用户的信息
          sessionStorage.removeItem('cur-user')
        }).catch(()=>{
          this.$message({
            message: '已取消退出',
            type: 'error'
          });
        })

      },
      collapse(){
        this.$emit("doCollapse")
      }
    } ,
    created(){
      this.$router.push('/Home')
    }
  }
</script>
<style scoped>

</style>