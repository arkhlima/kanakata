/* eslint-disable solid/prefer-for */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { For, Show } from 'solid-js'
import useStore from '~/store/kanaSelection'

import Checkbox from '~/components/Checkbox'
import { getCharGroupTitle } from '~/utils/chars'

import { toKatakana, toRomaji } from 'wanakana'

import type { CharGroup } from '~/constants/kana'

interface CharGroupProps {
   chars: CharGroup
   selectedChars: string
   toggleChars: (selectedChars: string, char: CharGroup, groupIndex: number) => void
   toggleAllChars: (selectedChars: string, char: CharGroup) => void
}

interface CharProps {
   char: string
}

const Char = (props: CharProps) => {
   const state = useStore()

   return (
      <>
         <Show
            when={['Hiragana', 'Katakana'].includes(state.selectedScript)}
            fallback={
               <span class="flex items-end justify-center break-keep text-center font-sans font-bold leading-none">
                  {props.char} {toKatakana(props.char)}
               </span>
            }
         >
            <span class="flex items-end justify-center font-sans text-xl font-bold leading-none">
               {state.selectedScript === 'Katakana' ? toKatakana(props.char) : props.char}
            </span>
         </Show>
         <span class="flex items-end justify-center text-xs leading-none text-slate-400">
            {toRomaji(props.char)}
         </span>
      </>
   )
}

const CharGroupSelect = (props: CharGroupProps) => {
   const state = useStore()
   const { setTotalSelected } = state

   return (
      <div class="grid gap-y-1">
         <header class="flex items-center justify-between rounded-t-xl border-2 border-b-0 border-slate-300 bg-slate-100 p-2 pb-1">
            <h2 class="xs:text-base order-last flex text-right text-sm font-bold text-slate-400">
               {getCharGroupTitle(props.selectedChars)}
            </h2>
            <Checkbox
               label="select all"
               // TODO: fix type errors
               isChecked={state[props.selectedChars].every(group =>
                  group.every(char => char !== '' && char !== undefined)
               )}
               onChange={() => {
                  props.toggleAllChars(props.selectedChars, props.chars)
                  setTotalSelected()
               }}
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
                     // TODO: fix type errors
                     isChecked={state[props.selectedChars][groupIndex].every(
                        char => char !== '' && char !== undefined
                     )}
                     onChange={() => {
                        props.toggleChars(props.selectedChars, props.chars, groupIndex)
                        setTotalSelected()
                     }}
                  />
               </div>
               <For each={charGroup}>
                  {char => (
                     <div
                        // TODO: fix type errors
                        class={`grid grid-flow-row justify-center gap-y-2 rounded-xl border-2 p-2 transition-all duration-100 ease-in-out ${
                           state[props.selectedChars][groupIndex].every(
                              char => char !== '' && char !== undefined
                           )
                              ? 'border-blue-300 bg-blue-50'
                              : 'border-slate-300 bg-slate-100'
                        }`}
                     >
                        {!!char && <Char char={char} />}
                     </div>
                  )}
               </For>
            </div>
         ))}
      </div>
   )
}

export default CharGroupSelect
