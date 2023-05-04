/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { For } from 'solid-js'
import useStore from '~/store'
import Checkbox from '~/components/Checkbox'

const App = () => {
   const state = useStore()
   const { toggleAllHiraganaMonographs, toggleHiraganaMonographs, toggleAllKana } = state

   return (
      <>
         <Checkbox
            label="Select All Hiragana Monographs"
            checked={state.selectedHiraganaMonographs.every(group =>
               group.every(char => char !== '' && char !== undefined)
            )}
            onChange={toggleAllHiraganaMonographs}
         />
         {state.hiraganaMonographs.map((hiraganaMonographsGroup, groupIndex) => (
            <div class="grid grid-cols-6">
               <Checkbox
                  label=""
                  checked={state.selectedHiraganaMonographs[groupIndex].every(
                     item => item !== '' && item !== undefined
                  )}
                  onChange={() => toggleHiraganaMonographs(groupIndex)}
               />
               <For each={hiraganaMonographsGroup}>
                  {hiraganaMonographs => <div>{hiraganaMonographs}</div>}
               </For>
            </div>
         ))}
         <div>
            <Checkbox
               label="Select All"
               checked={state.selectedHiraganaMonographs.every(group =>
                  group.every(item => item !== '' && item !== undefined)
               )}
               onChange={toggleAllKana}
            />
         </div>
         <button
            type="submit"
            disabled={!state.selectedHiraganaMonographs.flat().some(selected => selected)}
         >
            Submit
         </button>
         <div>Selected Hiragana Monographs:</div>
         <div class="flex">{state.selectedHiraganaMonographs}</div>
      </>
   )
}

export default App
