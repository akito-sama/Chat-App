<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-3">
      <router-link to="/create-group" class="btn btn-success">
        <i class="bi bi-plus-circle"></i>
      </router-link>
      <div class="dropdown">
        <button
          class="btn btn-outline-secondary dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
        >
          <i class="bi bi-funnel"></i>
        </button>
        <ul class="dropdown-menu">
          <li><a class="dropdown-item" href="#">Unread</a></li>
          <li><a class="dropdown-item" href="#">Groups</a></li>
          <li><a class="dropdown-item" href="#">Online Users</a></li>
        </ul>
      </div>
    </div>

    <input
      type="text"
      v-model="search"
      class="form-control mb-3"
      placeholder="Search chats..."
    />

    <div class="list-group">
      <div
        v-for="group in filtered_groups"
        :key="group.id"
        class="list-group-item list-group-item-action"
        @click="selectChat(group.id)"
        style="cursor: pointer"
      >
        <ChatItem :GroupId="group.id" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { collection, getDocs } from "firebase/firestore";
import ChatItem from "./ChatItem.vue";
import { db } from "@/firebase";
import { computed, onMounted, ref } from "vue";

let search = ref("");
let groups = ref([]);
let emit = defineEmits(["chat-selected"]);

let filtered_groups = computed(() => {
  return groups.value.filter((group) =>
    (group.groupName || "").toLowerCase().includes(search.value.toLowerCase())
  );
});

let groupsRef = collection(db, "groups");
onMounted(async () => {
  let querySnapshot = await getDocs(groupsRef);
  querySnapshot.forEach((doc) => {
    groups.value.push({ id: doc.id, ...doc.data() });
  });
});

function selectChat(id) {
  emit("chat-selected", id);
}
</script>
