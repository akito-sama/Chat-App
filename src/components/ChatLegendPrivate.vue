<template>
  <div class="d-flex align-items-center gap-3 px-3 py-2">
    <img
      :src="group.groupPDP"
      width="52"
      height="52"
      alt="Group Image"
      class="rounded-circle shadow-sm"
    />
    <span class="fw-bold fs-4 text-brown">{{ group.groupName }}</span>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue"
import { db } from "@/firebase"
import { doc, getDoc } from "firebase/firestore"

const props = defineProps({
  groupID: {
    type: String,
    required: true
  },
});
const group = ref({});
const groupDoc = doc(db, "groups", props.groupID);
onMounted(() => {
  getDoc(groupDoc).then((doc) => {
    group.value = doc.data();
  });
});
</script>