<template>
    <div class="d-flex align-items-center gap-2">
        <img :src="userPDP" alt="" width="52px" height="52px">
        <div>
            <p>{{username}}</p>
        </div>
    </div>
</template>

<script setup>
import { db } from "@/firebase";
import { collection, doc, getDoc, onSnapshot, orderBy, query } from "firebase/firestore";
import { onMounted, ref } from "vue";


let props = defineProps({
    UserId: String,
});

let username = ref("");
let userPDP = ref(""); 


const userRef = doc(db, "users", props.UserId);


onMounted(async () => {
    let docSnap = await getDoc(userRef);
    if (docSnap.exists()) {
        username.value = docSnap.data().firstname;
        userPDP.value = docSnap.data().pdp;
    } else {
        console.log("No such document!");
    }
});

</script>

<style scoped>
</style>
