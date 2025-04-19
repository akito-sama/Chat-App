<template>
  <div class="d-flex flex-column h-100">
    <!-- Messages container -->
    <div class="flex-grow-1 overflow-auto mb-2 px-3" style="max-height: 100%">
      <div v-if="messages.length === 0" class="text-center mt-3 text-muted">
        <p>No messages yet.</p>
      </div>
      <ul>
        <li
          v-for="message in messages"
          :key="message.id"
          class="list-unstyled max-w-100"
        >
          <MessageItem
            :group-i-d="groupID"
            :userID="userID"
            :messageID="message.id"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from "vue";
import { db } from "@/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import MessageItem from "@/components/MessageItem.vue";
import MessageBar from "@/components/MessageBar.vue";

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

const messages = ref([]);

onSnapshot(
  query(collection(db, "groups", props.groupID, "messages"), orderBy("date")),
  async (querySnapshot) => {
    messages.value = [];
    querySnapshot.forEach((doc) => {
      messages.value.push({ id: doc.id, ...doc.data() });
    });
    await nextTick(); // Add this line
    window.scrollTo(0, document.body.scrollHeight);
  }
);

messages.value.sort((a, b) => {
  return b.date - a.date;
});

</script>

<style scoped>
.writeSection {
  background-color: white;
}

/* Make messages start from the bottom and scroll up */
.flex-grow-1 {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  overflow-y: auto;
}

ul.list-unstyled {
  display: flex;
  flex-direction: column-reverse;
}

.max-w-100 {
  max-width: 100vh;
  margin: 0 auto;
}
</style>
