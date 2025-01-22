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
      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>
      <el-button type="primary" style="margin-left: 5px" @click="add" v-if="user.roleId==='管理员'">新增</el-button>
      <el-button type="warning" style="margin-left: 5px" @click="balancePayment">余额充值</el-button>
    </div>
    <el-table :data="tableData" :header-cell-style="{background:'#f2f5fc' ,color:'#555555'}" border>
      <!-- 序号列 -->
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="address" label="地址" width="200"/>
      <el-table-column prop="building" label="栋" width="80"/>
      <el-table-column prop="unit" label="单元" width="80"/>
      <el-table-column prop="number" label="门牌号" width="80"/>
      <el-table-column prop="name" label="户主" width="80"/>
      <el-table-column prop="amountName" label="名称" width="60"/>
      <el-table-column prop="price" label="价格(元)" width="80"/>
      <el-table-column prop="costDetails" label="详情"/>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="scope">
          <el-tag
              :type="scope.row.status ==='待缴费' ? 'info':(scope.row.status ==='缴费成功'?'success':'danger')"
              disable-transitions>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="operate" label="操作" width="260" >
        <template slot-scope="scope">
          <el-button size="mini" @click="billPayment(scope.row)" type="success">缴费</el-button>
          <el-button size="mini" @click="update(scope.row)" v-if="user.roleId==='管理员'">编辑</el-button>
          <el-popconfirm
              confirm-button-text='好的'
              cancel-button-text='不用了'
              icon="el-icon-info"
              icon-color="red"
              title="确定删除吗？"
              style="margin-left: 5px"
              @confirm="del(scope.row)"
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
        <el-form-item label="地址" prop="address">
          <el-col :span="20">
            <el-input v-model="form.address" :disabled="form.amountName === '维修费用'"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="栋" prop="building">
          <el-col :span="20">
            <el-input v-model="form.building" :disabled="form.amountName === '维修费用'"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="单元" prop="unit">
          <el-col :span="20">
            <el-input v-model="form.unit" :disabled="form.amountName === '维修费用'"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="门牌号" prop="number">
          <el-col :span="20">
            <el-input v-model="form.number" :disabled="form.amountName === '维修费用'"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="费用名称" prop="amountName">
          <el-col :span="20">
            <el-input v-model="form.amountName" :disabled="form.amountName === '维修费用'"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-col :span="20">
            <el-input v-model="form.price" :disabled="form.amountName === '维修费用'"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="费用详情" prop="costDetails">
          <el-col :span="20">
            <el-input
                type="textarea"
                v-model="form.costDetails"
                placeholder="请输入内容"
                :disabled="form.amountName === '维修费用'">
            </el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="状态" prop="status" >
          <el-col :span="20">
            <el-radio-group v-model="form.status" disabled>
              <el-radio label="待缴费">待缴费</el-radio>
              <el-radio label="缴费成功">缴费成功</el-radio>
              <el-radio label="缴费失败">缴费失败</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
        title="余额充值"
        :visible.sync="balancePaymentDialogVisible"
        width="30%"
        center>
      <el-form ref="balancePaymentForm" :rules="balancePaymentRules" :model="balancePaymentForm" label-width="120px">
        <el-form-item label="充值方式" prop="method">
          <el-col :span="20">
            <el-radio-group v-model="balancePaymentForm.method">
              <el-radio label="微信">微信</el-radio>
              <el-radio label="支付宝">支付宝</el-radio>
              <el-radio label="银行卡">银行卡</el-radio>
            </el-radio-group>
          </el-col>
        </el-form-item>
        <el-form-item label="充值金额" prop="balance">
          <el-col :span="20">
            <el-input v-model="balancePaymentForm.balance"></el-input>
          </el-col>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="balancePaymentDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doBalancePayment">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name:"userComponent",
  data(){
    // 从 sessionStorage 获取当前用户
    const user = JSON.parse(sessionStorage.getItem('cur-user'));
    return{
      user,
      tableData: [],
      pageNum:1,
      pageSize:10,
      total:0,
      address:null,
      building:null,
      unit:null,
      number:null,
      amountName:null,
      status:null,
      statuses:[
        {
          value: '待缴费',
          label: '待缴费'
        }, {
          value: '缴费成功',
          label: '缴费成功'
        }, {
          value: '缴费失败',
          label: '缴费失败'
        }
      ],
      dialogTitle:'',
      centerDialogVisible:false,
      balancePaymentDialogVisible:false,
      form:{
        id:'',
        address:'',
        building:'',
        unit:'',
        number:'',
        amountName:'',
        price:0.0,
        costDetails:'',
        status:'待缴费'
      },
      balancePaymentForm:{
        userId:user.id,
        balance:0.0,
        method:'微信'
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
        amountName: [
          {required: true, message: '费用名称不能为空', trigger: 'blur'}
        ],
        price: [
          {required: true, message: '费用价格不能为空', trigger: 'blur'}
        ],
      },
      balancePaymentRules:{
        method: [
          {required: true, message: '请选择充值方式', trigger: 'blur'}
        ],
        balance: [
          {required: true, message: '请输入充值金额', trigger: 'blur'}
        ],
      }
    }
  },
  methods:{
    loadPost(){
      this.$axios.post(this.$httpUrl+"/bills",{
        "pageNum":this.pageNum,
        "pageSize":this.pageSize,
        "address":this.address,
        "building":this.building,
        "unit":this.unit,
        "number":this.number,
        "amountName":this.amountName,
        "status":this.status,
        "curUserId":this.user.id
      }).then(res=>res.data).then(res=>{
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
      this.amountName=null
      this.status=null
    },
    billPayment(row){
      const params = new URLSearchParams();
      params.append('userId', this.user.id);
      params.append('id', row.id);
      this.$axios.post(this.$httpUrl+"/bill/payment",params).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code === 200){
          this.$message.success('操作成功')
          this.centerDialogVisible = false
          this.loadPost()
          // 1. 从 sessionStorage 获取 user 对象
          let user = JSON.parse(sessionStorage.getItem('cur-user')) || {};
          // 2. 更新用户的余额
          user.balance = Number(user.balance) - Number(row.price);
          // 3. 将更新后的对象存回 sessionStorage
          sessionStorage.setItem('cur-user', JSON.stringify(user));
          // 4. 同步更新 Vue 的数据
          this.user = user;
        }else {
          this.$message.error('操作失败 '+res.msg)
          this.loadPost()
        }
      })
    },
    balancePayment(){
      this.balancePaymentDialogVisible = true
      this.$nextTick(()=>{
        this.$refs.balancePaymentForm.resetFields();
      })
    },
    doBalancePayment(){
      this.$axios.post(this.$httpUrl+"/balance/payment",this.balancePaymentForm).then(res=>res.data).then(res=>{
        console.log(res)
        if(res.code === 200){
          this.$message.success('操作成功')
          this.balancePaymentDialogVisible = false
          // 1. 从 sessionStorage 获取 user 对象
          let user = JSON.parse(sessionStorage.getItem('cur-user')) || {};
          // 2. 更新用户的余额
          user.balance = Number(this.balancePaymentForm.balance)+Number(user.balance);
          // 3. 将更新后的对象存回 sessionStorage
          sessionStorage.setItem('cur-user', JSON.stringify(user));
          // 4. 同步更新 Vue 的数据
          this.user = user;
        }else {
          this.$message.error('操作失败 '+res.msg)
        }
      })
    },
    update(row){
      if(row.status === '缴费成功'){
        this.$message.error(row.status+' 无法修改')
        return
      }
      this.centerDialogVisible = true
      this.dialogTitle = '修改账单'
      this.$nextTick(()=>{
        this.form.id = row.id
        this.form.address = row.address
        this.form.building = row.building
        this.form.unit = row.unit
        this.form.number = row.number
        this.form.amountName = row.amountName
        this.form.price = row.price
        this.form.costDetails = row.costDetails
        this.form.status = row.status
      })
    },
    resetForm(){
      this.$refs.form.resetFields()
    },
    add(){
      this.centerDialogVisible = true
      this.dialogTitle = '新增账单'
      this.$nextTick(()=>{
        this.resetForm();
      })
    },
    doSave(){
      this.$axios.post(this.$httpUrl+"/bill",this.form).then(res=>res.data).then(res=>{
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
      this.$axios.put(this.$httpUrl+"/bill",this.form).then(res=>res.data).then(res=>{
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
    del(row){
      if(row.status !== '缴费成功'){
        this.$message.error(row.status+' 无法删除')
        return
      }
      this.$axios.delete(this.$httpUrl+"/bill/"+row.id).then(res=>res.data).then(res=>{
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
    // this.loadGet();
    this.loadPost();
  }
}
</script>
<style scoped>

</style>