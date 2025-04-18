<template>
  <form @submit.prevent="handleSubmit">
    <input type="text" class="form-control mb-2" v-model="name" placeholder="Group name" />
    <textarea class="form-control mb-2" v-model="text" rows="4" placeholder="Group description"></textarea>
    <input type="file" class="form-control mb-3" />

    <button type="submit" class="btn btn-primary me-2">Send</button>

    <!-- DROPDOWN -->
    <div class="dropdown d-inline">
      <button
        class="btn btn-secondary dropdown-toggle"
        type="button"
        @click="toggleDropdown"
        :aria-expanded="dropdownOpen"
      >
        add members
      </button>
      <ul class="dropdown-menu show" v-if="dropdownOpen">
        <input type="text" class="form-control mb-2" v-model="search" placeholder="Search" />
        <li v-for="user in filtered_users" :key="user.id" class="dropdown-item" @click="() => {selected.push(user.id); console.log('Youre my special');}">
          <UserItem :UserId="user.id" />
        </li>
      </ul>
    </div>
  </form>
</template>

<script setup>
import { db } from "@/firebase";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import UserItem from "../components/UserItem.vue";
import getUser from "../composables/getUser"

const groupsRef = collection(db, "groups");
const authuser = getUser().user;
const users = ref([]);
const name = ref('');
const text = ref('');
const search  = ref('');
const dropdownOpen = ref(false);
const selected = ref([]);
const filtered_users = computed(() => {
    return users.value.filter((user) => {
        // console.log(authuser.value.uid, user.id);
        return user.firstname.toLowerCase().includes(search.value.toLowerCase()) && !(selected.value.includes(user.id)) && authuser.value.uid != user.id;
    }).slice(0, 15);
})
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const router = useRouter();

const handleSubmit = async () => {
    let request = await addDoc(groupsRef, {
        groupName: name.value,
        groupBio: text.value,
        groupMembers: selected.value,
        groupPDP: '',
        groupAdmins: [authuser.value.uid],
        isPrivate: false,
        lastMessage: "",
    });
    router.push("/");
};

onMounted(async () => {
  const usersRef = collection(db, "users");
  const querySnapshot = await getDocs(usersRef);
  querySnapshot.forEach((doc) => {
    users.value.push({
      id: doc.id,
      ...doc.data(),
    });
  });
});
</script>

<style scoped>
/* Optional styling override for dropdown if needed */
.dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}
</style>
