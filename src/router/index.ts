import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
// import Home from "../views/Home.vue";
import Admin from '../views/Admin.vue'
import Header from '../components/Header.vue'

const routes: Array<RouteRecordRaw> = [
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
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
