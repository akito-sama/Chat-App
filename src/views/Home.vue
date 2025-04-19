<template>
  <!-- Main App View if logged in -->
  <div class="container-fluid vh-100 overflow-hidden" v-if="logged_in">
    <div class="row h-100">
      <!-- Sidebar -->
      <div class="col-4 col-md-3 bg-light border-end p-3 overflow-auto">
        <NavSection @chat-selected="onChatSelected" />
      </div>

      <!-- Main Chat Area -->
      <div class="col-8 col-md-9 p-0 d-flex flex-column" style="height: 100vh;">
        <div v-if="selectedChat" class="flex-grow-1 overflow-auto">
          <MessageList
            :key="selectedChat"
            :groupID="selectedChat"
            :userID="user?.uid"
          />
        </div>
        <div v-else class="d-flex flex-column justify-content-center align-items-center text-muted mt-5 flex-grow-1">
          <i class="bi bi-chat-dots fs-1 mb-3"></i>
          <p class="fs-5">Select a chat to start messaging.</p>
        </div>

        <MessageBar v-if="selectedChat" :group-i-d="selectedChat" class="border-top" />
      </div>
    </div>
  </div>

  <!-- Friendly message if not logged in -->
  <div v-else class="d-flex flex-column justify-content-center align-items-center text-muted vh-100 text-center px-3">
    <i class="bi bi-door-closed fs-1 mb-4"></i>
    <h2 class="mb-2">Welcome to ShutApp 👊</h2>
    <p class="fs-5">Please log in to start chatting with your friends and groups.</p>
    <router-link to="/login" class="btn btn-primary mt-3">
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
