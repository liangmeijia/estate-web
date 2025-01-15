<template>
  <div style="margin-left: 5px; margin-top: 5px">
    <div style="margin-bottom:5px;">
      <el-date-picker
          v-model="startTime"
          type="datetime"
          placeholder="选择充值的开始日期"
          @keyup.enter.native="loadPost"
          :format="'yyyy-MM-dd HH:mm:ss'"
          :value-format="'yyyy-MM-dd HH:mm:ss'">
      </el-date-picker>
      <el-date-picker
          v-model="endTime"
          type="datetime"
          placeholder="选择充值的截至日期"
          @keyup.enter.native="loadPost"
          :format="'yyyy-MM-dd HH:mm:ss'"
          :value-format="'yyyy-MM-dd HH:mm:ss'">
      </el-date-picker>
      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>
    </div>
    <el-table :data="tableData" :header-cell-style="{background:'#f2f5fc' ,color:'#555555'}" border>
      <!-- 序号列 -->
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="name" label="户主"/>
      <el-table-column prop="amount" label="充值金额(元)" />
      <el-table-column prop="date" label="充值日期" />
      <el-table-column prop="method" label="充值方式" >
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.method ==='微信' ? 'info':(scope.row.status ==='支付宝'?'success':'danger')"
              disable-transitions>{{scope.row.method}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="充值状态">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.status ==='充值成功' ? 'success':'danger'"
              disable-transitions>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNum"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
    </el-pagination>

  </div>
</template>
<script>
export default {
  name:"BalanceRecordsManage",
  data(){
    return{
      user: JSON.parse(sessionStorage.getItem('cur-user')),
      tableData: [],
      pageNum:1,
      pageSize:10,
      total:0,
      startTime:null,
      endTime:null,
    }
  },
  methods:{
    loadPost(){
      this.$axios.post(this.$httpUrl+"/balanceRecords",{
        "pageNum":this.pageNum,
        "pageSize":this.pageSize,
        "startTime":this.startTime,
        "endTime":this.endTime,
      }).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code === 200){
          this.tableData = res.data.records;
          this.total = res.data.total;
        }else {
          this.$message.error('操作失败')
        }

      })
    },
    reset(){
      this.startTime=null
      this.endTime=null
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize=val
      this.loadPost()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNum=val
      this.loadPost()
    }
  },
  beforeMount() {
    this.loadPost();
  }
}

</script>
<style scoped>

</style>