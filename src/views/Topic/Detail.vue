<template>
  <div class="Topic_Detail" ref="detailDom">
    <div>
      <p>{{ post.title }}</p>
      <p>{{ post.content }}</p>
      <!--      <p>{{ post.created_time | formatDate }}/{{ post.views }}</p>-->
    </div>
    <br />
    <br />
    <br />
    <ul class="replies" v-if="data.replies">
      <li v-for="(item, index) in data.replies" :key="index">
        <p>
          <!--          {{ item }}-->
          id： {{ item.id }}
          <br />
          回复时间：{{ formatDate(item.updated_time) }}
          <br />
          content: {{ item.content }} {{ index + 1 }}楼
        </p>
      </li>
    </ul>
    <el-button type="primary" @click="onDelete" v-if="token"
      >删除帖子</el-button
    >
    <el-input
      id="content"
      type="textarea"
      :autosize="{ minRows: 2, maxRows: 4 }"
      placeholder="请输入内容"
      v-model="data.content"
    ></el-input>
    <el-button type="primary" @click="onSubmit">立即创建</el-button>
  </div>
</template>

<script lang="ts">
// import pagination from './Pagination'
import { url } from '../../../api'
import axios from 'axios'
import { defineComponent, onBeforeMount, reactive, ref, toRefs } from 'vue'
import { useRoute } from 'vue-router'
import { formatDate } from '@/libs/libs'

if (localStorage.getItem('token') !== '') {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
}
export default defineComponent({
  name: 'Topic_detail',
  setup() {
    const route = useRoute()
    type Data = {
      isLoading: boolean
      content: string
      post: never[]
      replies: string[]
      token: null
    }
    const data = reactive<Data>({
      isLoading: false,
      content: '',
      post: [],
      replies: [],
      token: null,
    })
    const refData = toRefs(data)
    const detailDom: any = ref()
    const getDate = () => {
      axios
        .get(url.topic + '/' + route.query.id)
        .then(response => {
          data.isLoading = false
          data.post = response.data
          data.replies = JSON.parse(response.data.replies)
          data.token = response.data.token
          // console.log(this.posts);
        })
        .catch(function(err) {
          console.log(err)
        })
    }
    const onSubmit = () => {
      const params = new URLSearchParams()
      params.append('content', data.content)
      params.append('topic_id', String(route.query.id))
      axios
        .post(url.topic_reply, params)
        .then(response => {
          data.replies.push(response.data)
          detailDom.value.querySelector('#content').value = ''
        })
        .catch(function(err) {
          console.log(err)
        })
    }
    const onDelete = () => {
      const params = new URLSearchParams()
      params.append('topic_id', String(route.query.id))
      // params.append('csrf_token', this.token)
      axios
        .post(url.topic_delete, params)
        .then(response => {
          console.log(response)
          data.replies.push(response.data)
          // this.$el.querySelector('#content').value = ''
          // data.$router.push({ path: '/' })
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
      data,
      ...refData,
      getDate,
      onSubmit,
      onDelete,
      formatDate,
      detailDom,
    }
  },
})
</script>
