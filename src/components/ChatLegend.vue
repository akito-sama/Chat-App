<template>
  <div class="d-flex align-items-center justify-content-between px-3 py-2 border-bottom bg-white sticky-top z-3">
    <!-- Left: Avatar and Group Name -->
    <div class="d-flex align-items-center gap-3">
      <img
        :src="group.groupPDP"
        width="52"
        height="52"
        alt="Group Image"
        class="rounded-circle shadow-sm"
      />
      <span class="fw-bold fs-4 text-brown">{{ group.groupName }}</span>
    </div>

    <!-- Center: SelectUser (only when adding a member) -->
    <div class="flex-grow-1 d-flex justify-content-center" v-if="state === 'removeMember'">
      <SelectUser :userIds="group.groupMembers" @user-selected="removeMember"/>
    </div>
    <div class="flex-grow-1 d-flex justify-content-center" v-if="state === 'addMember'">
      <SelectUser :userIds="users" @user-selected="addMember" />
    </div>
    <!-- Right: Action Buttons -->
    <div class="d-flex align-items-center gap-2">
      <button class="btn btn-outline-success btn-sm" @click="() => { state = 'addMember'; }">
        <i class="bi bi-person-plus"></i>
      </button>
      <button class="btn btn-outline-danger btn-sm" @click="() => { state = 'removeMember'; }">
        <i class="bi bi-person-dash"></i>
      </button>
    </div>
  </div>
</template>



<script setup>
import { ref, onMounted } from "vue"
import { db } from "@/firebase"
import { arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore"
import SelectUser from "@/components/SelectUser.vue"

let key = ref(0);
const props = defineProps({
  groupID: {
    type: String,
    required: true
  },
});

let addMember = async (uid) => {
  key.value++;
  state.value = "";
  try {
    await updateDoc(groupDoc, {
      groupMembers: arrayUnion(uid)
    });
    group.value.groupMembers.push(uid);
    users.value = users.value.filter((user) => user !== uid);
    console.log("what is happening");
  } catch (err) {
    console.log("can't add member", err);
  }
};

let removeMember = async (uid) => {
  key.value++;
  state.value = "";
  try {
    await updateDoc(groupDoc, {
      groupMembers: arrayRemove(uid)
    });
    console.log()
    group.value.groupMembers = group.value.groupMembers.filter((member) => member !== uid);
    users.value.push(uid);
  } catch (err) {
    console.log("can't add member", err);
  }
};

let state = ref("");
let users = ref([]);
const group = ref({});
const groupDoc = doc(db, "groups", props.groupID);
onMounted(() => {
  getDoc(groupDoc).then((doc) => {
    group.value = doc.data();
  });
  getDocs(collection(db, "users")).then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      if (!group.value.groupMembers.includes(doc.id) && (!group.value.groupAdmins.includes(doc.id)))
        users.value.push(doc.id);
    });
  })
});
</script>