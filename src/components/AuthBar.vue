<template>
  <nav class="d-flex flex-column bg-light border-end vh-100 p-3 shadow-sm" style="width: 200px;">
    
    <!-- User Section -->
    <div class="dropdown dropend mb-4">
      <button
        class="btn dropdown-toggle d-flex align-items-center w-100 p-2"
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
          width="36"
          height="36"
        />
        <div class="d-flex flex-column text-start overflow-hidden">
          <span class="fw-semibold text-truncate" style="max-width: 120px;">
            {{ logged_in ? userInfo?.firstname : 'Guest' }}
          </span>
          <small class="text-muted text-truncate" style="max-width: 120px;">
            {{ logged_in ? userInfo?.email : 'Not logged in' }}
          </small>
        </div>
      </button>

      <ul class="dropdown-menu" aria-labelledby="userDropdown">
        <template v-if="!logged_in">
          <li><router-link class="dropdown-item" to="/register">Register</router-link></li>
          <li><router-link class="dropdown-item" to="/login">Login</router-link></li>
        </template>
        <template v-else>
          <!-- View Profile Link -->
          <li v-if="userInfo && userInfo.uid">
            <router-link class="dropdown-item" :to="`/users/${userInfo?.uid}`">
              View Profile
            </router-link>
          </li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <button class="dropdown-item text-danger" @click="logout">
              <i class="bi bi-box-arrow-right me-2"></i>Logout
            </button>
          </li>
        </template>
      </ul>
    </div>

    <!-- Notifications -->
    <!-- Commented out for now -->
    <!-- <router-link
      v-if="logged_in"
      to="/notifs"
      class="btn btn-outline-secondary d-flex align-items-center justify-content-center mb-3 mx-auto"
      style="width: 42px; height: 42px;"
      title="Notifications"
    >
      <i class="bi bi-bell fs-5"></i>
    </router-link> -->

    <!-- Spacer -->
    <div class="flex-grow-1"></div>

    <!-- Brand / Logo -->
    <router-link
      to="/"
      class="btn btn-outline-primary d-flex align-items-center gap-2 mt-auto"
    >
      <i class="bi bi-chat-dots-fill fs-5"></i>
      <span class="fw-bold">ShutApp</span>
    </router-link>
  </nav>
</template>

<script setup>
import { inject, onMounted, onUnmounted } from 'vue'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { auth, db } from '@/firebase'
import { useRouter } from 'vue-router'
import { doc, updateDoc } from 'firebase/firestore'

const logged_in = inject('logged_in')
const userInfo = inject('userDoc')
const router = useRouter()

// Set user's online status on mount
onMounted(async () => {
  try {
    if (auth.currentUser) {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        isOnline: true
      });
      await router.push('/')
    }
  } catch (err) {
    console.log('Error while setting presence:', err)
  }
})

// Listen to auth state changes and update online status
onAuthStateChanged(auth, async (user) => {
  if (user === null) return;
  try {
    await updateDoc(doc(db, 'users', user.uid), {
      isOnline: true
    });
    await router.push('/')
  } catch (err) {
    console.log('Error while setting presence:', err)
  }
})

// Set user's offline status when unmounted
onUnmounted(async () => {
  try {
    if (auth.currentUser) {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        isOnline: false
      });
      await router.push('/')
    }
  } catch (err) {
    console.log('Error while setting presence:', err)
  }
})

// Logout function
const logout = async () => {
  try {
    if (auth.currentUser) {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        isOnline: false
      });
    }
    await signOut(auth)
    console.log('Logged out successfully')
    await router.push('/')
  } catch (err) {
    console.log('Error while logging out:', err)
  }
}
</script>
