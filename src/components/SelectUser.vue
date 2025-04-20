<template>
  <div class="dropdown user-selector">
    <button
      class="btn btn-secondary dropdown-toggle w-100"
      type="button"
      @click="toggleDropdown"
      :aria-expanded="dropdownOpen"
    >
      <i v-if="selected" class="bi bi-person-check"></i>
      <i v-else class="bi bi-search"></i>
    </button>

    <ul v-if="dropdownOpen" class="dropdown-menu show w-100">
      <li class="px-3 pt-2">
        <input
          type="text"
          class="form-control"
          v-model="search"
          placeholder="Search"
        />
      </li>
      <li
        v-for="user in filtered_users"
        :key="user.id"
        class="dropdown-item"
        @click="selectUser(user.id)"
      >
        <UserItem :UserId="user.id" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, defineEmits, onMounted } from "vue";
import { db } from "@/firebase";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import UserItem from "../components/UserItem.vue";
import getUser from "@/composables/getUser";

const props = defineProps({
  userIds: {
    type: Array,
    default: null,
  },
});

const emit = defineEmits(["user-selected"]);

const users = ref([]);
const search = ref("");
const dropdownOpen = ref(false);
const selected = ref("");
const authuser = getUser().user.value;

const filtered_users = computed(() => {
  return users.value
    .filter((user) =>
      user.firstname.toLowerCase().includes(search.value.toLowerCase())
    )
    .filter((user) => user.id !== selected.value && user.id !== authuser.uid)
    .slice(0, 15);
});

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const selectUser = (userId) => {
  selected.value = userId;
  dropdownOpen.value = false;
  search.value = "";
  emit("user-selected", userId);
};

onMounted(async () => {
  if (props.userIds) {
    for (const uid of props.userIds) {
      const docSnap = await getDoc(doc(db, "users", uid));
      if (docSnap.exists()) {
        users.value.push({ id: uid, ...docSnap.data() });
      }
    }
  } else {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    querySnapshot.forEach((doc) => {
      users.value.push({ id: doc.id, ...doc.data() });
    });
  }
});
</script>
