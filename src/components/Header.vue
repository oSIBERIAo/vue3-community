<template>
  <div class="header">
    <img src="../assets/logo.png" alt="LOGO" />
    <ul>
      <li>
        <a href="#"><router-link to="/about">About</router-link></a>
      </li>
      <li>
        <a href="#"><router-link to="/vue">Home</router-link></a>
      </li>
      <li><a href="#">API</a></li>
      <li><a href="#">关于</a></li>
      <li>
        <a href="#"><router-link to="/user_profile">个人</router-link></a>
      </li>
      <li>
        <a href="#"><router-link to="/signup">注册</router-link></a>
      </li>
      <li>
        <a href="#"><router-link to="/signin">登陆</router-link></a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Header',
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
.header {
  display: flex;
  padding: 5px;
  background-color: rgba(16, 16, 16, 0.95);
  justify-content: space-between;
  ul {
    float: right;
    list-style: none;
    margin-top: -2px;
    margin-right: 50px;
    li {
      display: inline-block;
      padding: 10px 15px;
      a {
        text-decoration: none;
        color: #ccc;
        font-size: 13px;
      }
    }
  }
  img {
    max-width: 50px;
    margin-left: 30px;
  }
}
</style>
