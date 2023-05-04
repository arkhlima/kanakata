import create from 'solid-zustand'
import { HIRAGANA_MONOGRAPHS } from '~/constants/kana'
import type { CharGroup } from '~/constants/kana'

type SelectedCharGroup = (string | '' | null)[][]

interface State {
   hiraganaMonographs: (string | null)[][]
   selectedHiraganaMonographs: (string | null)[][]
   toggleAllHiraganaMonographs: () => void
   toggleHiraganaMonographs: (groupIndex: number) => void
   toggleAllKana: () => void
}

const hiraganaMonographs = HIRAGANA_MONOGRAPHS

const useStore = create<State>((set, get) => ({
   hiraganaMonographs,
   selectedHiraganaMonographs: hiraganaMonographs.map(group => group.map(() => '')),

   toggleAllHiraganaMonographs: () => {
      const { selectedHiraganaMonographs, hiraganaMonographs } = get()
      set({
         selectedHiraganaMonographs: toggleAllChars(selectedHiraganaMonographs, hiraganaMonographs),
      })
   },

   toggleAllKana: () => {
      const { selectedHiraganaMonographs, hiraganaMonographs } = get()
      const allSelected = selectedHiraganaMonographs.flat().every(char => char !== '')

      set({
         selectedHiraganaMonographs: allSelected
            ? hiraganaMonographs.map(group => group.map(() => ''))
            : hiraganaMonographs.map(group => group.slice()),
      })
   },

   toggleHiraganaMonographs: (groupIndex: number) => {
      const { selectedHiraganaMonographs, hiraganaMonographs } = get()
      set({
         selectedHiraganaMonographs: toggleChar(
            groupIndex,
            selectedHiraganaMonographs,
            hiraganaMonographs
         ),
      })
   },
}))

const toggleAllChars = (selectedChars: SelectedCharGroup, chars: CharGroup): SelectedCharGroup => {
   const allSelected = selectedChars.flat().every(char => char !== '')
   return allSelected ? chars.map(group => group.map(() => '')) : chars.map(group => group.slice())
}

const toggleChar = (
   groupIndex: number,
   selectedChars: SelectedCharGroup,
   chars: CharGroup
): SelectedCharGroup => {
   return selectedChars.map((group, index) =>
      index === groupIndex
         ? group.map((char, charIndex) => (char === '' ? chars[index][charIndex] : ''))
         : group
   )
}

export default useStore
