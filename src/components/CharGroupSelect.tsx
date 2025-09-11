import gsap from 'gsap'
import { twMerge } from 'tailwind-merge'

import { For, createEffect, onCleanup } from 'solid-js'

import useStore, { getSelectedCharGroup } from '~/store/kanaStore'

import Checkbox from '~/components/Checkbox'

import { getCharGroupTitle } from '~/utils/chars'
import { toRomaji, toKatakana } from 'wanakana'

import type { CharGroup } from '~/constants/kana'

interface CharGroupProps {
  chars: CharGroup
  selectedChars: string
  toggleChars: (
    selectedChars: string,
    char: CharGroup,
    groupIndex: number
  ) => void
  toggleAllChars: (selectedChars: string, char: CharGroup) => void
}
interface CharProps {
  char: string
}

const Char = (props: CharProps) => {
  const state = useStore()

  let kanaText: HTMLSpanElement
  let animation: gsap.core.Timeline

  const CHAR_ANIMATION = {
    DURATION: 0.2,
    EASING: {
      EXPO_IN: 'expo.in',
      EXPO_OUT: 'expo.out',
    },
  } as const

  createEffect(() => {
    // scale-in & scale-out chars animation by detecting selectedScript state
    if (state.selectedScript) {
      // cleanup previous animation
      if (animation) animation.kill()

      animation = gsap
        .timeline()
        .to(kanaText, {
          scale: 0,
          duration: CHAR_ANIMATION.DURATION,
          ease: CHAR_ANIMATION.EASING.EXPO_IN,
          onComplete: () => {
            kanaText.textContent =
              state.selectedScript === 'Katakana'
                ? toKatakana(props.char)
                : props.char
          },
        })
        .to(kanaText, {
          scale: 1,
          duration: CHAR_ANIMATION.DURATION,
          ease: CHAR_ANIMATION.EASING.EXPO_OUT,
        })
    }
  })

  onCleanup(() => {
    if (animation) animation.kill()
  })

  return (
    <>
      <span
        ref={(el) => (kanaText = el)}
        class="flex items-end justify-center font-sans text-xl font-bold leading-none"
      >
        <span class="text-slate-500">◕‿◕</span>
      </span>
      <span class="flex justify-center text-xs leading-none text-slate-500">
        {toRomaji(props.char)}
      </span>
    </>
  )
}

const CharGroupSelect = (props: CharGroupProps) => {
  const state = useStore()
  const { setTotalSelected } = state

  const CHAR_STATE_CLASSES: Record<string, string> = {
    active: 'border-blue-300 bg-blue-50',
    inactive: 'border-slate-300 bg-slate-50',
  }

  const isNotEmptyAndDefined = (char: string | null): boolean => {
    return char !== '' && char !== undefined && char !== null
  }

  const isCharSelected = (groupIndex: number): boolean => {
    const selectedCharGroup = getSelectedCharGroup(state, props.selectedChars)
    const originalGroup = props.chars[groupIndex]

    // check if all non-null positions are selected
    return originalGroup.every((char, index) => {
      if (char === null) return true // ignore null positions
      return isNotEmptyAndDefined(selectedCharGroup[groupIndex][index])
    })
  }

  const isCharGroupSelected = (): boolean => {
    const selectedCharGroup = getSelectedCharGroup(state, props.selectedChars)

    // check if all groups with non-null chars are selected
    return props.chars.every((originalGroup, groupIndex) => {
      return originalGroup.every((char, charIndex) => {
        if (char === null) return true // ignore null positions
        return isNotEmptyAndDefined(selectedCharGroup[groupIndex][charIndex])
      })
    })
  }

  return (
    <div class="grid gap-y-1">
      {/* header */}
      <header class="flex items-center justify-between rounded-t-xl border-2 border-b-0 border-slate-300 bg-slate-50 p-2 pb-1">
        <h2 class="xs:text-base order-last flex text-right text-sm font-bold text-slate-500">
          {getCharGroupTitle(props.selectedChars)}
        </h2>

        {/* select all char group */}
        <Checkbox
          label="select all"
          isChecked={isCharGroupSelected()}
          onChange={() => {
            props.toggleAllChars(props.selectedChars, props.chars)
            setTotalSelected()
          }}
        />
        {/* /select all char group */}
      </header>
      {/* /header */}

      {
        // eslint-disable-next-line solid/prefer-for
        props.chars.map((charGroup, groupIndex) => (
          <div
            class="grid min-h-[60px] gap-x-1 rounded-xl"
            // eslint-disable-next-line solid/style-prop
            style={`grid-template-columns: auto repeat(${charGroup.length},1fr)`}
          >
            <div class="flex items-center rounded-l-xl border-2 border-r-0 border-slate-300 bg-slate-50 p-2 pr-1">
              {/* select char group */}
              <Checkbox
                label={toRomaji(props.chars[groupIndex][0] ?? '')}
                isChecked={isCharSelected(groupIndex)}
                isLabelHidden
                onChange={() => {
                  props.toggleChars(
                    props.selectedChars,
                    props.chars,
                    groupIndex
                  )
                  setTotalSelected()
                }}
              />
              {/* /select char group */}
            </div>
            <For each={charGroup}>
              {(char) => (
                <div
                  class={twMerge(
                    'grid grid-flow-row justify-center gap-y-2 rounded-xl border-2 p-2 transition-all duration-100 ease-linear',
                    CHAR_STATE_CLASSES[
                      isCharSelected(groupIndex) ? 'active' : 'inactive'
                    ]
                  )}
                >
                  {!!char && <Char char={char} />}
                </div>
              )}
            </For>
          </div>
        ))
      }
    </div>
  )
}

export default CharGroupSelect
