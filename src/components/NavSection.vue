<template>
  <div class="d-flex justify-content-between align-items-center mx-2">
    <router-link to="/create-group" class="btn btn-success"
      ><i class="bi-plus-circle"></i
    ></router-link>
    <button
      class="btn btn-outline-secondary dropdown-toggle"
      type="button"
      data-bs-toggle="dropdown"
    >
      <i class="bi bi-funnel"></i> Filter
    </button>
    <ul class="dropdown-menu">
      <li><a class="dropdown-item" href="#">Unread</a></li>
      <li><a class="dropdown-item" href="#">Groups</a></li>
      <li><a class="dropdown-item" href="#">Online Users</a></li>
    </ul>
  </div>
  <input type="text" v-model="search" />
  <div v-for="group in filtered_groups" :key="group.id">
    <ChatItem :GroupId="group.id" />
  </div>
</template>


<script setup>
import { collection, getDocs } from "firebase/firestore";
import ChatItem from "./ChatItem.vue";
import { db } from "@/firebase";
import { computed, onMounted, ref } from "vue";

let search = ref("");
let groups = ref([]);
let filtered_groups = computed(() => {
  return groups.value.filter((group) => {
    return group.groupName.toLowerCase().includes(search.value.toLowerCase());
  });
});
let groupsRef = collection(db, "groups");
onMounted(async () => {
  let querySnapshot = await getDocs(groupsRef);
  querySnapshot.forEach((doc) => {
    groups.value.push({
      id: doc.id,
      ...doc.data(),
    });
  });
  console.log(groups);
});
let docs = getDocs(groupsRef);
</script>

<style scoped>
</style>