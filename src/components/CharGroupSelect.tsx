import { clsx } from 'clsx'
import gsap from 'gsap'
import { createEffect, createMemo, For, onCleanup, Show } from 'solid-js'
import { Transition } from 'solid-transition-group'
import { toKatakana, toRomaji } from 'wanakana'
import Checkbox from '~/components/Checkbox'
import { CHAR_ANIMATION } from '~/constants/animations'
import type { CharGroup } from '~/constants/kana'
import useStore, { getSelectedCharGroup } from '~/store/kanaStore'
import { cleanupAnimation } from '~/utils/animations'
import { getCharGroupTitle } from '~/utils/chars'

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

  let kanaText: HTMLSpanElement
  let animation: gsap.core.Timeline

  const displayChar = createMemo(() => {
    return state.selectedScript === 'Katakana' ? toKatakana(props.char) : props.char
  })

  const romajiChar = createMemo(() => toRomaji(props.char))

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
            kanaText.textContent = displayChar()
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
    cleanupAnimation(animation, kanaText)
  })

  return (
    <>
      <span
        ref={(el) => (kanaText = el)}
        class="flex items-end justify-center font-japan font-semibold text-xl leading-none"
      >
        <span class="text-slate-500">◕‿◕</span>
      </span>
      <span class="flex justify-center text-slate-500 text-xs leading-none">{romajiChar()}</span>
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

  const selectedCharGroup = createMemo(() => getSelectedCharGroup(state, props.selectedChars))

  const isCharSelected = createMemo(() => {
    return (groupIndex: number): boolean => {
      const selected = selectedCharGroup()
      const originalGroup = props.chars[groupIndex]

      // check if all non-null positions are selected
      return originalGroup.every((char, index) => {
        if (char === null) return true // ignore null positions
        return isNotEmptyAndDefined(selected[groupIndex][index])
      })
    }
  })

  const isCharGroupSelected = createMemo(() => {
    const selected = selectedCharGroup()

    // check if all groups with non-null chars are selected
    return props.chars.every((originalGroup, groupIndex) => {
      return originalGroup.every((char, charIndex) => {
        if (char === null) return true // ignore null positions
        return isNotEmptyAndDefined(selected[groupIndex][charIndex])
      })
    })
  })

  // get char group total count from state
  const getCharGroupTotal = createMemo(() => {
    const script = state.selectedScript
    const charType = props.selectedChars.replace(`selected${script}`, '')
    const totalKey = `total${script}${charType}` as keyof typeof state
    return state[totalKey] as number
  })

  return (
    <section class="grid gap-y-1">
      {/* header */}
      <header
        class={clsx(
          'relative flex items-center justify-between rounded-t-xl border-2 border-b-0 p-2 pb-1 transition-all duration-100 ease-linear',
          CHAR_STATE_CLASSES[isCharGroupSelected() ? 'active' : 'inactive']
        )}
      >
        {/* char group count balloon */}
        <Transition name="tr--from-bottom">
          <Show when={!!getCharGroupTotal()}>
            <span class="-top-5 absolute right-2 flex h-[24px] w-[24px] items-center justify-center rounded-full bg-blue-300 text-xs">
              {getCharGroupTotal()}
            </span>
          </Show>
        </Transition>
        {/* /char group count balloon */}

        <h2 class="order-last flex text-right text-slate-500 text-sm xs:text-base">
          {getCharGroupTitle(props.selectedChars)}
        </h2>

        {/* select all char group */}
        <Checkbox
          label="Select all"
          isChecked={isCharGroupSelected()}
          onChange={() => {
            props.toggleAllChars(props.selectedChars, props.chars)
            setTotalSelected()
          }}
        />
        {/* /select all char group */}
      </header>
      {/* /header */}

      <For each={props.chars}>
        {(charGroup, groupIndex) => (
          <div
            class="grid min-h-[60px] gap-x-1 rounded-xl"
            // eslint-disable-next-line solid/style-prop
            style={`grid-template-columns: auto repeat(${charGroup.length},1fr)`}
          >
            <div
              class={clsx(
                'flex items-center rounded-l-xl border-2 border-r-0 p-2 pr-1 transition-all duration-100 ease-linear',
                CHAR_STATE_CLASSES[isCharSelected()(groupIndex()) ? 'active' : 'inactive']
              )}
            >
              {/* select char group */}
              <Checkbox
                label={toRomaji(props.chars[groupIndex()][0] ?? '')}
                isChecked={isCharSelected()(groupIndex())}
                isLabelHidden
                onChange={() => {
                  props.toggleChars(props.selectedChars, props.chars, groupIndex())
                  setTotalSelected()
                }}
              />
              {/* /select char group */}
            </div>
            <For each={charGroup}>
              {(char) => (
                <div
                  class={clsx(
                    'grid grid-flow-row justify-center gap-y-2 rounded-xl border-2 p-2 transition-all duration-100 ease-linear',
                    CHAR_STATE_CLASSES[isCharSelected()(groupIndex()) ? 'active' : 'inactive']
                  )}
                >
                  {!!char && <Char char={char} />}
                </div>
              )}
            </For>
          </div>
        )}
      </For>
    </section>
  )
}

export default CharGroupSelect
