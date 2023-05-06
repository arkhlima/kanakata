/* eslint-disable solid/prefer-for */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { For } from 'solid-js'
import Checkbox from '~/components/Checkbox'

import { toRomaji } from 'wanakana'

interface CharGroupProps {
   chars: (string | null)[][]
   selectedChars: (string | null)[][]
   toggleChars: (groupIndex: number) => void
   toggleAllChars: () => void
}

const CharGroup = (props: CharGroupProps) => {
   return (
      <div class="grid gap-y-1">
         <div class="flex rounded-t-xl border-2 border-b-0 border-slate-300 bg-slate-100 p-2 pb-1">
            <Checkbox
               label="select all"
               isChecked={props.selectedChars.every(group =>
                  group.every(char => char !== '' && char !== undefined)
               )}
               onChange={props.toggleAllChars}
            />
         </div>
         {props.chars.map((hiraganaMonographsGroup, groupIndex) => (
            <div class="grid grid-cols-[auto_repeat(5,1fr)] gap-x-1 rounded-xl">
               <div class="flex items-center rounded-l-xl border-2 border-r-0 border-slate-300 bg-slate-100 p-2 pr-1">
                  <Checkbox
                     label=""
                     isChecked={props.selectedChars[groupIndex].every(
                        char => char !== '' && char !== undefined
                     )}
                     onChange={() => props.toggleChars(groupIndex)}
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
   )
}

export default CharGroup
