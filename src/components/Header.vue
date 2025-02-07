<template>
  <div style="display: flex">
    <div >
      <i :class="icon" style="font-size: 15px;cursor:pointer" @click="collapse"></i>
    </div>
    <div style="flex: 1;text-align: center;font-size: 20px">
      <span>小区物业管理系统</span>
    </div>
    <el-popover
        placement="right"
        width="400"
        trigger="click">
      <div style="text-align: right;">
          <el-badge :value="unReadCount" class="item">
            <el-button type="text" @click="getMore">更多</el-button>
          </el-badge>
      </div>
      <el-table :data="NoticeTop">
        <el-table-column  property="title" label="公告标题"></el-table-column>
        <el-table-column  property="createTime" label="创建时间"></el-table-column>
      </el-table>

      <el-button slot="reference" type="text" @click="loadNoticeTop">🛎️</el-button>
    </el-popover>
    &nbsp;&nbsp;&nbsp;&nbsp;
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
        user: JSON.parse(sessionStorage.getItem('cur-user')),
        unReadCount:'',
        NoticeTop: [
          {
            title: '公告**',
            createTime:'****-**-**',
          },
        ]
      }
    },
    methods:{
      getMore(){
        this.$router.push('/Notice')
      },
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
      loadNoticeTop(){
        this.$axios.get(this.$httpUrl+"/notices/top",{
          params:{
            "counts":5,
            "userId":this.user.id,
          }
        }).then(res=>res.data).then(res=>{
          console.log(res)
          if(res.code === 200){
            this.NoticeTop = res.data;
            //查询未读数量
            this.$axios.get(this.$httpUrl+"/notice/read/no/counts",{params:{
                "userId":this.user.id,
              }
            }).then(res=>res.data).then(res=>{
              if(res.code === 200){
                this.unReadCount = res.data;
              }else {
                this.$message.error('操作失败, '+res.msg)
              }
            })
          }else {
            this.$message.error('操作失败, '+res.msg)
          }

        })
      },
      collapse(){
        this.$emit("doCollapse")
      }
    },
  }
</script>
<style scoped>

</style>