import create from 'solid-zustand'

import { MONOGRAPHS } from '~/constants/kana'
import type { CharGroup } from '~/constants/kana'

type SelectedCharGroup = (string | '' | null)[][]

interface State {
   selectedHiraganaMonographs: CharGroup

   toggleAllHiraganaMonographs: () => void
   toggleChar: (selectedChar: string, char: CharGroup, groupIndex: number) => void

   toggleAllKana: () => void
}

const useStore = create<State>((set, get) => ({
   selectedHiraganaMonographs: MONOGRAPHS.map(group => group.map(() => '')),

   toggleAllHiraganaMonographs: () => {
      const { selectedHiraganaMonographs } = get()
      set({
         selectedHiraganaMonographs: toggleAllChars(selectedHiraganaMonographs, MONOGRAPHS),
      })
   },

   toggleChar: (selectedChar: string, char: CharGroup, groupIndex: number) => {
      const obj = get()

      // TODO: fix the type error
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

const toggleAllChars = (selectedChars: SelectedCharGroup, chars: CharGroup): SelectedCharGroup => {
   const allSelected = selectedChars.flat().every(char => char !== '')
   return allSelected ? chars.map(group => group.map(() => '')) : chars.map(group => group.slice())
}

export default useStore
