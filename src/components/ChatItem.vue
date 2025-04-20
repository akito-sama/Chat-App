<template>
  <div class="d-flex align-items-center justify-content-between p-2 border rounded shadow-sm bg-white">
    <!-- Left: Avatar + Info -->
    <div class="d-flex align-items-center gap-3 flex-grow-1">
      <img
        :src="groupPDP"
        alt="PDP"
        class="rounded-circle border"
        width="48"
        height="48"
      />
      <div class="text-start">
        <h6 class="mb-1 fw-semibold">{{ groupName }}</h6>
        <p class="mb-0 text-muted small">{{ lastMessage.text }}</p>
      </div>
    </div>

    <!-- Right: Time -->
    <div class="text-muted small ms-3 text-nowrap">
      {{ formattedTime }}
    </div>
  </div>
</template>


<script setup>
import { db } from "@/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onMounted, ref, computed } from "vue";

const props = defineProps({ GroupId: String });

let groupName = ref("");
let groupPDP = ref("");
let lastMessage = ref({});

const groupRef = doc(db, "groups", props.GroupId);

// Live updates
onSnapshot(groupRef, (docSnap) => {
  if (docSnap.exists()) {
    groupName.value = docSnap.data().groupName;
    groupPDP.value = docSnap.data().groupPDP;
    lastMessage.value = docSnap.data().lastMessage || {};
  }
});

// Initial load
onMounted(async () => {
  let docSnap = await getDoc(groupRef);
  if (docSnap.exists()) {
    groupName.value = docSnap.data().groupName;
    groupPDP.value = docSnap.data().groupPDP;
  }
});

// Format time like WhatsApp (HH:mm)
const formattedTime = computed(() => {
  if (!lastMessage.value?.date) return '';
  const date = lastMessage.value.date.toDate ? lastMessage.value.date.toDate() : new Date(lastMessage.value.date);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
});
</script>
