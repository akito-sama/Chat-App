<template>
  <div class="d-flex align-items-center justify-content-between p-2 border rounded shadow-sm bg-white">
    <div class="d-flex align-items-center gap-3">
      <img
        :src="PDP"
        alt="PDP"
        class="rounded-circle"
        width="48"
        height="48"
      />
      <div>
        <h6 class="mb-1 fw-semibold d-flex align-items-center gap-2">
          {{ Name }}
          <span
            class="rounded-circle"
            :class="isOnline ? 'bg-success' : 'bg-secondary'"
            style="width: 10px; height: 10px;"
            title="Status"
          ></span>
        </h6>
        <p class="mb-0 text-muted small">{{ lastMessage.text }}</p>
      </div>
    </div>
    <div class="text-muted small">
      {{ formattedTime }}
    </div>
  </div>
</template>


<script setup>
import getUser from "@/composables/getUser";
import { db } from "@/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { ref, onMounted, computed } from "vue";

const props = defineProps({ GroupId: String });

const Name = ref("");
const PDP = ref("");
const lastMessage = ref({});
const user = getUser().user.value;
const useruid = user?.uid;

const groupRef = doc(db, "groups", props.GroupId);

const isOnline = ref(false);

onMounted(async () => {
  if (!useruid) return;

  const groupSnap = await getDoc(groupRef);
  if (groupSnap.exists()) {
    const data = groupSnap.data();
    const members = data.groupMembers;
    const other_uid = members.find((id) => id !== useruid);

    const userRef = doc(db, "users", other_uid);

    // Live update for isOnline
    onSnapshot(userRef, (snap) => {
      if (snap.exists()) {
        const userData = snap.data();
        Name.value = userData.firstname;
        PDP.value = userData.pdp;
        isOnline.value = userData.isOnline;
      }
    });

    lastMessage.value = data.lastMessage || {};
  }
});


// Load name + PDP of other user
onMounted(async () => {
  if (!useruid) return;

  const groupSnap = await getDoc(groupRef);
  if (groupSnap.exists()) {
    const data = groupSnap.data();
    const members = data.groupMembers;
    const other_uid = members.find((id) => id !== useruid);

    const otherSnap = await getDoc(doc(db, "users", other_uid));
    if (otherSnap.exists()) {
      Name.value = otherSnap.data().firstname;
      PDP.value = otherSnap.data().pdp;
    }

    lastMessage.value = data.lastMessage || {};
  }
});

// Live updates for last message
onSnapshot(groupRef, (docSnap) => {
  if (docSnap.exists()) {
    lastMessage.value = docSnap.data().lastMessage || {};
  }
});

// Format timestamp WhatsApp style
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
