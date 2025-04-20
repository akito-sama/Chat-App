<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <form
      @submit.prevent="handleSubmit"
      class="d-flex flex-column gap-3 p-4 border rounded bg-light shadow"
      style="min-width: 300px; max-width: 500px; width: 100%;"
    >
      <!-- Send Button -->
      <button type="submit" class="btn btn-primary w-100">Send</button>

      <!-- Dropdown -->
      <div class="dropdown w-100">
        <button
          class="btn btn-secondary dropdown-toggle w-100"
          type="button"
          @click="toggleDropdown"
          :aria-expanded="dropdownOpen"
          :class="{ show: dropdownOpen }"
        >
          Find Contact
        </button>

        <!-- Selected User Display -->
        <div class="mt-3">
          <label class="form-label">Selected User</label>
          <UserItem v-if="selected !== ''" :UserId="selected" :key="selected" />
        </div>

        <!-- Dropdown Menu -->
        <div class="dropdown-menu show p-2 w-100 shadow mt-2" v-if="dropdownOpen">
          <input
            type="text"
            class="form-control mb-2"
            v-model="search"
            placeholder="Search users..."
          />
          <ul class="list-unstyled mb-0">
            <li
              v-for="user in filtered_users"
              :key="user.id"
              class="dropdown-item cursor-pointer"
              @click="() => { selected = user.id; dropdownOpen = false; search = ''; }"
            >
              <UserItem :UserId="user.id" />
            </li>
          </ul>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { db } from "@/firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import UserItem from "../components/UserItem.vue";
import getUser from "../composables/getUser";

const groupsRef = collection(db, "groups");
const authuser = getUser().user;
const users = ref([]);
const search = ref("");
const dropdownOpen = ref(false);
const selected = ref("");

const filtered_users = computed(() => {
  return users.value
    .filter((user) => {
      return (
        user.firstname &&
        typeof user.firstname === 'string' &&
        user.firstname.toLowerCase().includes(search.value.toLowerCase()) &&
        selected.value !== user.id &&
        authuser.value.uid !== user.id
      );
    })
    .slice(0, 15);
});

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const router = useRouter();

const handleSubmit = async () => {
  try {
    let request = await addDoc(groupsRef, {
      groupMembers: [selected.value, authuser.value.uid],
      isPrivate: true,
      lastMessage: "",
    });

    let userRef1 = doc(db, "users", authuser.value.uid);
    let userRef2 = doc(db, "users", selected.value);

    await Promise.all([
      updateDoc(userRef1, {
        groups: arrayUnion(request.id),
      }),
      updateDoc(userRef2, {
        groups: arrayUnion(request.id),
      }),
    ]);

    selected.value = "";
    dropdownOpen.value = false;
    router.push("/");
  } catch (err) {
    console.error("Error creating group or updating users:", err);
  }
};

onMounted(async () => {
  const usersRef = collection(db, "users");
  const querySnapshot = await getDocs(usersRef);
  querySnapshot.forEach((docSnap) => {
    users.value.push({
      id: docSnap.id,
      ...docSnap.data(),
    });
  });
});
</script>

<style scoped>
.dropdown-menu {
  max-height: 300px;
  overflow-y: auto;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
