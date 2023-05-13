import { JSX, For } from 'solid-js'
import useStore from '~/store/kanaSelection'

const Menu = (): JSX.Element => {
   const state = useStore()
   const { setSelectedScript } = state

   return (
      <ul class="flex justify-center gap-x-4 md:justify-normal">
         <For each={state.scripts}>
            {menu => (
               <li class="relative">
                  <span
                     class={`absolute -top-4 right-0 flex items-center justify-center rounded-lg px-1.5 py-0.5 text-xs text-slate-100 ${
                        state.selectedScript === menu ? 'bg-blue-300' : 'bg-slate-300'
                     }`}
                  >
                     {state[`total${menu}`]}
                  </span>
                  <button
                     class="xs:text-xl text-lg lowercase text-slate-400 decoration-blue-300 decoration-wavy transition-all duration-100 ease-in-out md:text-2xl"
                     classList={{
                        'underline text-slate-700': state.selectedScript === menu,
                     }}
                     onClick={() => setSelectedScript(menu)}
                  >
                     #{menu}
                  </button>
               </li>
            )}
         </For>
      </ul>
   )
}

export default Menu
