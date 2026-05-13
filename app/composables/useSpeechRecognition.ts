import { ref, onUnmounted, readonly, type Ref } from 'vue'
import type {
  SpeechRecognition,
  SpeechRecognitionEvent,
  SpeechRecognitionErrorEvent
} from '~/types/speech'

/**
 * Shared refs for coordinating speech session state across the app.
 */
export interface SessionRefs {
  sessionActiveRef: Ref<boolean>
  recognitionPausedRef: Ref<boolean>
}

/**
 * Speech recognition composable return shape.
 */
export interface SpeechRecognitionHook {
  transcript: Readonly<Ref<string>>
  isListening: Readonly<Ref<boolean>>
  hasSupport: boolean
  error: Readonly<Ref<string | null>>
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

type SpeechRecognitionConstructor = new () => SpeechRecognition

/**
 * Speech-to-text hook using Web Speech API.
 * Supports Arabic (ar-SA) with interim + final results.
 */
export const useSpeechRecognition = (
  sessionRefs?: SessionRefs
): SpeechRecognitionHook => {
  const transcript = ref('')
  const isListening = ref(false)
  const error = ref<string | null>(null)

  const recognitionRef = ref<SpeechRecognition | null>(null)
  const accumulatedRef = ref('')
  const startGenerationRef = ref(0)

  const isMobileBrowser =
    typeof navigator !== 'undefined' &&
    /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

  const recognitionCtor =
    typeof window !== 'undefined'
      ? (window.SpeechRecognition ||
          (window as any).webkitSpeechRecognition)
      : undefined

  const hasSupport = recognitionCtor !== undefined

  const createRecognition = (): SpeechRecognition | null => {
    if (!recognitionCtor) return null

    const rec = new recognitionCtor()

    rec.lang = 'ar-SA'
    rec.interimResults = true
    rec.continuous = !isMobileBrowser
    rec.maxAlternatives = 1

    rec.onresult = (event: SpeechRecognitionEvent) => {
      const start = event.resultIndex ?? 0
      let interim = ''

      for (let i = start; i < event.results.length; i++) {
        const result = event.results.item(i)
        const text = result.item(0)?.transcript ?? ''

        if (result.isFinal) {
          accumulatedRef.value = [accumulatedRef.value, text]
            .filter(Boolean)
            .join(' ')
            .trim()
        } else {
          interim += text
        }
      }

      transcript.value = [accumulatedRef.value, interim]
        .filter(Boolean)
        .join(' ')
        .trim()
    }

    rec.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error === 'aborted' || event.error === 'no-speech') return

      error.value =
        event.error === 'not-allowed'
          ? 'Microphone permission denied'
          : event.error === 'audio-capture'
          ? 'No microphone found'
          : `Speech error: ${event.error}`

      isListening.value = false
    }

    rec.onend = () => {
      isListening.value = false

      if (!sessionRefs) return

      const active = sessionRefs.sessionActiveRef.value
      const paused = sessionRefs.recognitionPausedRef.value

      if (!active || paused) return

      setTimeout(() => {
        if (
          !sessionRefs.sessionActiveRef.value ||
          sessionRefs.recognitionPausedRef.value
        ) {
          return
        }

        startListening()
      }, 120)
    }

    return rec
  }

  const startListening = () => {
    if (!recognitionCtor) {
      error.value = 'Speech recognition not supported'
      return
    }

    error.value = null
    const generation = ++startGenerationRef.value

    const attempt = (retry: boolean) => {
      if (generation !== startGenerationRef.value) return

      try {
        try {
          recognitionRef.value?.abort()
        } catch {}

        recognitionRef.value = createRecognition()

        if (!recognitionRef.value) {
          error.value = 'Speech recognition not supported'
          isListening.value = false
          return
        }

        recognitionRef.value.start()
        isListening.value = true
      } catch (err) {
        if (generation !== startGenerationRef.value) return

        if (!retry) {
          setTimeout(() => attempt(true), 150)
          return
        }

        const name = err instanceof DOMException ? err.name : ''

        error.value =
          name === 'InvalidStateError'
            ? 'Recognition still stopping. Try again shortly.'
            : 'Could not start speech recognition.'

        isListening.value = false
      }
    }

    setTimeout(() => attempt(false), 0)
  }

  const stopListening = () => {
    startGenerationRef.value++

    try {
      recognitionRef.value?.abort()
    } catch {
      try {
        recognitionRef.value?.stop()
      } catch {}
    }

    isListening.value = false
  }

  const resetTranscript = () => {
    startGenerationRef.value++
    accumulatedRef.value = ''
    transcript.value = ''

    try {
      recognitionRef.value?.abort()
    } catch {}

    recognitionRef.value = createRecognition()
  }

  onUnmounted(() => {
    startGenerationRef.value++
    try {
      recognitionRef.value?.abort()
    } catch {}
    recognitionRef.value = null
  })

  return {
    transcript: readonly(transcript),
    isListening: readonly(isListening),
    hasSupport,
    error: readonly(error),
    startListening,
    stopListening,
    resetTranscript,
  }
}