<template>
  <div class="header">
    <img src="../assets/logo1.png" alt="LOGO" />
    <ul>
      <!--      <li>-->
      <!--        <a href="#"><router-link to="/about">About</router-link></a>-->
      <!--      </li>-->
      <li>
        <a href="#"><router-link to="/topic">首页</router-link></a>
      </li>
      <!--      <li><a href="#">API</a></li>-->
      <!--      <li><a href="#">关于</a></li>-->
      <li>
        <a href="#"><router-link to="/user_profile">个人</router-link></a>
      </li>
      <li>
        <a href="#"><router-link to="/signup">注册</router-link></a>
      </li>
      <li>
        <a href="#"><router-link to="/signin">登陆</router-link></a>
      </li>
      <li>
        <a href="#"><router-link to="/vue">介绍</router-link></a>
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
  //background-color: rgba(16, 16, 16, 0.95);
  justify-content: space-between;
  background: #fff;
  //border: 1px solid #d9d9d9;
  box-shadow: 0 2px 20px 2px #dddddd47;
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
        color: #444;
        font-weight: bold;
      }
    }
  }
  img {
    max-width: 40px;
    max-height: 40px;
    margin: 4px 0 4px 60px;
  }
}
</style>
