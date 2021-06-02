<template>
  <div class="TopicContainer" v-if="data.topic !== null">
    <div class="topics">
      <ul class="board">
        <li>
          <div class="toobar">
            <span @click="changeBoard(0)">
              全部
            </span>
            <span
              v-for="(item, index) in board"
              :key="index"
              @click="changeBoard(item.id)"
            >
              {{ item.content }}
            </span>
          </div>
        </li>
      </ul>
      <ul class="topicList">
        <li v-for="topic in JSON.parse(data.topic.items)" :key="topic.id">
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
          </div>
          <span class="views">
            {{ formatDate(topic.updated_time) }} / {{ topic.views }}浏览
          </span>
        </li>
      </ul>
    </div>
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next"
        :page-count="data.topic.pages"
        :current-page="Number(data.topic.page)"
        @current-change="changePage"
      >
      </el-pagination>
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
import { defineComponent, onBeforeMount, ref, computed, reactive } from 'vue'
import { formatDate } from '../../libs/libs'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default defineComponent({
  name: 'Topic',
  setup() {
    const store = useStore()
    const router = useRouter()
    const currentBoardId = ref(
      Number(router.currentRoute.value.query.board) || 0,
    )
    const currentPage = ref(router.currentRoute.value.query.page || 1)

    const data = reactive({
      topic: null,
    })
    const board = computed(() => store.state.board)

    const getImgUrl = userid => {
      return url.host + '/' + 'head/' + (userid % 10) + '.png'
    }
    const changeBoard = id => {
      const payload = {
        id: id,
        params: {
          page: 1,
        },
      }
      currentBoardId.value = id
      store.dispatch('fetchTopicsByBoard', payload).then(() => {
        data.topic = store.state.topicsData[currentBoardId.value][1]
        router.push({
          query: { board: currentBoardId.value, page: 1 },
        })
        currentPage.value = 1
      })
    }
    const changePage = page => {
      const payload = {
        id: currentBoardId.value,
        params: {
          page: page,
        },
      }
      store.dispatch('fetchTopicsByBoard', payload).then(() => {
        data.topic = store.state.topicsData[currentBoardId.value][page]
        router.push({
          query: { board: currentBoardId.value, page: page },
        })
        currentPage.value = page
      })
    }
    onBeforeMount(() => {
      changePage(currentPage.value)
      store.dispatch('fetchBoards')
    })

    return {
      changeBoard,
      getImgUrl,
      formatDate,
      changePage,
      board,
      currentPage,
      currentBoardId,
      data,
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
      font-size: 15px;
      font-weight: 400;
      background-color: white;
      justify-content: space-between;
      padding: 2px 20px;
      border-bottom: 1px solid #f0f0f0;
      div {
        display: flex;
        align-items: center;
        a {
          color: #4d5d70;
          font-size: 16px;
          font-weight: 600;
        }
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
        display: flex;
        align-items: center;
      }
    }
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
  .pagination {
    padding: 20px;
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
