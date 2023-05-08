import create from 'solid-zustand'

import { MONOGRAPHS, MONOGRAPH_DIACRITICS, DIAGRAPHS, DIAGRAPH_DIACRITICS } from '~/constants/kana'
import type { CharGroup, Script } from '~/constants/kana'

interface State {
   scripts: Script[]

   selectedScript: Script

   selectedHiraganaMonographs: CharGroup
   selectedHiraganaMonographDiacritics: CharGroup
   selectedHiraganaDiagraphs: CharGroup
   selectedHiraganaDiagraphDiacritics: CharGroup

   selectedKatakanaMonographs: CharGroup
   selectedKatakanaMonographDiacritics: CharGroup
   selectedKatakanaDiagraphs: CharGroup
   selectedKatakanaDiagraphDiacritics: CharGroup

   setSelectedScript: (value: Script) => void
   toggleChars: (selectedChars: string, chars: CharGroup, groupIndex: number) => void
   toggleAllChars: (selectedChars: string, chars: CharGroup) => void
}

const useStore = create<State>((set, get) => ({
   scripts: ['hiragana', 'katakana', 'kana'],

   selectedScript: 'hiragana',

   selectedHiraganaMonographs: MONOGRAPHS.map(group => group.map(() => '')),
   selectedHiraganaMonographDiacritics: MONOGRAPH_DIACRITICS.map(group => group.map(() => '')),
   selectedHiraganaDiagraphs: DIAGRAPHS.map(group => group.map(() => '')),
   selectedHiraganaDiagraphDiacritics: DIAGRAPH_DIACRITICS.map(group => group.map(() => '')),

   selectedKatakanaMonographs: MONOGRAPHS.map(group => group.map(() => '')),
   selectedKatakanaMonographDiacritics: MONOGRAPH_DIACRITICS.map(group => group.map(() => '')),
   selectedKatakanaDiagraphs: DIAGRAPHS.map(group => group.map(() => '')),
   selectedKatakanaDiagraphDiacritics: DIAGRAPH_DIACRITICS.map(group => group.map(() => '')),

   selectedKanaMonographs: MONOGRAPHS.map(group => group.map(() => '')),
   selectedKanaMonographDiacritics: MONOGRAPH_DIACRITICS.map(group => group.map(() => '')),
   selectedKanaDiagraphs: DIAGRAPHS.map(group => group.map(() => '')),
   selectedKanaDiagraphDiacritics: DIAGRAPH_DIACRITICS.map(group => group.map(() => '')),

   setSelectedScript: value => set({ selectedScript: value }),

   toggleChars: (selectedChars: string, chars: CharGroup, groupIndex: number) => {
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
         [selectedChars]: obj[selectedChars].flat().every(char => char !== '')
            ? chars.map(group => group.map(() => ''))
            : chars.map(group => group.slice()),
      })
   },
}))

export default useStore
