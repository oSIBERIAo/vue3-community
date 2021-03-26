<template>
  <div class="Topic_Detail" ref="detailDom">
    <div class="topic">
      <div class="topic_title">{{ data.topic.title }}</div>
      <!--      <div class="topic_content">{{ data.topic.content }}</div>-->
      <v-md-preview
        class="topic_content"
        :text="data.topic.content"
      ></v-md-preview>
      {{ text }}
      <!--      <v-md-preview v-bind="text"></v-md-preview>-->
      <!--            <p>{{ formatDate(topic.created_time) }}/{{ post.views }}</p>-->
      <el-button type="primary" @click="onDelete" v-if="judgeAuthor">
        删除帖子
      </el-button>
      <el-button type="primary" @click="onEditor" v-if="judgeAuthor">
        编辑帖子
      </el-button>
    </div>
    <br />
    <br />
    <br />
    <ul class="replies" v-if="data.replies">
      <li class="reply" v-for="(item, index) in data.replies" :key="index">
        <a class="user_avatar">
          <img :src="getImgUrl(item.user_id)" alt="" />
        </a>
        <div class="reply_content">
          <span>{{ item.content }}</span>
          <span class="updated_time">
            {{ index + 1 }}楼 回复时间：{{ formatDate(item.updated_time) }}
          </span>
        </div>
      </li>
      <li class="content">
        <el-input
          id="content"
          type="textarea"
          :autosize="{ minRows: 8, maxRows: 50 }"
          placeholder="请输入内容"
          v-model="data.content"
        ></el-input>
        <el-button type="primary" @click="onSubmit">立即回复</el-button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
// import pagination from './Pagination'
import { url } from '../../../api'
import axios from 'axios'
import {
  defineComponent,
  onBeforeMount,
  reactive,
  ref,
  toRefs,
  computed,
} from 'vue'
import { useRoute } from 'vue-router'
import { formatDate } from '@/libs/libs'
import router from '@/router'

if (localStorage.getItem('token') !== '') {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
}
export default defineComponent({
  name: 'topic_detail',
  data() {
    return {
      text: '',
    }
  },
  setup() {
    const route = useRoute()
    type Data = {
      isLoading: boolean
      content: string
      topic: never[]
      replies: string[]
      token: null
      userId: number
      markdown: string
    }
    const data = reactive<Data>({
      isLoading: false,
      content: '',
      topic: [],
      replies: [],
      token: null,
      userId: -1,
      markdown: 'test~~~~~haha',
    })
    const refData = toRefs(data)
    const detailDom: any = ref()
    const getDate = () => {
      axios
        .get(url.topic + '/' + route.query.id)
        .then(response => {
          data.isLoading = false
          data.topic = response.data
          data.replies = JSON.parse(response.data.replies)
          data.token = response.data.token
          data.userId = response.data.user_id
          console.log('response', response)
        })
        .catch(function(err) {
          console.log(err)
        })
    }
    const getImgUrl = (userid: number) => {
      return url.host + '/' + 'static/head/' + (userid % 10) + '.png'
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
    const judgeAuthor = computed(() => {
      return data.userId == Number(localStorage.getItem('user_id'))
    })
    const onDelete = () => {
      const params = new URLSearchParams()
      params.append('topic_id', String(route.query.id))
      axios
        .post(url.topic_delete, params)
        .then(response => {
          console.log(response)
          data.replies.push(response.data)
          router.push('/')
        })
        .catch(function(err) {
          console.log(err)
        })
    }
    const onEditor = () => {
      router.push('/topic/new?id=' + route.query.id)
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
      onEditor,
      formatDate,
      getImgUrl,
      detailDom,
      judgeAuthor,
    }
  },
})
</script>
<style scoped lang="scss">
.Topic_Detail {
  color: #4d5d70;
  .topic {
    box-shadow: 0 2px 20px 2px #dddddd47;
    border: 1px solid #f1f1f1;
    border-radius: 7px;
    margin-left: 60px;
    margin-right: 60px;
    margin-top: 40px;
    //max-width: 70%;
    overflow: hidden;
    text-align: center;
    .topic_title {
      margin: 0;
      padding: 4px 0;
      overflow: hidden;
      border-bottom: 1px solid #f1f1f1;
      font-size: 16px;
      text-indent: 31px;
      box-shadow: 0 2px 20px 2px #dddddd47;
      color: #4d5d70;
      line-height: 40px;
      cursor: pointer;
      font-weight: bold;
      display: flex;
      justify-content: flex-start;
    }
    .topic_content {
      margin: 0;
      padding: 20px 30px 30px;
      overflow: hidden;
      border-bottom: 1px solid #f1f1f1;
      //font-size: 16px;
      //text-indent: 30px;
      box-shadow: 0 2px 20px 2px #dddddd47;
      color: #4d5d70;
      text-align: justify;
      line-height: 30px;
    }
    button {
      margin: 10px 10px;
      color: #4d5d70;
      background-color: #f1f1f1;
      border: #f1f1f1;
    }
  }
  .replies {
    box-shadow: 0 2px 20px 2px #dddddd47;
    border: 1px solid #f1f1f1;
    border-radius: 7px;
    margin-left: 60px;
    margin-right: 60px;
    margin-top: 40px;
    overflow: hidden;
    padding: 20px 0 0 0;
    .reply {
      display: flex;
      padding: 6px 20px;
      border-bottom: 1px solid #f1f1f1;
      .user_avatar {
        img {
          width: 46px;
          height: 46px;
          border-radius: 3px;
          //border: 1px solid #f1f1f1;
        }
      }
      .reply_content {
        display: flex;
        flex-direction: column;
        align-items: start;
        padding: 0 0 0 30px;
        width: 100%;
        text-align: justify;
        line-height: 30px;
        .updated_time {
          display: flex;
          width: 100%;
          justify-content: flex-end;
          font-weight: bold;
          font-size: 10px;
        }
      }
    }
    .content {
      padding: 30px 20px 30px 90px;
      button {
        margin: 30px 0 20px 0;
        color: #4d5d70;
        background-color: #f1f1f1;
        border: 1px solid #f1f1f1;
      }
    }
  }
}
.topic {
}
</style>
