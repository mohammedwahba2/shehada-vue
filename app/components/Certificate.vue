<script setup lang="ts">
const emit = defineEmits<{
  restart: []
}>()

const name = ref('')
const showCert = ref(false)
const nameError = ref('')

const date = new Date().toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})

/**
 * Validates and generates the certificate
 */
const handleGenerate = () => {
  if (!name.value.trim()) {
    nameError.value = 'Please enter your name'
    return
  }
  nameError.value = ''
  showCert.value = true
}

/**
 * Clear error when user starts typing
 */
const handleNameInput = () => {
  nameError.value = ''
}

/**
 * Print the certificate
 */
const printCertificate = () => {
  window.print()
}

</script>

<template>
  <template v-if="showCert">
    <div
      id="certificate"
      class="relative flex flex-col items-center justify-center gap-4 text-center max-w-2xl w-full mx-auto p-10 md:p-12 border-2 border-zinc-300 dark:border-zinc-600 rounded-[2rem] bg-white dark:bg-zinc-900 shadow-xl"
      style="aspect-ratio: 3/4;"
    >
      <!-- Decorative corners -->
      <div class="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-zinc-400 dark:border-zinc-500 rounded-tl-lg" />
      <div class="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-zinc-400 dark:border-zinc-500 rounded-tr-lg" />
      <div class="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-zinc-400 dark:border-zinc-500 rounded-bl-lg" />
      <div class="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-zinc-400 dark:border-zinc-500 rounded-br-lg" />

      <!-- Inner decorative border -->
      <div class="absolute inset-4 border border-zinc-200 dark:border-zinc-700 rounded-3xl" />

      <!-- Content -->
      <div class="relative z-10 flex flex-col items-center gap-4 py-6">
        <p class="text-sm text-zinc-500 dark:text-zinc-400 font-arabic">بسم الله الرحمن الرحيم</p>

        <div class="space-y-1">
          <h2 class="text-xl md:text-2xl font-semibold text-zinc-800 dark:text-zinc-100">Certificate of Faith</h2>
          <div class="w-16 h-0.5 bg-zinc-300 dark:bg-zinc-600 mx-auto" />
        </div>

        <p class="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">This certifies that</p>

        <p class="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">{{ name }}</p>

        <p class="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
          has sincerely recited the Shahada
        </p>

        <div class="w-full max-w-sm py-4">
          <p class="text-xl md:text-2xl leading-relaxed text-zinc-800 dark:text-zinc-200" style="font-family: 'Noto Naskh Arabic', serif">
            أَشْهَدُ أَنْ لَا إِلَٰهَ إِلَّا ٱللَّٰهُ
          </p>
          <p class="text-xl md:text-2xl leading-relaxed text-zinc-800 dark:text-zinc-200 mt-2" style="font-family: 'Noto Naskh Arabic', serif">
            وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ ٱللَّٰهِ
          </p>
        </div>

        <div class="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
          <span>{{ date }}</span>
          <span>•</span>
          <span>Shahada App</span>
        </div>
      </div>
    </div>

    <div class="flex gap-3 mt-6">
      <button
        class="px-6 py-2 rounded-full bg-ink text-white dark:bg-white dark:text-ink text-sm font-medium"
        @click="printCertificate"
      >
        Download PDF
      </button>

      <button
        class="px-6 py-2 rounded-full border border-zinc-300 dark:border-zinc-600 text-sm font-medium"
        @click="emit('restart')"
      >
        Practice again
      </button>
    </div>
  </template>

  <div v-else class="flex flex-col items-center gap-4 text-center">
    <p class="max-w-sm text-md font-medium text-ink dark:text-white">
      أدخل اسمك لتحميل الشهادة
    </p>

    <div class="relative">
      <input
        id="certificate-name"
        v-model="name"
        type="text"
        :aria-label="'Enter your name for the certificate'"
        :aria-invalid="!!nameError"
        :aria-describedby="nameError ? 'name-error' : undefined"
        placeholder="Your name"
        class="px-4 py-2 rounded-full border border-zinc-300 dark:border-zinc-600 bg-transparent text-center text-sm outline-none w-48 focus:ring-2 focus:ring-ink/20 dark:focus:ring-white/20"
        @input="handleNameInput"
        @keydown.enter="handleGenerate"
      />
      <p v-if="nameError" id="name-error" class="absolute -bottom-5 left-0 right-0 text-xs text-red-500 whitespace-nowrap">
        {{ nameError }}
      </p>
    </div>

    <button
      type="button"
      :disabled="!name.trim()"
      class="mt-4 px-6 py-2 rounded-full bg-ink text-white dark:bg-white dark:text-ink text-sm font-medium disabled:opacity-40 focus:outline-none focus:ring-2 focus:ring-ink/40 dark:focus:ring-white/40"
      @click="handleGenerate"
    >
      Generate certificate
    </button>
  </div>
</template>