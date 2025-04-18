<template>
    <div class="login-container">
      <form @submit.prevent="login" class="p-4 rounded shadow-sm">
        <div class="mb-3">
          <label for="email" class="form-label text-brown">Email :</label>
          <input type="email" id="email" placeholder="Email" v-model="email" class="form-control" />
        </div>
  
        <div class="mb-3">
          <label for="password" class="form-label text-brown">Password :</label>
          <input type="password" id="password" placeholder="Password" v-model="password" class="form-control" />
        </div>
  
        <div class="mb-3 text-end">
          <a href="#" @click.prevent="forgotPassword" class="text-decoration-none text-brown small">Forgot Password?</a>
        </div>
  
        <div class="text-center">
          <button type="submit" class="btn btn-success w-100">Login</button>
        </div>
  
        <p v-if="error" class="text-danger text-center mt-3">{{ error }}</p>
        <p v-if="successMessage" class="text-success text-center mt-3">{{ successMessage }}</p>
  
        <hr />
  
        <p class="text-center mt-3 mb-0 text-brown">Don’t have an account?</p>
        <div class="text-center">
          <router-link to="/register" class="btn btn-outline-success mt-2">Register</router-link>
        </div>
      </form>
    </div>
  </template>
    
  
  <script setup>
  import { ref } from 'vue'
  import useLogin from '@/composables/useLogin'
  import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
  import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore'
  
  const { email, password, error, login } = useLogin()
  const successMessage = ref('')
  
  const forgotPassword = async () => {
    const auth = getAuth()
    const db = getFirestore()
    error.value = ''
    successMessage.value = ''
  
  
    if (!email.value) {
      error.value = 'Please enter your email to reset your password.'
      return
    }
  
  
    try {
      // Step 1: Look for a user in Firestore with the provided email
      const q = query(collection(db, 'users'), where('email', '==', email.value.trim().toLowerCase()))
      const querySnapshot = await getDocs(q)
  
      if (querySnapshot.empty) {
        error.value = 'No user found with this email in the database.'
        return
      }
  
      // Step 2: Send the password reset email
      await sendPasswordResetEmail(auth, email.value.trim().toLowerCase())
      successMessage.value = 'Password reset email sent. Check your inbox.'
    } catch (err) {
      error.value = err.message
    }
  }
  </script>
  
  
  <style scoped>
  .login-container {
    display: flex;
    justify-content: center;
    align-items: start;
    padding-top: 10px;
    padding-bottom: 40px;
    min-height: 100vh;
    background-color: #f2f7f3; /* light green background */
  }
  
  form {
    width: 100%;
    max-width: 500px;
  }
  
  .main-title {
    color: #4CAF50; /* duck green */
    font-size: 2.5rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 40px;
    margin-bottom: 30px;
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
  
  .text-brown {
    color: #8B4513;
  }
  
  .bg-light {
    background-color: #f9f9f9;
  }
  
  .form-control {
    border: 1px solid #8B4513;
  }
  
  .btn-success {
    background-color: #4CAF50;
    border-color: #4CAF50;
  }
  
  .btn-success:hover {
    background-color: #45a049;
  }
  
  .btn-outline-success {
    color: #4CAF50;
    border-color: #4CAF50;
  }
  
  .btn-outline-success:hover {
    background-color: #4CAF50;
    color: white;
  }
  
  </style>