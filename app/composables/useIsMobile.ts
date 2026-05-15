const detectMobile = (): boolean => {
  if (typeof navigator === 'undefined') return false

  const ua = navigator.userAgent
  if (/Android|iPhone|iPad|iPod|Mobile/i.test(ua)) return true

  if (typeof window.matchMedia === 'function') {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    const narrow = window.matchMedia('(max-width: 768px)').matches
    if (coarse && narrow) return true
  }

  return false
}

/**
 * Client-only mobile detection for mic / visualizer behavior.
 */
export const useIsMobile = () => {
  const isMobile = ref(import.meta.client ? detectMobile() : false)

  onMounted(() => {
    isMobile.value = detectMobile()
  })

  return { isMobile: readonly(isMobile) }
}
