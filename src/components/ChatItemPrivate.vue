<template>
  <div class="d-flex align-items-center gap-2">
    <img
      :src="PDP"
      alt="PDP"
      class="rounded-circle"
      width="40"
      height="40"
    />
    <span>{{ Name }}</span>
  </div>
</template>

<script setup>
import getUser from "@/composables/getUser";
import { db } from "@/firebase";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { onMounted, ref } from "vue";

const props = defineProps({ GroupId: String });

let user = getUser().user.value;
let useruid = user ? user.uid : null;
let Name = ref("");
let PDP = ref("");

const groupRef = doc(db, "groups", props.GroupId);

onMounted(async () => {
  if (!useruid) return; // Prevent error if not logged in
  let docSnap = await getDoc(groupRef);
  if (docSnap.exists()) {
    let members = docSnap.data().groupMembers;
    let other_uid = members[0] === useruid ? members[1] : members[0];
    let docSnapOther = await getDoc(doc(db, "users", other_uid));
    if (docSnapOther.exists()) {
      Name.value = docSnapOther.data().firstname;
      PDP.value = docSnapOther.data().pdp;
    }
  }
});
</script>

