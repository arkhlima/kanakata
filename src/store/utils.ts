import { toKatakana } from 'wanakana'
import type { Script } from '~/constants/kana'
import {
  DIAGRAPH_DIACRITICS,
  DIAGRAPHS,
  HIRAGANA_LOOK_ALIKE,
  KATAKANA_LOOK_ALIKE,
  MONOGRAPH_DIACRITICS,
  MONOGRAPHS,
} from '~/constants/kana'
import type { Questions, State } from './types'

// util function to shuffle questions
export const shuffleQuestions = (questions: string[]): string[] => {
  const shuffled = [...questions]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// helper to get all selected chars
export const getSelectedCharacters = (state: State, script: Script): string[] => {
  const selectedCharGroups = [
    state[`selected${script}Monographs`],
    state[`selected${script}MonographDiacritics`],
    state[`selected${script}Diagraphs`],
    state[`selected${script}DiagraphDiacritics`],
    state[`selected${script}LookAlike`],
  ] as string[][][]

  const selectedChars = selectedCharGroups
    .flat(2)
    .filter((char): char is string => !!char && char !== '')

  // convert to katakana if needed
  return script === 'Katakana' ? selectedChars.map((char) => toKatakana(char)) : selectedChars
}

// generate questions from selected chars
export const generateQuestions = (state: State): Questions[] => {
  const hiraganaChars = getSelectedCharacters(state, 'Hiragana')
  const katakanaChars = getSelectedCharacters(state, 'Katakana')

  const allChars = shuffleQuestions([
    ...shuffleQuestions(hiraganaChars),
    ...shuffleQuestions(katakanaChars),
  ])

  return allChars.map((char) => ({
    char,
    answer: '',
  }))
}

// calc total selected
export const calculateTotal = (state: State, script: Script): number => {
  const allCharGroups = [
    ...state[`selected${script}Monographs`],
    ...state[`selected${script}MonographDiacritics`],
    ...state[`selected${script}Diagraphs`],
    ...state[`selected${script}DiagraphDiacritics`],
    ...state[`selected${script}LookAlike`],
  ] as string[][]

  return allCharGroups.reduce((total, group) => {
    return total + group.filter((char) => char !== '').length
  }, 0)
}

// calc individual char group totals
export const calculateCharGroupTotal = (
  charGroup: string[][],
  originalChars: (string | null)[][]
): number => {
  return charGroup.reduce((total, group, groupIndex) => {
    const originalGroup = originalChars[groupIndex]
    return (
      total +
      group.filter((char, charIndex) => {
        return originalGroup[charIndex] !== null && char !== ''
      }).length
    )
  }, 0)
}

// get original chars for a specific char group type
export const getOriginalCharsForGroup = (script: Script, charType: string): (string | null)[][] => {
  if (charType.includes('Monographs') && !charType.includes('Diacritics')) return MONOGRAPHS
  if (charType.includes('MonographDiacritics')) return MONOGRAPH_DIACRITICS
  if (charType.includes('Diagraphs') && !charType.includes('Diacritics')) return DIAGRAPHS
  if (charType.includes('DiagraphDiacritics')) return DIAGRAPH_DIACRITICS
  if (script === 'Hiragana' && charType.includes('LookAlike')) return HIRAGANA_LOOK_ALIKE
  if (script === 'Katakana' && charType.includes('LookAlike')) return KATAKANA_LOOK_ALIKE
  return []
}

// helper function to create empty char groups (used in reset)
export const createEmptyCharGroups = (charGroups: (string | null)[][]) =>
  charGroups.map((group) => group.map(() => ''))

// reset state helper
export const createResetState = () => ({
  selectedScript: 'Hiragana' as Script,

  totalHiragana: 0,
  totalHiraganaMonographs: 0,
  totalHiraganaMonographDiacritics: 0,
  totalHiraganaDiagraphs: 0,
  totalHiraganaDiagraphDiacritics: 0,
  totalHiraganaLookAlike: 0,
  selectedHiraganaMonographs: createEmptyCharGroups(MONOGRAPHS),
  selectedHiraganaMonographDiacritics: createEmptyCharGroups(MONOGRAPH_DIACRITICS),
  selectedHiraganaDiagraphs: createEmptyCharGroups(DIAGRAPHS),
  selectedHiraganaDiagraphDiacritics: createEmptyCharGroups(DIAGRAPH_DIACRITICS),
  selectedHiraganaLookAlike: createEmptyCharGroups(HIRAGANA_LOOK_ALIKE),

  totalKatakana: 0,
  totalKatakanaMonographs: 0,
  totalKatakanaMonographDiacritics: 0,
  totalKatakanaDiagraphs: 0,
  totalKatakanaDiagraphDiacritics: 0,
  totalKatakanaLookAlike: 0,
  selectedKatakanaMonographs: createEmptyCharGroups(MONOGRAPHS),
  selectedKatakanaMonographDiacritics: createEmptyCharGroups(MONOGRAPH_DIACRITICS),
  selectedKatakanaDiagraphs: createEmptyCharGroups(DIAGRAPHS),
  selectedKatakanaDiagraphDiacritics: createEmptyCharGroups(DIAGRAPH_DIACRITICS),
  selectedKatakanaLookAlike: createEmptyCharGroups(KATAKANA_LOOK_ALIKE),

  questions: [] as Questions[],
  currentQuestion: 0,
  correctAnswersTotal: 0,
  incorrectAnswersTotal: 0,
  correctAnswers: [],
  incorrectAnswers: [],
})
