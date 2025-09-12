import create from 'solid-zustand'
import { toRomaji } from 'wanakana'
import type { CharGroup } from '~/constants/kana'

import type { StateWithActions } from './types'
import { initialState } from './initialState'
import {
  generateQuestions,
  calculateTotal,
  createResetState
} from './utils'

export type { Questions } from './types'
export { getSelectedCharGroup } from './types'

const useStore = create<StateWithActions>((set, get) => ({
  ...initialState,

  // generate new questions based on selected chars
  setQuestions: () => {
    const questions = generateQuestions(get())
    set({ questions })
  },

  // submit answer and move to next question
  setAnswer: (value) => {
    const currentQuestionIndex = get().currentQuestion
    const currentQuestion = get().questions[currentQuestionIndex]
    const correctAnswer = toRomaji(currentQuestion.char)
    const isCorrect = value.toLowerCase() === correctAnswer

    set({
      questions: get().questions.map((question, index) =>
        index === currentQuestionIndex
          ? { ...question, answer: value, isCorrect }
          : question
      ),
      currentQuestion: get().currentQuestion + 1,
      correctAnswers: isCorrect ? get().correctAnswers + 1 : get().correctAnswers,
      incorrectAnswers: !isCorrect ? get().incorrectAnswers + 1 : get().incorrectAnswers,
    })
  },

  // set script type — hiragana or katakana
  setSelectedScript: (value) => set({ selectedScript: value }),

  // calculate and update total selected chars for current script
  setTotalSelected: () => {
    const total = calculateTotal(get(), get().selectedScript)
    set({
      [`total${get().selectedScript}`]: total,
    })
  },

  // toggle entire char group selection
  toggleChars: (selectedChars, chars, groupIndex) => {
    const currentSelection = get()[selectedChars] as CharGroup

    set({
      [selectedChars]: currentSelection.map((group, index) =>
        index === groupIndex
          ? group.map((groupChar, groupCharIndex) =>
              groupChar === '' ? chars[groupIndex][groupCharIndex] : ''
            )
          : group
      ),
    })
  },

  // toggle all chars
  toggleAllChars: (selectedChars, chars) => {
    const currentSelection = get()[selectedChars] as CharGroup

    const allSelected = chars.every((originalGroup, groupIndex) =>
      originalGroup.every((char, charIndex) => {
        if (char === null) return true
        return currentSelection[groupIndex][charIndex] !== ''
      })
    )

    set({
      [selectedChars]: allSelected
        ? chars.map((group) => group.map(() => ''))
        : chars.map((group) => group.slice()),
    })
  },

  // set quiz reset state — used for animations during reset
  setResetState: (value) => {
    set({ resetState: value })
  },

  // reset quiz progress
  resetQuiz: () => {
    set({
      currentQuestion: 0,
      correctAnswers: 0,
      incorrectAnswers: 0,
    })
  },

  // reset everything
  resetAll: () => {
    set(createResetState())
  },
}))

export default useStore
