<template>
    <div>
        <img :src="groupPDP" alt="" width="52px" height="52px">
        <p>{{groupName}}</p>
    </div>
</template>

<script setup>
import { db } from "@/firebase";
import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { onMounted, ref } from "vue";


let props = defineProps({
    GroupId: String,
});

let groupName = ref("");
let groupPDP = ref(""); 


const groupRef = doc(db, "groups", props.GroupId);
onSnapshot(groupRef, (docSnap) => {
    if (docSnap.exists()) {
        let docData = docSnap.data();
        groupName.value = docData.groupName;
        groupPDP.value = docData.groupPDP;
    } else {
        console.log("No such document!");
  }
});

onMounted(async () => {
    let docSnap = await getDoc(groupRef);
    if (docSnap.exists()) {
        groupName.value = docSnap.data().groupName;
        groupPDP.value = docSnap.data().groupPDP;
    } else {
        console.log("No such document!");
    }
});

</script>

<style scoped>
</style>
