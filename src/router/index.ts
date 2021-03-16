import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import Home from "../views/Home.vue";
import Admin from '../views/Admin.vue'
import Header from '../components/Header.vue'

const AdminRouter: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Topic',
    components: {
      header: Header,
      main: () => import('../views/Topic/Topic.vue'),
    },
  },
  {
    path: '/',
    name: 'Home',
    components: {
      header: Header,
      main: Admin,
    },
  },
  {
    path: '/vue',
    name: 'vue',
    components: {
      header: Header,
      main: () => import('../views/Home.vue'),
    },
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
  {
    path: '/signup',
    name: 'Signup',
    components: {
      header: Header,
      main: () => import('../views/Login/Signup.vue'),
    },
  },
  {
    path: '/signin',
    name: 'Signin',
    components: {
      header: Header,
      main: () => import('../views/Login/Signin.vue'),
    },
  },
  {
    path: '/user_profile',
    name: 'profile',
    components: {
      header: Header,
      main: () => import('../views/Topic/Profile.vue'),
    },
  },
  {
    path: '/topic',
    name: 'topic',
    components: {
      header: Header,
      main: () => import('../views/Topic/Topic.vue'),
    },
  },
]

const TopicRouter: Array<RouteRecordRaw> = [
  {
    path: '/topic/detail',
    name: 'topic_detail',
    components: {
      header: Header,
      main: () => import('../views/Topic/Detail.vue'),
    },
  },
  {
    path: '/topic/new',
    name: 'topic_new',
    components: {
      header: Header,
      main: () => import('../views/Topic/New.vue'),
    },
  },
]

let routes: Array<RouteRecordRaw> = []
routes = routes.concat(AdminRouter)
routes = routes.concat(TopicRouter)
console.log('routes', routes)

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
