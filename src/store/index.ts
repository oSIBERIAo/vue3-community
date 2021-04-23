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
      const key = 'board' + board + 'page' + page
      state.topicsData[key] = { ...rawData }
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
      const key = 'board' + board + 'page' + page
      state.topicsData[key] = { ...rawData }
    },
    submitTopicReply(state, rawData) {
      const id = rawData.topic_id
      const replies = JSON.parse(state.topic[id].replies)
      replies.push(rawData)
      state.topic[id].replies = JSON.stringify(replies)
    },
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
      const key = 'board' + params.id + 'page' + params.params.page
      if (!state.topicsData[key]) {
        return asyncAndCommit(
          url.board + '/' + params.id,
          'fetchTopicsByBoard',
          commit,
          params,
        )
      }
    },
    submitTopicReply({ commit }, params) {
      params = { method: 'post', data: params }
      return asyncAndCommit(url.topic_reply, 'submitTopicReply', commit, params)
    },
  },
  getters: {
    getTopicsbyIdPage: state => (id: number, page: number) => {
      const key = 'board' + id + 'page' + page
      return state.topicsData[key]
    },
    getTopicbyId: state => (id: number) => {
      return state.topic[id]
    },
  },
  modules: {},
})
