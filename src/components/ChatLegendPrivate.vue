<template>
  <div class="d-flex align-items-center gap-3 px-3 py-2">
    <img
      :src="group.groupPDP"
      width="52"
      height="52"
      alt="Group Image"
      class="rounded-circle shadow-sm"
      @click="redirectToUserProfile"
    />
    <div
      class="fw-bold fs-4 text-brown d-flex align-items-center gap-2"
      @click="redirectToUserProfile"
      style="cursor: pointer;"
    >
      {{ group.groupName }}
      <span
        class="rounded-circle"
        :class="isOnline ? 'bg-success' : 'bg-secondary'"
        style="width: 10px; height: 10px;"
        title="Status"
      ></span>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/firebase";
import { useRouter } from "vue-router";
import getUser from "@/composables/getUser";
import { doc, getDoc, onSnapshot } from "firebase/firestore";

const props = defineProps({
  groupID: {
    type: String,
    required: true,
  },
});

const group = ref({ groupPDP: "", groupName: "" });
const otherUserId = ref(null); // Store the other member's UID
const groupDoc = doc(db, "groups", props.groupID);
const authUser = getUser().user;
const router = useRouter();

const redirectToUserProfile = () => {
  if (otherUserId.value) {
    router.push(`/profile/${otherUserId.value}`);
  }
};

onMounted(async () => {
  const docSnap = await getDoc(groupDoc);
  if (docSnap.exists()) {
    const data = docSnap.data();
    const members = data.groupMembers || [];
    const myUid = authUser.value?.uid;
    const otherUid = members.find((uid) => uid !== myUid);
    if (otherUid) {
      otherUserId.value = otherUid; // Store for use in redirection
      const otherDoc = await getDoc(doc(db, "users", otherUid));
      if (otherDoc.exists()) {
        const other = otherDoc.data();
        group.value.groupPDP = other.pdp;
        group.value.groupName = other.firstname;
      }
    }
  }
});


const isOnline = ref(false);

onMounted(async () => {
  const docSnap = await getDoc(groupDoc);
  if (docSnap.exists()) {
    const data = docSnap.data();
    const members = data.groupMembers || [];
    const myUid = authUser.value?.uid;
    const otherUid = members.find((uid) => uid !== myUid);

    if (otherUid) {
      otherUserId.value = otherUid;
      const otherRef = doc(db, "users", otherUid);

      // Live status listener
      onSnapshot(otherRef, (userSnap) => {
        if (userSnap.exists()) {
          const userData = userSnap.data();
          group.value.groupPDP = userData.pdp;
          group.value.groupName = userData.firstname;
          isOnline.value = userData.isOnline;
        }
      });
    }
  }
});

</script>
