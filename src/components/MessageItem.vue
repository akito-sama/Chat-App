<template>
  <div v-if="message.authorID === userID" class="text-end">
    <span class="badge bg-primary">You</span>
    <p class="message-text">{{ message.text }}</p>
    <span class="readAll">{{ (allRead()) ? "Read" : "Not read"}}</span>
  </div>
  <div v-else class="text-start">
    <span></span>
    <span class="badge bg-secondary">{{ message.authorName }}</span>
    <p class="message-text">{{ message.text }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { db } from "@/firebase"
import {getDoc, doc} from "firebase/firestore";

const props = defineProps({
  messageID: {
    type: String,
    required: true
  },
  userID: {
    type: String,
    required: true
  },
  groupID: {
    type: String,
    required: true
  },
});

function allRead(){
  console.log(message.value)
  for (let id in message.value.readby){
    if (!message.value.readby[id]) return false;
  }
  return true;
}
const message = ref({});
onMounted(() => {
  const messageDoc = doc(db, "groups", props.groupID, "messages", props.messageID);
  getDoc(messageDoc).then((doc) => {
    message.value = doc.data();
  });
})
</script>