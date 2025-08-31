<template>
  <nav
    class="w-full flex justify-between items-center px-8 py-6 bg-whisperGray/80 dark:bg-gray-900 backdrop-blur-md shadow-md sticky top-0 z-50 transition-all duration-300"
    aria-label="Main navigation"
  >
    <!-- Left: Logo + Catchphrase -->
    <div class="flex flex-col items-start">
      <h1 class="text-4xl font-extrabold text-whisperDark dark:text-white transition-all duration-300">
        W<span class="text-blue-300">hi</span>sper
      </h1>
      <p class="italic text-sm text-gray-500 dark:text-gray-400 mt-1 opacity-80">
        Echoes of today for the heart of tomorrow.
      </p>
    </div>

    <!-- Desktop Navigation -->
    <div class="hidden md:flex gap-6 items-center">
      <router-link
        v-for="(link, i) in navLinks"
        :key="i"
        :to="link.to"
        class="relative text-whisperDark dark:text-gray-200 font-medium hover:text-primary transition duration-200 group"
      >
        {{ link.label }}
        <span class="absolute left-0 bottom-0 w-0 h-[2px] bg-primary transition-all duration-200 group-hover:w-full"></span>
      </router-link>

      <!-- Username with outline -->
      <div class="relative" ref="dropdownRef">
        <button
          @click.stop="toggleDropdown"
          :aria-expanded="isDropdownOpen"
          aria-haspopup="true"
          class="flex items-center gap-2 px-3 py-1 rounded-full font-semibold
                 bg-white/10 dark:bg-white/10 text-whisperDark dark:text-white
                 border border-gray-300 dark:border-gray-600 hover:border-primary transition-all duration-200
                 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <span>{{ username }}</span>
          <svg class="w-4 h-4 transform transition-transform" :class="{'rotate-180': isDropdownOpen}" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd" />
          </svg>
        </button>

        <!-- Dropdown -->
        <transition name="fade">
          <div
            v-if="isDropdownOpen"
            class="absolute right-0 mt-3 w-52 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 z-50"
          >
            <router-link to="/profile" class="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Profile</router-link>
            <router-link to="/settings" class="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Settings</router-link>
            <router-link to="/account" class="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">Account Settings</router-link>

            <div class="border-t dark:border-gray-700 my-2"></div>

            <!-- Theme toggle -->
            <div class="flex items-center justify-between px-3 py-2">
              <span class="text-sm text-gray-700 dark:text-gray-200">Theme</span>
              <label class="inline-flex items-center cursor-pointer relative">
                <input type="checkbox" class="sr-only peer" v-model="isDarkMode" />
                <span class="w-11 h-6 bg-gray-200 dark:bg-gray-600 rounded-full transition peer-checked:bg-primary block"></span>
                <span class="absolute left-[5px] w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-5"></span>
              </label>
            </div>

            <button @click="logout" class="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 dark:hover:text-red-100 dark:hover:bg-red-600 rounded">Logout</button>
          </div>
        </transition>
      </div>
    </div>

    <!-- Mobile -->
    <div class="flex md:hidden items-center gap-3">
      <!-- Theme toggle (consistent with LoginPage.vue) -->
      <button 
        @click="isDarkMode = !isDarkMode" 
        class="rounded-full shadow-lg hover:scale-110 transition-transform duration-300 flex items-center justify-center"
        :class="[isDarkMode ? 'bg-yellow-400 text-gray-900' : 'bg-gray-200 text-blue-500', 'p-3 md:p-4 text-lg md:text-xl']"
        title="Toggle theme"
        :aria-pressed="isDarkMode"
      >
        <i 
          :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'" 
          class="transition-transform duration-500"
          :style="{ transform: isDarkMode ? 'rotate(180deg)' : 'rotate(0deg)' }"
        ></i>
      </button>

      <!-- Hamburger -->
      <button
        @click.stop="toggleMobileMenu"
        :aria-expanded="isMobileMenuOpen"
        aria-label="Open mobile menu"
        class="relative w-10 h-10 flex flex-col justify-center items-center space-y-1 rounded-full bg-white/10 dark:bg-white/10 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <span :class="['block w-6 h-0.5 bg-current transition-all', isMobileMenuOpen ? 'rotate-45 translate-y-2' : '']"></span>
        <span :class="['block w-6 h-0.5 bg-current transition-all', isMobileMenuOpen ? 'opacity-0' : '']"></span>
        <span :class="['block w-6 h-0.5 bg-current transition-all', isMobileMenuOpen ? '-rotate-45 -translate-y-2' : '']"></span>
      </button>
    </div>

    <!-- Mobile menu -->
    <transition name="slide-down">
      <div
        v-if="isMobileMenuOpen"
        ref="mobileMenuRef"
        class="absolute top-full left-0 right-0 bg-white dark:bg-gray-900 shadow-md z-40 md:hidden"
      >
        <div class="px-4 py-4 flex flex-col gap-2">
          <router-link
            v-for="(link, idx) in navLinks"
            :key="'m-'+idx"
            :to="link.to"
            class="px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
            @click="closeAll"
          >
            {{ link.label }}
          </router-link>

          <div class="border-t dark:border-gray-700 my-2"></div>

          <div class="px-3 py-2">
            <div class="font-semibold mb-2">{{ username }}</div>
            <router-link to="/profile" class="block px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Profile</router-link>
            <router-link to="/settings" class="block px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Settings</router-link>
            <router-link to="/account" class="block px-2 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800">Account Settings</router-link>

            <button @click="logout" class="mt-3 w-full text-left px-2 py-2 text-red-600 rounded hover:bg-red-50 dark:hover:bg-red-600 dark:hover:text-red-50">Logout</button>
          </div>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';

const props = defineProps<{ isLoggedIn?: boolean }>();
const username = 'JohnDoe';

const dropdownRef = ref<HTMLElement | null>(null);
const mobileMenuRef = ref<HTMLElement | null>(null);
const isDropdownOpen = ref(false);
const isMobileMenuOpen = ref(false);
let ignoreNextHamburger = false;
const isDarkMode = ref(false);

const navLinks = computed(() => {
  return props.isLoggedIn
    ? [
        { label: 'Trending', to: '/trending' },
        { label: 'Write a Letter', to: '/write' },
        { label: 'My Letters', to: '/letters' },
      ]
    : [
        { label: 'Trending', to: '/trending' },
        { label: 'Sign In', to: '/signin' },
      ];
});

function handleClickOutside(e: MouseEvent) {
  const target = e.target as Node | null;
  if (isDropdownOpen.value && dropdownRef.value && !dropdownRef.value.contains(target)) {
    isDropdownOpen.value = false;
  }
  if (isMobileMenuOpen.value && mobileMenuRef.value && !mobileMenuRef.value.contains(target)) {
    isMobileMenuOpen.value = false;
    ignoreNextHamburger = true;
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside);
  const saved = localStorage.getItem('theme');
  isDarkMode.value = saved === 'dark';
  document.documentElement.classList.toggle('dark', isDarkMode.value);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside);
});

watch(isDarkMode, (val) => {
  document.documentElement.classList.toggle('dark', val);
  localStorage.setItem('theme', val ? 'dark' : 'light');
});

const toggleDropdown = () => {
  if (isDropdownOpen.value) {
    isDropdownOpen.value = false;
  } else {
    isDropdownOpen.value = true;
    isMobileMenuOpen.value = false;
  }
};


const toggleMobileMenu = () => {
  if (ignoreNextHamburger) {
    ignoreNextHamburger = false;
    return;
  }
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
  if (isMobileMenuOpen.value) {
    isDropdownOpen.value = false;
  }
};

function closeAll() {
  isDropdownOpen.value = false;
  isMobileMenuOpen.value = false;
}

function logout() {
  localStorage.removeItem('token');
  window.location.href = '/login';
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 160ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-down-enter-active {
  animation: slideDownIn 220ms ease forwards;
}
.slide-down-leave-active {
  animation: slideDownOut 180ms ease forwards;
}
@keyframes slideDownIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes slideDownOut {
  from { opacity: 1; transform: translateY(0); }
  to { opacity: 0; transform: translateY(-6px); }
}
</style>
