<template>
  <nav class="w-full flex justify-between items-center px-6 py-4 bg-whisperGray/80 backdrop-blur-md shadow-md sticky top-0 z-50">
    <div class="text-xl font-semibold text-whisperDark">Whisper</div>
    <div class="flex gap-4">
      <router-link to="/login" class="text-whisperDark hover:text-whisperPink transition">Login</router-link>
      <router-link to="/register" class="text-whisperDark hover:text-whisperPink transition">Register</router-link>
    </div>
  </nav>
</template>