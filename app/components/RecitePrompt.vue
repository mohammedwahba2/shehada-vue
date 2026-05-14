<script setup lang="ts">
import { computed, watch, onBeforeUnmount, ref } from 'vue'
import { Volume2, VolumeX, Loader2 } from 'lucide-vue-next'
import type { ShahadaStep } from '../types'
import { useAudioPlayback } from '~/composables/useAudioPlayback'

interface Props {
  step: ShahadaStep
  stepIndex: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'speechStart'): void
  (e: 'speechEnd'): void
}>()

// audio playback state
const { isPlaying, error: playbackError, play, stop } = useAudioPlayback()

// step audio file path
const audioSrc = computed(() => `/audio/step${props.step.id}.m4a`)

// Check if browser supports m4a format
const supportsM4a = typeof document !== 'undefined' 
  ? new Audio().canPlayType('audio/mp4; codecs="aac"') !== '' 
  : true

// assume user already interacted (component only used after flow starts)
const hasUserInteracted = ref(true)

// small delay tweak per step
const getAutoPlayDelay = () => (props.stepIndex === 0 ? 450 : 140)

// emit helpers
const handlePlaybackStart = () => {
  hasUserInteracted.value = true
  emit('speechStart')
}

const handlePlaybackEnd = () => {
  emit('speechEnd')
}

// manual play (button click)
const handleManualPlay = async () => {
  hasUserInteracted.value = true
  handlePlaybackStart()

  try {
    await play(audioSrc.value)
  } finally {
    handlePlaybackEnd()
  }
}

// autoplay timer
let autoPlayTimeout: ReturnType<typeof setTimeout> | null = null

const attemptAutoPlay = async () => {
  if (!hasUserInteracted.value) return

  autoPlayTimeout = setTimeout(async () => {
    handlePlaybackStart()

    try {
      await play(audioSrc.value)
    } finally {
      handlePlaybackEnd()
    }
  }, getAutoPlayDelay())
}

// trigger playback when step changes
watch(
  () => props.step.id,
  () => {
    if (autoPlayTimeout) {
      clearTimeout(autoPlayTimeout)
      autoPlayTimeout = null
    }

    stop()
    attemptAutoPlay()
  },
  { immediate: true }
)

// cleanup
onBeforeUnmount(() => {
  if (autoPlayTimeout) clearTimeout(autoPlayTimeout)
  stop()
})

// ui state
const showPlayButton = computed(() => !isPlaying.value)
const buttonDisabled = computed(() => isPlaying.value)
</script>

<template>
  <div class="flex w-full max-w-lg items-center justify-center gap-3">
    <p class="text-center text-[15px] font-medium text-zinc-800 dark:text-zinc-100 sm:text-base">
      {{ step.promptLine }}
    </p>

    <button
      type="button"
      @click="handleManualPlay"
      :disabled="buttonDisabled"
      aria-label="Play pronunciation"
      class="flex h-10 w-10 items-center justify-center rounded-full border border-ink text-ink transition hover:bg-ink/10 disabled:opacity-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-800"
    >
      <!-- Loading state -->
      <Loader2 
        v-if="isPlaying && !playbackError" 
        :size="22" 
        :stroke-width="1.75"
        class="animate-spin"
      />
      
      <!-- Error state -->
      <VolumeX 
        v-else-if="playbackError" 
        :size="22" 
        :stroke-width="1.75"
        class="text-red-500"
      />
      
      <!-- Normal state -->
      <Volume2 
        v-else 
        :size="22" 
        :stroke-width="1.75" 
      />
    </button>
  </div>

  <!-- Error message tooltip -->
  <div 
    v-if="playbackError" 
    class="mt-2 text-xs text-red-500 text-center max-w-xs"
    role="alert"
  >
    {{ playbackError }}
  </div>
</template>
