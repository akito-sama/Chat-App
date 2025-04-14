<template>
    <nav class="d-flex justify-content-between align-items-center px-4 py-3 border-bottom shadow-sm bg-light">
        <!-- Brand -->
        <router-link to="/" class="btn btn-outline-primary d-flex align-items-center gap-2">
        <i class="bi bi-chat-dots-fill"></i>
        <span>Chat App</span>
        </router-link>

        <!-- Auth buttons -->
        <div class="account-options d-flex gap-2">
        <router-link to="/register" class="btn btn-outline-secondary d-flex align-items-center gap-1">
            <i class="bi bi-person-plus-fill"></i>
            <span>Register</span>
        </router-link>
        <router-link to="/login" class="btn btn-primary d-flex align-items-center gap-1">
            <i class="bi bi-box-arrow-in-right"></i>
            <span>Login</span>
        </router-link>
        </div>
    </nav>
</template>
  