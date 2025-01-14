<template>
  <el-menu
      default-active="/Home"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      style="height: 100vh;"
      :collapse="isCollapse"
      :collapse-transition="false"
      router
  >
   <el-menu-item index="/Home">
     <i class="el-icon-s-home"></i>
     <span  slot="title">首页</span>
   </el-menu-item>

    <el-menu-item :index="'/'+item.menuClick" v-for="(item,i) in menus" :key="i">
      <i :class="item.menuIcon"></i>
      <span slot="title">{{item.menuName}}</span>
    </el-menu-item>

  </el-menu>
</template>
<script>
  export default {
    name: "asideComponent",
    data() {
      return {
        // menus:[
        //   {
        //     menuClick:'Admin',
        //     menuIcon:'el-icon-s-custom',
        //     menuName:'管理员管理'
        //   },{
        //     menuClick:'User',
        //     menuIcon:'el-icon-user-solid',
        //     menuName:'用户管理'
        //   }
        // ]
      };
    },
    computed:{
      "menus": {
        get(){
          return this.$store.state.menus
        }
      }
    },
    props:{
      isCollapse:Boolean
    }
  };
</script>
<style scoped>

</style>