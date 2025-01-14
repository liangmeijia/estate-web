<template>
  <el-container style="height: 100%; border: 1px solid #eee">
    <el-aside :width="aside_wide" style="background-color: rgb(238, 241, 246);height: 100%">
     <asideComponent :isCollapse="isCollapse"></asideComponent>
    </el-aside>

    <el-container style="height: 100%;">
      <el-header style="text-align: right; font-size: 12px;height: 100%;border-bottom: rgba(169,169,169,0.3) 1px solid;">
        <headerComponent @doCollapse="collapse" :icon="icon"></headerComponent>
      </el-header>
      <el-main style="height: 100%;">
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
  import asideComponent from "@/components/Aside";
  import headerComponent from "@/components/Header"
  export default {
    name: "indexPage",
    components: {asideComponent,headerComponent},
    data(){
      return{
        isCollapse:false,
        aside_wide:"200px",
        icon:'el-icon-s-fold'
      }
    },
    methods:{
      collapse(){
        this.isCollapse = !this.isCollapse;
        if(!this.isCollapse){
          //展开
          this.aside_wide="200px"
          this.icon='el-icon-s-fold'
        }else {
          //关闭
          this.aside_wide="64px"
          this.icon='el-icon-s-unfold'
        }
      }
    }

  };
</script>
<style scoped>
  .el-header {
    //background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
  .el-main{
    padding: 0;
  }
  .el-aside {
    color: #333;
  }
</style>