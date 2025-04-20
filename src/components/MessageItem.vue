<template>
  <div class="message-container">
    <!-- Sent Message -->
    <div
      v-if="message.authorID === userID"
      class="message message-sent position-relative"
    >
      <!-- Dropdown menu for Edit/Delete -->
      <div class="dropdown message-options">
        <button
          class="btn btn-sm p-0 border-0 bg-transparent text-muted"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          title="Options"
        >
          <i class="bi bi-three-dots-vertical"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li>
            <button class="dropdown-item" @click="editing = !editing">
              <i class="bi bi-pencil-fill me-2"></i> Edit
            </button>
          </li>
          <li>
            <button class="dropdown-item text-danger" @click="DeleteMessage">
              <i class="bi bi-trash-fill me-2"></i> Delete
            </button>
          </li>
        </ul>
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
        <span v-if="message.edited" class="edited">Edited</span>
      </div>
    </div>

    <!-- Received Message -->
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
import { getDoc, doc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore";

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
const message = ref({});

async function UpdateMessage() {
  const messageDoc = doc(db, "groups", props.groupID, "messages", props.messageID);
  if (message.value.text.trim() === "") {
    alert("Message cannot be empty");
    return;
  }
  message.value.edited = true;
  await updateDoc(messageDoc, {
    ...message.value,
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

onMounted(() => {
  const messageDoc = doc(db, "groups", props.groupID, "messages", props.messageID);

  const unsubscribe = onSnapshot(messageDoc, async (docSnap) => {
    if (docSnap.exists()) {
      message.value = docSnap.data();

      if (!author.value.firstname) {
        const authorDoc = doc(db, "users", message.value.authorID);
        const authorSnap = await getDoc(authorDoc);
        if (authorSnap.exists()) {
          author.value = authorSnap.data();
        }
      }

      if (message.value.authorID !== props.userID) {
        message.value.readby = message.value.readby || {};
        if (!message.value.readby[props.userID]) {
          message.value.readby[props.userID] = true;
          await updateDoc(messageDoc, {
            readby: message.value.readby,
          });
        }
      }
    }
  });

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

.edited {
  font-size: 0.75rem;
  color: #f39c12;
  display: flex;
  justify-content: flex-end;
}

.message-options {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  z-index: 1;
}

.message-options .btn {
  font-size: 1rem;
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.message-options .btn:hover {
  opacity: 1;
}
</style>
