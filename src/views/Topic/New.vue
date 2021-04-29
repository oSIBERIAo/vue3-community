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

      <el-select v-model="data.boardId" clearable placeholder="请选择">
        <!--        <el-option-->
        <!--          v-for="item in data.options"-->
        <!--          :key="item.value"-->
        <!--          :label="item.label"-->
        <!--          :value="item.value"-->
        <!--        ></el-option>-->
        <el-option
          v-for="item in board"
          :key="item.id"
          :label="item.content"
          :value="item.id"
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
      <el-button v-if="!route.query.id" type="primary" @click="onSubmit"
        >立即创建</el-button
      >
      <el-button v-else type="primary" @click="onUpdate">更新保存</el-button>
    </div>

    {{ data }}
    <!--    {{ data.title }}: {{ data.content }}-->
    <!--    {{ board }}-->
  </div>
</template>
<script lang="ts">
// import pagination from './Pagination'
import { url } from '../../../api'
import axios from 'axios'
import { computed, defineComponent, onBeforeMount, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '../../libs/libs'
import { ElMessage } from 'element-plus'
import { useStore } from 'vuex'
import router from '../../router'

if (localStorage.getItem('token') !== '') {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
}
export default defineComponent({
  name: 'topic_new',
  setup() {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const board = computed(() => {
      const b = store.getters.getBoards
      const a = [{ id: -1, content: '全部' }]
      for (const i in b) {
        a.push(b[i])
      }
      return a || undefined
    })
    const topic = computed(
      () => store.getters.getTopicbyId(route.query.id) || undefined,
    )

    type Data = {
      title: string
      content: string
      data: null
      board: any
      options: never[]
      boardId: string
      isLoading: boolean
      input: string
    }
    const data = reactive<Data>({
      title: '',
      content: '',
      data: null,
      board: board,
      options: [],
      boardId: '',
      isLoading: false,
      input: '# hello',
    })
    const onSubmit = () => {
      console.log('submit!')
      const params = new URLSearchParams()
      params.append('title', data.title)
      params.append('content', data.content)
      params.append('boardId', data.boardId)

      store
        .dispatch('addTopic', params)
        .then(res => {
          console.log('res', res)
          router.push('/topic/detail?id=' + res.id)
        })
        .catch(function(err) {
          console.log(err)
        })
    }
    const onUpdate = () => {
      const params = new URLSearchParams()
      params.append('title', data.title)
      params.append('content', data.content)
      params.append('board_id', data.boardId)
      params.append('topic_id', String(route.query.id))

      store
        .dispatch('updateTopic', params)
        .then(() => {
          router.push('/topic/detail?id=' + route.query.id)
        })
        .catch(function(err) {
          console.log(err)
        })
    }
    onBeforeMount(() => {
      console.log('onBeforeMount')
      store.dispatch('fetchBoards')
      store.dispatch('fetchTopicById', route.query.id).then(() => {
        const { board_id, content, title } = topic.value
        data.content = content
        data.boardId = board_id
        data.title = title
      })
    })
    return {
      data,
      onSubmit,
      onUpdate,
      formatDate,
      board,
      topic,
      route,
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
