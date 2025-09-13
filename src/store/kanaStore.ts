import create from 'solid-zustand'
import { toRomaji } from 'wanakana'
import type { CharGroup, Script } from '~/constants/kana'

import { initialState } from './initialState'
import type { CorrectAnswer, IncorrectAnswer, Questions, StateWithActions } from './types'
import { calculateTotal, createResetState, generateQuestions } from './utils'

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
    const total = calculateTotal(get(), get().selectedScript)
    set({
      [`total${get().selectedScript}`]: total,
    })
  },

  // toggle entire char group selection
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

  // set quiz reset state — used for animations during reset
  setResetState: (value) => {
    set({ resetState: value })
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
    })
  },

  // reset everything
  resetAll: () => {
    set(createResetState())
  },
}))

export default useStore
