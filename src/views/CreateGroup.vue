<template>
  <div class="card shadow-sm p-4 mx-auto my-4" style="max-width: 600px">
    <h4 class="mb-4">Create New Group</h4>

    <form @submit.prevent="handleSubmit">
      <!-- Group Name -->
      <div class="mb-3">
        <label class="form-label">Group Name</label>
        <input
          type="text"
          class="form-control"
          v-model="name"
          placeholder="Enter group name"
          required
        />
      </div>

      <!-- Group Description -->
      <div class="mb-3">
        <label class="form-label">Description</label>
        <textarea
          class="form-control"
          v-model="text"
          rows="4"
          placeholder="Group description"
        ></textarea>
      </div>

      <!-- Group Image Upload -->
      <div class="mb-3">
        <label class="form-label">Group Image</label>
        <div
          class="border p-3 d-flex justify-content-center align-items-center"
          @dragover.prevent
          @drop="handleFileDrop"
          @click="triggerFileInput"
          style="cursor: pointer; min-height: 150px"
        >
          <input
            type="file"
            ref="fileInput"
            class="d-none"
            @change="handleFileSelect"
          />
          <span v-if="!groupPDP.value"
            >Drag & Drop or Click to Upload Image</span
          >
          <img
            v-if="groupPDP.value"
            :src="groupPDP.value"
            alt="Group Image"
            class="img-fluid"
            style="max-width: 100%; max-height: 150px; object-fit: cover"
          />
        </div>
      </div>

      <!-- Buttons Row -->
      <div class="d-flex align-items-center gap-3 mb-4">
        <button type="submit" class="btn btn-primary">
          <i class="bi bi-send-fill me-1"></i> Create Group
        </button>

        <!-- Add Members Dropdown -->
        <div class="dropdown">
          <button
            class="btn btn-secondary dropdown-toggle"
            type="button"
            @click="toggleDropdown"
            :aria-expanded="dropdownOpen"
          >
            <i class="bi bi-person-plus-fill me-1"></i> Add Members
          </button>

          <ul class="dropdown-menu p-2 shadow show" v-if="dropdownOpen">
            <!-- Search Users -->
            <input
              type="text"
              class="form-control mb-2"
              v-model="search"
              placeholder="Search users..."
            />
            <li
              v-for="user in filtered_users"
              :key="user.id"
              class="dropdown-item d-flex align-items-center gap-2"
              @click="
                () => {
                  selected.push(user.id);
                }
              "
              style="cursor: pointer"
            >
              <UserItem :UserId="user.id" />
            </li>
          </ul>
        </div>
      </div>
    </form>

    <!-- Selected Members -->
    <div v-if="selected.length" class="alert alert-info">
      <strong>Selected Members:</strong> {{ selected.length }}
    </div>
  </div>
</template>

<script setup>
import { db } from "@/firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import UserItem from "../components/UserItem.vue";
import getUser from "../composables/getUser";
import {
  getStorage,
  ref as storageRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

const storage = getStorage(); // Initialize Firebase Storage

// Define the `fileInput` reference here
const fileInput = ref(null); // This reference will point to the file input element

const groupsRef = collection(db, "groups");
const authuser = getUser().user;
const users = ref([]);
const name = ref("");
const text = ref("");
const search = ref("");
const dropdownOpen = ref(false);
const selected = ref([]);
const groupPDP = ref(""); // Store image URL

const filtered_users = computed(() => {
  return users.value
    .filter((user) => {
      return (
        user.firstname.toLowerCase().includes(search.value.toLowerCase()) &&
        !selected.value.includes(user.id) &&
        authuser.value.uid != user.id
      );
    })
    .slice(0, 15);
});

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const router = useRouter();

// New helper function to trigger file input click
const triggerFileInput = () => {
  if (fileInput.value) {
    fileInput.value.click(); // Use fileInput reference to trigger the click event
  }
};

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    uploadImage(file);
  }
};

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file) {
    uploadImage(file);
  }
};

const uploadImage = (file) => {
  const storagePath = `groupImages/${Date.now()}_${file.name}`;
  const fileRef = storageRef(storage, storagePath); // Use the storage instance
  const uploadTask = uploadBytesResumable(fileRef, file);

  uploadTask.on(
    "state_changed",
    (snapshot) => {
      // Track progress if needed
    },
    (error) => {
      console.log("Error uploading file:", error);
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        groupPDP.value = downloadURL; // Store the download URL
      });
    }
  );
};

const handleSubmit = async () => {
  try {
    let request = await addDoc(groupsRef, {
      groupName: name.value,
      groupBio: text.value,
      groupMembers: selected.value,
      groupPDP: groupPDP.value, // Save the image URL
      groupAdmins: [authuser.value.uid],
      isPrivate: false,
      lastMessage: "",
    });
  } catch (err) {
    console.log("can't add group", err);
  }
  try {
    for (let i = 0; i < selected.value.length; i++) {
      let userRef = doc(db, "users", selected.value[i]);
      updateDoc(userRef, {
        groups: arrayUnion(request.id),
      });
    }
    let userRef = doc(db, "users", authuser.value.uid);
    updateDoc(userRef, {
      groups: arrayUnion(request.id),
    });
  } catch (err) {
    console.log("can't modify users", err);
  }
  selected.value = [];
  name.value = "";
  text.value = "";
  dropdownOpen.value = false;
  router.push("/");
};

onMounted(async () => {
  const usersRef = collection(db, "users");
  const querySnapshot = await getDocs(usersRef);
  querySnapshot.forEach((doc) => {
    users.value.push({
      id: doc.id,
      ...doc.data(),
    });
  });
});
</script>
