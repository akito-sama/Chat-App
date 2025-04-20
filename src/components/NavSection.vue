<template>
  <div>
    <div class="d-flex justify-content-between gap-2 mb-4">
      <div class="d-flex gap-2 mb-4">
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
  