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
          :min="new Date().toISOString().split('T')[0]"
          class="bg-gray-700 text-gray-200 rounded-lg px-3 py-2 border-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>
      <input
        v-model="email"
        type="email"
        :class="[
          'w-full mb-4 p-3 rounded-lg bg-gray-700 text-gray-200 placeholder-gray-400 border focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none transition',
          emailTouched && !isEmailValid() ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-600'
        ]"
        placeholder="Recipient's email address"
        required
        @blur="emailTouched = true"
      />
      <textarea
        v-model="text"
        :class="[
          'w-full h-72 md:h-96 p-4 rounded-2xl shadow-inner border focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 bg-gray-900 text-sm text-gray-100 resize-none transition-all duration-200 outline-none placeholder-gray-500 custom-scrollbar',
          textTouched && !text.trim() ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : 'border-gray-700'
        ]"
        placeholder="Write your message to your future self..."
        @blur="textTouched = true"
      ></textarea>
      <div class="w-full flex justify-between items-end mt-2">
        <span class="text-xs text-gray-400 select-none">
          {{ wordCount }} words • {{ charCount }} chars
        </span>
        <button
          class="px-4 py-2 text-sm rounded-lg font-medium bg-indigo-500 text-white shadow hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          @click="sendLetterHandler"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="animate-spin">⏳</span>
          <span v-else>Send Letter</span>
        </button>
      </div>
      <div v-if="errorMessage" class="w-full mt-3 text-center">
        <span class="text-red-500 text-sm font-medium">{{ errorMessage }}</span>
      </div>
      <div v-if="successMessage" class="w-full mt-3 text-center">
        <span class="text-green-400 text-sm font-medium">{{ successMessage }}</span>
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
import { sendLetter } from '../api/letters';


const options = [
  { label: '1 month', value: 1 },
  { label: '3 months', value: 3 },
  { label: '6 months', value: 6 },
  { label: '12 months', value: 12 },
];
const selectedOption = ref(options[0]);
const customDate = ref('');
const text = ref('')
const email = ref('')
const errorMessage = ref('');
const successMessage = ref('');
const emailTouched = ref(false)
const textTouched = ref(false)
const isLoading = ref(false)

function selectOption(option: { label: string, value: number }) {
  selectedOption.value = option;
  customDate.value = '';
}

function selectCustomDate() {
  selectedOption.value = { label: 'Custom', value: 0 };
}


const creationDate = computed(() => {
  const today = new Date();
  const day = today.getDate();
  const getOrdinal = (n: number) => {
    const s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  const month = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  return `${getOrdinal(day)} of ${month} ${year}`;
});

const wordCount = computed(() => {
  if (!text.value.trim()) return 0;
  return text.value.trim().split(/\s+/).length;
});
const charCount = computed(() => text.value.length);

function isEmailValid() {
  return email.value.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
}

function validateForm() {
  if (!email.value.trim() || !text.value.trim() || (selectedOption.value.label === 'Custom' && !customDate.value.trim())) {
    errorMessage.value = 'Please fill in all fields.';
    return false;
  }
  if (!isEmailValid()) {
    errorMessage.value = 'Please enter a valid email address.';
    return false;
  }
  return true;
}

const deliverAt = computed(() => {
  const today = new Date();
  if (selectedOption.value.label === 'Custom' && customDate.value) {
    return new Date(customDate.value + 'T00:01:00Z').toISOString();
  } else {
    const deliverDate = new Date(today);
    deliverDate.setMonth(deliverDate.getMonth() + selectedOption.value.value);
    deliverDate.setUTCHours(0, 0, 0, 0);
    return deliverDate.toISOString();
  }
});

async function sendLetterHandler() {
  errorMessage.value = '';
  successMessage.value = '';
  if (!validateForm()) return;
  isLoading.value = true;
  try {
    await sendLetter({ email: email.value, body: text.value, deliverAt: deliverAt.value });
    successMessage.value = 'Your letter has been sent into the future!';
    text.value = '';
    email.value = '';
    customDate.value = '';
    selectedOption.value = options[0];
  } catch (err) {
    console.error(err);
    errorMessage.value = 'Failed to send letter. Please try again.';
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #6366f1 #1e293b;
}
</style>

