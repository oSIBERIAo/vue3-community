<template>
  <div class="Topic">
    <!--    <div class="loading" v-if="isLoading">-->
    <!--      &lt;!&ndash;      <img src="../assets/loading.gif" alt />&ndash;&gt;-->
    <!--    </div>-->
    <div class="posts" v-else>
      <ul>
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
        <li v-for="post in data.posts">
          <span>{{ post.content }}</span>
          <a class="user_avatar">
            <!--            <img :src="getImgUrl(post.user_id)" alt="" />-->
          </a>
          <a class="topic_title">
            <!--            <router-link-->
            <!--              :to="{-->
            <!--                name: 'topic_detail',-->
            <!--                params: {-->
            <!--                  id: post.id,-->
            <!--                },-->
            <!--              }"-->
            <!--              >{{ post.title }}</router-link-->
            <!--            >-->
          </a>
          <!--          <span>{{ post.updated_time | formatDate }} / {{ post.views }}</span>-->
        </li>
      </ul>
      <div id="sidebar">
        <div class="panel">
          <div class="inner">
            <!--            <a href="/topic/detail/new" class="create_topic_btn">-->
            <!--              <router-link-->
            <!--                :to="{-->
            <!--                  name: 'topic_new',-->
            <!--                }"-->
            <!--                >发布话题</router-link-->
            <!--              >-->
            <!--              &lt;!&ndash; <span class="span-success">发布话题</span> &ndash;&gt;-->
            <!--            </a>-->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { url } from '../../../api'
import axios from 'axios'
import { defineComponent, onBeforeMount, reactive, ref } from 'vue'
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
      posts: [],
      postpage: 1,
      board: null,
    })
    const getTopicDate = () => {
      axios
        .get(url.topic)
        .then(res => {
          console.log('data', data)
          console.log('res', res)
          data.posts = res.data
        })
        .catch(err => {
          console.log(err)
        })
    }
    const getBoardDate = () => {
      axios
        .get(url.board)
        .then(res => {
          console.log('data-getBoardDate', data)
          console.log('res', res)
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
          console.log('response.data', response.data)
          data.posts = response.data
        })
        .catch(function(err) {
          console.log(err)
        })
    }
    const getImgUrl = userid => {
      return url.host + '/' + 'static/img/' + userid + '.png'
    }
    return {
      data,
      changeBoard,
      getImgUrl,
    }
  },
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
img {
  width: 30px;
  height: 30px;
}
.Topic {
  background-color: #e1e1e1;
}
.posts {
  margin-top: 10px;
}

.Topic img {
  height: 30px;
  width: 30px;
  vertical-align: middle;
}

.topic_title ul {
  list-style: none;
  width: 100%;
  max-width: 1344px;
  margin: 0 auto;
}

ul li:not(:first-child) {
  padding: 9px;
  font-size: 15px;
  font-family: 'Helvetica Neue', 'Luxi Sans', 'DejaVu Sans', Tahoma,
    'Hiragino Sans GB', STHeiti, sans-serif !important;
  font-weight: 400;
  background-color: white;
  color: #333;
  border-top: 1px solid #f0f0f0;
}

li:not(:first-child):hover {
  background: #f5f5f5;
}

li:last-child:hover {
  background: white;
}

li span {
  line-height: 30px;
}

.allcount {
  width: 70px;
  display: inline-block;
  text-align: center;
  font-size: 12px;
}

.reply_count {
  color: #9e78c0;
  font-size: 14px;
}

.put_good,
.put_top {
  background: #80bd01;
  padding: 2px 4px;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -o-border-radius: 3px;
  color: #fff;
  font-size: 12px;
  margin-right: 10px;
}

.topiclist-tab {
  background-color: #e5e5e5;
  color: #999;
  padding: 2px 4px;
  border-radius: 3px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  -o-border-radius: 3px;
  font-size: 12px;
  margin-right: 10px;
}

.last_reply {
  text-align: right;
  min-width: 50px;
  display: inline-block;
  white-space: nowrap;
  float: right;
  color: #778087;
  font-size: 12px;
}

.toobar {
  height: 40px;
  background-color: #f5f5f5;
}

.toobar span {
  font-size: 14px;
  color: #80bd01;
  line-height: 40px;
  margin: 0 10px;
  cursor: pointer;
}

.toobar span:hover {
  color: #9e78c0;
}

a {
  text-decoration: none;
  color: black;
}

a:hover {
  text-decoration: underline;
}

.loading {
  text-align: center;
  padding-top: 300px;
}

.user_avatar img,
.user_big_avatar img {
  width: 30px;
  height: 30px;
  border-radius: 3px;
}
</style>
