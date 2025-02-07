<template>
  <el-descriptions class="margin-top" title="公告详情" :column="3" :size="size" border>
    <template slot="extra">
      <el-button type="text" size="small" @click="reback">返回</el-button>
    </template>

    <el-descriptions-item>
      <template slot="label">
        公告标题
      </template>
      {{noticerDetail.title }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        公告内容
      </template>
      {{noticerDetail.content}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        状态
      </template>
      <el-tag
          :type="noticerDetail.status ==='未读' ? 'info' :'success' "
          disable-transitions>{{noticerDetail.status}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        发布时间
      </template>
      {{noticerDetail.createTime}}
    </el-descriptions-item>



  </el-descriptions>
</template>
<script>
export default {
  name:"NoticeDetailManage",
  data(){
    return{
      user :JSON.parse(sessionStorage.getItem('cur-user')),
      size:'',
      noticerDetail:{
        title:'',
        content:'',
        status:'',
        createTime:'',
      },
    }
  },
  methods:{
    loadPost(){
      this.$axios.get(this.$httpUrl+"/notice",{
        params:{
          'noticeId':this.selectedNoticeId,
          'userId':this.selectedUserId
        }
      }).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code === 200){
          this.noticerDetail = res.data;

        }else {
          this.$message.error('操作失败')
        }

      })
    },
    reback(){
      this.$router.replace('/Notice')
    }
  },
  computed:{
    "selectedUserId": {
      get(){
        return this.$store.state.selectedUserId
      }
    },
    "selectedNoticeId": {
      get(){
        return this.$store.state.selectedNoticeId
      }
    }
  },
  beforeMount() {
    this.loadPost();
  }

}
</script>
<style scoped>

</style>