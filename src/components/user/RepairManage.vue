<template>
  <div style="margin-left: 5px; margin-top: 5px">
    <div style="margin-bottom:5px;">
      <el-select v-model='status' placeholder="请选择维修状态" style="margin-left: 5px" @keyup.enter.native="loadPost">
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
          placeholder="选择维修开始日期"
          @keyup.enter.native="loadPost"
          :format="'yyyy-MM-dd HH:mm:ss'"
          :value-format="'yyyy-MM-dd HH:mm:ss'">
      </el-date-picker>
      <el-date-picker
          v-model="endTime"
          type="datetime"
          placeholder="选择维修的截至日期"
          @keyup.enter.native="loadPost"
          :format="'yyyy-MM-dd HH:mm:ss'"
          :value-format="'yyyy-MM-dd HH:mm:ss'">
      </el-date-picker>

      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>
      <el-button type="primary" style="margin-left: 5px" @click="add" v-if="user.roleId==='管理员'">维修申请</el-button>
    </div>

    <el-table :data="tableData" :header-cell-style="{background:'#f2f5fc' ,color:'#555555'}" border>
      <!-- 序号列 -->
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="applicantName" label="申请人姓名" />
      <el-table-column prop="applicantPhone" label="申请人电话"/>
      <el-table-column prop="address" label="地址"/>
      <el-table-column prop="building" label="栋"/>
      <el-table-column prop="unit" label="单元" />
      <el-table-column prop="number" label="门牌号"/>
      <el-table-column prop="status" label="状态" >
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.status ==='待维修' ? 'info' : (scope.row.status ==='维修中' ? 'primary':'success')"
              disable-transitions>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reason" label="申请事由" width="180"/>

      <el-table-column prop="operate" label="操作" width="260" >
        <template slot-scope="scope">
          <el-button type="warning" size="mini" @click="processRepair(scope.row)" v-if="user.roleId==='管理员'">去处理</el-button>
          <el-button size="mini" @click="update(scope.row)" >编辑</el-button>
          <el-popconfirm
              confirm-button-text='好的'
              cancel-button-text='不用了'
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              style="margin-left: 5px"
              @confirm="del(scope.row.id)"
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
            <el-input disabled v-model="this.user.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-col :span="20">
            <el-input v-model="form.address"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="栋" prop="building">
          <el-col :span="20">
            <el-input v-model="form.building"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="单元" prop="unit">
          <el-col :span="20">
            <el-input v-model="form.unit"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="门牌号" prop="number">
          <el-col :span="20">
            <el-input v-model="form.number"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="申请事由" prop="reason">
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
  </div>

</template>
<script >

export default {
  name:"RepairMange",
  data() {
    const user = JSON.parse(sessionStorage.getItem('cur-user'));
    return {
      user,
      tableData: [],
      pageNum:1,
      pageSize:10,
      total:0,
      startTime:null,
      endTime:null,
      status:null,
      statuses:[
        {
          value: '待维修',
          label: '待维修'
        }, {
          value: '维修中',
          label: '维修中'
        }, {
          value: '维修完成',
          label: '维修完成'
        }
      ],
      dialogTitle:'',
      centerDialogVisible:false,
      form:{
        id:'',
        address:'',
        building:'',
        unit:'',
        number:'',
        reason:'',
        applicantId : user.id
      },
      rules: {
        address: [
          {required: true, message: '地址不能为空', trigger: 'blur'}
        ],
        building: [
          {required: true, message: '请输入栋', trigger: 'blur'}
        ],
        unit: [
          {required: true, message: '请输入单元', trigger: 'blur'}
        ],
        number: [
          {required: true, message: '请输入门牌号', trigger: 'blur'}
        ],
        reason: [
          {required: true, message: '申请事由不能为空', trigger: 'blur'}
        ],
      },

    }
  },
  methods: {
    loadPost(){
      this.$axios.post(this.$httpUrl+"/repairs",{
        "pageNum":this.pageNum,
        "pageSize":this.pageSize,
        "status":this.status,
        "startTime":this.startTime,
        "endTime":this.endTime,
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
      this.startTime=null
      this.endTime=null
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
          this.$message({
            message: '错误提交',
            type: 'error'
          });
          return false;
        }
      });
    },
    doSave(){
      this.$axios.post(this.$httpUrl+"/repair",this.form).then(res=>res.data).then(res=>{
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
      this.$axios.put(this.$httpUrl+"/repair",this.form).then(res=>res.data).then(res=>{
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
      this.dialogTitle = '维修申请'
      this.$nextTick(()=>{
        this.resetForm();
      })
    },
    del(id){
      this.$axios.delete(this.$httpUrl+"/repair/"+id).then(res=>res.data).then(res=>{
        if(res.code === 200){
          this.$message.success('操作成功')
          this.loadPost()
        }else {
          this.$message.error('操作失败')
        }
      })
    },
    update(row){
      if(row.status !== '待维修'){
        this.$message.error('无法修改')
        return
      }
      this.centerDialogVisible = true
      this.dialogTitle = '修改维修申请'
      this.$nextTick(()=>{
        this.form.id = row.id
        this.form.address = row.address
        this.form.building = row.building
        this.form.unit = row.unit
        this.form.number = row.number
        this.form.reason = row.reason
      })
    },
    processRepair(row){
      console.log(row)
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