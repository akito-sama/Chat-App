<template>
  <div class="d-flex flex-column h-100">
    <!-- Chat Legend (sticky header) -->
    <div class="flex-shrink-0 sticky-top bg-white z-3 border-bottom">
      <component
        :is="
          isPrivate === true
            ? ChatLegendPrivate
            : isPrivate === false
            ? ChatLegend
            : null
        "
        v-if="isPrivate !== null"
        :groupID="props.groupID"
      />
    </div>
    <!-- Messages container -->
    <div class="flex-grow-1 overflow-auto mb-2 px-3 messages-container">
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
import { ref, nextTick, onMounted } from "vue";
import { db } from "@/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import MessageItem from "@/components/MessageItem.vue";
import ChatLegend from "@/components/ChatLegend.vue";
import ChatLegendPrivate from "@/components/ChatLegendPrivate.vue";

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
const isPrivate = ref(null);

onSnapshot(
  query(collection(db, "groups", props.groupID, "messages"), orderBy("date")),
  async (querySnapshot) => {
    messages.value = [];
    querySnapshot.forEach((doc) => {
      messages.value.push({ id: doc.id, ...doc.data() });
    });
    // Update last message in group
    await updateDoc(doc(db, "groups", props.groupID), {
      lastMessage: (messages.value.length) ? messages.value[messages.value.length - 1] : {},
    });
    await nextTick();
    window.scrollTo(0, document.body.scrollHeight);
  }
);

onMounted(async () => {
  // Fetch group info to determine if it's private
  const groupDoc = await getDoc(doc(db, "groups", props.groupID));
  if (groupDoc.exists()) {
    isPrivate.value = groupDoc.data().isPrivate;
  }
});
</script>

<style scoped>
.writeSection {
  background-color: white;
}

.d-flex.h-100 {
  height: 100%;
}

.flex-grow-1.messages-container {
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  overflow-y: auto;
  height: 0;
  min-height: 0;
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
