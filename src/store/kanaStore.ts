import create from 'solid-zustand'
import { toKatakana } from 'wanakana'

import {
  MONOGRAPHS,
  MONOGRAPH_DIACRITICS,
  DIAGRAPHS,
  DIAGRAPH_DIACRITICS,
} from '~/constants/kana'
import type { CharGroup, Script } from '~/constants/kana'

interface Questions {
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

  totalKatakana: number
  selectedKatakanaMonographs: CharGroup
  selectedKatakanaMonographDiacritics: CharGroup
  selectedKatakanaDiagraphs: CharGroup
  selectedKatakanaDiagraphDiacritics: CharGroup

  questions: Questions[]
  currentQuestion: number

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
}

const useStore = create<State>((set, get) => ({
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

  totalKatakana: 0,
  selectedKatakanaMonographs: MONOGRAPHS.map((group) => group.map(() => '')),
  selectedKatakanaMonographDiacritics: MONOGRAPH_DIACRITICS.map((group) =>
    group.map(() => '')
  ),
  selectedKatakanaDiagraphs: DIAGRAPHS.map((group) => group.map(() => '')),
  selectedKatakanaDiagraphDiacritics: DIAGRAPH_DIACRITICS.map((group) =>
    group.map(() => '')
  ),

  questions: [],
  currentQuestion: 0,

  setQuestions: () => {
    const obj = get()

    const filteredSelectedHiragana = [
      ...obj.selectedHiraganaMonographs,
      ...obj.selectedHiraganaMonographDiacritics,
      ...obj.selectedHiraganaDiagraphs,
      ...obj.selectedHiraganaDiagraphDiacritics,
    ]
      .flat()
      .filter((char): char is string => !!char)

    const filteredSelectedKatakana = [
      ...obj.selectedKatakanaMonographs,
      ...obj.selectedKatakanaMonographDiacritics,
      ...obj.selectedKatakanaDiagraphs,
      ...obj.selectedKatakanaDiagraphDiacritics,
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
    const obj = get()

    const newQuestions = [...obj.questions]
    newQuestions[obj.currentQuestion].answer = value

    set({
      questions: newQuestions,
    })
  },

  setSelectedScript: (value) => set({ selectedScript: value }),

  setTotalSelected: () => {
    const obj = get()

    set({
      [`total${obj.selectedScript}`]: [
        ...obj[`selected${obj.selectedScript}Monographs`],
        ...obj[`selected${obj.selectedScript}MonographDiacritics`],
        ...obj[`selected${obj.selectedScript}Diagraphs`],
        ...obj[`selected${obj.selectedScript}DiagraphDiacritics`],
      ].filter((group) => group.some((char) => char !== '')).length,
    })
  },

  toggleChars: (
    selectedChars: string,
    chars: CharGroup,
    groupIndex: number
  ) => {
    const obj = get()

    // TODO: fix type errors
    set({
      [selectedChars]: obj[selectedChars].map((group, index) =>
        index === groupIndex
          ? group.map((groupChar, groupCharIndex) =>
              groupChar === '' ? chars[index][groupCharIndex] : ''
            )
          : group
      ),
    })
  },

  toggleAllChars: (selectedChars: string, chars: CharGroup) => {
    const obj = get()

    // TODO: fix type errors
    set({
      [selectedChars]: obj[selectedChars].flat().every((char) => char !== '')
        ? chars.map((group) => group.map(() => ''))
        : chars.map((group) => group.slice()),
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
