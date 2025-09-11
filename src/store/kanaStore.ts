import create from 'solid-zustand'
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

  setQuestions: () => {
    const questions = generateQuestions(get())
    set({ questions })
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
    const state = get()
    const total = calculateTotal(state, state.selectedScript)
    set({
      [`total${state.selectedScript}`]: total,
    })
  },

  toggleChars: (selectedChars, chars, groupIndex) => {
    const state = get()
    const currentSelection = state[selectedChars] as CharGroup

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

  toggleAllChars: (selectedChars, chars) => {
    const state = get()
    const currentSelection = state[selectedChars] as CharGroup

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

  setResetState: (value) => {
    set({ resetState: value })
  },

  resetQuiz: () => {
    set({ currentQuestion: 0 })
  },

  resetAll: () => {
    set(createResetState())
  },
}))

export default useStore
