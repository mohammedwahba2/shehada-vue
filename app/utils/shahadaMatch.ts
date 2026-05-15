import { shahadaSteps } from '~/constants/shahadaSteps'

export const normalizeTranscript = (value: string): string =>
  value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/\s+/g, ' ')
    .trim()

export const stripForCompare = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .replace(/[أإآٱأ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/ؤ/g, 'و')
    .replace(/ئ/g, 'ي')
    .trim()

export const countConsecutiveWordsMatched = (
  expected: string,
  actual: string
): number => {
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

export const countConsecutiveSteps = (
  raw: string,
  _normalized: string,
  fromStep: number = 0
): number => {
  const compactRaw = stripForCompare(raw)
  let lastIndex = 0
  let matched = 0

  for (let i = 0; i < shahadaSteps.length; i++) {
    const step = shahadaSteps[i]
    if (!step) continue
    if (i < fromStep) {
      matched++
      continue
    }

    const arabic = stripForCompare(step.arabic)
    const hints = (step.compactHints ?? []).map((h) => stripForCompare(h))

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

export const cleanDisplayTranscript = (text: string): string => {
  if (!text) return ''
  const words = text.trim().split(/\s+/)
  return words.filter((word, index) => word !== words[index - 1]).join(' ')
}
