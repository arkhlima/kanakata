import create from 'solid-zustand'
import { toKatakana } from 'wanakana'

import {
  MONOGRAPHS,
  MONOGRAPH_DIACRITICS,
  DIAGRAPHS,
  DIAGRAPH_DIACRITICS,
  KATAKANA_LOOK_ALIKE,
  HIRAGANA_LOOK_ALIKE,
} from '~/constants/kana'
import type { CharGroup, Script } from '~/constants/kana'

export interface Questions {
  char: string
  answer: string
}

interface State {
  scripts: Script[]

  selectedScript: Script

  totalHiragana: number
  selectedHiraganaMonographs: CharGroup
  selectedHiraganaMonographDiacritics: CharGroup
  selectedHiraganaDiagraphs: CharGroup
  selectedHiraganaDiagraphDiacritics: CharGroup
  selectedHiraganaLookAlike: CharGroup

  totalKatakana: number
  selectedKatakanaMonographs: CharGroup
  selectedKatakanaMonographDiacritics: CharGroup
  selectedKatakanaDiagraphs: CharGroup
  selectedKatakanaDiagraphDiacritics: CharGroup
  selectedKatakanaLookAlike: CharGroup

  resetState: boolean

  questions: Questions[]
  currentQuestion: number
}

const initialState: State = {
  scripts: ['Hiragana', 'Katakana'],

  selectedScript: 'Hiragana',

  totalHiragana: 0,
  selectedHiraganaMonographs: MONOGRAPHS.map((group) => group.map(() => '')),
  selectedHiraganaMonographDiacritics: MONOGRAPH_DIACRITICS.map((group) =>
    group.map(() => '')
  ),
  selectedHiraganaDiagraphs: DIAGRAPHS.map((group) => group.map(() => '')),
  selectedHiraganaDiagraphDiacritics: DIAGRAPH_DIACRITICS.map((group) =>
    group.map(() => '')
  ),
  selectedHiraganaLookAlike: HIRAGANA_LOOK_ALIKE.map((group) =>
    group.map(() => '')
  ),

  totalKatakana: 0,
  selectedKatakanaMonographs: MONOGRAPHS.map((group) => group.map(() => '')),
  selectedKatakanaMonographDiacritics: MONOGRAPH_DIACRITICS.map((group) =>
    group.map(() => '')
  ),
  selectedKatakanaDiagraphs: DIAGRAPHS.map((group) => group.map(() => '')),
  selectedKatakanaDiagraphDiacritics: DIAGRAPH_DIACRITICS.map((group) =>
    group.map(() => '')
  ),
  selectedKatakanaLookAlike: KATAKANA_LOOK_ALIKE.map((group) =>
    group.map(() => '')
  ),

  resetState: false,

  questions: [],
  currentQuestion: 0,
}

interface Actions {
  setQuestions: () => void
  setAnswer: (value: string) => void

  setSelectedScript: (value: Script) => void
  setTotalSelected: () => void

  toggleChars: (
    selectedChars: string,
    chars: CharGroup,
    groupIndex: number
  ) => void
  toggleAllChars: (selectedChars: string, chars: CharGroup) => void

  setResetState: (value: boolean) => void
  resetQuiz: () => void
  resetAll: () => void
}

const useStore = create<State & Actions>((set, get) => ({
  ...initialState,

  setQuestions: () => {
    const filteredSelectedHiragana = [
      ...get().selectedHiraganaMonographs,
      ...get().selectedHiraganaMonographDiacritics,
      ...get().selectedHiraganaDiagraphs,
      ...get().selectedHiraganaDiagraphDiacritics,
      ...get().selectedHiraganaLookAlike,
    ]
      .flat()
      .filter((char): char is string => !!char)

    const filteredSelectedKatakana = [
      ...get().selectedKatakanaMonographs,
      ...get().selectedKatakanaMonographDiacritics,
      ...get().selectedKatakanaDiagraphs,
      ...get().selectedKatakanaDiagraphDiacritics,
      ...get().selectedKatakanaLookAlike,
    ]
      .flat()
      .filter((char): char is string => !!char)
      .map((char) => char && toKatakana(char))

    const composedQuestions = shuffleQuestions([
      ...shuffleQuestions(filteredSelectedHiragana),
      ...shuffleQuestions(filteredSelectedKatakana),
    ]).map((char) => ({
      char,
      answer: '',
    }))

    set({
      questions: composedQuestions,
    })
  },

  setAnswer: (value) => {
    set({
      questions: get().questions.map((question, index) =>
        index === get().currentQuestion
          ? { ...question, answer: value }
          : question
      ),
      currentQuestion: get().currentQuestion + 1,
    })
  },

  setSelectedScript: (value) => set({ selectedScript: value }),

  setTotalSelected: () => {
    set({
      [`total${get().selectedScript}`]: [
        ...get()[`selected${get().selectedScript}Monographs`],
        ...get()[`selected${get().selectedScript}MonographDiacritics`],
        ...get()[`selected${get().selectedScript}Diagraphs`],
        ...get()[`selected${get().selectedScript}DiagraphDiacritics`],
        ...(get().selectedScript === 'Hiragana'
          ? get().selectedHiraganaLookAlike
          : get().selectedKatakanaLookAlike),
      ].filter((group) => group.some((char) => char !== '')).length,
    })
  },

  toggleChars: (selectedChars, chars, groupIndex) => {
    // TODO: fix type errors
    set({
      [selectedChars]: get()[selectedChars].map((group, index) =>
        index === groupIndex
          ? group.map((groupChar, groupCharIndex) =>
              groupChar === '' ? chars[index][groupCharIndex] : ''
            )
          : group
      ),
    })
  },

  toggleAllChars: (selectedChars, chars) => {
    // TODO: fix type errors
    set({
      [selectedChars]: get()
        [selectedChars].flat()
        .every((char) => char !== '')
        ? chars.map((group) => group.map(() => ''))
        : chars.map((group) => group.slice()),
    })
  },

  setResetState: (value) => {
    set({ resetState: value })
  },

  resetQuiz: () => {
    set({ currentQuestion: 0 })
  },

  resetAll: () => {
    set({
      selectedScript: 'Hiragana',

      totalHiragana: 0,
      selectedHiraganaMonographs: MONOGRAPHS.map((group) =>
        group.map(() => '')
      ),
      selectedHiraganaMonographDiacritics: MONOGRAPH_DIACRITICS.map((group) =>
        group.map(() => '')
      ),
      selectedHiraganaDiagraphs: DIAGRAPHS.map((group) => group.map(() => '')),
      selectedHiraganaDiagraphDiacritics: DIAGRAPH_DIACRITICS.map((group) =>
        group.map(() => '')
      ),
      selectedHiraganaLookAlike: HIRAGANA_LOOK_ALIKE.map((group) =>
        group.map(() => '')
      ),

      totalKatakana: 0,
      selectedKatakanaMonographs: MONOGRAPHS.map((group) =>
        group.map(() => '')
      ),
      selectedKatakanaMonographDiacritics: MONOGRAPH_DIACRITICS.map((group) =>
        group.map(() => '')
      ),
      selectedKatakanaDiagraphs: DIAGRAPHS.map((group) => group.map(() => '')),
      selectedKatakanaDiagraphDiacritics: DIAGRAPH_DIACRITICS.map((group) =>
        group.map(() => '')
      ),
      selectedKatakanaLookAlike: KATAKANA_LOOK_ALIKE.map((group) =>
        group.map(() => '')
      ),

      questions: [],
      currentQuestion: 0,
    })
  },
}))

const shuffleQuestions = (questions: string[]): string[] => {
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[questions[i], questions[j]] = [questions[j], questions[i]]
  }
  return questions
}

export default useStore
