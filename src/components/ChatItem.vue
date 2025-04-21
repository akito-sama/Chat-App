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
  const timestamp = lastMessage.value.date?.toDate?.();
  if (!timestamp) return '';

  const now = new Date();
  const diff = now - timestamp;

  const oneDay = 24 * 60 * 60 * 1000;
  const sevenDays = 7 * oneDay;

  if (diff < oneDay && now.getDate() === timestamp.getDate()) {
    // Same day: show time
    return timestamp.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } else if (diff < sevenDays) {
    // Within the last week: show weekday
    return timestamp.toLocaleDateString('en-GB', {
      weekday: 'short',
    });
  } else {
    // Older: show date
    return timestamp.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }
});

</script>
