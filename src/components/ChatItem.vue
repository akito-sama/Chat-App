<template>
  <div class="d-flex align-items-center justify-content-between gap-2">
    <div class="d-flex align-items-center gap-2">
      <img
        :src="groupPDP"
        alt="PDP"
        class="rounded-circle"
        width="40"
        height="40"
      />
      <span>{{ groupName }}</span>
      <span>{{ lastMessage }}</span>
    </div>
  </div>
</template>


<script setup>
import { db } from "@/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onMounted, ref } from "vue";
import SelectUser from "./SelectUser.vue";

const props = defineProps({ GroupId: String });

let groupName = ref("");
let groupPDP = ref("");
let lastMessage = ref("");

const groupRef = doc(db, "groups", props.GroupId);

onSnapshot(groupRef, (docSnap) => {
  if (docSnap.exists()) {
    groupName.value = docSnap.data().groupName;
    groupPDP.value = docSnap.data().groupPDP;
    lastMessage.value = docSnap.data().lastMessage;
  }
});

onMounted(async () => {
  let docSnap = await getDoc(groupRef);
  if (docSnap.exists()) {
    groupName.value = docSnap.data().groupName;
    groupPDP.value = docSnap.data().groupPDP;
  }
});
</script>
