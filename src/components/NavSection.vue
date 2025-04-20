<template>
  <div class="nav-section p-3">
    <!-- Action Buttons -->
    <div class="d-flex justify-content-between gap-2 mb-4">
      <div class="d-flex gap-2">
        <router-link
          to="/create-group"
          class="nature-action-btn btn d-flex align-items-center justify-content-center"
          title="Create Group"
        >
          <i class="bi bi-people-fill"></i>
        </router-link>
        <router-link
          to="/add-private-discussion"
          class="nature-action-btn secondary btn d-flex align-items-center justify-content-center"
          title="Start Private Chat"
        >
          <i class="bi bi-chat-dots-fill"></i>
        </router-link>
      </div>

      <div class="dropdown">
        <button
          class="nature-filter-btn btn dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
        >
          <i class="bi bi-funnel"></i>
        </button>
        <ul class="dropdown-menu nature-dropdown">
          <li>
            <a
              class="dropdown-item"
              href="#"
              @click="
                () => {
                  buttonFilter = 'Unread';
                }
              "
              >Unread</a
            >
          </li>
          <li>
            <a
              class="dropdown-item"
              href="#"
              @click="
                () => {
                  buttonFilter = 'Groups';
                }
              "
              >Groups</a
            >
          </li>
          <li>
            <a
              class="dropdown-item"
              href="#"
              @click="
                () => {
                  buttonFilter = 'Online';
                }
              "
              >Online Users</a
            >
          </li>
          <li>
            <a
              class="dropdown-item"
              href="#"
              @click="
                () => {
                  buttonFilter = '';
                }
              "
              >Everyone</a
            >
          </li>
        </ul>
      </div>
    </div>

    <!-- Search Box -->
    <div class="nature-search-container mb-3">
      <i class="bi bi-search nature-search-icon"></i>
      <input
        type="text"
        v-model="search"
        class="nature-search form-control"
        placeholder="Search chats..."
      />
    </div>

    <!-- Chat List -->
    <div class="nature-chat-list">
      <div class="list-group" v-for="group in filtered_groups" :key="group.id">
        <ChatItem
          v-if="!group.isPrivate"
          :GroupId="group.id"
          @click="selectChat(group.id)"
          class="nature-chat-item list-group-item list-group-item-action"
        />
        <ChatItemPrivate
          v-else
          :GroupId="group.id"
          @click="selectChat(group.id)"
          class="nature-chat-item list-group-item list-group-item-action"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import ChatItem from "./ChatItem.vue";
import ChatItemPrivate from "./ChatItemPrivate.vue";
import { db } from "@/firebase";
import { computed, onMounted, ref } from "vue";
import getUser from "@/composables/getUser";

let buttonFilter = ref("");
let search = ref("");
let groups = ref([]);
let emit = defineEmits(["chat-selected"]);
let filtered_groups = computed(() => {
  return groups.value.filter((group) => {
    let name_condition = group.groupName
      .toLowerCase()
      .includes(search.value.toLowerCase());
    if (buttonFilter.value == "Groups") {
      return !group.isPrivate && name_condition;
    }
    if (buttonFilter.value == "Online") {
      return name_condition && group.isPrivate && userMap[group.uid].isOnline;
    }
    if (buttonFilter.value == "Unread") {
      return name_condition && !(group.lastMessage.readby[getUser().user.value.uid] || group.lastMessage.authorID === getUser().user.value.uid);
    }
    return name_condition;
  }).sort((a, b) => {
      const aDate = a.lastMessage?.date?.toDate?.() ?? new Date();
      const bDate = b.lastMessage?.date?.toDate?.() ?? new Date();
      return bDate - aDate;
    });
});

const usersRef = collection(db, "users");
const groupRef = collection(db, "groups");

onSnapshot(usersRef, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    const user = change.doc.data();
    const userId = change.doc.id;
    userMap.value[userId] = user;
  });
});

onSnapshot(groupRef, (snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === "modified") {
        let index = groups.value.find((group) => group.id === change.doc.id);
        console.log("data: ", index);
        if (!index) {
            return
        } else {
            Object.assign(index, change.doc.data());
        }
    }
    if (change.type === "added") {
      let data = change.doc.data();
      if (
        data.groupMembers.includes(getUser().user.value.uid) &&
        !groups.value.find((group) => group.id === change.doc.id)
      ) {
        if (!data.isPrivate) {
          groups.value.push({ id: change.doc.id, ...data });
        } else {
          let useruid = getUser().user.value.uid;
          let members = change.doc.data().groupMembers;
          let other_uid = members[0] === useruid ? members[1] : members[0];
          if (other_uid in userMap) {
            groups.value.push({
              id: change.doc.id,
              ...change.doc.data(),
              uid: other_uid,
              groupName: userMap[other_uid].firstname,
            });
          }
        }
      }
    }
  });
});

const userMap = ref({});

let groupsRef = collection(db, "groups");
onMounted(async () => {
  let querySnapshot = await getDocs(groupsRef);
  const userDocs = await getDocs(collection(db, "users"));
  userDocs.forEach((doc) => {
    userMap[doc.id] = doc.data();
  });
  querySnapshot.forEach(async (document) => {
    if (
      (document.data().groupMembers.includes(getUser().user.value.uid) ||
      (!document.data().isPrivate &&
        document.data().groupAdmins.includes(getUser().user.value.uid))) && !groups.value.find((group) => group.id === document.id)
    ) {
      if (!document.data().isPrivate)
        groups.value.push({ id: document.id, ...document.data() });
      else {
        let useruid = getUser().user.value.uid;
        let members = document.data().groupMembers;
        let other_uid = members[0] === useruid ? members[1] : members[0];
        if (other_uid in userMap) {
          groups.value.push({
            id: document.id,
            ...document.data(),
            uid: other_uid,
            groupName: userMap[other_uid].firstname,
          });
        }
      }
    }
  });
});

function selectChat(id) {
  emit("chat-selected", id);
}
</script>

<style scoped>
/* Nature Theme for NavSection */
.nav-section {
  background-color: #f5f8f2;
  height: 100vh;
  border-right: 1px solid rgba(76, 124, 80, 0.15);
  overflow-y: auto;
  width: 320px;
}

/* Custom scrollbar */
.nav-section::-webkit-scrollbar {
  width: 6px;
}

.nav-section::-webkit-scrollbar-track {
  background: #f5f8f2;
}

.nav-section::-webkit-scrollbar-thumb {
  background-color: rgba(76, 124, 80, 0.3);
  border-radius: 10px;
}

.nav-section::-webkit-scrollbar-thumb:hover {
  background-color: rgba(76, 124, 80, 0.5);
}

/* Action Buttons */
.nature-action-btn {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  border: none;
  background: #4d7c50;
  color: white;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nature-action-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15 3C7.82 3 2 8.82 2 16s5.82 13 13 13 13-5.82 13-13S22.18 3 15 3zm0 23.4c-5.72 0-10.4-4.68-10.4-10.4S9.28 5.6 15 5.6s10.4 4.68 10.4 10.4-4.68 10.4-10.4 10.4z' fill='rgba(255,255,255,0.07)' fill-rule='nonzero'/%3E%3C/svg%3E");
  opacity: 0.5;
  z-index: 0;
}

.nature-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background: #5b9362;
}

.nature-action-btn.secondary {
  background: #8cb369;
}

.nature-action-btn.secondary:hover {
  background: #9ac278;
}

.nature-filter-btn {
  width: 42px;
  height: 42px;
  border-radius: 10px;
  background: rgba(140, 179, 105, 0.15);
  color: #4d7c50;
  border: 1px solid rgba(140, 179, 105, 0.3);
  transition: all 0.3s ease;
}

.nature-filter-btn:hover {
  background: rgba(140, 179, 105, 0.25);
  color: #3a603d;
}

.nature-dropdown {
  background: #f9fcf6;
  border: 1px solid rgba(76, 124, 80, 0.15);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.nature-dropdown .dropdown-item {
  color: #3c5a3f;
  transition: all 0.2s ease;
  padding: 0.6rem 1rem;
}

.nature-dropdown .dropdown-item:hover {
  background: rgba(140, 179, 105, 0.1);
  color: #2c5e43;
  padding-left: 1.2rem;
}

/* Search Box */
.nature-search-container {
  position: relative;
}

.nature-search {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(76, 124, 80, 0.2);
  border-radius: 10px;
  padding: 0.5rem 0.75rem 0.5rem 2.5rem;
  color: #3a603d;
  transition: all 0.3s ease;
}

.nature-search:focus {
  background: #ffffff;
  border-color: rgba(76, 124, 80, 0.4);
  box-shadow: 0 0 0 0.2rem rgba(76, 124, 80, 0.15);
}

.nature-search::placeholder {
  color: rgba(76, 124, 80, 0.5);
}

.nature-search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(76, 124, 80, 0.6);
  z-index: 1;
}

/* Chat List */
.nature-chat-list {
  margin-top: 0.5rem;
}

.nature-chat-item {
  border: none;
  border-radius: 10px;
  margin-bottom: 0.5rem;
  background: rgba(255, 255, 255, 0.7);
  border-left: 3px solid transparent;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nature-chat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: linear-gradient(to bottom, #4d7c50, #8cb369);
  opacity: 0;
  transition: all 0.3s ease;
}

.nature-chat-item:hover {
  background: rgba(255, 255, 255, 0.9);
  transform: translateX(3px);
}

.nature-chat-item:hover::before {
  opacity: 1;
}

.nature-chat-item.active {
  background: #ffffff;
  border-left-color: #4d7c50;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.nature-chat-item.active::before {
  opacity: 1;
}
</style>