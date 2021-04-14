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
  },
  mutations: {
    // login(state) {
    //   state.user = { ...state.user, isLogin: true, username: 'gua' }
    // },
    login(state, rawData) {
      console.log('rawData', rawData)
      const { token } = rawData
      state.token = token
      state.user = { isLogin: true, ...rawData }
      // localStorage.setItem('token', token)
      axios.defaults.headers.common.Authorization =
        'Basic ' + btoa(rawData.token + ':')
      localStorage.setItem('token', 'Basic ' + btoa(rawData.token + ':'))
      // localStorage.setItem('user_id', rawData.user_id)
      // localStorage.setItem('user_username', rawData.user_username)
      console.log('111', state)
    },
    logout(state) {
      state.token = ''
      state.user = { isLogin: false }
      localStorage.removeItem('token')
      delete axios.defaults.headers.common.Authorization
    },
    fetchCurrentUserProfile(state, rawData) {
      console.log('fetchCurrentUserProfile', rawData)
      state.user = { isLogin: true, ...rawData }
      console.log('fetchCurrentUserProfile-state.user', state.user)
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
      // console.log('111')
      return dispatch('login', loginData).then(() => {
        // console.log('222')
        return dispatch('fetchCurrentUserProfile')
      })
    },
    fetchCurrentUserProfile({ commit }) {
      return asyncAndCommit(url.profile, 'fetchCurrentUserProfile', commit)
    },
  },
  modules: {},
})
