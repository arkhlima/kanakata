import {
  MONOGRAPHS,
  MONOGRAPH_DIACRITICS,
  DIAGRAPHS,
  DIAGRAPH_DIACRITICS,
  KATAKANA_LOOK_ALIKE,
  HIRAGANA_LOOK_ALIKE,
} from '~/constants/kana'
import type { State } from './types'

// helper function to create empty char groups
const createEmptyCharGroups = (charGroups: (string | null)[][]) =>
  charGroups.map((group) => group.map(() => ''))

export const initialState: State = {
  scripts: ['Hiragana', 'Katakana'],
  selectedScript: 'Hiragana',
  resetState: false,
  questions: [],
  currentQuestion: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,

  // hiragana state
  totalHiragana: 0,
  selectedHiraganaMonographs: createEmptyCharGroups(MONOGRAPHS),
  selectedHiraganaMonographDiacritics: createEmptyCharGroups(MONOGRAPH_DIACRITICS),
  selectedHiraganaDiagraphs: createEmptyCharGroups(DIAGRAPHS),
  selectedHiraganaDiagraphDiacritics: createEmptyCharGroups(DIAGRAPH_DIACRITICS),
  selectedHiraganaLookAlike: createEmptyCharGroups(HIRAGANA_LOOK_ALIKE),

  // katakana state
  totalKatakana: 0,
  selectedKatakanaMonographs: createEmptyCharGroups(MONOGRAPHS),
  selectedKatakanaMonographDiacritics: createEmptyCharGroups(MONOGRAPH_DIACRITICS),
  selectedKatakanaDiagraphs: createEmptyCharGroups(DIAGRAPHS),
  selectedKatakanaDiagraphDiacritics: createEmptyCharGroups(DIAGRAPH_DIACRITICS),
  selectedKatakanaLookAlike: createEmptyCharGroups(KATAKANA_LOOK_ALIKE),
}
