import type { JSX } from 'solid-js'

import { For, Show } from 'solid-js'
import { Transition } from 'solid-transition-group'
import { DEFAULT_INTERACTION_CLASS } from '~/constants/classes'
import type { Script } from '~/constants/kana'
import {
  DIAGRAPH_DIACRITICS,
  DIAGRAPHS,
  HIRAGANA_LOOK_ALIKE,
  KATAKANA_LOOK_ALIKE,
  MONOGRAPH_DIACRITICS,
  MONOGRAPHS,
} from '~/constants/kana'
import useStore from '~/store/kanaStore'
import { cn } from '~/utils/cn'
import Checkbox from './Checkbox'

const Menu = (): JSX.Element => {
  const state = useStore()
  const { setSelectedScript, toggleAllScript } = state

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

  const isAllScriptSelected = (script: Script) => {
    const scriptPrefix = `selected${script}`
    const charGroupKeys = [
      `${scriptPrefix}Monographs`,
      `${scriptPrefix}MonographDiacritics`,
      `${scriptPrefix}Diagraphs`,
      `${scriptPrefix}DiagraphDiacritics`,
      `${scriptPrefix}LookAlike`,
    ]

    return charGroupKeys.every((key) => {
      const selection = state[key as keyof typeof state] as any[][]

      const getCharsForKey = (key: string) => {
        if (key.includes('Monographs') && !key.includes('Diacritics')) return MONOGRAPHS
        if (key.includes('MonographDiacritics')) return MONOGRAPH_DIACRITICS
        if (key.includes('Diagraphs') && !key.includes('Diacritics')) return DIAGRAPHS
        if (key.includes('DiagraphDiacritics')) return DIAGRAPH_DIACRITICS
        if (script === 'Hiragana' && key.includes('LookAlike')) return HIRAGANA_LOOK_ALIKE
        if (script === 'Katakana' && key.includes('LookAlike')) return KATAKANA_LOOK_ALIKE
        return []
      }

      const originalChars = getCharsForKey(key)
      return originalChars.every((group, groupIndex) =>
        group.every((char, charIndex) => {
          if (char === null) return true // ignore null positions
          return selection[groupIndex][charIndex] !== ''
        })
      )
    })
  }

  const handleToggleAllScript = (script: Script) => {
    if (state.selectedScript !== script) {
      setSelectedScript(script)
    }

    toggleAllScript(script)
  }

  return (
    <nav>
      <ul class="flex justify-center gap-x-4 md:justify-normal">
        <For each={state.scripts}>
          {(menu) => (
            <li class="relative flex items-center gap-x-2">
              {/* select all checkbox */}
              <Checkbox
                label=""
                isLabelHidden={true}
                isChecked={isAllScriptSelected(menu)}
                onChange={() => handleToggleAllScript(menu)}
              />
              {/* /select all checkbox */}

              {/* total selected char group balloon */}
              <Transition name="tr--from-bottom">
                <Show when={!!state[`total${menu}`]}>
                  <span
                    class={cn(
                      '-top-6 absolute right-0 flex h-[24px] w-[24px] items-center justify-center rounded-full text-xs',
                      MENU_STATE_CLASSES[isMenuSelected(menu) ? 'active' : 'inactive']
                    )}
                  >
                    {state[`total${menu}`]}
                  </span>
                </Show>
              </Transition>
              {/* /total selected char group balloon */}

              {/* menu button */}
              <button
                type="button"
                class={cn(
                  'cursor-pointer text-2xl text-slate-500 lowercase decoration-blue-300 decoration-wavy',
                  DEFAULT_INTERACTION_CLASS,
                  isMenuSelected(menu) && 'text-slate-700 underline'
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
    </nav>
  )
}

export default Menu
