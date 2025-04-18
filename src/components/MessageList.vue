<template>
  <div class="d-flex flex-column h-100">
    <!-- Messages container -->
    <div class="flex-grow-1 overflow-auto mb-2 px-3" style="max-height: 100%;">
      <div v-if="messages.length === 0" class="text-center mt-3 text-muted">
        <p>No messages yet.</p>
      </div>
      <ul class="list-unstyled">
        <li v-for="message in messages" :key="message.id">
          <MessageItem
            :group-i-d="groupID"
            :userID="userID"
            :messageID="message.id"
          />
        </li>
      </ul>
    </div>

    <!-- Input bar -->
    <div class="writeSection border-top p-2 bg-white">
      <input
        type="text"
        v-model="newMessage"
        placeholder="Type a message..."
        @keyup.enter="sendMessage"
        class="form-control"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { db } from "@/firebase";
import {
  collection,
  getDoc,
  doc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import MessageItem from "@/components/MessageItem.vue";

const props = defineProps({
  userID: {
    type: String,
    required: true,
  },
  groupID: {
    type: String,
    required: true,
  },
});

const newMessage = ref("");
const messages = ref([]);

onSnapshot(
  query(collection(db, "groups", props.groupID, "messages"), orderBy("date")),
  (querySnapshot) => {
    messages.value = [];
    querySnapshot.forEach((doc) => {
      messages.value.push({ id: doc.id, ...doc.data() });
    });
  }
);

async function getAllMembers() {
  const members = {};
  try {
    const groupDoc = await getDoc(doc(db, "groups", props.groupID));
    if (groupDoc.exists()) {
      const groupData = groupDoc.data();
      const groupMembers = groupData.groupMembers || [];
      groupMembers.forEach((member) => {
        if (member !== props.userID) {
          members[member] = false;
        }
      });
      const groupAdmins = groupData.groupAdmins || [];
      groupAdmins.forEach((admin) => {
        if (admin !== props.userID) {
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

async function sendMessage() {
  if (newMessage.value.trim() === "") return;

  const message = {
    text: newMessage.value,
    authorID: props.userID,
    readby: await getAllMembers(),
    date: new Date(),
  };
  await addDoc(collection(db, "groups", props.groupID, "messages"), message);
  newMessage.value = "";
}
</script>

<style scoped>
.writeSection {
  background-color: white;

}
</style>
