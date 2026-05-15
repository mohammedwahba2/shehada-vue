<script setup lang="ts">
const emit = defineEmits<{
  start: []
}>()

const showSafariHint = ref(false)

onMounted(() => {
  if (!import.meta.client) return
  const ua = navigator.userAgent
  const isIOS = /iPad|iPhone|iPod/i.test(ua)
  const isSafari = /Safari/i.test(ua) && !/CriOS|FxiOS|OPiOS|EdgiOS/i.test(ua)
  showSafariHint.value = isIOS && !isSafari
})

const handleStart = () => {
  emit('start')
}

const scrollToAbout = () => {
  document.getElementById('about')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
</script>

<template>
  <div class="flex flex-col items-center gap-4 text-center">
    <p class="max-w-sm text-base font-medium text-ink dark:text-white">
      هل أنت مستعد لنطق الشهادة؟
    </p>

    <p
      v-if="showSafariHint"
      class="max-w-sm rounded-xl border border-amber-300/60 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/40 dark:text-amber-100"
      role="status"
    >
      On iPhone, use <strong>Safari</strong> for voice recognition. Chrome and other browsers on iOS do not support the microphone API for speech.
    </p>

    <div class="flex gap-3">
      <button
        type="button"
        class="rounded-full bg-ink px-6 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 dark:bg-white dark:text-ink dark:focus-visible:ring-white/40"
        @click="handleStart"
      >
        نعم، أنا مستعد
      </button>

      <button
        type="button"
        class="rounded-full border border-zinc-300 px-6 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-ink/40 dark:border-zinc-600 dark:focus-visible:ring-white/40"
        @click="scrollToAbout"
      >
        تعلم المزيد
      </button>
    </div>
  </div>
</template>
