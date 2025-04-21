<template>
  <h1 class="text-center mt-5">Profile Page</h1>
  <div class="container mt-4">
    <div class="row">
      <div class="col-md-4">
        <button
          v-if="user.id === connectedUser?.uid"
          class="btn btn-outline-primary mb-3"
          @click="changingProfile = !changingProfile"
        >
          <i class="bi bi-pencil-fill"></i>
          {{ changingProfile ? "Cancel" : "Edit Profile" }}
        </button>
        <div v-if="changingProfile" class="mb-3">
          <label class="form-label text-brown">Profile Picture</label>
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
            <div v-if="!pdp" class="upload-placeholder">
              <i class="bi bi-person-circle fs-1 text-primary"></i>
              <p class="text-muted mb-0">Click or drag a profile image</p>
            </div>
            <div v-else class="position-relative">
              <img
                :src="pdp"
                alt="Profile Picture"
                class="img-fluid rounded shadow-sm"
                style="max-height: 200px; object-fit: cover"
                width="36"
                height="36"
              />
              <button
                type="button"
                class="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                @click.stop="pdp = ''"
              >
                <i class="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
          <small class="form-text text-muted"
            >Or enter a direct image link below:</small
          >
          <input
            type="text"
            class="form-control mt-2"
            placeholder="https://example.com/image.jpg"
            v-model="pdp"
          />
        </div>
        <div v-else>
          <img
            :src="user?.pdp"
            alt="Profile Picture"
            class="img-fluid rounded-circle mb-3"
            width="100"
            height="100"
          />
        </div>
        <div v-if="changingProfile" class="mb-3">
          <label for="firstname" class="form-label text-brown"
            >First Name</label
          >
          <input
            type="text"
            id="firstname"
            v-model="user.firstname"
            class="form-control"
          />
          <label for="lastname" class="form-label text-brown">Last Name</label>
          <input
            type="text"
            id="lastname"
            v-model="user.lastname"
            class="form-control"
          />
        </div>
        <div v-else>
          <h2 class="text-center">
            {{ user?.firstname }} {{ user?.lastname }}
          </h2>
          <p class="text-muted text-center">{{ user?.email }}</p>
          <p class="text-muted text-center">Birthday: {{ user.birthday }}</p>
          <p class="text-muted text-center">
            Joined:
            {{
              user?.createdAt?.toDate()?.toLocaleDateString() ||
              new Date(user.createdAt).toLocaleTimeString()
            }}
          </p>
        </div>
      </div>
      <div class="col-md-8">
        <h3>About</h3>
        <textarea
          v-if="changingProfile"
          class="form-control"
          v-model="user.bio"
          rows="5"
        ></textarea>
        <p v-else class="text-muted">{{ user?.bio }}</p>
      </div>
      <button
        v-if="changingProfile"
        class="btn btn-primary mt-3"
        @click="saveChanges"
      >
        <i class="bi bi-save"></i> Save Changes
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

const connectedUser = inject("userDoc");
const route = useRoute();
const user = ref({
  firstname: "",
  lastname: "",
  pdp: "",
  bio: "",
  birthday: null,
  createdAt: null,
});
let userId = route.params.id;
const pdp = ref("");
const changingProfile = ref(false);

// Watch router in case the id changes
watch(
  () => route.params.id,
  (newId) => {
    userId = newId;
    fetchUser();
  }
);

async function fetchUser() {
  try {
    const userDoc = await getDoc(doc(db, "users", userId));
    if (userDoc.exists()) {
      user.value = {
        id: userDoc.id,
        ...userDoc.data(),
      };
      pdp.value = user.value.pdp || ""; // Initialize pdp with current value
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }
}

onMounted(async () => {
  await fetchUser();
});

// File upload handlers
const fileInput = ref(null);

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      pdp.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

function handleFileDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = () => {
      pdp.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
}

async function saveChanges() {
  if (!changingProfile.value) return;

  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      firstname: user.value.firstname,
      lastname: user.value.lastname,
      pdp: pdp.value,
      bio: user.value.bio,
    });
    changingProfile.value = false;
  } catch (error) {
    console.error("Error updating profile:", error);
  }
}
</script>

<style scoped>
.container {
  background-color: #f8f5f0;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 8px 16px rgba(139, 109, 59, 0.1);
}

h1 {
  color: #4a6741;
  font-family: "Segoe UI", sans-serif;
  position: relative;
}

h1::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #8b6d3b, #4a6741);
  border-radius: 2px;
}

.text-brown {
  color: #8b6d3b;
}

.btn-outline-primary {
  color: #4a6741;
  border-color: #4a6741;
  transition: all 0.3s ease;
}

.btn-outline-primary:hover {
  background-color: #4a6741;
  color: #f8f5f0;
  transform: translateY(-2px);
}

.upload-box {
  background-color: #fff;
  border: 2px dashed #8b6d3b !important;
  transition: all 0.3s ease;
  cursor: pointer;
}

.upload-box:hover {
  border-color: #4a6741 !important;
  background-color: #f8f5f0;
}

.upload-placeholder {
  color: #8b6d3b;
}

.img-fluid {
  border: 4px solid #f8f5f0;
  box-shadow: 0 4px 12px rgba(139, 109, 59, 0.15);
  transition: transform 0.3s ease;
}

.img-fluid:hover {
  transform: scale(1.02);
}

.form-control {
  border: 2px solid #e0d5c1;
  border-radius: 8px;
  padding: 0.75rem;
  transition: all 0.3s ease;
}

.form-control:focus {
  border-color: #8b6d3b;
  box-shadow: 0 0 0 0.2rem rgba(139, 109, 59, 0.25);
}

textarea.form-control {
  background-color: #fff;
  min-height: 150px;
}

.btn-primary {
  background-color: #4a6741;
  border-color: #4a6741;
  padding: 0.75rem 2rem;
  border-radius: 25px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: #3d5635;
  border-color: #3d5635;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(74, 103, 65, 0.2);
}

.btn-danger {
  background-color: #c77366;
  border-color: #c77366;
}

.text-muted {
  color: #8b6d3b !important;
  font-size: 0.9rem;
}

h2 {
  color: #4a6741;
  margin-top: 1rem;
}

h3 {
  color: #8b6d3b;
  margin-bottom: 1rem;
  position: relative;
  display: inline-block;
}

h3::after {
  content: "";
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, #8b6d3b, transparent);
}

.col-md-4,
.col-md-8 {
  padding: 1.5rem;
}

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }

  .col-md-4,
  .col-md-8 {
    padding: 1rem;
  }
}
</style>
