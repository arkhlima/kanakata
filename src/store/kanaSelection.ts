import create from 'solid-zustand'

import { MONOGRAPHS, MONOGRAPH_DIACRITICS } from '~/constants/kana'
import type { CharGroup } from '~/constants/kana'

interface State {
   selectedHiraganaMonographs: CharGroup
   selectedHiraganaMonographDiacritics: CharGroup

   toggleChars: (selectedChars: string, chars: CharGroup, groupIndex: number) => void
   toggleAllChars: (selectedChars: string, chars: CharGroup) => void
}

const useStore = create<State>((set, get) => ({
   selectedHiraganaMonographs: MONOGRAPHS.map(group => group.map(() => '')),
   selectedHiraganaMonographDiacritics: MONOGRAPH_DIACRITICS.map(group => group.map(() => '')),

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
