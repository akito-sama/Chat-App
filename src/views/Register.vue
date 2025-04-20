<template>
  <div class="register-container">
    <form @submit.prevent="register" class="bg-light p-4 rounded shadow-sm">
      <h2 class="text-center text-success main-title mb-4">Create an Account</h2>

      <!-- First & Last Name -->
      <div class="row mb-3">
        <div class="col">
          <label for="firstname" class="form-label text-brown">First Name</label>
          <input type="text" id="firstname" placeholder="First name" v-model="firstname" class="form-control" />
        </div>
        <div class="col">
          <label for="lastname" class="form-label text-brown">Last Name</label>
          <input type="text" id="lastname" placeholder="Last name" v-model="lastname" class="form-control" />
        </div>
      </div>

      <!-- Email & Password -->
      <div class="mb-3">
        <label for="email" class="form-label text-brown">Email</label>
        <input type="email" id="email" placeholder="Email" v-model="email" class="form-control" />
      </div>

      <div class="mb-3">
        <label for="password" class="form-label text-brown">Password</label>
        <input type="password" id="password" placeholder="Password" v-model="password" class="form-control" />
      </div>

      <!-- Birthday -->
      <div class="mb-3">
        <label for="birthday" class="form-label text-brown">Birthday</label>
        <input type="date" id="birthday" v-model="birthday" class="form-control" />
      </div>

      <!-- Profile Picture Upload -->
      <div class="mb-3">
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
        <small class="form-text text-muted">Or enter a direct image link below:</small>
        <input type="text" class="form-control mt-2" placeholder="https://example.com/image.jpg" v-model="pdp" />
      </div>

      <!-- Bio -->
      <div class="mb-3">
        <label for="bio" class="form-label text-brown">Biography</label>
        <textarea id="bio" placeholder="Tell us about yourself..." v-model="bio" class="form-control"></textarea>
      </div>

      <!-- Submit -->
      <div class="text-center">
        <button type="submit" class="btn btn-success px-4">Register</button>
      </div>

      <p v-if="error" class="text-danger text-center mt-3">{{ error }}</p>
    </form>
  </div>
</template>

  
<script setup>
import { ref } from 'vue';
import useSignup from '@/composables/useSignup';

const { email, password, firstname, lastname, bio, birthday, error, pdp, register } = useSignup();

// File upload handlers
const fileInput = ref(null);

function triggerFileInput() {
  fileInput.value?.click();
}

function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file && file.type.startsWith('image/')) {
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
  if (file && file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = () => {
      pdp.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
</script>

  
<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: start;
  padding-top: 10px;
  padding-bottom: 40px;
  min-height: 100vh;
  background-color: #f2f7f3;
}

.main-title {
  color: #1e6b21;
  font-size: 2.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  position: relative;
}

.main-title::after {
  content: '';
  display: block;
  width: 80px;
  height: 4px;
  background-color: #8B4513;
  margin: 10px auto 0 auto;
  border-radius: 2px;
}

form {
  width: 100%;
  max-width: 650px;
}

.text-brown {
  color: #8B4513;
}

.bg-light {
  background-color: #f9f9f9;
}

.form-control {
  border: 1px solid #8B4513;
}

textarea.form-control {
  min-height: 100px;
}

.btn-success {
  background-color: #4CAF50;
  border-color: #4CAF50;
}
.btn-success:hover {
  background-color: #45a049;
}

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
