<template>
  <div class="Topic_New">
    <div style="margin: 20px 0;"></div>
    <p>标题：</p>
    <el-input
      type="textarea"
      autosize
      placeholder="请输入内容"
      v-model="title"
    ></el-input>
    <div style="margin: 20px 0;"></div>
    <p>板块：</p>
    <el-select v-model="boardId" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <div style="margin: 20px 0;"></div>
    <p>内容：</p>
    <el-input
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 4 }"
      placeholder="请输入内容"
      v-model="content"
    ></el-input>
    <el-button type="primary" @click="onSubmit">立即创建</el-button>
    {{ this.title }}: {{ this.content }}
  </div>
</template>
<script lang="ts">
// import pagination from './Pagination'
import { url } from '../../../api'
import axios from 'axios'
import { defineComponent, onBeforeMount, reactive, ref, toRefs } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '@/libs/libs'

if (localStorage.getItem('token') !== '') {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
}
export default defineComponent({
  name: 'Topic_new',
  setup() {
    const route = useRoute()
    const router = useRouter()
    type Data = {
      title: string
      content: string
      data: null
      board: null
      options: never[]
      boardId: string
      isLoading: boolean
    }
    const data = reactive<Data>({
      title: '',
      content: '',
      data: null,
      board: null,
      options: [],
      boardId: '',
      isLoading: false,
    })
    const refData = toRefs(data)
    const getDate = () => {
      axios
        .get(url.board)
        .then(response => {
          data.board = response.data
          console.log('response.data', response.data)
          const options = []
          response.data.forEach(e => {
            const o = {}
            o.value = e.id
            o.label = e.content
            options.push(o)
          })
          data.options = options
          console.log('data-----', data)
        })
        .catch(function(err) {
          console.log(err)
        })
    }
    const onSubmit = () => {
      console.log('submit!')
      const params = new URLSearchParams()
      params.append('title', data.title)
      params.append('content', data.content)
      params.append('boardId', data.boardId)
      axios
        .post(url.topic_add, params)
        .then(response => {
          data.isLoading = false
          console.log(response)
          data.data = response.data
          router.push({ path: `/topic/detail?id=${response.data.id}` })
        })
        .catch(function(err) {
          console.log(err)
        })
    }
    onBeforeMount(() => {
      console.log('onBeforeMount')
      getDate()
    })
    return {
      // data,
      ...refData,
      getDate,
      onSubmit,
    }
  },
})
</script>
