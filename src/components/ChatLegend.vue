<template>
  <img :src="group.image" alt="Group Image" class="img-fluid rounded-circle mb-3" />
  <span class="fw-bold fs-4 text-brown">{{ group.name }}</span>
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