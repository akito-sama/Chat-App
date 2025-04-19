<template>
  <div v-if="message.authorID === userID" class="text-end mb-3">
    <span class="badge bg-primary">You</span>
    <div class="bg-light p-2 rounded d-inline-block mt-1">
      {{ message.text }}
    </div>
    <div class="small text-muted mt-1">
      {{ allRead() ? "Read" : "Not read" }}
    </div>
  </div>
  <div v-else class="text-start mb-3">
    <span class="badge bg-secondary">{{ message.authorName }}</span>
    <div class="bg-body-secondary p-2 rounded d-inline-block mt-1">
      {{ message.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/firebase";
import { getDoc, doc } from "firebase/firestore";
import { useRouter } from "vue-router";

const props = defineProps({
  messageID: {
    type: String,
    required: true,
  },
  userID: {
    type: String,
    required: true,
  },
  groupID: {
    type: String,
    required: true,
  },
});

function allRead() {
  for (let id in message.value.readby) {
    if (!message.value.readby[id]) return false;
  }
  return true;
}

const message = ref({});
const router = useRouter();

onMounted(() => {
  const messageDoc = doc(
    db,
    "groups",
    props.groupID,
    "messages",
    props.messageID
  );
  getDoc(messageDoc).then((docSnap) => {
    message.value = docSnap.data();
    // If the message is for the current user and not sent by them, show notification in Notifs.vue
    if (message.value && message.value.authorID !== props.userID) {
      // Save notification to localStorage only if not already present (by messageID)
      let notifs = JSON.parse(localStorage.getItem("notifs") || "[]");
      const alreadyExists = notifs.some(
        (notif) => notif.messageID === props.messageID
      );
      if (!alreadyExists) {
        notifs.push({
          messageID: props.messageID,
          text: message.value.text,
          authorName: message.value.authorName,
          groupID: props.groupID,
          date: message.value.date,
          read: false,
        });
        localStorage.setItem("notifs", JSON.stringify(notifs));
      }
    }
  });
});
</script>

<style scoped></style>
