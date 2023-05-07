import create from 'solid-zustand'

import { MONOGRAPHS, MONOGRAPH_DIACRITICS, DIAGRAPHS, DIAGRAPH_DIACRITICS } from '~/constants/kana'
import type { CharGroup, Script } from '~/constants/kana'

interface State {
   selectedScript: Script

   selectedHiraganaMonographs: CharGroup
   selectedHiraganaMonographDiacritics: CharGroup
   selectedHiraganaDiagraphs: CharGroup
   selectedHiraganaDiagraphDiacritics: CharGroup

   setSelectedScript: (value: Script) => void
   toggleChars: (selectedChars: string, chars: CharGroup, groupIndex: number) => void
   toggleAllChars: (selectedChars: string, chars: CharGroup) => void
}

const useStore = create<State>((set, get) => ({
   selectedScript: 'hiragana',
   selectedHiraganaMonographs: MONOGRAPHS.map(group => group.map(() => '')),
   selectedHiraganaMonographDiacritics: MONOGRAPH_DIACRITICS.map(group => group.map(() => '')),
   selectedHiraganaDiagraphs: DIAGRAPHS.map(group => group.map(() => '')),
   selectedHiraganaDiagraphDiacritics: DIAGRAPH_DIACRITICS.map(group => group.map(() => '')),

   setSelectedScript: value => set({ selectedScript: value }),

   toggleChars: (selectedChars: string, chars: CharGroup, groupIndex: number) => {
      const obj = get()

      // TODO: fix the type errors
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

      // TODO: fix the type errors
      set({
         [selectedChars]: obj[selectedChars].flat().every(char => char !== '')
            ? chars.map(group => group.map(() => ''))
            : chars.map(group => group.slice()),
      })
   },
}))

export default useStore
