import { Show } from 'solid-js'

import useStore from '~/store/kanaSelection'
import CharGroupSelect from '~/components/CharGroupSelect'
import Menu from '~/components/Menu'

import { DIAGRAPHS, MONOGRAPHS, MONOGRAPH_DIACRITICS, DIAGRAPH_DIACRITICS } from '~/constants/kana'

const App = () => {
   const state = useStore()
   const { toggleAllChars, toggleChars } = state

   return (
      <main class="mx-auto grid max-w-5xl grid-cols-12 gap-y-16 px-4 pb-20 pt-16 md:px-8">
         <header class="col-span-12 grid grid-cols-1 items-end gap-2 md:grid-cols-2 md:justify-center">
            <h1 class="text-center text-5xl font-bold md:order-last md:text-right">kanakata</h1>

            <Menu />
         </header>

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

         <Show when={state.totalHiragana + state.totalKatakana + state.totalKana > 0}>
            <aside class="fixed bottom-8 left-0 w-full">
               <div class="relative mx-auto flex h-full w-full max-w-5xl justify-end px-4 md:px-8">
                  <button class="ease w-full rounded-xl bg-slate-700 px-4 py-2 text-lg text-slate-50 shadow-lg shadow-slate-200 transition-all duration-100 hover:bg-slate-600 focus:bg-slate-500">
                     let's play!
                  </button>
               </div>
            </aside>
         </Show>

         <footer class="col-span-12 flex justify-center md:justify-end">
            <a
               class="ease text-slate-700 decoration-blue-300 decoration-wavy transition-all duration-75 hover:underline"
               href="https://arkhlima.xyz"
            >
               @arkhlima
            </a>
         </footer>
      </main>
   )
}

export default App
