import create from 'solid-zustand'
import { toRomaji } from 'wanakana'
import type { CharGroup, Script } from '~/constants/kana'
import {
  DIAGRAPH_DIACRITICS,
  DIAGRAPHS,
  HIRAGANA_LOOK_ALIKE,
  KATAKANA_LOOK_ALIKE,
  MONOGRAPH_DIACRITICS,
  MONOGRAPHS,
} from '~/constants/kana'

import { initialState } from './initialState'
import type { CorrectAnswer, IncorrectAnswer, Questions, StateWithActions } from './types'
import {
  calculateCharGroupTotal,
  calculateTotal,
  createResetState,
  generateQuestions,
  getOriginalCharsForGroup,
} from './utils'

export type { CorrectAnswer, IncorrectAnswer, Questions } from './types'
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

    const answerData = {
      char: currentQuestion.char,
      userAnswer: value,
      correctAnswer: correctAnswer,
    }

    const newCorrectAnswers = isCorrect
      ? [...get().correctAnswers, answerData]
      : get().correctAnswers

    const newIncorrectAnswers = !isCorrect
      ? [...get().incorrectAnswers, answerData]
      : get().incorrectAnswers

    set({
      questions: get().questions.map((question, index) =>
        index === currentQuestionIndex ? { ...question, answer: value, isCorrect } : question
      ),
      currentQuestion: get().currentQuestion + 1,
      correctAnswersTotal: isCorrect ? get().correctAnswersTotal + 1 : get().correctAnswersTotal,
      incorrectAnswersTotal: !isCorrect
        ? get().incorrectAnswersTotal + 1
        : get().incorrectAnswersTotal,
      correctAnswers: newCorrectAnswers,
      incorrectAnswers: newIncorrectAnswers,
    })
  },

  // set script type — hiragana or katakana
  setSelectedScript: (value) => set({ selectedScript: value }),

  // calculate and update total selected chars for current script
  setTotalSelected: () => {
    const state = get()
    const script = state.selectedScript
    const total = calculateTotal(state, script)

    const charGroupTypes = [
      'Monographs',
      'MonographDiacritics',
      'Diagraphs',
      'DiagraphDiacritics',
      'LookAlike',
    ]
    const updates: Record<string, number> = {
      [`total${script}`]: total,
    }

    charGroupTypes.forEach((charType) => {
      const selectedCharGroup = state[
        `selected${script}${charType}` as keyof typeof state
      ] as string[][]
      const originalChars = getOriginalCharsForGroup(script, charType)
      const groupTotal = calculateCharGroupTotal(selectedCharGroup, originalChars)
      updates[`total${script}${charType}`] = groupTotal
    })

    set(updates)
  },

  // toggle all char group selection
  toggleChars: (selectedChars, chars, groupIndex) => {
    const state = get() as unknown as Record<
      string,
      | CharGroup
      | number
      | Script[]
      | Script
      | boolean
      | Questions[]
      | CorrectAnswer[]
      | IncorrectAnswer[]
    >
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

  // toggle all chars
  toggleAllChars: (selectedChars, chars) => {
    const state = get() as unknown as Record<
      string,
      | CharGroup
      | number
      | Script[]
      | Script
      | boolean
      | Questions[]
      | CorrectAnswer[]
      | IncorrectAnswer[]
    >
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

  // toggle all script
  toggleAllScript: (script) => {
    const state = get()
    const scriptPrefix = `selected${script}`

    const charGroupKeys = [
      `${scriptPrefix}Monographs`,
      `${scriptPrefix}MonographDiacritics`,
      `${scriptPrefix}Diagraphs`,
      `${scriptPrefix}DiagraphDiacritics`,
      `${scriptPrefix}LookAlike`,
    ]

    // check if all char groups are fully selected
    const allCharGroupsSelected = charGroupKeys.every((key) => {
      const stateWithDynamicAccess = state as unknown as Record<string, CharGroup>
      const selection = stateWithDynamicAccess[key]
      // get corresponding original chars for this group
      const getCharsForKey = (key: string) => {
        if (key.includes('Monographs') && !key.includes('Diacritics')) return MONOGRAPHS
        if (key.includes('MonographDiacritics')) return MONOGRAPH_DIACRITICS
        if (key.includes('Diagraphs') && !key.includes('Diacritics')) return DIAGRAPHS
        if (key.includes('DiagraphDiacritics')) return DIAGRAPH_DIACRITICS
        if (script === 'Hiragana' && key.includes('LookAlike')) return HIRAGANA_LOOK_ALIKE
        if (script === 'Katakana' && key.includes('LookAlike')) return KATAKANA_LOOK_ALIKE
        return []
      }

      const originalChars = getCharsForKey(key)
      return originalChars.every((group, groupIndex) =>
        group.every((char, charIndex) => {
          if (char === null) return true
          return selection[groupIndex][charIndex] !== ''
        })
      )
    })

    // toggle all char groups
    const updates: Record<string, CharGroup> = {}
    charGroupKeys.forEach((key) => {
      const getCharsForKey = (key: string) => {
        if (key.includes('Monographs') && !key.includes('Diacritics')) return MONOGRAPHS
        if (key.includes('MonographDiacritics')) return MONOGRAPH_DIACRITICS
        if (key.includes('Diagraphs') && !key.includes('Diacritics')) return DIAGRAPHS
        if (key.includes('DiagraphDiacritics')) return DIAGRAPH_DIACRITICS
        if (script === 'Hiragana' && key.includes('LookAlike')) return HIRAGANA_LOOK_ALIKE
        if (script === 'Katakana' && key.includes('LookAlike')) return KATAKANA_LOOK_ALIKE
        return []
      }

      const originalChars = getCharsForKey(key)
      updates[key] = allCharGroupsSelected
        ? originalChars.map((group) => group.map(() => ''))
        : originalChars.map((group) => group.slice())
    })

    set(updates)
    get().setTotalSelected()
  },

  // set quiz reset state — used for animations during reset
  setResetState: (value) => {
    set({ resetState: value })
  },

  // reset the incorrect answers flag
  resetIncorrectAnswersFlag: () => {
    set({ isResetFromIncorrectAnswers: false })
  },

  // reset quiz progress
  resetQuiz: () => {
    set({
      currentQuestion: 0,
      correctAnswersTotal: 0,
      incorrectAnswersTotal: 0,
      correctAnswers: [],
      incorrectAnswers: [],
    })
  },

  // create quiz from wrong answers only
  setQuestionsFromWrongAnswers: () => {
    const incorrectAnswers = get().incorrectAnswers
    const questions = incorrectAnswers.map((incorrectAnswer) => ({
      char: incorrectAnswer.char,
      answer: '',
      isCorrect: undefined,
    }))

    set({
      questions,
      currentQuestion: 0,
      correctAnswersTotal: 0,
      incorrectAnswersTotal: 0,
      correctAnswers: [],
      incorrectAnswers: [],
      resetState: true,
      isResetFromIncorrectAnswers: true,
    })
  },

  // reset everything
  resetAll: () => {
    set(createResetState())
  },
}))

export default useStore
