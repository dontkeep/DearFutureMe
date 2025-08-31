<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue';
import TextAreaInput from '@/components/TextAreaInput.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gradient-to-br from-gray-100 to-white dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-500">
    <!-- ✅ Reusable Navbar -->
    <AppNavbar :is-logged-in="true" />

    <!-- ✅ Main Content Area -->
    <main class="flex justify-center">
      <div class="w-full flex-row-reverse">
        <section class="items-center">
          <TextAreaInput />
        </section>
      </div>
    </main>

    <!-- ✅ Footer -->
    <footer class="text-center py-2 text-sm text-gray-500 dark:text-gray-400">
      &copy; 2025 Whisper • Made with <span class="text-pink-400">❤</span> by Loyalty
    </footer>
  </div>
</template>

<style scoped>
main {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
