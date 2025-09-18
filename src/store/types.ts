import type { CharGroup, Script } from '~/constants/kana'

export interface Questions {
  char: string
  answer: string
  isCorrect?: boolean
}

export interface IncorrectAnswer {
  char: string
  userAnswer: string
  correctAnswer: string
}

export interface CorrectAnswer {
  char: string
  userAnswer: string
  correctAnswer: string
}

export type CharType =
  | 'Monographs'
  | 'MonographDiacritics'
  | 'Diagraphs'
  | 'DiagraphDiacritics'
  | 'LookAlike'

export interface ScriptState {
  selectedMonographs: CharGroup
  selectedMonographDiacritics: CharGroup
  selectedDiagraphs: CharGroup
  selectedDiagraphDiacritics: CharGroup
  selectedLookAlike: CharGroup
  total: number
}

export interface State {
  scripts: Script[]
  selectedScript: Script
  resetState: boolean
  isResetFromIncorrectAnswers: boolean
  questions: Questions[]
  currentQuestion: number
  correctAnswersTotal: number
  incorrectAnswersTotal: number
  correctAnswers: CorrectAnswer[]
  incorrectAnswers: IncorrectAnswer[]

  // hiragana state
  totalHiragana: number
  totalHiraganaMonographs: number
  totalHiraganaMonographDiacritics: number
  totalHiraganaDiagraphs: number
  totalHiraganaDiagraphDiacritics: number
  totalHiraganaLookAlike: number
  selectedHiraganaMonographs: CharGroup
  selectedHiraganaMonographDiacritics: CharGroup
  selectedHiraganaDiagraphs: CharGroup
  selectedHiraganaDiagraphDiacritics: CharGroup
  selectedHiraganaLookAlike: CharGroup

  // katakana state
  totalKatakana: number
  totalKatakanaMonographs: number
  totalKatakanaMonographDiacritics: number
  totalKatakanaDiagraphs: number
  totalKatakanaDiagraphDiacritics: number
  totalKatakanaLookAlike: number
  selectedKatakanaMonographs: CharGroup
  selectedKatakanaMonographDiacritics: CharGroup
  selectedKatakanaDiagraphs: CharGroup
  selectedKatakanaDiagraphDiacritics: CharGroup
  selectedKatakanaLookAlike: CharGroup
}

export interface Actions {
  setQuestions: () => void
  setAnswer: (value: string) => void
  setSelectedScript: (value: Script) => void
  setTotalSelected: () => void
  toggleChars: (selectedChars: string, chars: CharGroup, groupIndex: number) => void
  toggleAllChars: (selectedChars: string, chars: CharGroup) => void
  toggleAllScript: (script: Script) => void
  setResetState: (value: boolean) => void
  resetIncorrectAnswersFlag: () => void
  resetQuiz: () => void
  resetAll: () => void
  setQuestionsFromWrongAnswers: () => void
}

export type StateWithActions = State & Actions
export type SelectedCharsKey = `selected${Script}${CharType}`
export type TotalKey = `total${Script}`

export const getSelectedCharGroup = (state: State, key: string): CharGroup => {
  const stateWithDynamicAccess = state as unknown as Record<
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
  return stateWithDynamicAccess[key] as CharGroup
}
