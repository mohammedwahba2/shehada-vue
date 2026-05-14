<script setup lang="ts">
import { shahadaSteps } from '~/constants/shahadaSteps'
import type { OrbVisualMode, SessionRefs } from '~/types'

/** Threshold for detecting speech onset */
const SPEAKING_ON = 40
/** Threshold for detecting speech offset */
const SPEAKING_OFF = 30

/** Mobile device detection - used to disable visualizer on mobile */
const isMobileDevice = typeof navigator !== 'undefined'
  ? /iPad|iPhone|iPod|Android/i.test(navigator.userAgent)
  : false

const isRecording = ref(false)
const startupError = ref<string | null>(null)
const orbOverride = ref<null | 'engaged' | 'error'>(null)

const overrideTimer = ref<ReturnType<typeof setTimeout> | null>(null)
const prevStep = ref(0)
const sessionPeakSteps = ref(0)
const recordingActive = ref(false)
const recognitionPausedForGuide = ref(false)

const speechSessionRefs: SessionRefs = {
  sessionActiveRef: recordingActive,
  recognitionPausedRef: recognitionPausedForGuide,
}

const { 
  volume, 
  startVisualizer, 
  stopVisualizer, 
  suspendVisualizer, 
  resumeVisualizer 
} = useAudioVisualizer()

const { 
  transcript, 
  hasSupport, 
  error, 
  startListening, 
  stopListening, 
  resetTranscript 
} = useSpeechRecognition(speechSessionRefs)


useSeoMeta({
  title: 'Learn & Recite the Shahada Online',
  description: 'Learn and recite the Shahada with real-time Arabic voice recognition, guided pronunciation, and personalized certificate. Start your journey to Islam today.',
  ogTitle: 'Shahada App - Learn & Recite the Shahada Online',
  ogDescription: 'Learn and recite the Shahada with real-time Arabic voice recognition, guided pronunciation, and personalized certificate.',
  ogType: 'website',
  ogUrl: 'https://shehada-vue.vercel.app',
  ogImage: 'https://shehada-vue.vercel.app/preview.png',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Shahada App - Learn & Recite the Shahada Online',
  twitterDescription: 'Learn and recite the Shahada with real-time Arabic voice recognition and guided pronunciation.',
  twitterImage: 'https://shehada-vue.vercel.app/preview.png',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://shehada-vue.vercel.app' }
  ]
})

const normalizeTranscript = (value: string): string =>
  value.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').replace(/\s+/g, ' ').trim()

const stripForCompare = (value: string): string =>
  value.normalize('NFD').replace(/\p{M}/gu, '').replace(/[أإآٱأ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي').trim()

const countConsecutiveWordsMatched = (expected: string, actual: string): number => {
  const expectedWords = stripForCompare(expected).split(/\s+/)
  const actualWords = stripForCompare(actual).split(/\s+/)
  let matched = 0
  let j = 0
  for (const word of actualWords) {
    if (j < expectedWords.length && expectedWords[j] === word) {
      matched++
      j++
    }
  }
  return matched
}

const cleanDisplayTranscript = (text: string): string => {
  if (!text) return ""
  const words = text.trim().split(/\s+/)
  return words.filter((word, index) => word !== words[index - 1]).join(" ")
}

const countConsecutiveSteps = (raw: string, normalized: string, fromStep: number = 0): number => {
  const compactRaw = stripForCompare(raw)
  let lastIndex = 0
  let matched = 0

  for (let i = 0; i < shahadaSteps.length; i++) {
    const step = shahadaSteps[i]
    if (!step) continue
    if (i < fromStep) { matched++; continue }

    const arabic = stripForCompare(step.arabic)
    const hints = (step.compactHints ?? []).map(h => stripForCompare(h))

    let bestStart = -1
    let bestLen = 0

    for (const cand of [arabic, ...hints]) {
      const idx = compactRaw.indexOf(cand, lastIndex)
      if (idx !== -1 && (bestStart === -1 || idx < bestStart)) {
        bestStart = idx
        bestLen = cand.length
      }
    }

    if (bestStart !== -1) {
      matched++
      lastIndex = bestStart + bestLen
      continue
    }
    break
  }
  return matched
}

const normalized = computed(() => normalizeTranscript(transcript.value))

const steps = computed(() => {
  if (prevStep.value >= shahadaSteps.length) return shahadaSteps.length
  
  if (!isRecording.value) {
    sessionPeakSteps.value = 0
    return countConsecutiveSteps(transcript.value, normalized.value)
  }

  const fullMatch = countConsecutiveSteps(transcript.value, normalized.value)
  const partialMatch = sessionPeakSteps.value > 0 
    ? countConsecutiveSteps(transcript.value, normalized.value, sessionPeakSteps.value)
    : 0

  const best = Math.max(fullMatch, partialMatch)
  sessionPeakSteps.value = Math.max(sessionPeakSteps.value, best)
  return Math.min(sessionPeakSteps.value, shahadaSteps.length)
})

const isComplete = computed(() => steps.value >= shahadaSteps.length)
const currentStep = computed(() => shahadaSteps[Math.min(steps.value, shahadaSteps.length - 1)]!)

const smoothVolume = ref(0)
const isSpeaking = ref(false)
watch(volume, (v) => {
  smoothVolume.value = smoothVolume.value * 0.8 + v * 0.2
  if (!isRecording.value) {
    isSpeaking.value = false
    return
  }
  if (!isSpeaking.value && smoothVolume.value >= SPEAKING_ON) isSpeaking.value = true
  else if (isSpeaking.value && smoothVolume.value <= SPEAKING_OFF) isSpeaking.value = false
})

const orbMode = computed<OrbVisualMode>(() => {
  if (error.value || startupError.value) return 'error'
  if (orbOverride.value) return orbOverride.value
  if (!isRecording.value) return 'listening'
  return isSpeaking.value ? 'speaking' : 'listening'
})

const display = computed(() => cleanDisplayTranscript(transcript.value))

const clearTimer = () => {
  if (overrideTimer.value) { clearTimeout(overrideTimer.value); overrideTimer.value = null }
}

const scheduleTimer = (ms: number) => {
  clearTimer()
  overrideTimer.value = setTimeout(() => { orbOverride.value = null }, ms)
}

const handleStart = async () => {
  if (!hasSupport) {
    startupError.value = 'Speech recognition is not supported in your browser. Please try Chrome or Safari.'
    return
  }
  clearTimer()
  orbOverride.value = null
  startupError.value = null

  try {
    // iOS workaround: Cancel any ongoing speech synthesis first
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel()
      window.speechSynthesis.resume()
    }

    // On mobile: DO NOT start visualizer at all
    // iOS Safari: SpeechRecognition runs in separate process and must be the ONLY one accessing mic
    // Any AudioContext (even after SpeechRecognition starts) causes conflict
    if (isMobileDevice) {
      recordingActive.value = true
      recognitionPausedForGuide.value = false
      isRecording.value = true
      startListening()
      // No visualizer on mobile - orb animation based on SpeechRecognition events only
    } else {
      // On desktop: Start visualizer first (more stable)
      await startVisualizer().catch((visualizerErr) => {
        console.error('Visualizer error:', visualizerErr)
      })
      
      recordingActive.value = true
      recognitionPausedForGuide.value = false
      isRecording.value = true
      startListening()
    }
    
    prevStep.value = 0
  } catch (err: any) {
    handleStop()
    startupError.value = err.message || "Microphone could not be started. Please ensure you've granted microphone permission."
  }
}

const handleStop = () => {
  const incomplete = steps.value < shahadaSteps.length
  const hasText = transcript.value.trim().length > 0

  recordingActive.value = false
  recognitionPausedForGuide.value = false
  stopVisualizer()
  stopListening()
  isRecording.value = false

  if (hasText && incomplete) {
    orbOverride.value = 'error'
    scheduleTimer(2000)
  }
}

const handleRestart = () => {
  clearTimer()
  orbOverride.value = null
  startupError.value = null
  recordingActive.value = false
  resetTranscript()
  stopVisualizer()
  stopListening()
  isRecording.value = false
  prevStep.value = 0
}

const handlePromptSpeechStart = () => {
  recognitionPausedForGuide.value = true
  // Only suspend visualizer on desktop - on mobile it's not running
  if (!isMobileDevice) {
    suspendVisualizer()
  }
  stopListening()
}

const handlePromptSpeechEnd = () => {
  recognitionPausedForGuide.value = false
  // Only resume visualizer on desktop - on mobile it's not running
  if (!isMobileDevice) {
    resumeVisualizer()
  }
  startListening()
}

// --- Watchers ---
watch(steps, (newVal) => {
  if (isRecording.value && newVal > prevStep.value) {
    prevStep.value = newVal
    orbOverride.value = 'engaged'
    scheduleTimer(2000)
  }
})

watch(isComplete, (done) => {
  if (done && isRecording.value) {
    recordingActive.value = false
    stopListening()
    stopVisualizer()
    isRecording.value = false
    orbOverride.value = 'engaged'
    scheduleTimer(2000)
  }
})

onUnmounted(() => {
  clearTimer()
  stopVisualizer()
  stopListening()
})

const subtitle = computed(() => 
  isComplete.value ? "Your first step on your path to Islam." :
  isRecording.value ? "Repeat after me" : "Your First Step On Your Path To Islam."
)
</script>

<template>
  <main class="flex flex-1 flex-col items-center px-4 pb-16 pt-12 sm:px-6 sm:pt-40 lg:px-8">
    <div class="flex w-full max-w-2xl flex-1 flex-col items-center text-center">
      <h1 class="text-4xl font-semibold sm:text-6xl">SHAHADA</h1>
      <p class="max-w-md text-sm font-medium text-ink dark:text-white sm:text-xl">
        {{ subtitle }}
      </p>

      <div class="mt-10 mb-4 md:mb-8 sm:mt-22">
        <VisualizerOrb :mode="orbMode" />

        <div v-if="isRecording && currentStep && transcript.trim()" class="mt-4">
          <p class="text-lg sm:text-2xl leading-relaxed" dir="rtl">
            <template v-for="(word, idx) in currentStep.arabic.split(/\s+/)" :key="idx">
              <span :class="idx < countConsecutiveWordsMatched(currentStep.arabic, display) ? 'text-ink/30 dark:text-white/30' : ''">
                {{ word }}&nbsp;
              </span>
            </template>
          </p>
        </div>
      </div>

      <RecitePrompt
        v-if="!isComplete && isRecording"
        :step="currentStep"
        :step-index="steps"
        @speech-start="handlePromptSpeechStart"
        @speech-end="handlePromptSpeechEnd"
      />

      <div class="mt-10 flex flex-col gap-4">
        <p v-if="startupError || error" class="text-red-500 max-w-sm">
          {{ startupError || error }}
        </p>

        <IntroFlow v-if="!isRecording && !isComplete" @start="handleStart" />
        
        <Button v-if="isRecording && !isComplete" variant="stop" @click="handleStop">
          Stop recording
        </Button>

        <Certificate v-if="isComplete" @restart="handleRestart" />
      </div>
    </div>
  </main>
</template>