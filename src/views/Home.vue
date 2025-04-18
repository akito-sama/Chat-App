<template>
    <div class="container-fluid vh-100 overflow-hidden">
      <div class="row h-100">
        <!-- Sidebar -->
        <div class="col-4 col-md-3 bg-light border-end p-3 overflow-auto">
          <NavSection @chat-selected="selectedChat = $event" />
        </div>
  
        <!-- Main chat area -->
        <div class="col-8 col-md-9 p-3 overflow-auto">
          <MessageList
            v-if="selectedChat"
            :group-i-d="selectedChat"
            :user-i-d="user?.uid"
          />
          <div v-else class="text-muted text-center mt-5">
            Select a chat to start messaging.
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import NavSection from "@/components/NavSection.vue";
  import MessageList from "@/components/MessageList.vue";
  import { ref, inject } from "vue";
  
  let selectedChat = ref(null);
  let user = inject("userDoc");
  </script>
  