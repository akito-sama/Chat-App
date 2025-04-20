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
          class="upload-box border rounded-3 p-3 text-center position-relative"
          @dragover.prevent
          @drop="handleFileDrop"
          @click="triggerFileInput"
        >
          <input
            type="file"
            ref="fileInput"
            class="d-none"
            @change="handleFileSelect"
          />

          <div v-if="!groupPDP" class="upload-placeholder">
            <i class="bi bi-cloud-arrow-up fs-1 text-primary"></i>
            <p class="text-muted mb-0">Click or drag an image here</p>
          </div>

          <div v-else class="position-relative">
            <img
              :src="groupPDP"
              alt="Group Image"
              class="img-fluid rounded shadow-sm"
              style="max-height: 200px; object-fit: cover"
            />
            <button
              type="button"
              class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
              @click.stop="groupPDP = ''"
            >
              <i class="bi bi-x-lg"></i>
            </button>
          </div>
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
              @click="() => selected.push(user.id)"
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { db } from "@/firebase";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import UserItem from "../components/UserItem.vue";
import getUser from "../composables/getUser";

// Refs & state
const fileInput = ref(null);
const name = ref("");
const text = ref("");
const search = ref("");
const dropdownOpen = ref(false);
const selected = ref([]);
const groupPDP = ref("");
const users = ref([]);
const authuser = getUser().user;
const groupsRef = collection(db, "groups");

const router = useRouter();

// Computed for user search
const filtered_users = computed(() =>
  users.value
    .filter(
      (user) =>
        user.firstname.toLowerCase().includes(search.value.toLowerCase()) &&
        !selected.value.includes(user.id) &&
        authuser.value.uid !== user.id
    )
    .slice(0, 15)
);

// File input trigger
const triggerFileInput = () => {
  if (fileInput.value) fileInput.value.click();
};

// Upload helper (now included!)
const uploadImage = async (file) => {
  await uploadImageToGitHub(file);
};

// GitHub upload logic
const uploadImageToGitHub = async (file) => {
  const reader = new FileReader();
  reader.onload = async () => {
    const base64Content = reader.result.split(",")[1];
    const fileName = `${Date.now()}_${file.name}`;
    const repoOwner = "MouadBensafir";
    const repoName = "ImageUpload";
    const branch = "main";
    const githubToken = "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";

    const response = await fetch(
      `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${fileName}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${githubToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Add group image ${fileName}`,
          content: base64Content,
        }),
      }
    );

    if (!response.ok) {
      console.error("GitHub Upload Error:", await response.text());
      return;
    }

    const data = await response.json();
    groupPDP.value = data.content.download_url;
  };

  reader.readAsDataURL(file);
};

// File input + drop logic
const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) uploadImage(file);
};

const handleFileDrop = (event) => {
  const file = event.dataTransfer.files[0];
  if (file) uploadImage(file);
};

// Dropdown toggle
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Form submit
const handleSubmit = async () => {
  try {
    const request = await addDoc(groupsRef, {
      groupName: name.value,
      groupBio: text.value,
      groupMembers: selected.value,
      groupPDP: groupPDP.value,
      groupAdmins: [authuser.value.uid],
      isPrivate: false,
      lastMessage: "",
    });

    // Update group refs for each user
    for (let i = 0; i < selected.value.length; i++) {
      const userRef = doc(db, "users", selected.value[i]);
      await updateDoc(userRef, {
        groups: arrayUnion(request.id),
      });
    }

    const creatorRef = doc(db, "users", authuser.value.uid);
    await updateDoc(creatorRef, {
      groups: arrayUnion(request.id),
    });

    // Cleanup
    selected.value = [];
    name.value = "";
    text.value = "";
    groupPDP.value = "";
    dropdownOpen.value = false;
    router.push("/");
  } catch (err) {
    console.error("Group creation error:", err);
  }
};

// Load users
onMounted(async () => {
  const usersRef = collection(db, "users");
  const querySnapshot = await getDocs(usersRef);
  querySnapshot.forEach((doc) => {
    users.value.push({ id: doc.id, ...doc.data() });
  });
});
</script>

<style scoped>
.upload-box {
  background-color: #f8f9fa;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out, border-color 0.2s;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.upload-box:hover {
  background-color: #e9ecef;
  border-color: #0d6efd;
}
.upload-placeholder i {
  transition: transform 0.3s ease-in-out;
}
.upload-box:hover .upload-placeholder i {
  transform: scale(1.2);
}
</style>
