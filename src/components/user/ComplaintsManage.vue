<template>
  <div style="margin-left: 5px; margin-top: 5px">
    <div style="margin-bottom:5px;">
      <el-select v-model='status' placeholder="请选择投诉状态" style="margin-left: 5px" @keyup.enter.native="loadPost">
        <el-option
            v-for="item in statuses"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>
      <el-button type="primary" style="margin-left: 5px" @click="add">投诉申请</el-button>
    </div>

    <el-table :data="tableData" :header-cell-style="{background:'#f2f5fc' ,color:'#555555'}" border>
      <!-- 序号列 -->
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="applicantName" label="申请人姓名" />
      <el-table-column prop="applicantPhone" label="申请人电话"/>
      <el-table-column prop="status" label="状态" >
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.status ==='待处理' ? 'info' : 'success'"
              disable-transitions>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="投诉申请事由" width="180"/>
      <el-table-column prop="result" label="处理结果" width="180"/>
      <el-table-column prop="createTime" label="创建时间" width="180"/>

      <el-table-column prop="operate" label="操作" width="460" >
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="processComplaint(scope.row)" v-if="user.roleId==='管理员'">去处理</el-button>
          <el-button size="mini" @click="update(scope.row)" >编辑</el-button>
          <el-popconfirm
              confirm-button-text='好的'
              cancel-button-text='不用了'
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              style="margin-left: 5px"
              @confirm="del(scope.row)"
          >
            <el-button size="mini" type="danger" slot="reference" v-if="user.roleId==='管理员'">删除</el-button>
          </el-popconfirm>
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

    <el-dialog
        :title="dialogTitle"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="ID" prop="id" style="display: none;">
          <el-col :span="20">
            <el-input v-model="form.id"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="申请人">
          <el-col :span="20">
            <el-input disabled v-model="form.applicantName" ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="投诉申请事由" prop="reason">
          <el-col :span="20">
            <el-input
                type="textarea"
                v-model="form.reason"
                placeholder="请输入内容">
            </el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
        title="投诉申请处理"
        :visible.sync="processComplaintDialogVisible"
        width="30%"
        center>
      <el-form ref="processComplaintForm" :rules="processComplaintRules" :model="processComplaintForm" label-width="120px">
        <el-form-item label="ID" prop="id" style="display: none;">
          <el-col :span="20">
            <el-input v-model="processComplaintForm.id"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="处理结果" prop="result">
          <el-col :span="20">
            <el-input
                type="textarea"
                v-model="processComplaintForm.result"
                placeholder="请输入内容">
            </el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="processComplaintDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doProcessComplaint">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name:'complaintsManage',
  data(){
    const user = JSON.parse(sessionStorage.getItem('cur-user'));
    return {
      user,
      tableData: [],
      pageNum: 1,
      pageSize: 10,
      total: 0,
      status: null,
      statuses: [
        {
          value: '待处理',
          label: '待处理'
        }, {
          value: '已处理',
          label: '已处理'
        }
      ],
      dialogTitle:'',
      centerDialogVisible:false,
      form:{
        id:'',
        reason:'',
        applicantId : user.id,
        applicantName:user.name
      },
      rules: {
        reason: [
          {required: true, message: '投诉申请事由不能为空', trigger: 'blur'}
        ],
      },
      processComplaintDialogVisible:false,
      processComplaintForm:{
        id:'',
        result:'',
      },
      processComplaintRules:{
        result: [
          {required: true, message: '处理结果不能为空', trigger: 'blur'}
        ],
      },
    }
  },
  methods:{
    processComplaint(row){
      if(row.status !== '待处理'){
        this.$message.error(row.status+' 无法处理')
        return
      }
      this.processComplaintDialogVisible=true
      this.$nextTick(()=>{
        this.$refs.processComplaintForm.resetFields();
      })
      this.processComplaintForm.id = row.id
    },
    doProcessComplaint(){
      this.$axios.post(this.$httpUrl+"/complaint/process",this.processComplaintForm).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code === 200){
          this.$message.success('操作成功')
          this.processComplaintDialogVisible = false
          this.loadPost()
        }else {
          this.$message.error('操作失败, '+res.msg)
        }
      })
    },
    loadPost(){
      this.$axios.post(this.$httpUrl+"/complaints",{
        "pageNum":this.pageNum,
        "pageSize":this.pageSize,
        "status":this.status,
        "curUserId":this.user.id
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
      this.status=null
    },
    saveOrUpdate(){
      this.$refs.form.validate((valid) => {
        if (valid) {
          if(this.form.id){
            //修改
            this.doUpdate()
          }else {
            //新增
            this.doSave()
          }
        } else {
          this.$message.error("错误提交");
          return false;
        }
      });
    },
    doSave(){
      this.$axios.post(this.$httpUrl+"/complaint",this.form).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code === 200){
          this.$message.success('操作成功')
          this.centerDialogVisible = false
          this.loadPost()
        }else {
          this.$message.error('操作失败 '+res.msg)
        }
      })
    },
    doUpdate(){
      this.$axios.put(this.$httpUrl+"/complaint",this.form).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code === 200){
          this.$message.success('操作成功')
          this.centerDialogVisible = false
          this.loadPost()
        }else {
          this.$message.error('操作失败')
        }
      })
    },
    resetForm(){
      this.$refs.form.resetFields()
    },
    add(){
      this.centerDialogVisible = true
      this.dialogTitle = '投诉申请'
      this.$nextTick(()=>{
        this.resetForm();
      })
    },
    update(row){
      if(row.status !== '待处理'){
        this.$message.error(row.status+' 无法修改')
        return
      }
      this.centerDialogVisible = true
      this.dialogTitle = '修改投诉申请'
      this.$nextTick(()=>{
        this.form.id = row.id
        this.form.applicantId = this.user.id
        this.form.reason = row.reason
      })
    },
    del(row){
      this.$axios.delete(this.$httpUrl+"/complaint/"+row.id).then(res=>res.data).then(res=>{
        if(res.code === 200){
          this.$message.success('操作成功')
          this.loadPost()
        }else {
          this.$message.error('操作失败')
        }
      })
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
    this.loadPost()
  }
}
</script>
<style scoped>

</style>