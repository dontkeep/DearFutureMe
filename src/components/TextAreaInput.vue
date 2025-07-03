<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-8">
    <div class="w-full max-w-2xl bg-gray-800/90 rounded-3xl shadow-2xl p-6 flex flex-col items-center pb-3">
      <h1 class="text-2xl md:text-3xl font-bold text-gray-100 mb-2 text-center drop-shadow">
        A letter from {{ creationDate }}
      </h1>
      <p class="text-gray-400 mb-2 text-center text-sm">
        Your message will be delivered in....
      </p>
      <div class="flex flex-wrap gap-2 mb-8 w-full justify-center">
        <button
          v-for="option in options"
          :key="option.label"
          @click="selectOption(option)"
          :class="['px-4 py-2 rounded-lg font-medium transition', selectedOption.label === option.label ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600']"
        >
          {{ option.label }}
        </button>
        <input
          type="date"
          v-model="customDate"
          @change="selectCustomDate"
          class="bg-gray-700 text-gray-200 rounded-lg px-3 py-2 border-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <input
        v-model="email"
        type="email"
        class="w-full mb-4 p-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 border border-gray-600 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition"
        placeholder="Recipient's email address"
        required
      />
      <textarea
        v-model="text"
        class="w-full h-72 md:h-96 p-4 rounded-2xl shadow-inner border border-gray-700 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 bg-gray-900 text-sm text-gray-100 resize-none transition-all duration-200 outline-none placeholder-gray-500"
        placeholder="Write your message to your future self..."
      ></textarea>
      <div class="w-full flex justify-between items-end mt-2">
        <span class="text-xs text-gray-400 select-none">
          {{ wordCount }} words • {{ charCount }} chars
        </span>
        <button
          class="px-4 py-2 text-xs rounded-lg font-medium bg-indigo-500 text-white shadow hover:bg-indigo-600 transition"
          @click="sendLetter"
        >
          Send Letter
        </button>
      </div>
    </div>
  </div>
  <footer class="w-full fixed bottom-0 left-0 flex justify-center items-center pb-3 z-50">
    <span class="text-xs text-gray-500 select-none">
      &copy; 2025 made with <span class="text-pink-400" aria-label="love" title="love">❤</span> by Loyalty
    </span>
  </footer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const text = ref('')
const email = ref('')
const today = new Date()
const creationDate = computed(() => {
  const day = today.getDate();
  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  const month = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  return `${getOrdinal(day)} of ${month} ${year}`;
})

const options = [
  { label: '1 month', value: 1 },
  { label: '3 months', value: 3 },
  { label: '6 months', value: 6 },
  { label: '12 months', value: 12 },
]
const selectedOption = ref(options[0])
const customDate = ref('')

function selectOption(option: { label: string, value: number }) {
  selectedOption.value = option
  customDate.value = ''
}

function selectCustomDate() {
  selectedOption.value = { label: 'Custom', value: 0 }
}

const wordCount = computed(() => {
  if (!text.value.trim()) return 0;
  return text.value.trim().split(/\s+/).length;
});
const charCount = computed(() => text.value.length)

function sendLetter() {
  // Placeholder for sending logic
  alert('Your letter has been sent!');
}
</script>

