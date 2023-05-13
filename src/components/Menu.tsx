import { JSX, For, Show } from 'solid-js'
import useStore from '~/store/kanaSelection'

const Menu = (): JSX.Element => {
   const state = useStore()
   const { setSelectedScript } = state

   return (
      <ul class="flex justify-center gap-x-4 md:justify-normal">
         <For each={state.scripts}>
            {menu => (
               <li class="relative">
                  <Show when={!!state[`total${menu}`]}>
                     <span
                        class={`ease absolute -top-6 right-0 flex h-[24px] w-[24px] items-center justify-center rounded-full text-xs transition-all duration-75 ${
                           state.selectedScript === menu
                              ? 'bg-blue-300'
                              : 'bg-slate-300 text-slate-50'
                        }`}
                     >
                        {state[`total${menu}`]}
                     </span>
                  </Show>
                  <button
                     class="xs:text-xl ease text-lg lowercase text-slate-400 decoration-blue-300 decoration-wavy transition-all duration-75 md:text-2xl"
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
