<template>
  <div>
<div class="d-flex justify-content-between gap-2 mb-4">
  <div class="d-flex gap-2 mb-4 ">
      <router-link
        to="/create-group"
        class="btn btn-outline-primary d-flex align-items-center gap-2"
        title="Create Group"
      >
        <i class="bi bi-people-fill"></i>
      </router-link>
      <router-link
        to="/add-private-discussion"
        class="btn btn-outline-secondary d-flex align-items-center gap-2"
        title="Start Private Chat"
      >
        <i class="bi bi-chat-dots-fill"></i>
      </router-link>
  </div>

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

    <div class="list-group" v-for="group in filtered_groups" :key="group.id">
      <ChatItem
        v-if="!group.isPrivate"
        :GroupId="group.id"
        @click="selectChat(group.id)"
        class="list-group-item list-group-item-action"
      />
      <ChatItemPrivate
        v-else
        :GroupId="group.id"
        @click="selectChat(group.id)"
        class="list-group-item list-group-item-action"
      />
    </div>
  </div>
</template>

<script setup>
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import ChatItem from "./ChatItem.vue";
import ChatItemPrivate from "./ChatItemPrivate.vue";
import { db } from "@/firebase";
import { computed, onMounted, ref } from "vue";
import getUser from "@/composables/getUser";

let search = ref("");
let groups = ref([]);
let emit = defineEmits(["chat-selected"]);
let filtered_groups = computed(() => {
  return groups.value.filter(async (group) => {
    if (!group.isPrivate) {
      return group.groupName.toLowerCase().includes(search.value.toLowerCase());
    } else {
      let useruid = getUser().user?.value?.uid;
      if (!useruid) return false;
      let members = group.groupMembers;
      let other_uid = members[0] === useruid ? members[1] : members[0];
      let docSnap = await getDoc(doc(db, "users", other_uid));
      return docSnap.data().firstname.toLowerCase().includes(search.value.toLocaleLowerCase())
    }
  });
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
