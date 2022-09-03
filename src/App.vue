<template>
  <div id="app">
    <nav class="nav_top" @click="navigateTo">用户管理</nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name:'app',
  data() {
    return {
      
    }
  },
  methods: {
    navigateTo(){
      this.$router.push('/adminManagement')
    }
  },
}
</script>

<style lang="scss">
html {
  font-size: 16px;
}
body {
  padding: 0;
  margin: 0;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;

  .nav_top {
    width: 100%;
    height: 100px;
    background-color: #409eff;
    color: white;
    font-size: 1.5rem;
    text-align: center;
    line-height: 100px;
  }
}
</style>
