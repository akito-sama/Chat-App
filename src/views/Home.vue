// This is the main container for the Home view
<template>
  <div class="container-fluid vh-100 overflow-hidden">
    <div class="row h-100">
      <!-- Sidebar -->
      <div class="col-4 col-md-3 bg-light border-end p-3 overflow-auto">
        <NavSection @chat-selected="onChatSelected" />
      </div>

      <!-- Main chat area -->
      <div class="col-8 col-md-9 p-0 d-flex flex-column" style="height: 100vh;">
        <div v-if="selectedChat" class="flex-grow-1 overflow-auto">
          <MessageList
            :key="selectedChat"
            :groupID="selectedChat"
            :userID="user?.uid"
          />
        </div>
        <div v-else class="text-muted text-center mt-5 flex-grow-1">
          Select a chat to start messaging.
        </div>
        <MessageBar v-if="selectedChat" :group-i-d="selectedChat" class="border-top"/>
</div>
    </div>
  </div>
</template>

<script setup>
import NavSection from "@/components/NavSection.vue";
import MessageList from "@/components/MessageList.vue";
import { ref, inject } from "vue";
import MessageBar from "@/components/MessageBar.vue";

let selectedChat = ref('');
let user = inject("userDoc");

function onChatSelected(chatId) {
  selectedChat.value = chatId;
}
</script>
