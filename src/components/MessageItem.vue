<template>
  <div v-if="message.authorID === curUser.uid" class="text-end">
    <span class="badge bg-primary">You</span>
    <p class="message-text">{{ message.text }}</p>
    <span class="readAll">{{ (allRead()) ? "Read" : "Not read"}}</span>
  </div>
  <div v-else class="text-start">
    <img :src="user.pdp" class="rounded-circle me-2" width="40" height="40"/>
    <span class="badge bg-secondary">{{ user.firstname + ' ' + user.lastname }}</span>
    <p class="message-text">{{ message.text }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from "vue"
import { db } from "@/firebase"
import {getDoc, doc} from "firebase/firestore";

const props = defineProps({
  messageID: {
    type: String,
    required: true
  },
  groupID: {
    type: String,
    required: true
  },
});

const user = ref({});
const curUser = inject('userDoc');

function allRead(){
  console.log(message.value)
  for (let id in message.value.readby){
    if (!message.value.readby[id]) return false;
  }
  return true;
}
const message = ref({});
onMounted(async () => {
  const messageDoc = doc(db, "groups", props.groupID, "messages", props.messageID);
  await getDoc(messageDoc).then((doc) => {
    message.value = doc.data();
  });
  const q = await getDoc(doc(db, "users", message.value.authorID));
  user.value = q.data();
  console.log("uservalue "+user.value);
})
</script>