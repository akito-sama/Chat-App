<template>
  <div class="card shadow-sm p-4 mx-auto my-4" style="max-width: 600px;">
    <h4 class="mb-4">Create New Group</h4>

    <form @submit.prevent="handleSubmit">
      <!-- Group Name -->
      <div class="mb-3">
        <label class="form-label">Group Name</label>
        <input type="text" class="form-control" v-model="name" placeholder="Enter group name" required />
      </div>

      <!-- Group Description -->
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea class="form-control" v-model="text" rows="4" placeholder="Group description"></textarea>
      </div>

      <!-- Group Image Upload -->
      <div class="mb-3">
        <label class="form-label">Group Image</label>
        <input type="file" class="form-control" />
      </div>

      <!-- Buttons Row -->
      <div class="d-flex align-items-center gap-3 mb-4">
        <button type="submit" class="btn btn-primary">
          <i class="bi bi-send-fill me-1"></i> Create Group
        </button>

        <!-- Add Members Dropdown -->
        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            @click="toggleDropdown"
            :aria-expanded="dropdownOpen"
          >
            <i class="bi bi-person-plus-fill me-1"></i> Add Members
          </button>

          <ul class="dropdown-menu p-2 shadow show" v-if="dropdownOpen">
            <!-- Search Users -->
            <input type="text" class="form-control mb-2" v-model="search" placeholder="Search users..." />
            <li
              v-for="user in filtered_users"
              :key="user.id"
              class="dropdown-item d-flex align-items-center gap-2"
              @click="() => { selected.push(user.id) }"
              style="cursor: pointer;"
            >
              <UserItem :UserId="user.id" />
            </li>
          </ul>
        </div>
      </div>
    </form>

    <!-- Selected Members -->
    <div v-if="selected.length" class="alert alert-info">
      <strong>Selected Members:</strong> {{ selected.length }}
    </div>
  </div>
</template>


<script setup>
import { db } from "@/firebase";
import { addDoc, arrayUnion, collection, doc, getDocs, updateDoc } from "firebase/firestore";
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
    try {
    let request = await addDoc(groupsRef, {
        groupName: name.value,
        groupBio: text.value,
        groupMembers: selected.value,
        groupPDP: '',
        groupAdmins: [authuser.value.uid],
        isPrivate: false,
        lastMessage: "",
    });}
    catch (err) {
        console.log("can't add group", err);
    }
    try {
    for (let i = 0; i < selected.value.length; i++) {
        let userRef = doc(db, "users", selected.value[i]);
        updateDoc(userRef, {
            groups: arrayUnion(request.id),
        });
    }
    let userRef = doc(db, "users", authuser.value.uid);
    updateDoc(userRef, {
        groups: arrayUnion(request.id),
    });
    } catch (err) {
        console.log("can't modify users", err);
    }
    selected.value = [];
    name.value = '';
    text.value = '';
    dropdownOpen.value = false;
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
