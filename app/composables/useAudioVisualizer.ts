import { ref, onUnmounted, readonly, type Ref } from 'vue'

/**
 * Hook return type for audio visualizer.
 * Exposes mic volume + basic control methods.
 */
export interface AudioVisualizerHook {
  volume: Readonly<Ref<number>>
  startVisualizer: () => Promise<void>
  stopVisualizer: () => void
  suspendVisualizer: () => Promise<void>
  resumeVisualizer: () => Promise<void>
  resumeAudioContext: () => Promise<void>
}

/**
 * Simple mic-based audio visualizer using Web Audio API.
 * Reads microphone input and converts it into a volume value (0–255).
 */
export const useAudioVisualizer = (): AudioVisualizerHook => {
  const animationRef = ref<number | null>(null)
  const analyserRef = ref<AnalyserNode | null>(null)
  const sourceRef = ref<MediaStreamAudioSourceNode | null>(null)
  const audioContextRef = ref<AudioContext | null>(null)
  const streamRef = ref<MediaStream | null>(null)

  const volume = ref(0)

  const stopVisualizer = () => {
    if (animationRef.value !== null) {
      cancelAnimationFrame(animationRef.value)
      animationRef.value = null
    }

    sourceRef.value?.disconnect()
    sourceRef.value = null

    analyserRef.value = null

    if (audioContextRef.value && audioContextRef.value.state !== 'closed') {
      void audioContextRef.value.close()
    }
    audioContextRef.value = null

    streamRef.value?.getTracks().forEach(t => t.stop())
    streamRef.value = null

    volume.value = 0
  }

  const startVisualizer = async () => {
    if (typeof window === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      throw new Error('Microphone not supported in this environment.')
    }

    stopVisualizer()

    let stream: MediaStream

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          channelCount: 1,
        },
      })
    } catch (err) {
      const name = err instanceof DOMException ? err.name : ''

      if (name === 'OverconstrainedError' || name === 'ConstraintNotSatisfiedError') {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        } catch (fallbackErr) {
          handleStreamError(fallbackErr)
          return
        }
      } else {
        handleStreamError(err)
        return
      }
    }

    streamRef.value = stream

    const audioContext = new AudioContext({ latencyHint: 'interactive' })
    audioContextRef.value = audioContext

    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }

    const analyser = audioContext.createAnalyser()
    analyser.fftSize = 256
    analyser.smoothingTimeConstant = 0.65
    analyserRef.value = analyser

    const source = audioContext.createMediaStreamSource(stream)
    sourceRef.value = source
    source.connect(analyser)

    const bufferLength = analyser.fftSize
    const dataArray = new Uint8Array(bufferLength)

    const tick = () => {
      animationRef.value = requestAnimationFrame(tick)

      analyser.getByteTimeDomainData(dataArray)

      let sum = 0
      for (const v of dataArray) {
        const centered = v - 128
        sum += centered * centered
      }

      const rms = Math.sqrt(sum / bufferLength)
      volume.value = Math.min(255, Math.floor(rms * 5.5 * 255))
    }

    tick()
  }

  const handleStreamError = (err: unknown) => {
    const name = err instanceof DOMException ? err.name : ''

    if (name === 'NotAllowedError') {
      throw new Error('Mic permission denied.')
    }

    if (name === 'NotFoundError') {
      throw new Error('No microphone found.')
    }

    throw new Error('Failed to start microphone.')
  }

  const resumeAudioContext = async () => {
    const ctx = audioContextRef.value
    if (ctx?.state === 'suspended') {
      await ctx.resume()
    }
  }

  const suspendVisualizer = async () => {
    streamRef.value?.getTracks().forEach(t => (t.enabled = false))

    const ctx = audioContextRef.value
    if (ctx?.state === 'running') {
      await ctx.suspend()
    }
  }

  const resumeVisualizer = async () => {
    streamRef.value?.getTracks().forEach(t => (t.enabled = true))

    const ctx = audioContextRef.value
    if (ctx?.state === 'suspended') {
      await ctx.resume()
    }
  }

  onUnmounted(() => {
    stopVisualizer()
  })

  return {
    volume: readonly(volume),
    startVisualizer,
    stopVisualizer,
    suspendVisualizer,
    resumeVisualizer,
    resumeAudioContext,
  }
}