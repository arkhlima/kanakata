/* eslint-disable solid/prefer-for */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { For } from 'solid-js'
import useStore from '~/store'
import Checkbox from '~/components/Checkbox'

import { toRomaji } from 'wanakana'

const App = () => {
   const state = useStore()
   const { toggleAllHiraganaMonographs, toggleHiraganaMonographs } = state

   return (
      <main class="mx-auto grid max-w-lg grid-cols-12 py-16">
         <header class="col-span-12 mb-16">
            <h1 class="text-center text-5xl font-bold">kanakata</h1>
         </header>

         <section class="col-span-12">
            <div class="grid gap-y-1">
               <div class="flex rounded-t-xl border-2 border-b-0 border-slate-300 bg-slate-100 p-2 pb-1">
                  <Checkbox
                     label="select all"
                     isChecked={state.selectedHiraganaMonographs.every(group =>
                        group.every(char => char !== '' && char !== undefined)
                     )}
                     onChange={toggleAllHiraganaMonographs}
                  />
               </div>
               {state.hiraganaMonographs.map((hiraganaMonographsGroup, groupIndex) => (
                  <div class="grid grid-flow-dense grid-cols-[auto_repeat(5,1fr)] gap-x-1 rounded-xl">
                     <div class="flex items-center rounded-l-xl border-2 border-r-0 border-slate-300 bg-slate-100 p-2 pr-1">
                        <Checkbox
                           label=""
                           isChecked={state.selectedHiraganaMonographs[groupIndex].every(
                              item => item !== '' && item !== undefined
                           )}
                           onChange={() => toggleHiraganaMonographs(groupIndex)}
                        />
                     </div>
                     <For each={hiraganaMonographsGroup}>
                        {hiraganaMonographs => (
                           <div class="flex flex-col items-center gap-y-2 rounded-xl border-2 border-slate-300 bg-slate-100 p-2">
                              {!!hiraganaMonographs && (
                                 <>
                                    <span class="font-sans text-xl font-bold leading-none">
                                       {hiraganaMonographs}
                                    </span>
                                    <span class="text-xs leading-none text-slate-400">
                                       {!!hiraganaMonographs && toRomaji(hiraganaMonographs)}
                                    </span>
                                 </>
                              )}
                           </div>
                        )}
                     </For>
                  </div>
               ))}
            </div>
         </section>
      </main>
   )
}

export default App
