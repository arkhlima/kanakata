import type { CharGroup, Script } from '~/constants/kana'

export interface Questions {
  char: string
  answer: string
  isCorrect?: boolean
}

export type CharType = 'Monographs' | 'MonographDiacritics' | 'Diagraphs' | 'DiagraphDiacritics' | 'LookAlike'

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
  questions: Questions[]
  currentQuestion: number
  correctAnswers: number
  incorrectAnswers: number

  // hiragana state
  totalHiragana: number
  selectedHiraganaMonographs: CharGroup
  selectedHiraganaMonographDiacritics: CharGroup
  selectedHiraganaDiagraphs: CharGroup
  selectedHiraganaDiagraphDiacritics: CharGroup
  selectedHiraganaLookAlike: CharGroup

  // katakana state
  totalKatakana: number
  selectedKatakanaMonographs: CharGroup
  selectedKatakanaMonographDiacritics: CharGroup
  selectedKatakanaDiagraphs: CharGroup
  selectedKatakanaDiagraphDiacritics: CharGroup
  selectedKatakanaLookAlike: CharGroup

  [key: string]: any
}

export interface Actions {
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

export type StateWithActions = State & Actions
export type SelectedCharsKey = `selected${Script}${CharType}`
export type TotalKey = `total${Script}`

export const getSelectedCharGroup = (state: State, key: string): CharGroup => {
  return state[key] as CharGroup
}
