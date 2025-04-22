<template>
  <el-descriptions class="margin-top" title="维修申请详情" :column="3" :size="size" border>
    <template slot="extra">
      <el-button type="text" size="small" @click="reback">返回</el-button>
    </template>

    <el-descriptions-item>
      <template slot="label">
        申请人姓名
      </template>
      {{repairDetail.applicantName }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        申请人电话
      </template>
      {{repairDetail.applicantPhone}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        小区
      </template>
      {{repairDetail.address}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        栋
      </template>
      {{repairDetail.building}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        单元
      </template>
      {{repairDetail.unit}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        门牌号
      </template>
      {{repairDetail.number}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        状态
      </template>
      <el-tag
          :type="repairDetail.status ==='待维修' ? 'info' :(repairDetail.status ==='维修完成' ?'success':'primary') "
          disable-transitions>{{repairDetail.status}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        维修开始日期
      </template>
      {{repairDetail.startTime}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        维修截至日期
      </template>
      {{repairDetail.endTime}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        维修费用(元)
      </template>
      {{repairDetail.price}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        维修申请事由
      </template>
      {{repairDetail.reason}}
    </el-descriptions-item>
  </el-descriptions>

</template>

<script >
export default {
  name :"RepairDetailManage",
  data(){
    return{
      user :JSON.parse(sessionStorage.getItem('cur-user')),
      size:'',
      repairDetail:{
        applicantName:'',
        applicantPhone:'',
        address:'',
        building:'',
        unit:'',
        number:'',
        status:'',
        startTime:'',
        endTime:'',
        price:'',
        reason:'',
      },
    }
  },
  methods:{
    loadPost(){
      this.$axios.get(this.$httpUrl+"/repair",{
        params:{
          'id':this.selectedUserId
        }
      }).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code === 200){
          this.repairDetail = res.data;

        }else {
          this.$message.error('操作失败')
        }

      })
    },
    reback(){
      this.$router.replace('/Repair')
    }
  },
  computed:{
    "selectedUserId": {
      get(){
        return this.$store.state.selectedUserId
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