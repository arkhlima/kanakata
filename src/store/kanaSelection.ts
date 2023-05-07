import create from 'solid-zustand'

import { MONOGRAPHS } from '~/constants/kana'
import type { CharGroup } from '~/constants/kana'

interface State {
   selectedHiraganaMonographs: CharGroup

   toggleChar: (selectedChar: string, char: CharGroup, groupIndex: number) => void
   toggleAllChar: (selectedChar: string, char: CharGroup) => void
   toggleAllKana: () => void
}

const useStore = create<State>((set, get) => ({
   selectedHiraganaMonographs: MONOGRAPHS.map(group => group.map(() => '')),

   toggleChar: (selectedChar: string, char: CharGroup, groupIndex: number) => {
      const obj = get()

      // TODO: fix the type errors
      set({
         [selectedChar]: obj[selectedChar].map((group, index) =>
            index === groupIndex
               ? group.map((groupChar, groupCharIndex) =>
                    groupChar === '' ? char[index][groupCharIndex] : ''
                 )
               : group
         ),
      })
   },

   toggleAllChar: (selectedChar: string, char: CharGroup) => {
      const obj = get()

      // TODO: fix the type errors
      set({
         [selectedChar]: obj[selectedChar].flat().every(item => item !== '')
            ? char.map(group => group.map(() => ''))
            : char.map(group => group.slice()),
      })
   },

   toggleAllKana: () => {
      const { selectedHiraganaMonographs } = get()
      const allSelected = selectedHiraganaMonographs.flat().every(char => char !== '')

      set({
         selectedHiraganaMonographs: allSelected
            ? MONOGRAPHS.map(group => group.map(() => ''))
            : MONOGRAPHS.map(group => group.slice()),
      })
   },
}))

export default useStore
