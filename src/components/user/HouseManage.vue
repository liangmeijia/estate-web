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
      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>
      <el-button type="primary" style="margin-left: 5px" @click="add" v-if="user.roleId==='管理员'">新增</el-button>
    </div>
    <el-table :data="tableData" :header-cell-style="{background:'#f2f5fc' ,color:'#555555'}" border>
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="address" label="地址" />
      <el-table-column prop="building" label="栋"/>
      <el-table-column prop="unit" label="单元"/>
      <el-table-column prop="number" label="门牌号"/>
      <el-table-column prop="area" label="面积(平方米)"/>
      <el-table-column prop="price" label="房价(元)"/>
      <el-table-column prop="name" label="户主"/>
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
        <el-form-item label="面积" prop="area">
          <el-col :span="20">
            <el-input v-model="form.area"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="房价" prop="price">
          <el-col :span="20">
            <el-input v-model="form.price"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="户主" prop="name">
          <el-col :span="20">
            <el-input v-model="form.name"></el-input>
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
  name:'houseComponent',
  data(){
    return {
      user: JSON.parse(sessionStorage.getItem('cur-user')),
      tableData: [],
      pageNum:1,
      pageSize:10,
      total:0,
      address:null,
      building:null,
      unit:null,
      number:null,

      dialogTitle:'',
      centerDialogVisible:false,
      form:{
        id:'',
        address:'',
        building:'',
        unit:'',
        number:'',
        area:0.0,
        price:'',
        name:''
      },
      rules: {
        address: [
          {required: true, message: '请输入地址', trigger: 'blur'},
          {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
        ],
        building: [
          {required: true, message: '请输入栋', trigger: 'blur'},
          {min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur'}
        ],
        unit: [
          {required: true, message: '请输入单元', trigger: 'blur'},
          {min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur'}
        ],
        number: [
          {required: true, message: '请输入门牌号', trigger: 'blur'},
          {min: 1, max: 5, message: '长度在 1 到 5 个字符', trigger: 'blur'}
        ],
        area: [
          {required: true, message: '请输入房屋面积', trigger: 'blur'},
        ],
        price: [
          {required: true, message: '请输入房屋价格', trigger: 'blur'},
        ]
      }
    }
  },
  methods:{
    loadPost(){
      this.$axios.post(this.$httpUrl+"/houses",{
        "pageNum":this.pageNum,
        "pageSize":this.pageSize,
        "address":this.address,
        "building":this.building,
        "unit":this.unit,
        "number":this.number
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
      this.address=null
      this.building=null
      this.unit=null
      this.number=null
    },
    resetForm(){
      this.$refs.form.resetFields()
    },
    add(){
      this.centerDialogVisible = true
      this.dialogTitle = '新增房屋'
      this.$nextTick(()=>{
        this.resetForm();
      })
    },
    update(row){
      this.centerDialogVisible = true
      this.dialogTitle = '修改房屋'
      this.$nextTick(()=>{
        this.form.id = row.id
        this.form.address = row.address
        this.form.building = row.building
        this.form.unit = row.unit
        this.form.number = row.number
        this.form.area = row.area
        this.form.price = row.price
        this.form.name = row.name
      })
    },
    doSave(){
      this.$axios.post(this.$httpUrl+"/house",this.form).then(res=>res.data).then(res=>{
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
    doUpdate(){
      this.$axios.put(this.$httpUrl+"/house",this.form).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code === 200){
          this.$message.success('操作成功');
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
      this.$axios.delete(this.$httpUrl+"/house/"+id).then(res=>res.data).then(res=>{
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