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
    <!-- 遍历菜单 -->
    <template v-for="(item,i) in menuTree">
      <!-- 一级菜单 -->
      <el-submenu v-if="item.children && item.children.length" :key="i" :index="String(i)">
        <template slot="title">
          <i :class="item.menuIcon"></i>
          <span>{{ item.menuName }}</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item v-for="(child,j) in item.children" :key="j" :index="'/' + child.menuClick">{{ child.menuName }}</el-menu-item>
      </el-submenu>

      <!-- 无子菜单 -->
      <el-menu-item v-else :index="'/' + item.menuClick" :key="i">
        <i :class="item.menuIcon"></i>
        <span slot="title">{{ item.menuName }}</span>
      </el-menu-item>
    </template>

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
      "menuTree": {
        get(){
          return this.$store.state.menuTree
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