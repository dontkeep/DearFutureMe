<template>
  <div 
    :class="darkMode ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100' : 'bg-gradient-to-br from-blue-100 to-white text-gray-900'" 
    class="min-h-screen flex flex-col transition-all duration-500"
  >
    <!-- Header -->
    <header class="flex justify-between items-center px-8 py-6">
      <div>
        <h1 class="text-4xl font-extrabold">
          W<span class="text-blue-300">hi</span>sper
        </h1>
        <p class="italic text-sm opacity-80 mt-1">Echoes of today for the heart of tomorrow.</p>
      </div>

      <button 
        @click="toggleTheme" 
        class="rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center"
        :class="[
          darkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-blue-500',
          'p-3 md:p-4 text-lg md:text-xl'
        ]"
      >
        <i 
          :class="darkMode ? 'fas fa-sun' : 'fas fa-moon'" 
          class="transition-transform duration-500"
          :style="{ transform: darkMode ? 'rotate(180deg)' : 'rotate(0deg)' }"
        ></i>
      </button>
    </header>

    <!-- Login Card -->
    <div class="flex-grow flex justify-center items-center">
      <transition name="scale-fade" mode="out-in">
         <div 
          :key="darkMode ? 'dark' : 'light'"
          class="w-full max-w-md p-8 rounded-2xl shadow-xl transition-all duration-200 animate-fadeIn"
          :class="darkMode ? 'bg-gray-800' : 'bg-white'"
        >
          <h2 class="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
          <form @submit.prevent="login" class="flex flex-col space-y-4">
            <input v-model="email" type="email" placeholder="Email" class="input-field" />
            <input v-model="password" type="password" placeholder="Password" class="input-field" />

            <button type="submit" class="btn-primary">
              <i class="fas fa-sign-in-alt mr-2"></i> Login
            </button>
          </form>

          <p class="text-center text-sm mt-4">
            Don't have an account?
            <router-link to="/register" class="text-primary hover:underline"> Register</router-link>
          </p>
        </div>
      </transition>
    </div>

    <!-- Footer -->
    <footer class="text-center py-4 text-sm"
            :class="darkMode ? 'text-gray-400' : 'text-gray-600'">
      &copy; 2025 Whisper • Made with <span class="text-pink-400">❤</span> by Loyalty
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const darkMode = ref(false)
const email = ref('')
const password = ref('')

// Restore theme from localStorage
if (localStorage.getItem('theme') === 'dark') {
  darkMode.value = true
}

watch(darkMode, (val) => {
  localStorage.setItem('theme', val ? 'dark' : 'light')
})

function toggleTheme() {
  darkMode.value = !darkMode.value
}

function login() {
  console.log('Logging in with:', email.value, password.value)
  // TODO: Axios login logic
}
</script>

<style scoped>
.input-field {
  @apply w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 
         dark:bg-gray-700 text-gray-700 dark:text-gray-100 
         focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300;
}
.btn-primary {
  @apply w-full py-3 bg-primary text-white font-bold rounded-lg 
         hover:bg-primary-dark transition flex items-center justify-center;
}
.text-primary {
  color: #3b82f6;
}

/* Animation for card */
.scale-fade-enter-active,
.scale-fade-leave-active {
  transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1); /* fast & smooth */
}
.scale-fade-enter-from {
  opacity: 0;
  transform: scale(0.95);
}
.scale-fade-enter-to {
  opacity: 1;
  transform: scale(1);
}
.scale-fade-leave-from {
  opacity: 1;
  transform: scale(1);
}
.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
