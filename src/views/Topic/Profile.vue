<template>
  <div>
    <h1 v-if="data.user">用户名：{{ data.user }}</h1>
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
    <button @click="logout">退出登陆</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { url } from '../../../api'
const router = useRouter()
console.log('url', url.register)
console.log('axios', axios)
if (localStorage.getItem('token') !== '') {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
}

export default defineComponent({
  name: 'Signup',
  setup() {
    const data = reactive({
      user: '',
      imageUrl: '',
      fileType: ['image/jpeg', 'image/gif', 'image/png'],
      token: '',
    })

    const getProfileDate = () => {
      axios
        .get(url.profile)
        .then(res => {
          data.token = res.data.token
          data.user = res.data.username
          data.imageUrl = url.host + '/' + 'static/img/' + res.data.user_image
          // console.log('data', data)
        })
        .catch(err => {
          console.log(err)
        })
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
      axios
        .get(url.logout, {
          withCredentials: true,
        })
        .then(res => {
          console.log('res', res)
          router.push({ path: '/user_profile' })
          location.reload()
        })
        .catch(err => {
          console.log(err)
        })
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

<style></style>
