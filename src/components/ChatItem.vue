<template>
  <div @click="showMessages = true; " class="d-flex align-items-center gap-2">
    <img :src="groupPDP" alt="" width="52px" height="52px" />
    <p>{{ groupName }}</p>
  </div>
  <MessageList v-if="showMessages" :group-i-d="GroupId" :user-i-d="user?.uid"/>
</template>

<script setup>
import { db } from "@/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onMounted, ref, inject } from "vue";
import MessageList from "@/components/MessageList.vue";

let props = defineProps({
  GroupId: String,
});

let groupName = ref("");
let groupPDP = ref("");
let showMessages = ref(false);
let user = inject('userDoc');

const groupRef = doc(db, "groups", props.GroupId);
onSnapshot(groupRef, (docSnap) => {
  if (docSnap.exists()) {
    let docData = docSnap.data();
    groupName.value = docData.groupName;
    groupPDP.value = docData.groupPDP;
  } else {
    console.log("No such document!");
  }
});

onMounted(async () => {
  let docSnap = await getDoc(groupRef);
  if (docSnap.exists()) {
    groupName.value = docSnap.data().groupName;
    groupPDP.value = docSnap.data().groupPDP;
  } else {
    console.log("No such document!");
  }
});
</script>

<style scoped></style>
