import { JSX, For } from 'solid-js'
import useStore from '~/store/kanaSelection'

import type { Script } from '~/constants/kana'

const MENU: Script[] = ['hiragana', 'katakana', 'kana']

const Menu = (): JSX.Element => {
   const state = useStore()
   const { setSelectedScript } = state

   return (
      <ul class="flex justify-start gap-x-4">
         <For each={MENU}>
            {menu => (
               <li>
                  <button
                     class="text-2xl decoration-blue-300 decoration-wavy transition-all duration-100 ease-in-out"
                     classList={{
                        underline: state.selectedScript === menu,
                     }}
                     onClick={() => setSelectedScript(menu)}
                  >
                     {menu}
                  </button>
               </li>
            )}
         </For>
      </ul>
   )
}

export default Menu
