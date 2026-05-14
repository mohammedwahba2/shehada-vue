import { ref, onBeforeUnmount } from 'vue'

export interface UseAudioPlaybackReturn {
  isPlaying: Readonly<Ref<boolean>>
  error: Readonly<Ref<string | null>>
  play: (src: string) => Promise<void>
  stop: () => void
}

/**
 * Simple audio playback composable.
 * Handles play/stop state, basic errors, and retries for browser autoplay rules.
 */
export const useAudioPlayback = (): UseAudioPlaybackReturn => {
  const isPlaying = ref(false)
  const error = ref<string | null>(null)
  const currentAudio = ref<HTMLAudioElement | null>(null)

  let playGeneration = 0
  const maxRetries = 2

  /**
   * Tries to play audio and handles common browser issues like autoplay blocking.
   * Uses a generation check so old play requests don’t interfere with new ones.
   */
  const attemptPlay = async (
    audio: HTMLAudioElement,
    generation: number,
    retryCount = 0
  ): Promise<void> => {
    try {
      await audio.play()

      if (generation === playGeneration) {
        isPlaying.value = true
        error.value = null
      }
    } catch (err) {
      if (generation !== playGeneration) return

      if (err instanceof DOMException) {
        if (err.name === 'NotSupportedError') {
          error.value = 'Audio format not supported by this browser'
          isPlaying.value = false
          return
        }

        if (err.name === 'AbortError') {
          isPlaying.value = false
          return
        }

        // Browser blocked autoplay — try again once after a short delay
        if (err.name === 'NotAllowedError' && retryCount === 0) {
          await new Promise(resolve => setTimeout(resolve, 100))
          if (generation === playGeneration) {
            await attemptPlay(audio, generation, retryCount + 1)
          }
          return
        }

        if (retryCount >= maxRetries) {
          error.value = 'Could not play audio. Please click the play button.'
          isPlaying.value = false
        } else {
          await new Promise(resolve =>
            setTimeout(resolve, Math.pow(2, retryCount) * 100)
          )

          if (generation === playGeneration) {
            await attemptPlay(audio, generation, retryCount + 1)
          }
        }
      } else {
        error.value = 'Something went wrong while playing audio'
        isPlaying.value = false
      }
    }
  }

  /**
   * Starts playing audio from a given URL.
   * Stops any currently playing audio first.
   */
  const play = async (src: string): Promise<void> => {
    stop()
  
    const generation = ++playGeneration
    error.value = null
  
    const audio = new Audio(src)
    audio.preload = 'auto'
    // audio.crossOrigin = 'anonymous'
  
    currentAudio.value = audio

    return new Promise<void>((resolve, reject) => {
      audio.onended = () => {
        if (generation === playGeneration) {
          isPlaying.value = false
          currentAudio.value = null
        }
        resolve()
      }
  
      audio.onerror = () => {
        if (generation === playGeneration) {
          // More specific error based on network state
          const errorCode = audio.error?.code
          let errorMsg = 'Failed to load audio file'
          
          if (errorCode === 1) errorMsg = 'Loading interrupted'
          else if (errorCode === 2) errorMsg = 'Network error - check your connection'
          else if (errorCode === 3) errorMsg = 'Audio format not supported or file corrupted'
          else if (errorCode === 4) errorMsg = 'Media source not available'
          
          error.value = errorMsg
          isPlaying.value = false
          currentAudio.value = null
          console.error('Audio error:', audio.error, 'Code:', errorCode, 'Src:', src)
        }
        reject(new Error('Failed to load audio file'))
      }
  
      audio.play()
        .then(() => {
          if (generation === playGeneration) {
            isPlaying.value = true
            error.value = null
          }
        })
        .catch((err: DOMException) => {
          if (generation !== playGeneration) return resolve()
  
          if (err.name === 'NotAllowedError') {
            error.value = 'Could not play audio. Please click the play button.'
          } else if (err.name === 'NotSupportedError') {
            error.value = 'Audio format not supported'
          } else {
            error.value = 'Something went wrong while playing audio'
          }
  
          isPlaying.value = false
          resolve()
        })
    })
  }
  /**
   * Stops playback and clears the current audio instance.
   */
  const stop = () => {
    playGeneration++

    if (currentAudio.value) {
      currentAudio.value.pause()
      currentAudio.value.src = ''
      currentAudio.value = null
    }

    isPlaying.value = false
    error.value = null
  }

  onBeforeUnmount(() => {
    stop()
  })

  return {
    isPlaying: readonly(isPlaying),
    error: readonly(error),
    play,
    stop
  }
}