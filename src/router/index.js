import { createRouter, createWebHistory } from 'vue-router'
import Home from "../views/Home.vue"
import Register from "../views/Register.vue"
import Login from "../views/Login.vue"
import Private from "../views/Private.vue"
import User from "../views/User.vue"
import Notification from "../views/Notifs.vue"
import CreateGroup from "../views/CreateGroup.vue"
import AddPrivateDiscussion from "../views/AddPrivateDiscussion.vue"


const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/add-private-discussion',
    name: 'addPrivateDiscussion',
    component: AddPrivateDiscussion,
  },
  {
    path: '/create-group',
    name: 'createGroup',
    component: CreateGroup
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
  },
  {
    path: '/private/:userId',
    name: 'private',
    component: Private,
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
  },
  {
    path: '/profile/:id',
    name: 'profile',
    component: () => import('../views/Profile.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
