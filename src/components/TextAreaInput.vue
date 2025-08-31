<template>
  <div class="flex justify-center px-3 mt-4">
    <div
      class="w-full max-w-3xl bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col gap-3 transition-all duration-300 h-[calc(100vh-160px)]"
    >
      <!-- Header -->
      <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 text-center drop-shadow">
        A letter from {{ creationDate }}
      </h1>

      <!-- Letter Type Options -->
      <div class="w-full">
        <p class="text-base font-medium text-gray-700 dark:text-gray-200 text-center mb-3">
          What kind of letter would you like to keep today?
        </p>
        <div class="flex gap-2 w-full">
          <button
            class="px-3 py-2 rounded-lg font-medium transition flex-1"
            :class="selectedMainOption === 'Scheduled'
              ? 'bg-primary text-white shadow'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-primary/80 hover:text-white'"
            @click="selectMainOption('Scheduled')"
          >
            Scheduled
          </button>
          <button
            class="px-3 py-2 rounded-lg font-medium transition flex-1"
            :class="selectedMainOption === 'Open When'
              ? 'bg-primary text-white shadow'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-primary/80 hover:text-white'"
            @click="selectMainOption('Open When')"
          >
            Open When
          </button>
          <button
            class="px-3 py-2 rounded-lg font-medium transition flex-1"
            :class="selectedMainOption === 'Surprise Me'
              ? 'bg-primary text-white shadow'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-primary/80 hover:text-white'"
            @click="selectMainOption('Surprise Me')"
          >
            Surprise Me
          </button>
        </div>
      </div>

      <!-- Scheduled Options -->
      <div v-if="selectedMainOption === 'Scheduled'" class="w-full">
        <p class="text-gray-500 dark:text-gray-400 text-center text-sm mb-2">
          Your message will be delivered in...
        </p>

        <!-- Buttons + Date Picker in One Row -->
        <div class="flex flex-wrap items-center gap-2">
          <div class="flex gap-1 w-full md:w-auto">
            <button
              v-for="option in options"
              :key="option.label"
              @click="selectOption(option)"
              :class="[
                'px-2 py-1 md:px-3 md:py-2 rounded-lg font-medium transition text-xs md:text-base flex-1 md:flex-none',
                selectedOption.label === option.label
                  ? 'bg-blue-300 text-white shadow'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-primary/80 hover:text-white'
              ]"
            >
              {{ option.label }}
            </button>
          </div>
          <div class="flex items-center gap-2 mt-2 md:mt-0 w-full md:w-auto">
            <span class="text-sm text-gray-600 dark:text-gray-300">Or pick a date:</span>
            <Datepicker
              v-model="customDate"
              :min-date="new Date()"
              :enable-time-picker="false"
              placeholder="Choose a date"
              auto-apply
              class="w-32 md:w-48"
              @update:model-value="selectCustomDate"
            />
          </div>
        </div>
      </div>

      <!-- Open When Option -->
      <div v-if="selectedMainOption === 'Open When'" class="w-full">
        <input
          v-model="openWhenText"
          type="text"
          class="w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 border border-gray-300 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary outline-none transition"
          placeholder="Open when I... (e.g. graduate, feel sad, get a new job)"
        />
      </div>

      <!-- Email -->
      <input
        v-model="email"
        type="email"
        :class="[
          'w-full p-3 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 placeholder-gray-400 border focus:border-primary focus:ring-2 focus:ring-primary outline-none transition',
          emailTouched && !isEmailValid()
            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 dark:border-gray-600'
        ]"
        placeholder="Recipient's email address"
        required
        @blur="emailTouched = true"
      />

      <!-- Message -->
      <div class="flex-1 min-h-0 w-full">
        <textarea
          v-model="text"
          :class="[
            'w-full h-full min-h-[8rem] max-h-full p-4 rounded-2xl shadow-inner border focus:border-primary focus:ring-2 focus:ring-primary bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 resize-none transition-all duration-200 outline-none placeholder-gray-500 custom-scrollbar',
            textTouched && !text.trim()
              ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
              : 'border-gray-300 dark:border-gray-700'
          ]"
          placeholder="Write your message to your future self..."
          @blur="textTouched = true"
        ></textarea>
      </div>

      <!-- Footer -->
      <div class="w-full flex justify-between items-center">
        <span class="text-xs text-gray-400 select-none">
          {{ wordCount }} words • {{ charCount }} chars
        </span>
        <button
          class="px-4 py-2 text-sm rounded-lg font-medium bg-primary text-white shadow hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed"
          @click="sendLetterHandler"
          :disabled="isLoading"
        >
          <span v-if="isLoading" class="animate-spin">⏳</span>
          <span v-else>Send Letter</span>
        </button>
      </div>

      <!-- Messages -->
      <div v-if="errorMessage" class="w-full text-center">
        <span class="text-red-500 text-sm font-medium">{{ errorMessage }}</span>
      </div>
      <div v-if="successMessage" class="w-full text-center">
        <span class="text-green-500 dark:text-green-400 text-sm font-medium">{{ successMessage }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import { sendLetter } from '../api/letters';

// Main options
const selectedMainOption = ref<'Scheduled' | 'Open When' | 'Surprise Me'>('Scheduled');

function selectMainOption(option: 'Scheduled' | 'Open When' | 'Surprise Me') {
  selectedMainOption.value = option;
  if (option !== 'Scheduled') {
    customDate.value = null;
    selectedOption.value = options[0];
  }
}

// Scheduled options
const options = [
  { label: '1 month', value: 1 },
  { label: '3 months', value: 3 },
  { label: '6 months', value: 6 },
  { label: '12 months', value: 12 }
];
const selectedOption = ref(options[0]);
const customDate = ref<Date | null>(null);

function selectOption(option: { label: string; value: number }) {
  selectedOption.value = option;
  customDate.value = null;
}

function selectCustomDate() {
  selectedOption.value = { label: 'Custom', value: 0 };
}

// Other state
const text = ref('');
const email = ref('');
const openWhenText = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const emailTouched = ref(false);
const textTouched = ref(false);
const isLoading = ref(false);

// Computed
const creationDate = computed(() => {
  const today = new Date();
  const day = today.getDate();
  const getOrdinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };
  const month = today.toLocaleString('default', { month: 'long' });
  const year = today.getFullYear();
  return `${getOrdinal(day)} of ${month} ${year}`;
});

const wordCount = computed(() => (text.value.trim() ? text.value.trim().split(/\s+/).length : 0));
const charCount = computed(() => text.value.length);

function isEmailValid() {
  return email.value.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
}

function validateForm() {
  if (!email.value.trim() || !text.value.trim() || (selectedOption.value.label === 'Custom' && !customDate.value)) {
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
    const d = new Date(customDate.value);
    d.setHours(0, 1, 0, 0);
    return d.toISOString();
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
    await sendLetter({
      email: email.value,
      body: text.value,
      deliverAt: deliverAt.value
    });
    successMessage.value = 'Your letter has been sent into the future!';
    text.value = '';
    email.value = '';
    customDate.value = null;
    selectedOption.value = options[0];
    selectedMainOption.value = 'Scheduled';
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
  scrollbar-color: #6366f1 #e0e7ef;
}
</style>
