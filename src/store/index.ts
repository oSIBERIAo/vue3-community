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
  user_id?: any
  user_username?: any
}

export interface GlobalDataProps {
  token: string
  user: UserProps
  topicsData: {
    topics?: {}
    pageCount?: number
  }
  board: object[]
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
      // localStorage.setItem('user_id', rawData.user_id)
      // localStorage.setItem('user_username', rawData.user_username)
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
      const { items, pages } = rawData
      state.topicsData = {
        topics: JSON.parse(items),
        pageCount: pages,
      }
    },
    fetchBoards(state, rawData) {
      // const { board } = rawData
      state.board = { ...rawData }
    },
    fetchTopicsByBoard(state, rawData) {
      const { items, pages } = rawData
      state.topicsData = {
        topics: JSON.parse(items),
        pageCount: pages,
      }
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
    fetchBoards({ state, commit }) {
      return asyncAndCommit(url.board, 'fetchBoards', commit)
    },
    fetchTopicsByBoard({ commit }, params) {
      return asyncAndCommit(
        url.board + '/' + params.id,
        'fetchTopicsByBoard',
        commit,
        params,
      )
    },
  },
  modules: {},
})
