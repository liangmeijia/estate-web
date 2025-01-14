<template>
  <div style="margin-left: 5px; margin-top: 5px">
    <div style="margin-bottom:5px;">
      <el-input v-model='name' placeholder="请输入用户姓名" style="width: 200px"
                suffix-icon="el-icon-search"
                @keyup.enter.native="loadPost"
      ></el-input>
      <el-select v-model='status' placeholder="请选择用户状态" style="margin-left: 5px" @keyup.enter.native="loadPost">
        <el-option
            v-for="item in statuses"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>

      <el-button type="primary" style="margin-left: 5px" @click="add">新增</el-button>
    </div>
    <el-table :data="tableData" :header-cell-style="{background:'#f2f5fc' ,color:'#555555'}" border>
      <el-table-column prop="id" label="ID" width="40">
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="120">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="180">
      </el-table-column>
      <el-table-column prop="password" label="密码" width="120">
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="60">
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="60">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.sex ==='男' ? 'info' : 'warning'"
              disable-transitions>{{scope.row.sex}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.status ==='正常' ? 'success' : 'danger'"
              disable-transitions>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话">
      </el-table-column>
      <el-table-column prop="balance" label="余额" width="60">
      </el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="success" @click="update(scope.row)">编辑</el-button>
          <el-popconfirm
              confirm-button-text='好的'
              cancel-button-text='不用了'
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              style="margin-left: 5px"
              @confirm="del(scope.row.id)"
          >
            <el-button size="mini" type="danger" slot="reference">删除</el-button>
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
        title="新增用户"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="姓名" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-col :span="20">
            <el-input v-model="form.email"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-col :span="20">
            <el-input v-model="form.password"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="年龄" prop="age">
          <el-col :span="20">
            <el-input v-model="form.age"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="性别">
          <el-col :span="20">
            <el-radio-group v-model="form.sex">
              <el-radio label="男">男</el-radio>
              <el-radio label="女">女</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="电话" prop="phone">
          <el-col :span="20">
            <el-input v-model="form.phone"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="余额" prop="balance">
          <el-col :span="20">
            <el-input v-model="form.balance"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="状态">
          <el-col :span="20">
            <el-radio-group v-model="form.status">
              <el-radio label="正常">正常</el-radio>
              <el-radio label="冻结">冻结</el-radio>
            </el-radio-group>
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
<script>
  export default {
    name:"mainComponent",
    data() {
      return {
        tableData: [],
        pageNum:1,
        pageSize:10,
        total:0,
        name:'',
        status:null,
        statuses:[
          {
            value: '正常',
            label: '正常'
          }, {
            value: '冻结',
            label: '冻结'
          }
        ],
        centerDialogVisible:false,
        form:{
          id:'',
          name:'',
          email:'',
          password:'',
          age:'',
          sex:'女',
          phone:'',
          balance:'',
          status:'正常',
          roleId:0
        },
        rules: {
          name: [
            {required: true, message: '请输入姓名', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {min: 4, max: 8, message: '长度在 4 到 8 个字符', trigger: 'blur'}
          ],
          phone: [
            {required: true, message: '手机号不能为空', trigger: 'blur'},
            {pattern:/^(13[0-9]|14[0-9]|15[0-9]|16[0-9]|17[0-9]|18[0-9]|19[0-9])\d{8}$/, message: '请输入正确的手机号', trigger: 'blur'}
          ]
        }
      }
    },
    methods:{
      del(id){
        this.$axios.delete(this.$httpUrl+"/user/"+id).then(res=>res.data).then(res=>{
          if(res.code === 200){
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.loadPost()
          }else {
            this.$message({
              message: '操作失败',
              type: 'error'
            });
          }
        })
      },
      update(row){
        this.centerDialogVisible = true
        this.$nextTick(()=>{
          this.form.id = row.id
          this.form.name = row.name
          this.form.email = row.email
          this.form.password = ''
          this.form.age = row.age
          this.form.sex = row.sex
          this.form.phone = row.phone
          this.form.balance = row.balance
          this.form.status = row.status
          this.form.roleId = row.roleId
        })
      },
      resetForm(){
        this.$refs.form.resetFields()
      },
      add(){
        this.centerDialogVisible = true
        this.$nextTick(()=>{
          this.resetForm();
        })

      },
      doSave(){
        this.$axios.post(this.$httpUrl+"/user",this.form).then(res=>res.data).then(res=>{
          console.log(res)
          if(res.code === 200){
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.centerDialogVisible = false
            this.loadPost()
          }else {
            this.$message({
              message: '操作失败',
              type: 'error'
            });
          }
        })
      },
      doUpdate(){
        this.$axios.put(this.$httpUrl+"/user",this.form).then(res=>res.data).then(res=>{
          console.log(res)
          if(res.code === 200){
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.centerDialogVisible = false
            this.loadPost()
          }else {
            this.$message({
              message: '操作失败',
              type: 'error'
            });
          }
        })
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
      loadGet(){
        this.$axios.get(this.$httpUrl+"/user/1").then(res=>res.data).then(res=>{
          console.log(res)
        })
      },
      loadPost(){
        this.$axios.post(this.$httpUrl+"/user/page",{
            "pageNum":this.pageNum,
            "pageSize":this.pageSize,
            "name":this.name,
            "status":this.status
        }).then(res=>res.data).then(res=>{
          console.log(res)
          if(res.code === 200){
            this.tableData = res.data.records;
            this.total = res.data.total;
          }else {
            this.$message({
              message: '操作失败',
              type: 'error'
            });
          }

        })
      },
      reset(){
        this.name=''
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
      // this.loadGet();
      this.loadPost();
    }

  }
</script>
<style scoped>

</style>