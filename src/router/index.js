import { createRouter, createWebHistory } from 'vue-router'
import Home from "../views/Home.vue"
import Register from "../views/Register.vue"
import Login from "../views/Login.vue"
import Private from "../views/Private.vue"
import User from "../views/User.vue"
import Notification from "../views/Notifs.vue"
import Group from "../views/Group.vue"


const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/Login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: Login
  },
  {
    path: '/Register',
    name: 'register',
    component: Register,
  },
  {
    path: '/private/:userId',
    name: 'private',
    component: Private,
  },
  {
    path: '/group/:groupId',
    name: 'group',
    component: Group,
  },
  {
    path: '/notifs',
    name: 'notifs',
    component: Notification,
  },
  {
    path: '/users/:userId',
    name: 'users',
    component: User,
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
