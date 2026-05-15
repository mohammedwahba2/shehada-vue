import { describe, expect, it } from 'vitest'
import {
  countConsecutiveSteps,
  countConsecutiveWordsMatched,
  normalizeTranscript,
  stripForCompare,
} from './shahadaMatch'

describe('shahadaMatch', () => {
  it('normalizes Arabic diacritics and casing', () => {
    expect(normalizeTranscript('أَشْهَدُ')).toBe('اشهد')
  })

  it('strips letter variants for comparison', () => {
    expect(stripForCompare('إِلَّا')).toBe('الا')
  })

  it('counts consecutive word matches', () => {
    const expected = 'أَشْهَدُ أَن لَّا إِلَٰهَ'
    const actual = 'اشهد ان لا اله'
    expect(countConsecutiveWordsMatched(expected, actual)).toBe(4)
  })

  it('advances through multiple shahada steps in order', () => {
    const raw = 'اشهد ان لا اله الا الله واشهد ان محمد رسول الله'
    const norm = normalizeTranscript(raw)
    expect(countConsecutiveSteps(raw, norm)).toBeGreaterThanOrEqual(3)
  })

  it('stops at first missing step', () => {
    const raw = 'اشهد ان لا اله'
    const norm = normalizeTranscript(raw)
    expect(countConsecutiveSteps(raw, norm)).toBe(1)
  })
})
