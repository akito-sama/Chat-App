<template>
    <div class="profile-container">
      <div class="profile-header text-center">
        <img
          :src="user.pdp || '/default-profile.png'"
          alt="Profile Picture"
          class="profile-img rounded-circle"
        />
        <h2 class="mt-3">{{ user.firstname }} {{ user.lastname }}</h2>
        <p class="text-muted">{{ user.bio || 'No bio available.' }}</p>
      </div>
  
      <div class="profile-details mt-4">
        <div class="profile-detail-item">
          <strong>Email: </strong>
          <span>{{ user.email }}</span>
        </div>
        <div class="profile-detail-item">
          <strong>Birthday: </strong>
          <span>{{ formatDate(user.birthday) }}</span>
        </div>
        <div class="profile-detail-item">
          <strong>Member since: </strong>
          <span>{{ formatDate(user.createdAt) }}</span>
        </div>
      </div>
  
      <div class="d-flex justify-content-center mt-4">
        <button @click="editProfile" class="btn btn-primary">Edit Profile</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router'; // To get route params
  import { db } from '@/firebase'; // Firebase setup
  import { doc, getDoc } from 'firebase/firestore';
  
  // Create a reference for user data
  const user = ref({
    firstname: '',
    lastname: '',
    email: '',
    birthday: null,
    bio: '',
    pdp: '',
    createdAt: null,
  });
  
  // Get route parameters
  const route = useRoute();
  const userId = route.params.userId; // Get the uid from the route
  
  // Fetch user data from Firestore
  onMounted(async () => {
    const userDocRef = doc(db, 'users', userId);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      user.value = docSnap.data();
    } else {
      console.log("No such user found!");
    }
  });
  
  // Format the date (could be birthday or creation date)
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  // Edit profile function (just a placeholder here)
  const editProfile = () => {
    // Logic for editing profile, could navigate to an edit page or open a modal
    console.log("Edit profile clicked");
  };
  </script>
  
  <style scoped>
  .profile-container {
    max-width: 600px;
    margin: 0 auto;
    padding: 2rem;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .profile-header {
    margin-bottom: 2rem;
  }
  
  .profile-img {
    width: 120px;
    height: 120px;
    object-fit: cover;
    border: 2px solid #ddd;
  }
  
  .profile-details {
    font-size: 1rem;
    line-height: 1.5;
  }
  
  .profile-detail-item {
    margin-bottom: 1rem;
  }
  
  .profile-detail-item strong {
    color: #333;
  }
  
  .d-flex {
    display: flex;
  }
  
  .justify-content-center {
    justify-content: center;
  }
  
  button {
    width: 200px;
  }
  </style>
  