<template>
  <!-- Main App View if logged in -->
  <div class="nature-app-container" v-if="logged_in">
    <div class="nature-layout">
      <!-- Sidebar -->
      <div class="nature-sidebar">
        <NavSection @chat-selected="onChatSelected" />
      </div>

      <!-- Main Chat Area -->
      <div class="nature-chat-area">
        <div v-if="selectedChat" class="nature-message-container">
          <MessageList
            :key="selectedChat"
            :groupID="selectedChat"
            :userID="user?.uid"
          />
        </div>
        <div v-else class="nature-empty-state">
          <i class="bi bi-chat-dots nature-empty-icon"></i>
          <p class="nature-empty-text">Select a chat to start messaging.</p>
        </div>

        <MessageBar v-if="selectedChat" :group-id="selectedChat" />
      </div>
    </div>
  </div>

  <!-- Friendly message if not logged in -->
  <div v-else class="nature-login-container">
    <i class="bi bi-door-closed nature-login-icon"></i>
    <h2 class="nature-login-title">Welcome to ShutApp 👊</h2>
    <p class="nature-login-text">Please log in to start chatting with your friends and groups.</p>
    <router-link to="/login" class="nature-login-btn">
      Log In
    </router-link>
  </div>
</template>

<script setup>
import NavSection from "@/components/NavSection.vue";
import MessageList from "@/components/MessageList.vue";
import { ref, inject } from "vue";
import MessageBar from "@/components/MessageBar.vue";

let selectedChat = ref('');
let user = inject("userDoc");
let logged_in = inject("logged_in");

function onChatSelected(chatId) {
  selectedChat.value = chatId;
}
</script>

<style scoped>
/* Nature Theme App Layout */
.nature-app-container {
  display: flex;
  height: 100vh;
  overflow: hidden; /* Prevent horizontal overflow */
}

.nature-layout {
  display: flex;
  height: 100%;
  width: 100%; /* Ensure layout uses full width */
}

/* Sidebar styles - fixed width */
.nature-sidebar {
  width: 320px;
  min-width: 320px; /* Force minimum width */
  height: 100%;
  overflow: hidden; /* Prevent sidebar from overflowing */
  border-right: 1px solid rgba(76, 124, 80, 0.15);
  background-color: #f5f8f2;
}

/* Main chat area - takes up the remaining space */
.nature-chat-area {
  flex-grow: 1; /* Take up remaining space */
  height: 100vh;
  position: relative;
  background-color: #fafdf7;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Prevent overflow */
}

.nature-message-container {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zm-16.142 0l16.142 16.142-1.414 1.414L25.857 0h2.83zM20.143 0l16.142 16.142-1.414 1.414L18.717 2.828l-1.414-1.414L13.857 0h2.83zM14.143 0L0 14.143v-2.83L11.313 0h2.83zM2.03 0L0 2.03v-2.03h2.03zM0 8.485L0 5.657 5.657 0H2.828L0 2.828v5.657zM0 17.657l17.657-17.657h-2.83L0 14.83v2.83zM0 17.657L0 20.486l17.657-17.657H14.83L0 17.657zM0 5.657L5.657 0H2.828L0 2.828z' fill='rgba(76, 124, 80, 0.03)' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.nature-empty-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex: 1; /* Ensures it takes up available space */
  padding: 2rem;
  text-align: center;
}

.nature-empty-icon {
  font-size: 3rem;
  color: #8cb369;
  margin-bottom: 1rem;
}

.nature-empty-text {
  font-size: 1.25rem;
  color: #4d7c50;
}

/* Login screen */
.nature-login-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  padding: 1rem;
  background-color: #f5f8f2;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.627 0l.83.828-1.415 1.415L51.8 0h2.827zM5.373 0l-.83.828L5.96 2.243 8.2 0H5.374zM48.97 0l3.657 3.657-1.414 1.414L46.143 0h2.828zM11.03 0L7.372 3.657 8.787 5.07 13.857 0H11.03zm32.284 0L49.8 6.485 48.384 7.9l-7.9-7.9h2.83zm-16.142 0l16.142 16.142-1.414 1.414L25.857 0h2.83zM20.143 0l16.142 16.142-1.414 1.414L18.717 2.828l-1.414-1.414L13.857 0h2.83zM14.143 0L0 14.143v-2.83L11.313 0h2.83zM2.03 0L0 2.03v-2.03h2.03zM0 8.485L0 5.657 5.657 0H2.828L0 2.828v5.657zM0 17.657l17.657-17.657h-2.83L0 14.83v2.83zM0 17.657L0 20.486l17.657-17.657H14.83L0 17.657zM0 5.657L5.657 0H2.828L0 2.828z' fill='rgba(76, 124, 80, 0.03)' fill-rule='evenodd'/%3E%3C/svg%3E");
}

.nature-login-icon {
  font-size: 3.5rem;
  color: #4d7c50;
  margin-bottom: 1.5rem;
}

.nature-login-title {
  color: #3a603d;
  margin-bottom: 0.75rem;
}

.nature-login-text {
  font-size: 1.2rem;
  color: #555;
  max-width: 500px;
}

.nature-login-btn {
  margin-top: 1.5rem;
  background-color: #4d7c50;
  border: none;
  color: white;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.nature-login-btn:hover {
  background-color: #3a603d;
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
