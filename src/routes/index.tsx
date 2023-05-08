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
      <main class="mx-auto grid max-w-4xl grid-cols-12 py-16">
         <header class="col-span-12 mb-16 grid grid-cols-2 items-end">
            <h1 class="order-last flex items-center justify-end text-5xl font-bold">kanakata</h1>

            <Menu />
         </header>

         <section class="col-span-12 grid grid-cols-2 gap-8">
            <div class="flex flex-col gap-y-8">
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
            <div class="flex flex-col gap-y-8">
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
