<template>
  <div style="margin-left: 5px; margin-top: 5px">
    <div style="margin-bottom:5px;">
      <el-input v-model='address' placeholder="地址" style="width: 200px"
                suffix-icon="el-icon-search"
                @keyup.enter.native="loadPost">
      </el-input>
      <el-input v-model='building' placeholder="栋" style="width: 200px"
                suffix-icon="el-icon-search"
                @keyup.enter.native="loadPost">
      </el-input>
      <el-input v-model='unit' placeholder="单元" style="width: 200px"
                suffix-icon="el-icon-search"
                @keyup.enter.native="loadPost">
      </el-input>
      <el-input v-model='number' placeholder="门牌号" style="width: 200px"
                suffix-icon="el-icon-search"
                @keyup.enter.native="loadPost">
      </el-input>
      <el-input v-model='amountName' placeholder="费用名称" style="width: 200px"
                suffix-icon="el-icon-search"
                @keyup.enter.native="loadPost">
      </el-input>
      <el-select v-model='status' placeholder="请选择缴费状态" style="margin-left: 5px" @keyup.enter.native="loadPost">
        <el-option
            v-for="item in statuses"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-date-picker
          v-model="startTime"
          type="datetime"
          placeholder="选择缴费的开始日期"
          @keyup.enter.native="loadPost"
          :format="'yyyy-MM-dd HH:mm:ss'"
          :value-format="'yyyy-MM-dd HH:mm:ss'">
      </el-date-picker>
      <el-date-picker
          v-model="endTime"
          type="datetime"
          placeholder="选择缴费的截至日期"
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
      <el-table-column prop="address" label="地址" width="200"/>
      <el-table-column prop="building" label="栋" width="80"/>
      <el-table-column prop="unit" label="单元" width="80"/>
      <el-table-column prop="number" label="门牌号" width="80"/>
      <el-table-column prop="amountName" label="费用名称" />
      <el-table-column prop="amount" label="缴费金额(元)" />
      <el-table-column prop="status" label="缴费状态">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.status ==='缴费成功' ? 'success':'danger'"
              disable-transitions>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="date" label="缴费日期"/>
      <el-table-column prop="name" label="缴费人"/>
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
<script >
export default {
  name:"BillRecordsManage",
  data(){
    return{
      user: JSON.parse(sessionStorage.getItem('cur-user')),
      tableData: [],
      pageNum:1,
      pageSize:10,
      total:0,
      address:null,
      building:null,
      unit:null,
      number:null,
      amountName:null,
      startTime:null,
      endTime:null,
      status:null,
      statuses:[
        {
          value: '缴费成功',
          label: '缴费成功'
        }, {
          value: '缴费失败',
          label: '缴费失败'
        }
      ]
    }
  },
  methods:{
    loadPost(){
      this.$axios.post(this.$httpUrl+"/billRecords",{
        "pageNum":this.pageNum,
        "pageSize":this.pageSize,
        "address":this.address,
        "building":this.building,
        "unit":this.unit,
        "number":this.number,
        "amountName":this.amountName,
        "startTime":this.startTime,
        "endTime":this.endTime,
        "status":this.status,
      }).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code === 200){
          this.tableData = res.data.records;
          this.total = res.data.total;
          //数据级别权限控制
          if(this.user.roleId === '业主'){
            this.tableData = this.tableData.filter(item => (item.userId === this.user.id));
          }
        }else {
          this.$message.error('操作失败')
        }

      })
    },
    reset(){
      this.address=null
      this.building=null
      this.unit=null
      this.number=null
      this.amountName=null
      this.startTime=null
      this.endTime=null
      this.status=null
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