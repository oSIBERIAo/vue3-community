<template>
  <div id="app">
    <router-view name="header"></router-view>
    <router-view name="main" id="main"></router-view>
    <br />
    <br />
    <br />
  </div>
</template>

<style lang="scss">
#app {
  //font-family: Avenir, Helvetica, Arial, sans-serif;
  font-family: Apercu, 'PingFang SC', 'Microsoft YaHei', Arial, SimHei,
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  //text-align: center;
  color: #2c3e50;
}

#app {
  //font-family: Avenir, Helvetica, Arial, sans-serif;
  .main {
    max-width: 800px;
  }
}

* {
  //outline: 1px dashed rgb(191, 171, 171, 0.1);
}

* {
  margin: 0;
  padding: 0;
}

ul li {
  list-style: none;
  padding: 0;
  margin: 0;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
