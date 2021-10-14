<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <br />
    <HelloWorld msg="这是一个基于 Vue.js + TypeScript 搭建的论坛" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HelloWorld from '../components/HelloWorld.vue' // @ is an alias to /src

export default defineComponent({
  name: 'Home',
  components: {
    HelloWorld,
  },
})
</script>
<style scoped lang="scss">
.home {
  display: flex;
  align-items: center;
  flex-direction: column;
}
</style>
