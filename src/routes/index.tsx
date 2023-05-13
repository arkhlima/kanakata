import useStore from '~/store/kanaSelection'
import CharGroupSelect from '~/components/CharGroupSelect'
import Menu from '~/components/Menu'

import { DIAGRAPHS, MONOGRAPHS, MONOGRAPH_DIACRITICS, DIAGRAPH_DIACRITICS } from '~/constants/kana'

const App = () => {
   const state = useStore()
   const { toggleAllChars, toggleChars } = state

   return (
      <main class="mx-auto grid max-w-5xl grid-cols-12 gap-y-16 px-4 py-16 md:px-8">
         <header class="col-span-12 grid grid-cols-1 items-end gap-2 md:grid-cols-2 md:justify-center">
            <h1 class="text-center text-5xl font-bold md:order-last md:text-right">kanakata</h1>

            <Menu />
         </header>

         {/* <div class="fixed bottom-0 left-0 w-full">
            <div class="mx-auto max-w-5xl rounded-t-lg bg-slate-700 px-8 py-4">a</div>
         </div> */}

         <section class="col-span-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
            <div class="flex flex-col gap-y-4 md:gap-y-8">
               <CharGroupSelect
                  chars={MONOGRAPHS}
                  selectedChars={`selected${state.selectedScript}Monographs`}
                  toggleChars={toggleChars}
                  toggleAllChars={toggleAllChars}
               />
               <CharGroupSelect
                  chars={MONOGRAPH_DIACRITICS}
                  selectedChars={`selected${state.selectedScript}MonographDiacritics`}
                  toggleChars={toggleChars}
                  toggleAllChars={toggleAllChars}
               />
            </div>
            <div class="flex flex-col gap-y-4 md:gap-y-8">
               <CharGroupSelect
                  chars={DIAGRAPHS}
                  selectedChars={`selected${state.selectedScript}Diagraphs`}
                  toggleChars={toggleChars}
                  toggleAllChars={toggleAllChars}
               />
               <CharGroupSelect
                  chars={DIAGRAPH_DIACRITICS}
                  selectedChars={`selected${state.selectedScript}DiagraphDiacritics`}
                  toggleChars={toggleChars}
                  toggleAllChars={toggleAllChars}
               />
            </div>
         </section>

         <footer class="col-span-12 flex justify-end">
            <small class="text-slate-400">
               by{' '}
               <a
                  class="text-slate-700 decoration-blue-300 decoration-wavy transition-all duration-100 ease-in-out hover:underline"
                  href="https://arkhlima.xyz"
               >
                  arkhlima
               </a>
            </small>
         </footer>
      </main>
   )
}

export default App
