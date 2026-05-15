const ORB_ASSETS = [
  '/orbs/listen.svg',
  '/orbs/speak.svg',
  '/orbs/engage.svg',
  '/orbs/error.svg',
] as const

const cache = new Map<string, string>()

/** Strip XML prolog and ensure SVG scales inside our container */
const normalizeSvg = (raw: string): string =>
  raw
    .replace(/<\?xml[^?]*\?>\s*/i, '')
    .replace(/<svg\b/, '<svg width="100%" height="100%"')

const fetchOrb = async (url: string): Promise<string> => {
  if (cache.has(url)) return cache.get(url)!

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to load ${url}`)

  const text = normalizeSvg(await res.text())
  cache.set(url, text)
  return text
}

/** Warm cache so orb mode switches do not flash on mobile */
export const preloadOrbAssets = async (): Promise<void> => {
  if (!import.meta.client) return
  await Promise.all(ORB_ASSETS.map((url) => fetchOrb(url).catch(() => '')))
}

/**
 * Loads orb SVG markup for inline rendering (fixes iOS foreignObject / object quirks).
 */
export const useOrbSvg = (assetUrl: Ref<string> | ComputedRef<string>) => {
  const markup = ref('')
  const loading = ref(false)

  const load = async (url: string) => {
    if (!import.meta.client || !url) {
      markup.value = ''
      return
    }

    loading.value = true
    try {
      markup.value = await fetchOrb(url)
    } catch {
      markup.value = ''
    } finally {
      loading.value = false
    }
  }

  watch(
    assetUrl,
    (url) => {
      void load(url)
    },
    { immediate: true }
  )

  onMounted(() => {
    void preloadOrbAssets()
  })

  return { markup: readonly(markup), loading: readonly(loading) }
}
