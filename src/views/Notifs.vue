<template>
  <div class="container py-4">
    <h2 class="mb-4">Notifications</h2>
    <button
      class="btn btn-sm btn-danger mb-3"
      @click="clearNotifs"
      v-if="notifications.length"
    >
      Clear Notifications
    </button>
    <div v-if="notifications.length === 0" class="text-muted">
      No notifications yet.
    </div>
    <ul class="list-group">
      <li
        v-for="(notif, idx) in notifications"
        :key="idx"
        class="list-group-item"
        :class="{ 'list-group-item-secondary': notif.read }"
        @click="markAsRead(idx)"
      >
        <div>
          <strong>{{ notif.authorName || "Someone" }}</strong> sent:
          {{ notif.text }}
          <span v-if="!notif.read" class="badge bg-warning text-dark ms-2"
            >New</span
          >
        </div>
        <div class="small text-muted">
          Group: {{ notif.groupID }} | {{ formatDate(notif.date) }}
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const notifications = ref([]);

function loadNotifs() {
  const notifs = JSON.parse(localStorage.getItem("notifs") || "[]");
  notifications.value = notifs.sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );
}

function clearNotifs() {
  localStorage.removeItem("notifs");
  notifications.value = [];
}

function markAsRead(idx) {
  notifications.value[idx].read = true;
  localStorage.setItem("notifs", JSON.stringify(notifications.value));
}

function formatDate(date) {
  if (!date) return "";
  try {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleString();
  } catch {
    return "";
  }
}

onMounted(() => {
  loadNotifs();
  window.addEventListener("storage", loadNotifs);
  // Mark all as read when opening the page
  notifications.value.forEach((notif, idx) => {
    if (!notif.read) markAsRead(idx);
  });
});
</script>

<style scoped>
.container {
  max-width: 600px;
}
</style>
