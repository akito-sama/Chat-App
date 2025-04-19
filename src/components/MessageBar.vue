<script setup>
import { ref } from "vue";
import {addDoc, collection, doc, getDoc} from "firebase/firestore";
import {db} from "@/firebase";
import getUser from "@/composables/getUser";

const props = defineProps({
  groupID: {
    type: String,
    required: true,
  },
});

const user = getUser();
const newMessage = ref("");
async function sendMessage() {
  if (newMessage.value.trim() === "") return;
  console.log("User: ", user)
  const message = {
    text: newMessage.value,
    authorID: user.user.value.uid,
    readby: await getAllMembers(),
    date: new Date(),
  };
  newMessage.value = "";
  await addDoc(collection(db, "groups", props.groupID, "messages"), message);
  window.scrollTo(0, document.body.scrollHeight);
}
async function getAllMembers() {
  const members = {};
  try {
    const groupDoc = await getDoc(doc(db, "groups", props.groupID));
    if (groupDoc.exists()) {
      const groupData = groupDoc.data();
      const groupMembers = groupData.groupMembers || [];
      groupMembers.forEach((member) => {
        if (member !== user.uid) {
          members[member] = false;
        }
      });
      const groupAdmins = groupData.groupAdmins || [];
      groupAdmins.forEach((admin) => {
        if (admin !== user.uid) {
          members[admin] = false;
        }
      });
    } else {
      console.error("Group document not found");
    }
  } catch (error) {
    console.error("Error fetching group members:", error);
  }
  return members;
}
</script>

<template>
    <div class="writeSection border-top p-2 bg-white">
      <input
        type="text"
        v-model="newMessage"
        placeholder="Type a message..."
        @keyup.enter="sendMessage"
        class="form-control"
      />
    </div>
</template>

<style scoped>

</style>