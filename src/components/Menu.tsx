import { twMerge } from 'tailwind-merge'

import { For, Show } from 'solid-js'
import type { JSX } from 'solid-js'
import { Transition } from 'solid-transition-group'

import useStore from '~/store/kanaStore'

import { DEFAULT_INTERACTION_CLASS } from '~/constants/classes'
import type { Script } from '~/constants/kana'

const Menu = (): JSX.Element => {
  const state = useStore()
  const { setSelectedScript } = state

  const MENU_STATE_CLASSES: Record<string, string> = {
    active: 'bg-blue-300',
    inactive: 'bg-slate-300 text-slate-50',
  }

  const isMenuSelected = (menu: string) => {
    return state.selectedScript === menu
  }

  const handleClickMenuButton = (menu: Script) => {
    setSelectedScript(menu)
  }

  return (
    <ul class="flex justify-center gap-x-4 md:justify-normal">
      <For each={state.scripts}>
        {(menu) => (
          <li class="relative">
            {/* total selected char group balloon */}
            <Transition name="tr--from-bottom">
              <Show when={!!state[`total${menu}`]}>
                <span
                  class={twMerge(
                    'absolute -top-6 right-0 flex h-[24px] w-[24px] items-center justify-center rounded-full text-xs',
                    MENU_STATE_CLASSES[
                      isMenuSelected(menu) ? 'active' : 'inactive'
                    ]
                  )}
                >
                  {state[`total${menu}`]}
                </span>
              </Show>
            </Transition>
            {/* /total selected char group balloon */}

            {/* menu button */}
            <button
              class={twMerge(
                'text-2xl lowercase text-slate-500 decoration-blue-300 decoration-wavy',
                DEFAULT_INTERACTION_CLASS,
                isMenuSelected(menu) && 'underline text-slate-700'
              )}
              onClick={() => handleClickMenuButton(menu)}
            >
              #{menu}
            </button>
            {/* /menu button */}
          </li>
        )}
      </For>
    </ul>
  )
}

export default Menu
