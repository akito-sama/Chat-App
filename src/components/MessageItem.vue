<template>
  <div class="message-container">
    <div
      v-if="message.authorID === userID"
      class="message message-sent"
    >
      <div class="d-flex justify-content-end">
      <button
            class="btn btn-outline-warning btn-sm"
            @click="editing = !editing"
            title="Edit discussion">
            <i class="bi bi-pencil-fill"></i>
          </button>
        <button
                class="btn btn-outline-danger btn-sm me-2"
                @click="DeleteMessage">
          <i class="bi bi-trash-fill"></i>
        </button>
        </div>
      <!-- Edit Mode -->
      <div v-if="editing" class="mb-3">
        <textarea class="form-control mb-2" v-model="message.text" rows="3" placeholder="Content"></textarea>
        <div class="d-flex gap-2">
          <button class="btn btn-primary btn-sm" @click="UpdateMessage">Save Changes</button>
          <button class="btn btn-outline-secondary btn-sm" @click="editing = false">Cancel</button>
        </div>
      </div>
      <!-- View Mode -->
      <div v-else>
      <div class="message-body">
        {{ message.text }}
      </div>
      <div class="message-footer">
        <span :key="message.date" class="message-time">
          {{ message.date?.toDate?.()?.toLocaleTimeString() || new Date(message.date).toLocaleTimeString() }}
        </span>
        <span class="message-status">
          {{ allRead() ? "✔✔" : "✔" }}
        </span>
      </div>
    </div>
      <span v-if="message.edited" class="edited">Edited</span>
      </div>
    <div
      v-else
      class="message message-received"
    >
      <div class="message-header">
        <img
          :src="author.pdp"
          alt="Profile Picture"
          class="author-avatar"
        />
        <span class="author-name">
          {{ author.firstname + ' ' + author.lastname }}
        </span>
      </div>
      <div class="message-body">
        {{ message.text }}
      </div>
      <div class="message-footer">
        <span class="message-time">
          {{ message.date?.toDate?.()?.toLocaleTimeString() || new Date(message.date).toLocaleTimeString() }}
        </span>
      </div>
      <span v-if="message.edited" class="edited">Edited</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { db } from "@/firebase";
import { getDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

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

let editing = ref(false);
const author = ref({});

async function UpdateMessage() {
  const messageDoc = doc(db, "groups", props.groupID, "messages", props.messageID);
  if (message.value.text.trim() === "") {
    alert("Message cannot be empty");
    return;
  }
  message.value.edited = true;
  await updateDoc(messageDoc, {
    ... message.value,
    text: message.value.text,
    edited: true,
  });
  editing.value = false;
}

async function DeleteMessage() {
  if (!confirm("Are you sure you want to delete this message?")) return;
  await deleteDoc(doc(db, "groups", props.groupID, "messages", props.messageID));
}

function allRead() {
  for (let id in message.value.readby) {
    if (!message.value.readby[id]) return false;
  }
  return true;
}

const message = ref({});
import { onSnapshot } from "firebase/firestore"; // Add this import

// Replace onMounted with this:
onMounted(() => {
  const messageDoc = doc(db, "groups", props.groupID, "messages", props.messageID);

  // Set up real-time listener
  const unsubscribe = onSnapshot(messageDoc, async (docSnap) => {
    if (docSnap.exists()) {
      message.value = docSnap.data();

      // Fetch author data (only once, since it doesn't change often)
      if (!author.value.firstname) {
        const authorDoc = doc(db, "users", message.value.authorID);
        const authorSnap = await getDoc(authorDoc);
        if (authorSnap.exists()) {
          author.value = authorSnap.data();
        }
      }

      // Mark as read if current user is not the author
      if (message.value.authorID !== props.userID) {
        message.value.readby = message.value.readby || {}; // Ensure `readby` exists
        if (!message.value.readby[props.userID]) {
          message.value.readby[props.userID] = true;
          await updateDoc(messageDoc, {
            readby: message.value.readby,
          });
        }
      }
    }
  });

  // Clean up listener when component unmounts
  onUnmounted(() => unsubscribe());
});
</script>

<style scoped>
.message-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.message {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  font-size: 0.9rem;
  line-height: 1.4;
  position: relative;
}

.message-sent {
  align-self: flex-end;
  background-color: #dcf8c6;
  color: #000;
  border-top-right-radius: 0;
}

.message-received {
  align-self: flex-start;
  background-color: #fff;
  color: #000;
  border-top-left-radius: 0;
  border: 1px solid #ddd;
}

.message-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.author-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
}

.author-name {
  font-size: 0.85rem;
  font-weight: bold;
  color: #555;
}

.message-body {
  word-wrap: break-word;
}

.message-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: #555;
}

.message-time {
  font-size: 0.75rem;
}

.message-status {
  font-size: 0.75rem;
  color: #34b7f1;
}
.edited{
  font-size: 0.75rem;
  color: #f39c12;
  display: flex;
  justify-content: flex-end;
}
</style>