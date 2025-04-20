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
import { ref, onMounted } from "vue";
import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";
import getUser from "@/composables/getUser";

const props = defineProps({
  groupID: {
    type: String,
    required: true,
  },
});
const group = ref({ groupPDP: "", groupName: "" });
const groupDoc = doc(db, "groups", props.groupID);
const authUser = getUser().user;

onMounted(async () => {
  const docSnap = await getDoc(groupDoc);
  if (docSnap.exists()) {
    const data = docSnap.data();
    // Find the other member
    const members = data.groupMembers || [];
    const myUid = authUser.value?.uid;
    const otherUid = members.find((uid) => uid !== myUid);
    if (otherUid) {
      const otherDoc = await getDoc(doc(db, "users", otherUid));
      if (otherDoc.exists()) {
        const other = otherDoc.data();
        group.value.groupPDP = other.pdp;
        group.value.groupName = other.firstname;
      }
    }
  }
});
</script>
