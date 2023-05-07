/* eslint-disable solid/prefer-for */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { For } from 'solid-js'
import Checkbox from '~/components/Checkbox'
import { toHiragana } from 'wanakana'
import type { CharGroup } from '~/constants/kana'

interface CharGroupProps {
   chars: CharGroup
   selectedChars: CharGroup
   selectedCharsName: string
   toggleChars: (selectedChars: string, char: CharGroup, groupIndex: number) => void
   toggleAllChars: (selectedChars: string, char: CharGroup) => void
}

const CharGroupSelect = (props: CharGroupProps) => {
   const getCharGroupTitle = () => {
      const splitByUppercase: string[] = props.selectedCharsName.split(/(?=[A-Z])/)
      const removeFirstTwoWords: string[] = splitByUppercase.slice(2)
      return removeFirstTwoWords.join(' ').toLocaleLowerCase()
   }

   return (
      <div class="grid gap-y-1">
         <header class="grid grid-cols-2 rounded-t-xl border-2 border-b-0 border-slate-300 bg-slate-100 p-2 pb-1">
            <h2 class="order-last text-right font-bold text-slate-400">{getCharGroupTitle()}</h2>
            <Checkbox
               label="select all"
               isChecked={props.selectedChars.every(group =>
                  group.every(char => char !== '' && char !== undefined)
               )}
               onChange={() => props.toggleAllChars(props.selectedCharsName, props.chars)}
            />
         </header>
         {props.chars.map((charGroup, groupIndex) => (
            <div
               class="grid min-h-[60px] gap-x-1 rounded-xl"
               style={`grid-template-columns: auto repeat(${charGroup.length},1fr)`}
            >
               <div class="flex items-center rounded-l-xl border-2 border-r-0 border-slate-300 bg-slate-100 p-2 pr-1">
                  <Checkbox
                     label=""
                     isChecked={props.selectedChars[groupIndex].every(
                        char => char !== '' && char !== undefined
                     )}
                     onChange={() =>
                        props.toggleChars(props.selectedCharsName, props.chars, groupIndex)
                     }
                  />
               </div>
               <For each={charGroup}>
                  {char => (
                     <div
                        class={`flex flex-col items-center gap-y-2 rounded-xl border-2 p-2 transition-all duration-100 ease-in-out ${
                           props.selectedChars[groupIndex].every(
                              char => char !== '' && char !== undefined
                           )
                              ? 'border-blue-300 bg-blue-50'
                              : 'border-slate-300 bg-slate-100'
                        }`}
                     >
                        {!!char && (
                           <>
                              <span class="font-sans text-xl font-bold leading-none">
                                 {!!char && toHiragana(char)}
                              </span>
                              <span class="text-xs leading-none text-slate-400">{char}</span>
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

export default CharGroupSelect
