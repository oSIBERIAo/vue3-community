<template>
  <div class="Profile">
    <span class="user" v-if="data.user">用户名：{{ data.user }}</span>
    <div class="uploader">
      <span>用户头像：</span>
      <el-upload
        ref="upload"
        class="avatar-uploader"
        :headers="headers"
        :action="action"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="data.imageUrl" :src="data.imageUrl" class="avatar" />
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </div>
    <el-button class="logout" @click="logout">退出登陆</el-button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onBeforeMount } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { url } from '../../../api'
import { ElMessage } from 'element-plus'
const router = useRouter()
console.log('url', url.register)
console.log('axios', axios)
if (localStorage.getItem('token') !== '') {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
}

export default defineComponent({
  name: 'Signup',
  setup() {
    const store = useStore()
    const data = reactive({
      user: '',
      imageUrl: '',
      token: '',
    })
    const user = computed(() => store.state.user)
    console.log('user', user.value)

    const getProfileDate = () => {
      data.token = user.value.token
      data.user = user.value.username
      data.imageUrl = url.host + '/' + 'static/img/' + user.value.user_image
    }
    onBeforeMount(() => {
      console.log('onBeforeMount')
      getProfileDate()
    })
    const action = computed(() => {
      return 'http://127.0.0.1:5000/v1/index/addimg'
    })
    const headers = computed(() => {
      return { Authorization: localStorage.getItem('token') }
    })
    const logout = () => {
      localStorage.removeItem('token')
      router.push('/')
    }
    const handleAvatarSuccess = (
      res: { token: string },
      file: { raw: any },
    ) => {
      data.token = res.token
      data.imageUrl = URL.createObjectURL(file.raw)
      console.log('file.raw', file.raw)
    }
    const beforeAvatarUpload = (file: { type: string; size: number }) => {
      // const isAllow_file = this.fileType.includes(file.type)
      const isAllow = data.fileType.includes(file.type)
      const isLt2M = file.size / 1024 / 1024 < 2
      // console.log('isAllow_file', isAllow_file)
      if (!isAllow) {
        // this.$message.error("上传头像图片只能是 JPG / PNG /GiF格式!");
      }
      if (!isLt2M) {
        // this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isAllow && isLt2M
    }
    return {
      store,
      data,
      logout,
      action,
      beforeAvatarUpload,
      handleAvatarSuccess,
      headers,
    }
  },
})
</script>

<style scoped lang="scss">
.Profile {
  box-shadow: 0 2px 20px 2px #dddddd47;
  border: 1px solid #f1f1f1;
  border-radius: 7px;
  margin-left: 60px;
  margin-right: 60px;
  margin-top: 40px;
  overflow: hidden;
  .user {
    display: flex;
    font-size: 15px;
    font-weight: 800;
    background-color: white;
    border-bottom: 1px solid #f0f0f0;
    padding: 10px 20px;
  }
  .uploader {
    display: flex;
    font-size: 15px;
    font-weight: 800;
    background-color: white;
    border-bottom: 1px solid #f0f0f0;
    padding: 10px 20px;
  }
  .logout {
    margin: 10px;
  }
}
</style>
