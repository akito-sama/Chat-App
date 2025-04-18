<template>
    <div class="register-container">
      <form @submit.prevent="register" class="bg-light p-4 rounded shadow-sm">
        <div class="mb-2">
          <label for="firstname" class="form-label text-brown">First name :</label>
          <input type="text" id="firstname" placeholder="Username" v-model="firstname" class="form-control" />
        </div>
        <div class="mb-2">
          <label for="lastname" class="form-label text-brown">Last name :</label>
          <input type="text" id="lastname" placeholder="Username" v-model="lastname" class="form-control" />
        </div>
  
        <div class="mb-2">
          <label for="email" class="form-label text-brown">Email :</label>
          <input type="email" id="email" placeholder="Email" v-model="email" class="form-control" />
        </div>
  
        <div class="mb-2">
          <label for="password" class="form-label text-brown">Password :</label>
          <input type="password" id="password" placeholder="Password" v-model="password" class="form-control" />
        </div>
  
        <div class="mb-2">
          <label for="birthday" class="form-label text-brown">Birthday :</label>
          <input type="date" id="birthday" v-model="birthday" class="form-control" />
        </div>
  
        <div class="mb-2">
          <label for="pdp" class="form-label text-brown">Profile Picture :</label>
          <input type="text" id="pdp" placeholder="Enter image link (A default Icon will be generated)" v-model="pdp" class="form-control" />
        </div>
  
        <div class="mb-2">
          <label for="bio" class="form-label text-brown">Biographie :</label>
          <textarea id="bio" placeholder="Bio" v-model="bio" class="form-control"></textarea>
        </div>
  
        <div class="text-center">
          <button type="submit" class="btn btn-success">Submit</button>
        </div>
  
        <p v-if="error" class="text-danger text-center mt-3">{{ error }}</p>
      </form>
    </div>
  </template>
  
  <script setup>
  import useSignup from '@/composables/useSignup';
  
  const { email, password, firstname, lastname, bio, birthday, error, pdp, register } = useSignup();
  </script>
  
  <style scoped>
  .register-container {
    display: flex;
    justify-content: center;
    align-items: start;
    padding-top: 10px;
    padding-bottom: 40px;
    min-height: 100vh;
    background-color: #f2f7f3; /* Optional: light green background */
  }
  
  .main-title {
    color: #1e6b21; /* duck green */
    font-size: 2.5rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 40px;
    position: relative;
  }
  
  .main-title::after {
    content: '';
    display: block;
    width: 80px;
    height: 4px;
    background-color: #8B4513; /* duck brown */
    margin: 10px auto 0 auto;
    border-radius: 2px;
  }
  
  form {
    width: 100%;
    max-width: 600px;
  }
  
  .text-success {
    color: #4CAF50 !important; /* green text for heading */
    margin-top: 20px;
  }
  
  .text-brown {
    color: #8B4513; /* brown text for labels */
  }
  
  .bg-light {
    background-color: #f9f9f9; /* light background for form */
  }
  
  .form-control {
    border: 1px solid #8B4513; /* brown border for input fields */
  }
  
  .btn-success {
    background-color: #4CAF50; /* green button */
    border-color: #4CAF50;
  }
  
  .btn-success:hover {
    background-color: #45a049; /* slightly darker green on hover */
  }
  
  textarea.form-control {
    min-height: 100px;
  }
  
  .error {
    color: red;
  }
  </style>
