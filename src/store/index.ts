import { createStore, Commit } from 'vuex'
import axios, { AxiosRequestConfig } from 'axios'
import { url } from '../../api'

export interface ImageProps {
  _id?: string
  url?: string
  createdAt?: string
  fitUrl?: string
}

export interface UserProps {
  isLogin: boolean
  nickName?: string
  _id?: string
  column?: string
  email?: string
  avatar?: ImageProps
  description?: string
  username?: string
  user_id?: string
  user_username?: string
}

export interface TopicsData {
  items?: string
  pages: number
  page: number
  board: number
  per_page: number
}
export interface GlobalDataProps {
  token: string
  user: UserProps
  topicsData: {
    [key: string]: TopicsData
  }
  board: object[]
  topic: {
    [key: string]: any
  }
}

const asyncAndCommit = async (
  url: string,
  mutationName: string,
  commit: Commit,
  config: AxiosRequestConfig = { method: 'get' },
  extraData?: any,
) => {
  const { data } = await axios(url, config)
  if (extraData) {
    commit(mutationName, { data, extraData })
  } else {
    commit(mutationName, data)
  }
  return data
}

export const store = createStore<GlobalDataProps>({
  state: {
    token: localStorage.getItem('token') || '',
    user: { isLogin: false },
    topicsData: {},
    board: [],
    topic: {},
  },
  mutations: {
    login(state, rawData) {
      console.log('rawData', rawData)
      const { token } = rawData
      state.token = token
      state.user = { isLogin: true, ...rawData }
      axios.defaults.headers.common.Authorization =
        'Basic ' + btoa(rawData.token + ':')
      localStorage.setItem('token', 'Basic ' + btoa(rawData.token + ':'))
      // TODO 改服务器token
    },
    logout(state) {
      state.token = ''
      state.user = { isLogin: false }
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    },
    fetchCurrentUserProfile(state, rawData) {
      state.user = { isLogin: true, ...rawData }
    },
    fetchTopics(state, rawData) {
      const { page, board } = rawData
      state.topicsData[board] = {
        ...state.topicsData[board],
        [page]: { ...rawData },
      }
    },
    fetchTopicById(state, rawData) {
      const { id } = rawData
      state.topic[id] = { ...rawData }
      console.log('state.topic[id] ', state.topic[id])
    },
    fetchBoards(state, rawData) {
      state.board = { ...rawData }
    },
    fetchTopicsByBoard(state, rawData) {
      const { page, board } = rawData
      state.topicsData[board] = {
        ...state.topicsData[board],
        [page]: { ...rawData },
      }
    },
    submitTopicReply(state, rawData) {
      const id = rawData.topic_id
      const replies = JSON.parse(state.topic[id].replies)
      replies.push(rawData)
      state.topic[id].replies = JSON.stringify(replies)
    },
    deleteTopicById(state, rawData) {
      const { extraData } = rawData
      const id = extraData.data.get('topic_id')
      delete state.topic[id]
    },
    updateTopic(state, rawData) {
      const { extraData } = rawData
      const id = extraData.data.get('topic_id')
      delete state.topic[id]
    },
    addTopic(state, rawData) {
      console.log('rawDatarawData---addTopic', rawData)
      const { id } = rawData
      state.topic[id] = { ...rawData }
      state.topicsData = {}
    },
    // addBoard(state, rawData) {
    //   console.log('rawDatarawData---addBoard', rawData)
    //   console.log('addBoard', rawData)
    // },
  },
  actions: {
    login({ commit }, payload) {
      return asyncAndCommit(url.token, 'login', commit, {
        method: 'post',
        data: payload,
      })
    },
    logout({ commit }) {
      commit('logout')
    },
    loginAndFetch({ dispatch }, loginData) {
      return dispatch('login', loginData).then(() => {
        return dispatch('fetchCurrentUserProfile')
      })
    },
    fetchCurrentUserProfile({ commit }) {
      return asyncAndCommit(url.profile, 'fetchCurrentUserProfile', commit)
    },
    fetchTopics({ state, commit }, params) {
      return asyncAndCommit(url.topic, 'fetchTopics', commit, params)
    },
    fetchTopicById({ state, commit }, payload) {
      const id = payload
      if (!state.topic[id]) {
        return asyncAndCommit(
          url.topic + '/' + payload,
          'fetchTopicById',
          commit,
        )
      }
    },
    fetchBoards({ state, commit }) {
      if (state.board.length == 0) {
        return asyncAndCommit(url.board, 'fetchBoards', commit)
      }
    },
    fetchTopicsByBoard({ state, commit }, params) {
      const board = params.id
      const page = params.params.page
      console.log('state.topicsData', state.topicsData[board])
      if (!state.topicsData[board]) {
        console.log('state.topicsData[board]', state.topicsData[board])
        console.log('state.topicsData', state.topicsData[1])
      }
      return asyncAndCommit(
        url.board + '/' + params.id,
        'fetchTopicsByBoard',
        commit,
        params,
      )
    },
    submitTopicReply({ commit }, params) {
      params = { method: 'post', data: params }
      return asyncAndCommit(url.topic_reply, 'submitTopicReply', commit, params)
    },
    deleteTopicById({ state, commit }, params) {
      params = { method: 'post', data: params }
      state.topicsData = {}
      return asyncAndCommit(
        url.topic_delete,
        'deleteTopicById',
        commit,
        params,
        params,
      )
    },
    updateTopic({ commit }, params) {
      params = { method: 'post', data: params }
      console.log('updateTopic!')
      return asyncAndCommit(
        url.topic_update,
        'updateTopic',
        commit,
        params,
        params,
      )
    },
    addTopic({ commit }, params) {
      params = { method: 'post', data: params }
      console.log('updateTopic!')
      return asyncAndCommit(url.topic_add, 'addTopic', commit, params, params)
    },
    addBoard({ commit }, params) {
      params = { method: 'post', data: params }
      console.log('addBoard!')
      return asyncAndCommit(url.board_add, 'addBoard', commit, params, params)
    },
  },
  getters: {
    getTopicbyId: state => (id: number) => {
      return state.topic[id]
    },
    getBoards: state => {
      return state.board
    },
  },
  modules: {},
})
