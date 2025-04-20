<template>
  <nav class="nature-sidebar d-flex flex-column vh-100 p-3 shadow">
    <!-- User Info (No Dropdown) -->
    <div class="nature-user-info d-flex align-items-center mb-4 p-2">
      <div class="nature-avatar me-2">
        <img
          v-if="logged_in"
          :src="userInfo?.pdp"
          alt="profile"
          class="rounded-circle"
          width="42"
          height="42"
        />
        <div v-else class="nature-guest-avatar d-flex align-items-center justify-content-center">
          <i class="bi bi-person-fill text-light"></i>
        </div>
      </div>
      <div class="d-flex flex-column text-start overflow-hidden">
        <span class="nature-username fw-semibold text-truncate" style="max-width: 120px;">
          {{ logged_in ? userInfo?.firstname : 'Guest' }}
        </span>
        <small class="nature-useremail text-truncate" style="max-width: 120px;">
          {{ logged_in ? userInfo?.email : 'Not logged in' }}
        </small>
      </div>
    </div>

    <!-- Auth Navigation Links -->
    <div class="nature-nav-links mb-4">
      <template v-if="!logged_in">
        <router-link to="/register" class="nature-nav-item d-flex align-items-center mb-2 p-2">
          <i class="bi bi-person-plus me-3"></i>
          <span>Register</span>
        </router-link>
        <router-link to="/login" class="nature-nav-item d-flex align-items-center mb-2 p-2">
          <i class="bi bi-box-arrow-in-right me-3"></i>
          <span>Login</span>
        </router-link>
      </template>
      <template v-else>
        <router-link v-if="userInfo && userInfo.uid" :to="`/profile/${userInfo?.uid}`" class="nature-nav-item d-flex align-items-center mb-2 p-2">
          <i class="bi bi-person-circle me-3"></i>
          <span>View Profile</span>
        </router-link>
        <router-link to="/notifs" class="nature-nav-item d-flex align-items-center mb-2 p-2">
          <i class="bi bi-bell me-3"></i>
          <span>Notifications</span>
        </router-link>
        <button @click="logout" class="nature-nav-item logout-btn d-flex align-items-center mb-2 p-2 w-100 text-start">
          <i class="bi bi-box-arrow-right me-3 text-warning"></i>
          <span class="text-warning">Logout</span>
        </button>
      </template>
    </div>

    <!-- Spacer -->
    <div class="flex-grow-1 nature-spacer"></div>

    <!-- Brand / Logo -->
    <router-link
      to="/"
      class="nature-logo-btn btn d-flex align-items-center gap-2 mt-auto"
    >
      <i class="bi bi-chat-heart-fill fs-5"></i>
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

onMounted(async () => {
  try {
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      isOnline: true
    });
    await router.push('/')
  } catch (err) {
    console.log('Error while setting presence:', err)
  }
})

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
});

onUnmounted(async () => {
  try {
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      isOnline: false
    });
    await router.push('/')
  } catch (err) {
    console.log('Error while setting presence:', err)
  }
});

const logout = async () => {
  try {
    await updateDoc(doc(db, 'users', auth.currentUser.uid), {
      isOnline: false
    });
    await signOut(auth)
    console.log('Logged out successfully')
    await router.push('/')
  } catch (err) {
    console.log('Error while logging out:', err)
  }
}
</script>

<style scoped>
/* Nature Theme CSS */
.nature-sidebar {
  background: linear-gradient(to bottom, #2c5e43, #3a7053);
  width: 240px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.nature-sidebar::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.5 0 7-3 7-3s3.5 3 7 3 7-3 7-3 3.5 3 7 3 7-3 7-3' stroke='rgba(255,255,255,0.05)' fill='none' stroke-width='2'/%3E%3C/svg%3E");
  opacity: 0.4;
  z-index: 0;
  pointer-events: none;
}

.nature-user-info {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 12px;
  color: #ffffff;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;
  overflow: hidden;
}

.nature-user-info::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 13.5C0 8.5 4 4.5 9 4.5s9 4 9 9-4 9-9 9-9-4-9-9zm9-7.5C6 6 4 8 4 11s2 5 5 5 5-2 5-5-2-5-5-5z' fill='rgba(255,255,255,0.03)' fill-rule='nonzero'/%3E%3C/svg%3E");
  opacity: 0.2;
  z-index: -1;
}

.nature-avatar {
  position: relative;
}

.nature-avatar::after {
  content: '';
  position: absolute;
  top: -2px;
  left: -2px;
  right: -2px;
  bottom: -2px;
  border-radius: 50%;
  background: linear-gradient(45deg, #8cb369, #4d7c50);
  z-index: -1;
}

.nature-guest-avatar {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4d7c50, #8cb369);
  font-size: 1.2rem;
}

.nature-username {
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.nature-useremail {
  color: rgba(255, 255, 255, 0.7);
}

.nature-nav-links {
  width: 100%;
}

.nature-nav-item {
  color: rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.05);
  margin-bottom: 0.75rem;
}

.nature-nav-item::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 50%;
  width: 6px;
  height: 6px;
  background: #8cb369;
  border-radius: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: all 0.3s ease;
}

.nature-nav-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding-left: 1rem !important;
}

.nature-nav-item:hover::before {
  opacity: 1;
  left: 8px;
}

.nature-nav-item.router-link-active {
  background: rgba(140, 179, 105, 0.3);
  color: #ffffff;
  position: relative;
  padding-left: 1rem !important;
}

.nature-nav-item.router-link-active::before {
  opacity: 1;
  left: 8px;
}

.logout-btn {
  background: none;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

.logout-btn:hover {
  background: rgba(255, 193, 7, 0.1);
}

.nature-spacer {
  position: relative;
}

.nature-spacer::after {
  content: '';
  position: absolute;
  left: 10%;
  right: 10%;
  top: 50%;
  height: 1px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.1), transparent);
}

.nature-logo-btn {
  background: rgba(140, 179, 105, 0.2);
  border: 1px solid rgba(140, 179, 105, 0.3);
  border-radius: 10px;
  color: #ffffff;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nature-logo-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: all 0.5s ease;
}

.nature-logo-btn:hover::before {
  left: 100%;
}

.nature-logo-btn:hover {
  background: rgba(140, 179, 105, 0.3);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

@media (prefers-reduced-motion: reduce) {
  .nature-logo-btn::before {
    display: none;
  }
}
</style>