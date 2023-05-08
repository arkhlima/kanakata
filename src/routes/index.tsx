import useStore from '~/store/kanaSelection'
import CharGroupSelect from '~/components/CharGroupSelect'
import Menu from '~/components/Menu'

import { DIAGRAPHS, MONOGRAPHS, MONOGRAPH_DIACRITICS, DIAGRAPH_DIACRITICS } from '~/constants/kana'

const App = () => {
   const state = useStore()
   const { toggleAllChars, toggleChars } = state

   const getSelectedChars = (syllabograms: string) => {
      return `selected${
         state.selectedScript.charAt(0).toUpperCase() + state.selectedScript.slice(1)
      }${syllabograms}`
   }

   return (
      <main class="mx-auto grid max-w-5xl grid-cols-12 px-4 py-16 md:px-8">
         <header class="col-span-12 mb-16 grid grid-cols-1 items-end gap-2 md:grid-cols-2 md:justify-center">
            <h1 class="text-center text-5xl font-bold md:order-last md:text-right">kanakata</h1>

            <Menu />
         </header>

         <section class="col-span-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
            <div class="flex flex-col gap-y-4 md:gap-y-8">
               <CharGroupSelect
                  chars={MONOGRAPHS}
                  selectedChars={getSelectedChars('Monographs')}
                  toggleChars={toggleChars}
                  toggleAllChars={toggleAllChars}
               />
               <CharGroupSelect
                  chars={MONOGRAPH_DIACRITICS}
                  selectedChars={getSelectedChars('MonographDiacritics')}
                  toggleChars={toggleChars}
                  toggleAllChars={toggleAllChars}
               />
            </div>
            <div class="flex flex-col gap-y-4 md:gap-y-8">
               <CharGroupSelect
                  chars={DIAGRAPHS}
                  selectedChars={getSelectedChars('Diagraphs')}
                  toggleChars={toggleChars}
                  toggleAllChars={toggleAllChars}
               />
               <CharGroupSelect
                  chars={DIAGRAPH_DIACRITICS}
                  selectedChars={getSelectedChars('DiagraphDiacritics')}
                  toggleChars={toggleChars}
                  toggleAllChars={toggleAllChars}
               />
            </div>
         </section>
      </main>
   )
}

export default App
