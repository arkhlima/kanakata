import create from 'solid-zustand'

import { MONOGRAPHS, MONOGRAPH_DIACRITICS, DIAGRAPHS, DIAGRAPH_DIACRITICS } from '~/constants/kana'
import type { CharGroup, Script } from '~/constants/kana'

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

   totalKana: number
   selectedKanaMonographs: CharGroup
   selectedKanaMonographDiacritics: CharGroup
   selectedKanaDiagraphs: CharGroup
   selectedKanaDiagraphDiacritics: CharGroup

   setSelectedScript: (value: Script) => void
   setTotalSelected: () => void

   toggleChars: (selectedChars: string, chars: CharGroup, groupIndex: number) => void
   toggleAllChars: (selectedChars: string, chars: CharGroup) => void
}

const useStore = create<State>((set, get) => ({
   scripts: ['Hiragana', 'Katakana', 'Kana'],

   selectedScript: 'Hiragana',

   totalHiragana: 0,
   selectedHiraganaMonographs: MONOGRAPHS.map(group => group.map(() => '')),
   selectedHiraganaMonographDiacritics: MONOGRAPH_DIACRITICS.map(group => group.map(() => '')),
   selectedHiraganaDiagraphs: DIAGRAPHS.map(group => group.map(() => '')),
   selectedHiraganaDiagraphDiacritics: DIAGRAPH_DIACRITICS.map(group => group.map(() => '')),

   totalKatakana: 0,
   selectedKatakanaMonographs: MONOGRAPHS.map(group => group.map(() => '')),
   selectedKatakanaMonographDiacritics: MONOGRAPH_DIACRITICS.map(group => group.map(() => '')),
   selectedKatakanaDiagraphs: DIAGRAPHS.map(group => group.map(() => '')),
   selectedKatakanaDiagraphDiacritics: DIAGRAPH_DIACRITICS.map(group => group.map(() => '')),

   totalKana: 0,
   selectedKanaMonographs: MONOGRAPHS.map(group => group.map(() => '')),
   selectedKanaMonographDiacritics: MONOGRAPH_DIACRITICS.map(group => group.map(() => '')),
   selectedKanaDiagraphs: DIAGRAPHS.map(group => group.map(() => '')),
   selectedKanaDiagraphDiacritics: DIAGRAPH_DIACRITICS.map(group => group.map(() => '')),

   setSelectedScript: value => set({ selectedScript: value }),

   setTotalSelected: () => {
      const obj = get()

      set({
         [`total${obj.selectedScript}`]: [
            ...obj[`selected${obj.selectedScript}Monographs`],
            ...obj[`selected${obj.selectedScript}MonographDiacritics`],
            ...obj[`selected${obj.selectedScript}Diagraphs`],
            ...obj[`selected${obj.selectedScript}DiagraphDiacritics`],
         ].filter(group => group.some(char => char !== '')).length,
      })
   },

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
