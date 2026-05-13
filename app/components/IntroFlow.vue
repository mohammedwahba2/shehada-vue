<script setup lang="ts">
const emit = defineEmits<{
  start: []
}>()

/**
 * Emit start event when user is ready to begin
 */
const handleStart = () => {
  emit('start')
}
</script>

<template>
  <div class="flex flex-col items-center gap-4 text-center">
    <p class="max-w-sm text-base font-medium text-ink dark:text-white">
      هل أنت مستعد لنطق الشهادة؟
    </p>
    <div class="flex gap-3">
      <button
        type="button"
        class="px-6 py-2 rounded-full bg-ink text-white dark:bg-white dark:text-ink text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ink/40 dark:focus:ring-white/40"
        @click="handleStart"
      >
        نعم، أنا مستعد
      </button>

      <NuxtLink
        to="/#about"
        class="px-6 py-2 rounded-full border border-zinc-300 dark:border-zinc-600 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-ink/40 dark:focus:ring-white/40"
      >
        تعلم المزيد
      </NuxtLink>
    </div>
  </div>
</template>
