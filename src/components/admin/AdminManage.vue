<template>
  <div style="margin-left: 5px; margin-top: 5px">
    <div style="margin-bottom:5px;">
      <el-input v-model='menuName' placeholder="请输入菜单名称" style="width: 200px"
                suffix-icon="el-icon-search"
                @keyup.enter.native="loadPost"
      ></el-input>
      <el-select v-model='menuLevel' placeholder="请选择菜单级别" style="margin-left: 5px" @keyup.enter.native="loadPost">
        <el-option
            v-for="item in menuLevels"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model='menuRight' placeholder="请选择菜单权限" style="margin-left: 5px" @keyup.enter.native="loadPost">
        <el-option
            v-for="item in menuRights"
            :key="item.value"
            :label="item.label"
            :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" style="margin-left: 5px" @click="loadPost">查询</el-button>
      <el-button type="info" @click="reset">重置</el-button>
<!--      <el-button type="primary" style="margin-left: 5px" @click="add" v-if="user.roleId==='管理员'">新增</el-button>-->
    </div>

    <el-table :data="tableData" :header-cell-style="{background:'#f2f5fc' ,color:'#555555'}" border>
      <!-- 序号列 -->
      <el-table-column type="index" label="序号" width="80" />
      <el-table-column prop="menuName" label="菜单名称" />
      <el-table-column prop="menuLevel" label="菜单级别"/>

      <el-table-column prop="menuParentName" label="父级菜单名" />
      <el-table-column prop="menuRightName" label="菜单权限"/>

      <el-table-column prop="operate" label="操作" width="260" v-if="user.roleId==='管理员'">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="updateMenuRight(scope.row)" >修改权限</el-button>
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
        <el-form-item label="权限" rop="menuRight">
          <el-checkbox-group v-model="form.menuRight">
            <el-checkbox label="管理员">管理员</el-checkbox>
            <el-checkbox label="业主">业主</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doUpdateMenuRight">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  name:'adminComponent',
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem('cur-user')),
      tableData: [],
      pageNum:1,
      pageSize:10,
      total:0,
      menuName:'',
      menuLevel:null,
      menuLevels:[
        {
          value: '1',
          label: '1级'
        }, {
          value: '2',
          label: '2级'
        }
      ],
      menuRight:null,
      menuRights:[
        {
          value: '0',
          label: '管理员'
        }, {
          value: '1',
          label: '业主'
        }
      ],
      dialogTitle:'修改菜单权限',
      centerDialogVisible:false,
      form:{
        id:'',
        menuRight:[],
      },
      rules: {
        menuRight: [
          {required: true, message: '请选择菜单权限', trigger: 'blur'},
        ],
      }
    };
  },
  methods:{
    doUpdateMenuRight(){
      if(!this.form.menuRight.length > 0){
        this.$message.error('请选择权限')
        return
      }

      const newForm = {
        id : this.form.id,
        menuRight:  this.form.menuRight.join(',')
      };
      this.$axios.put(this.$httpUrl+"/updateMenu",newForm).then(res=>res.data).then(res=>{
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
    updateMenuRight(row){
      //console.log(row.menuRightName)
      this.centerDialogVisible = true;
      this.$nextTick(()=>{
        this.form.id = row.id
        this.form.menuRight = row.menuRightName.split(",")
      })
    },
    reset(){
      this.menuName=''
      this.menuLevel=null
      this.menuRight=null
    },
    loadPost(){
      this.$axios.post(this.$httpUrl+"/allMenu",{
        "pageNum":this.pageNum,
        "pageSize":this.pageSize,
        "menuName":this.menuName,
        "menuLevel":this.menuLevel,
        "menuRight":this.menuRight
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