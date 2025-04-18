<template>
    <div v-for="group in groups" :key="group.id">
        <ChatItem :GroupId="group.id"/>
    </div>
</template>


<script setup>
import { collection, getDocs } from "firebase/firestore";
import ChatItem from "./ChatItem.vue";
import { db } from "@/firebase";
import { onMounted, ref } from "vue";


let groups = ref([]);
let groupsRef = collection(db, "groups");
onMounted(async () => {
    let querySnapshot = await getDocs(groupsRef);
    querySnapshot.forEach((doc) => {
        groups.value.push({
            id: doc.id,
            ...doc.data(),
        });
    });
    console.log(groups);
});
let docs = getDocs(groupsRef);
</script>

<style scoped>

</style>