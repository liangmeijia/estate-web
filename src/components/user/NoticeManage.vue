<template>
  <div style="margin-left: 5px; margin-top: 5px">
    <div style="margin-bottom:5px;">
      <el-select v-model='status' placeholder="请选择公告阅读状态" style="margin-left: 5px" @keyup.enter.native="loadPost">
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
          placeholder="选择公告发布的开始日期"
          @keyup.enter.native="loadPost"
          :format="'yyyy-MM-dd HH:mm:ss'"
          :value-format="'yyyy-MM-dd HH:mm:ss'">
      </el-date-picker>

      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>
      <el-button type="primary" style="margin-left: 5px" @click="add" v-if="user.roleId==='管理员'">发布公告</el-button>
    </div>

    <el-table :data="tableData" :header-cell-style="{background:'#f2f5fc' ,color:'#555555'}" border>
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="title" label="公告标题"/>
      <el-table-column prop="status" label="状态"/>
      <el-table-column prop="createTime" label="发布时间"/>
      <el-table-column prop="operate" label="操作" width="260">
        <template slot-scope="scope">
          <el-button size="mini" @click="detail(scope.row.id)" >详情</el-button>
          <el-popconfirm
              confirm-button-text='好的'
              cancel-button-text='不用了'
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              style="margin-left: 5px"
              @confirm="del(scope.row.id)"
              v-if="user.roleId==='管理员'"
          >
            <el-button size="mini" type="danger" slot="reference" >删除</el-button>
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
        title="发布公告"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="姓名" prop="name" >
          <el-col :span="20">
            <el-input v-model="form.name" disabled="disabled"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="公告标题" prop="title">
          <el-col :span="20">
            <el-input v-model="form.title"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-col :span="20">
            <el-input type="textarea" v-model="form.content"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doSave">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>
<script>
export default {
  name:"NoticeManage",
  data(){
    const user=JSON.parse(sessionStorage.getItem('cur-user'));
    return{
      user,
      tableData: [],
      pageNum:1,
      pageSize:10,
      total:0,

      status:null,
      statuses:[
        {
          value: '未读',
          label: '未读'
        }, {
          value: '已读',
          label: '已读'
        }
      ],
      startTime:null,
      centerDialogVisible:false,
      form:{
        name:user.name,
        title:'',
        content:'',
      },
      rules: {
        title: [
          {required: true, message: '请输入公告标题', trigger: 'blur'},
        ],
      }
    }
  },
  methods:{
    loadPost(){
      this.$axios.post(this.$httpUrl+"/notices",{
        "pageNum":this.pageNum,
        "pageSize":this.pageSize,
        "userId":this.user.id,
        "status":this.status,
        "startTime":this.startTime
      }).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code === 200){
          this.tableData = res.data.records;
          this.total = res.data.total;
        }else {
          this.$message.error('操作失败, '+res.msg)
        }

      })
    },
    reset(){
      this.status=null
      this.startTime=null
    },
    resetForm(){
      this.$refs.form.resetFields()
      // console.log(this.form.id)
    },
    add(){
      this.centerDialogVisible = true
      this.$nextTick(()=>{
        this.resetForm();
      })
    },
    doSave(){
      this.$axios.post(this.$httpUrl+"/notice",this.form).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code === 200){
          this.$message.success('操作成功')
          this.centerDialogVisible = false
          this.loadPost()
        }else {
          this.$message.error('操作失败， '+res.msg)
        }
      })
    },
    detail(id){
      console.log(id)
    },
    del(id){
      this.$axios.delete(this.$httpUrl+"/notice/"+id).then(res=>res.data).then(res=>{
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
    },
  },
  beforeMount() {
    this.loadPost();
  }
}
</script>
<style scoped>

</style>