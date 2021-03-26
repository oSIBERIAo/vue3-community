<template>
  <div class="TopicContainer">
    <!--    <div class="loading" v-if="isLoading">-->
    <!--      &lt;!&ndash;      <img src="../assets/loading.gif" alt />&ndash;&gt;-->
    <!--    </div>-->
    <!--    <div class="topics" v-else>-->
    <div class="topics">
      <ul class="board">
        <li>
          <div class="toobar">
            <span @click="changeBoard(0)">
              全部
            </span>
            <span
              v-for="(item, index) in data.board"
              :key="index"
              @click="changeBoard(item.id)"
            >
              {{ item.content }}
            </span>
          </div>
        </li>
      </ul>
      <ul class="topicList">
        <li class="topic" v-for="topic in data.topics" :key="topic.id">
          <div>
            <a class="user_avatar">
              <img :src="getImgUrl(topic.user_id)" alt="" />
            </a>
            <a class="topic_title">
              <router-link
                :to="{
                  name: 'topic_detail',
                  params: {
                    id: topic.id,
                  },
                  query: { id: topic.id },
                }"
                >{{ topic.title }}</router-link
              >
            </a>
            <!--          <span>{{ topic.content }}</span>-->
          </div>
          <span class="views">
            {{ formatDate(topic.updated_time) }} / {{ topic.views }}浏览
          </span>
        </li>
      </ul>
    </div>
    <div class="newTopic">
      <a>
        <router-link
          :to="{
            name: 'topic_new',
          }"
          >发布话题</router-link
        >
      </a>
    </div>
  </div>
</template>

<script>
import { url } from '../../../api'
import axios from 'axios'
import { defineComponent, onBeforeMount, reactive, ref } from 'vue'
import { formatDate } from '@/libs/libs'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

if (localStorage.getItem('token') !== '') {
  axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
}

export default defineComponent({
  name: 'Topic',
  setup() {
    const data = reactive({
      isLoading: false,
      topics: [],
      postpage: 1,
      board: null,
    })
    const getTopicDate = () => {
      axios
        .get(url.topic)
        .then(res => {
          console.log('getTopicDate', res.data)
          data.topics = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
    const getBoardDate = () => {
      axios
        .get(url.board)
        .then(res => {
          data.board = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
    onBeforeMount(() => {
      console.log('onBeforeMount')
      getTopicDate()
      getBoardDate()
    })
    const changeBoard = id => {
      axios
        .get(url.board + '/' + id)
        .then(response => {
          data.topics = response.data
          console.log('board---topics', response.data)
        })
        .catch(err => {
          console.log(err)
        })
    }
    const getImgUrl = userid => {
      return url.host + '/' + 'static/head/' + (userid % 10) + '.png'
    }
    return {
      data,
      changeBoard,
      getImgUrl,
      formatDate,
    }
  },
})
</script>
<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
img {
  width: 30px;
  height: 30px;
}
.TopicContainer {
  //background-color: #e1e1e1;
  box-shadow: 0 2px 20px 2px #dddddd47;
  border: 1px solid #f1f1f1;
  border-radius: 7px;
  margin-left: 60px;
  margin-right: 60px;
  margin-top: 40px;
  //max-width: 70%;
  overflow: hidden;
  .topics {
    background: white;
  }
  .topicList {
    li {
      display: flex;
      //padding: 9px;
      font-size: 15px;
      font-weight: 400;
      background-color: white;
      //color: #333;
      border-bottom: 1px solid #f0f0f0;
    }
    .topic {
      //margin-top: 20px;
      padding: 6px 10px 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      div {
        display: flex;
        align-items: center;
        .user_avatar {
          img {
            width: 46px;
            height: 46px;
            border-radius: 3px;
            //border: 1px solid #f1f1f1;
          }
        }
        .topic_title {
          a {
            color: #778087;
          }
          padding-left: 10px;
          font-weight: bold;
        }
      }
      .views {
        font-size: 10px;
        padding-right: 10px;
      }
    }
  }
  .toobar {
    margin: 0;
    padding: 8px 0;
    overflow: hidden;
    border-bottom: 1px solid #f1f1f1;
    //background: #f5f5f5;
    font-size: 16px;
    color: #757575;
    line-height: 60px;
    text-indent: 31px;
    box-shadow: 0 2px 20px 2px #dddddd47;
    display: flex;
    justify-content: flex-start;
    span {
      font-size: 16px;
      color: #4d5d70;
      line-height: 40px;
      cursor: pointer;
      font-weight: bold;
    }
    span:hover {
      color: #9e78c0;
    }
  }
  .newTopic {
    padding: 10px;
    box-shadow: 0 2px 20px 2px #dddddd47;
    text-align: center;
    a {
      color: #778087;
      font-weight: bold;
    }
  }
  a {
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
}

.loading {
  text-align: center;
  padding-top: 300px;
}
</style>
