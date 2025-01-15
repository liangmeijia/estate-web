<template>
  <div style="margin-left: 5px; margin-top: 5px">
    <div style="margin-bottom:5px;">
      <el-input v-model='position' placeholder="车位位置" style="width: 200px"
                suffix-icon="el-icon-search"
                @keyup.enter.native="loadPost">
      </el-input>
      <el-select v-model='type' placeholder="请选择车位类型" style="margin-left: 5px" @keyup.enter.native="loadPost">
        <el-option
            v-for="item in types"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model='status' placeholder="请选择车位状态" style="margin-left: 5px" @keyup.enter.native="loadPost">
        <el-option
            v-for="item in statuses"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>

      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>
      <el-button type="primary" style="margin-left: 5px" @click="add" v-if="user.roleId==='管理员'">新增</el-button>
    </div>
    <el-table :data="tableData" :header-cell-style="{background:'#f2f5fc' ,color:'#555555'}" border>
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="position" label="车位位置" width="200"/>
      <el-table-column prop="type" label="类型" width="100">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.type ==='标准车位' ? 'info':
              (scope.row.type ==='微型车位'?'primary':'success')"
              disable-transitions>{{scope.row.type}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="price" label="价格(元)"/>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.status ==='使用中' ? 'success' : 'danger'"
              disable-transitions>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="户主"/>
      <el-table-column prop="startTime" label="生效开始日期"/>
      <el-table-column prop="endTime" label="生效截至日期"/>

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
      <el-form ref="form" :rules="rules" :model="form" label-width="120px">
        <el-form-item label="ID" prop="id" style="display: none;">
          <el-col :span="20">
            <el-input v-model="form.id"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="车位位置" prop="position">
          <el-col :span="20">
            <el-input v-model="form.position"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="类型">
          <el-col :span="20">
            <el-radio-group v-model="form.type">
              <el-radio label="标准车位">标准车位</el-radio>
              <el-radio label="微型车位">微型车位</el-radio>
              <el-radio label="大车位">大车位</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-col :span="20">
            <el-input v-model="form.price"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="状态">
          <el-col :span="20">
            <el-radio-group v-model="form.status">
              <el-radio label="未使用">未使用</el-radio>
              <el-radio label="使用中">使用中</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="业主" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="开始生效日期" prop="startTime">
          <el-date-picker
              v-model="form.startTime"
              type="datetime"
              placeholder="选择日期时间"
              :format="'yyyy-MM-dd HH:mm:ss'"
              :value-format="'yyyy-MM-dd HH:mm:ss'">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="截至生效日期" prop="endTime">
          <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="选择日期时间"
              :format="'yyyy-MM-dd HH:mm:ss'"
              :value-format="'yyyy-MM-dd HH:mm:ss'">
          </el-date-picker>
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
  name:'houseComponent',
  data(){
    return{
      user: JSON.parse(sessionStorage.getItem('cur-user')),
      tableData: [],
      pageNum:1,
      pageSize:10,
      total:0,
      position:null,
      type:null,
      types:[
        {
          value: '标准车位',
          label: '标准车位'
        }, {
          value: '微型车位',
          label: '微型车位'
        }, {
          value: '大车位',
          label: '大车位'
        }
      ],
      status:null,
      statuses:[
        {
          value: '未使用',
          label: '未使用'
        }, {
          value: '使用中',
          label: '使用中'
        }
      ],
      dialogTitle:'',
      centerDialogVisible:false,
      form:{
        id:'',
        position:'',
        type:'',
        price:'',
        status:'未使用',
        name:'',
        startTime:'',
        endTime:'',
      },
      rules: {
        position: [
          {required: true, message: '请输入车位位置', trigger: 'blur'}
        ],
        type: [
          {required: true, message: '请选择车位类型', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '车位价格不能为空', trigger: 'blur'},
        ],
        status: [
          {required: true, message: '请选择车位状态', trigger: 'blur'},
        ]
      }
    }
  },
  methods:{
    loadPost(){
      this.$axios.post(this.$httpUrl+"/parks",{
        "pageNum":this.pageNum,
        "pageSize":this.pageSize,
        "position":this.position,
        "type":this.type,
        "status":this.status
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
      this.position=null
      this.type=null
      this.status=null
    },
    resetForm(){
      this.$refs.form.resetFields()
    },
    add(){
      this.centerDialogVisible = true
      this.dialogTitle = '新增车位'
      this.$nextTick(()=>{
        this.resetForm();
      })
    },
    update(row){
      this.centerDialogVisible = true
      this.dialogTitle = '修改车位'
      this.$nextTick(()=>{
        this.form.id = row.id
        this.form.position = row.position
        this.form.type = row.type
        this.form.price = row.price
        this.form.status = row.status
        this.form.name = row.name
        this.form.startTime = row.startTime
        this.form.endTime = row.endTime
      })
    },
    doSave(){
      this.$axios.post(this.$httpUrl+"/park",this.form).then(res=>res.data).then(res=>{
        if(res.code === 200){
          this.$message.success('操作成功')
          this.centerDialogVisible = false
          this.loadPost()
        }else {
          this.$message.error('操作失败')
        }
      })
    },
    doUpdate(){
      this.$axios.put(this.$httpUrl+"/park",this.form).then(res=>res.data).then(res=>{
        if(res.code === 200){
          this.$message.success('操作成功')
          this.centerDialogVisible = false
          this.loadPost()
        }else {
          this.$message.error('操作失败')
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
    del(id){
      this.$axios.delete(this.$httpUrl+"/park/"+id).then(res=>res.data).then(res=>{
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
    this.loadPost();
  }
}
</script>
<style scoped>

</style>