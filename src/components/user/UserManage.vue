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
      <el-select v-model='roleId' placeholder="请选择用户角色" style="margin-left: 5px" @keyup.enter.native="loadPost">
        <el-option
            v-for="item in roleIds"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>
      <el-button type="primary" style="margin-left: 5px" @click="add" v-if="user.roleId==='管理员'">新增</el-button>
      <el-button @click="usersExport">批量导出</el-button>
      <el-upload
          class="upload-demo"
          :action= "usersImportImportUrl"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-error="handleError"
          :auto-upload="true"
          :limit="1"
          :file-list="fileList"
      >
        <el-button slot="trigger">批量导入</el-button>
      </el-upload>
    </div>
    <el-table :data="tableData" :header-cell-style="{background:'#f2f5fc' ,color:'#555555'}" border>
      <!-- 序号列 -->
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="name" label="姓名" >
      </el-table-column>
      <el-table-column prop="password" label="密码" >
      </el-table-column>
      <el-table-column prop="age" label="年龄" width="60">
      </el-table-column>
      <el-table-column prop="sex" label="性别" width="60">
      </el-table-column>
      <el-table-column prop="phone" label="电话">
      </el-table-column>
      <el-table-column prop="email" label="邮箱" width="140">
      </el-table-column>
      <el-table-column prop="balance" label="余额" >
      </el-table-column>
      <el-table-column prop="roleId" label="角色" >
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.roleId ==='管理员' ? 'warning' : 'info'"
              disable-transitions>{{scope.row.roleId}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.status ==='正常' ? 'success' : 'danger'"
              disable-transitions>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="160" v-if="user.roleId==='管理员'">
        <template slot-scope="scope">
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
        :title="dialogTitle"
        :visible.sync="centerDialogVisible"
        width="30%"
        center>
      <el-form ref="form" :rules="rules" :model="form" label-width="80px">
        <el-form-item label="ID" prop="id" style="display: none;">
          <el-col :span="20">
            <el-input v-model="form.id"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"></el-input>
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
        <el-form-item label="邮箱" prop="email">
          <el-col :span="20">
            <el-input v-model="form.email"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="余额" prop="balance">
          <el-col :span="20">
            <el-input v-model="form.balance"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="角色">
          <el-col :span="20">
            <el-radio-group v-model="form.roleId">
              <el-radio label="管理员">管理员</el-radio>
              <el-radio label="业主">业主</el-radio>
            </el-radio-group>
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
  name:"userComponent",
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem('cur-user')),
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
      roleId:null,
      roleIds:[
        {
          value: '管理员',
          label: '管理员'
        }, {
          value: '业主',
          label: '业主'
        }
      ],
      dialogTitle:'',
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
        roleId:'业主'
      },
      fileList: [], // 用于管理上传的文件列表
      autoUpload: true, // 自动上传状态
      usersImportImportUrl:this.$httpUrl+'/users/import', //批量导入的请求url
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
      this.dialogTitle = '修改用户'
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
      console.log(this.form.id)
    },
    add(){
      this.centerDialogVisible = true
      this.dialogTitle = '新增用户'
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
        "status":this.status,
        "roleId":this.roleId
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
      this.roleId=null
    },
    beforeUpload(file) {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        this.$message.error('上传文件大小不能超过 10MB!');
      }
      const isExcel =
          file.type === "application/vnd.ms-excel" || // .xls
          file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"; // .xlsx

      if (!isExcel) {
        this.$message.error("只能上传 Excel 文件！");
      }
      return isLt10M && isExcel; // 返回 true 继续上传，返回 false 取消上传
    },
    handleSuccess(response, file, fileList) {
      if(response.code === 200){
        this.$message.success('批量导入成功');
      }else {
        this.$message.error(response.msg);
      }
      console.log('执行成功:', response, file, fileList);
    },
    handleError(err, file, fileList) {
      this.$message.error('批量导入失败');
      console.error('执行失败:', err, file, fileList);
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    usersExport(){
      this.$axios({
        method: 'post',
        url: this.$httpUrl+"/users/export", // 文件下载接口
        data :{
          "pageNum":this.pageNum,
          "pageSize":this.pageSize,
          "name":this.name,
          "status":this.status,
          "roleId":this.roleId
        },
        responseType: 'blob', // 设置响应类型为 blob
      }).then(res=>{
        // 提取文件名（后端通常会在 Content-Disposition 头中返回）
        const disposition = res.headers['content-disposition'];
        const fileName = disposition ? decodeURIComponent(disposition.split(';')[1].split('filename=')[1].replace(/"/g, '')) : '用户信息.xlsx';
        // 创建 Blob 对象
        const blob = new Blob([res.data]);

        // 创建下载链接
        const downloadUrl = URL.createObjectURL(blob);

        // 创建 a 标签并触发下载
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();

        // 清理临时链接和元素
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);
        //
        this.$message({
          message: '批量导出成功',
          type: 'success'
        });
      }).catch((error) => {
          this.$message({
            message: '批量导出失败',
            type: 'error'
          });
          console.error('批量导出失败:', error);
        });

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