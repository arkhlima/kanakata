/* eslint-disable solid/prefer-for */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import useStore from '~/store/kanaSelection'
import CharGroupSelect from '~/components/CharGroupSelect'

import { DIAGRAPHS, MONOGRAPHS, MONOGRAPH_DIACRITICS, DIAGRAPH_DIACRITICS } from '~/constants/kana'

const App = () => {
   const state = useStore()
   const { toggleAllChars, toggleChars } = state

   return (
      <main class="mx-auto grid max-w-4xl grid-cols-12 py-16">
         <header class="col-span-12 mb-16">
            <h1 class="text-center text-5xl font-bold">kanakata</h1>
         </header>

         <section class="col-span-12 grid grid-cols-2 gap-x-8">
            <div class="flex flex-col gap-y-8">
               <CharGroupSelect
                  chars={MONOGRAPHS}
                  selectedChars={state.selectedHiraganaMonographs}
                  selectedCharsName="selectedHiraganaMonographs"
                  toggleChars={toggleChars}
                  toggleAllChars={toggleAllChars}
               />
               <CharGroupSelect
                  chars={MONOGRAPH_DIACRITICS}
                  selectedChars={state.selectedHiraganaMonographDiacritics}
                  selectedCharsName="selectedHiraganaMonographDiacritics"
                  toggleChars={toggleChars}
                  toggleAllChars={toggleAllChars}
               />
            </div>
            <div class="flex flex-col gap-y-8">
               <CharGroupSelect
                  chars={DIAGRAPHS}
                  selectedChars={state.selectedHiraganaDiagraphs}
                  selectedCharsName="selectedHiraganaDiagraphs"
                  toggleChars={toggleChars}
                  toggleAllChars={toggleAllChars}
               />
               <CharGroupSelect
                  chars={DIAGRAPH_DIACRITICS}
                  selectedChars={state.selectedHiraganaDiagraphDiacritics}
                  selectedCharsName="selectedHiraganaDiagraphDiacritics"
                  toggleChars={toggleChars}
                  toggleAllChars={toggleAllChars}
               />
            </div>
         </section>
      </main>
   )
}

export default App
