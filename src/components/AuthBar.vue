<template>
  <nav class="d-flex flex-column bg-light border-end vh-100 p-3 shadow-sm" style="width: 250px;">
    <!-- Auth Dropdown -->
    <div class="dropdown dropend">
      <button
        class="btn dropdown-toggle d-flex align-items-center w-100"
        type="button"
        id="userDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img
          v-if="logged_in"
          :src="userInfo?.pdp"
          alt="pdp"
          class="rounded-circle me-2"
          width="40"
          height="40"
        />
        <span class="fw-semibold">{{ logged_in ? userInfo?.firstname : 'Guest' }}</span>
      </button>

      <ul class="dropdown-menu" aria-labelledby="userDropdown">
        <template v-if="!logged_in">
          <li><router-link class="dropdown-item" to="/register">Register</router-link></li>
          <li><router-link class="dropdown-item" to="/login">Login</router-link></li>
        </template>
        <template v-else>
          <li><router-link class="dropdown-item" to="/profile">View Profile</router-link></li>
          <li><button class="dropdown-item text-danger" @click="logout">Logout</button></li>
        </template>
      </ul>
    </div>

     <!-- Spacer -->
     <div class="flex-grow-1"></div>

    <!-- Brand -->
    <router-link to="/" class="btn btn-outline-primary mb-4 d-flex align-items-center gap-2">
      <i class="bi bi-chat-dots-fill fs-4"></i>
      <span class="fw-bold">ShutApp</span>
    </router-link>
  </nav>
</template>

<script setup>
import { inject } from 'vue'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase'
import { useRouter } from 'vue-router'

const logged_in = inject('logged_in')
const userInfo = inject('userDoc')
const router = useRouter()

const logout = async () => {
  try {
    await signOut(auth)
    console.log('Logged out successfully')
    await router.push('/')
  } catch (err) {
    console.log('Error while logging out:', err)
  }
}
</script>
