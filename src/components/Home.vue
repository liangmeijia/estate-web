<template>
  <el-descriptions class="margin-top" title="个人中心" :column="3" :size="size" border>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-user"></i>
        用户名
      </template>
      {{ user.name }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-star-off"></i>
        密码
      </template>
      {{user.password}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-umbrella"></i>
        年龄
      </template>
      {{user.age}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-tickets"></i>
        性别
      </template>
      {{user.sex}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        手机号
      </template>
      {{user.phone}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-mobile-phone"></i>
        邮箱
      </template>
      {{user.email}}
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-location-outline"></i>
        角色
      </template>
<!--      <el-tag type= "warning" size="small">{{user.roleId}}</el-tag>-->
      <el-tag
          :type="user.roleId ==='管理员' ? 'warning' : 'info'"
          disable-transitions>{{user.roleId}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-location-outline"></i>
        状态
      </template>
<!--      <el-tag size="small">{{user.status}}</el-tag>-->
      <el-tag
          :type="user.status ==='正常' ? 'success' : 'danger'"
          disable-transitions>{{user.status}}</el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template slot="label">
        <i class="el-icon-wallet"></i>
        余额
      </template>
      {{user.balance}}
    </el-descriptions-item>
  </el-descriptions>
</template>

<script>
export default {
  name:'HomeComponent',
  data() {
    return {
      size: '',
      user: JSON.parse(sessionStorage.getItem('cur-user'))
    };
  }
};
</script>

<style scoped>
.user-profile {
  text-align: center;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #eee;
}
.profile-pic {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin: 20px 0;
}
.username, .user-email {
  margin: 10px 0;
}
button {
  padding: 10px 20px;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #4cae4c;
}
</style>