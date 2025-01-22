<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data(){
    return{
      user: JSON.parse(sessionStorage.getItem('cur-user'))
    }
  },
  watch:{
    '$store.state.menus':{
      handler(val,old){
        //console.log(val,old)
        if(!old && this.user && this.user.id){
          this.$store.commit('setRouter',val)
        }
      },
      immediate:true
    }
  }
}
</script>

<style>
#app {
 height: 100%;
}
</style>
