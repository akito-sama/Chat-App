<template>
  <div class="message-container">
    <div
      v-if="message.authorID === userID"
      class="message message-sent"
    >
      <!-- Options Toggle -->
      <div class="message-options dropdown">
        <button
          class="btn btn-sm dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          title="Message options"
        >
          <i class="bi bi-three-dots-vertical"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li>
            <button class="dropdown-item" @click="editing = !editing">
              <i class="bi bi-pencil me-2"></i>Edit
            </button>
          </li>
          <li>
            <button class="dropdown-item text-danger" @click="DeleteMessage">
              <i class="bi bi-trash3-fill me-2"></i>Delete
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
      </div>
      <span v-if="message.edited" class="edited">Edited</span>
    </div>

    <!-- Received Message -->
    <div v-else class="message message-received">
      <div class="message-header">
        <img
          :src="author.pdp"
          alt="Profile Picture"
          class="author-avatar"
          @click="() => router.push('/profile/' + message.authorID)"
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
import { useRouter } from "vue-router";
import { onSnapshot } from "firebase/firestore";

const props = defineProps({
  messageID: String,
  userID: String,
  groupID: String,
});

let editing = ref(false);
const message = ref({});
const author = ref({});
const router = useRouter();

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
/* Existing styles remain unchanged */

.message-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.message {
  max-width: 70%;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  font-size: 0.9rem;
  line-height: 1.4;
  position: relative;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.message-sent {
  align-self: flex-end;
  background-color: #e3f1d4;
  color: #2c5e30;
  border-top-right-radius: 0;
  border: 1px solid rgba(140, 179, 105, 0.2);
  position: relative;
}

.message-sent::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: linear-gradient(135deg, #e3f1d4 50%, transparent 50%);
  border-top: 1px solid rgba(140, 179, 105, 0.2);
  border-right: 1px solid rgba(140, 179, 105, 0.2);
}

.message-received {
  align-self: flex-start;
  background-color: #fff;
  color: #3a603d;
  border-top-left-radius: 0;
  border: 1px solid rgba(76, 124, 80, 0.15);
  position: relative;
}

.message-received::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  background: linear-gradient(-45deg, #fff 50%, transparent 50%);
  border-top: 1px solid rgba(76, 124, 80, 0.15);
  border-left: 1px solid rgba(76, 124, 80, 0.15);
}

.message-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.author-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid rgba(140, 179, 105, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.author-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: #4d7c50;
}

.message-body {
  word-wrap: break-word;
  text-align: left;
}

.message-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  font-size: 0.75rem;
  margin-top: 0.4rem;
}

.message-time {
  font-size: 0.75rem;
  color: rgba(76, 124, 80, 0.7);
}

.message-status {
  font-size: 0.75rem;
  color: #4d7c50;
}

.edited {
  font-size: 0.75rem;
  color: #8cb369;
  display: flex;
  justify-content: flex-end;
  font-style: italic;
  margin-top: 0.2rem;
}

.message-options {
  position: absolute;
  top: 0.25rem;
  right: 0.25rem;
  z-index: 1;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.message:hover .message-options {
  opacity: 1;
}

.message-options .btn {
  font-size: 1rem;
  color: #4d7c50;
  transition: transform 0.2s ease;
  background: transparent;
  border: none;
}

.message-options .btn:hover {
  transform: scale(1.1);
}

.dropdown-menu {
  background: #f9fcf6;
  border: 1px solid rgba(76, 124, 80, 0.15);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.dropdown-item {
  color: #3c5a3f;
  transition: all 0.2s ease;
  padding: 0.6rem 1rem;
}

.dropdown-item:hover {
  background: rgba(140, 179, 105, 0.1);
  color: #2c5e43;
  padding-left: 1.2rem;
}

.dropdown-item.text-danger {
  color: #e74c3c;
}

.dropdown-item.text-danger:hover {
  background: rgba(231, 76, 60, 0.1);
}

/* Edit mode styling */
textarea.form-control {
  border: 1px solid rgba(76, 124, 80, 0.3);
  border-radius: 8px;
  background-color: #f9fcf6;
  color: #3a603d;
  transition: all 0.3s ease;
}

textarea.form-control:focus {
  border-color: rgba(76, 124, 80, 0.5);
  box-shadow: 0 0 0 0.2rem rgba(76, 124, 80, 0.15);
}

.btn-primary {
  background-color: #4d7c50;
  border-color: #4d7c50;
  color: white;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #3a603d;
  border-color: #3a603d;
  transform: translateY(-1px);
}

.btn-outline-secondary {
  color: #4d7c50;
  border-color: rgba(76, 124, 80, 0.3);
  background: transparent;
  transition: all 0.3s ease;
}

.btn-outline-secondary:hover {
  background-color: rgba(140, 179, 105, 0.1);
  color: #3a603d;
  border-color: rgba(76, 124, 80, 0.5);
}
</style>
