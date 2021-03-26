<template>
  <div class="Topic_New">
    <div class="title">
      <span>标题：</span>
      <el-input
        id="title"
        type="textarea"
        autosize
        placeholder="请输入内容"
        v-model="data.title"
      ></el-input>
    </div>
    <div class="board">
      <span>板块：</span>
      <el-select v-model="data.boardId" placeholder="请选择">
        <el-option
          v-for="item in data.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
    </div>
    <div class="content">
      <v-md-editor
        v-model="data.content"
        height="400px"
        @save="onUpdate"
      ></v-md-editor>
    </div>
    <div class="onSubmit">
      <el-button type="primary" @click="onSubmit">立即创建</el-button>
    </div>
    <!--    {{ data.title }}: {{ data.content }}-->
  </div>
</template>
<script lang="ts">
// import pagination from './Pagination'
import { url } from '../../../api'
import axios from 'axios'
import { defineComponent, onBeforeMount, reactive, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '../../libs/libs'
import { ElMessage } from 'element-plus'

if (localStorage.getItem('token') !== '') {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
}
export default defineComponent({
  name: 'topic_new',
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
      input: string
    }
    const data = reactive<Data>({
      title: '',
      content: '',
      data: null,
      board: null,
      options: [],
      boardId: '',
      isLoading: false,
      input: '# hello',
    })
    const getDate = () => {
      axios
        .get(url.board)
        .then(response => {
          data.board = response.data
          console.log('response.data', response.data)
          const options: any = []
          response.data.forEach((e: { id: any; content: any }) => {
            const o: any = {}
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
    const getEditorTopic = () => {
      axios
        .get(url.topic + '/' + route.query.id)
        .then(response => {
          data.title = response.data.title
          data.boardId = response.data.board_id
          data.content = response.data.content
          console.log('getEditorTopic', response)
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
          router.push(`/topic/detail?id=${response.data.id}`)
        })
        .catch(function(err) {
          console.log(err)
        })
    }
    const onUpdate = () => {
      console.log('submit!')
      const params = new URLSearchParams()
      params.append('title', data.title)
      params.append('content', data.content)
      params.append('board_id', data.boardId)
      params.append('topic_id', String(route.query.id))
      axios
        .post(url.topic_update, params)
        .then(response => {
          data.isLoading = false
          console.log(response)
          data.data = response.data
          // router.push(`/topic/detail?id=${response.data.id}`)
          ElMessage.success({
            message: '保存成功',
            type: 'success',
          })
        })
        .catch(function(err) {
          console.log(err)
        })
    }
    onBeforeMount(() => {
      console.log('onBeforeMount')
      getDate()
      if (route.query.id) {
        console.log('route.query.id', route.query.id)
        getEditorTopic()
      }
    })
    return {
      data,
      getDate,
      onSubmit,
      onUpdate,
      formatDate,
    }
  },
})
</script>
<style scoped lang="scss">
.Topic_New {
  box-shadow: 0 2px 20px 2px #dddddd47;
  border: 1px solid #f1f1f1;
  border-radius: 7px;
  margin-left: 60px;
  margin-right: 60px;
  margin-top: 40px;
  overflow: hidden;
  .title {
    display: flex;
    padding: 9px;
    font-size: 15px;
    font-weight: 400;
    background-color: white;
    border-bottom: 1px solid #f0f0f0;
    align-items: center;
    span {
      width: 60px;
      margin: 10px;
    }
  }
  .board {
    display: flex;
    padding: 9px;
    font-size: 15px;
    font-weight: 400;
    background-color: white;
    border-bottom: 1px solid #f0f0f0;
    align-items: center;
    span {
      width: 54px;
      margin: 10px;
    }
  }
  .content {
    display: flex;
    //padding: 9px;
    font-size: 15px;
    font-weight: 400;
    background-color: white;
    border-bottom: 1px solid #f0f0f0;
    align-items: center;
  }
  .onSubmit {
    text-align: center;
    button {
      margin: 10px 0;
      color: #4d5d70;
      background-color: #f1f1f1;
      border: #f1f1f1;
    }
  }
}
</style>
