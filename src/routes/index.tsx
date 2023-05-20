import gsap from 'gsap'

import { createEffect, onCleanup, createSignal, Show } from 'solid-js'
import { useNavigate } from 'solid-start'

import useStore from '~/store/kanaStore'
import General from '~/layouts/general'
import Menu from '~/components/Menu'
import Footer from '~/components/Footer'
import CharGroupSelect from '~/components/CharGroupSelect'

import {
  DIAGRAPHS,
  MONOGRAPHS,
  MONOGRAPH_DIACRITICS,
  DIAGRAPH_DIACRITICS,
} from '~/constants/kana'

const App = () => {
  const state = useStore()
  const { toggleAllChars, toggleChars, setQuestions } = state
  const [isFloatingButtonVisible, setFloatingButtonVisibility] =
    createSignal<boolean>(false)

  const navigate = useNavigate()

  let floatingButtonContainer: HTMLElement
  let animation: gsap.core.Tween
  let previousTotal = 0

  createEffect(() => {
    if (previousTotal === 0 && state.totalHiragana + state.totalKatakana > 0) {
      floatingButtonContainer.style.display = 'block'
      setFloatingButtonVisibility(true)
      animation = gsap.fromTo(
        floatingButtonContainer,
        {
          opacity: 0,
          bottom: '0',
        },
        {
          bottom: '2rem',
          duration: 0.1,
          opacity: 1,
          ease: 'sine.in',
        }
      )
    } else if (
      previousTotal > 0 &&
      state.totalHiragana + state.totalKatakana === 0
    ) {
      animation = gsap.fromTo(
        floatingButtonContainer,
        {
          opacity: 1,
          bottom: '2rem',
        },
        {
          bottom: '0',
          duration: 0.1,
          opacity: 0,
          ease: 'sine.out',
          onComplete: () => {
            floatingButtonContainer.style.display = 'none'
            setFloatingButtonVisibility(false)
          },
        }
      )
    }
    previousTotal = state.totalHiragana + state.totalKatakana
  })

  onCleanup(() => {
    animation.kill()
  })

  return (
    <General>
      {/* header */}
      <header class="col-span-12 grid grid-cols-1 items-end gap-2 md:grid-cols-2 md:justify-center">
        <h1 class="text-center text-5xl font-bold md:order-last md:text-right">
          kanakata
        </h1>

        {/* menu */}
        <Menu />
        {/* /menu */}
      </header>
      {/* /header */}

      {/* content */}
      <section class="col-span-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <div class="flex flex-col gap-y-4 md:gap-y-8">
          <CharGroupSelect
            chars={MONOGRAPHS}
            selectedChars={`selected${state.selectedScript}Monographs`}
            toggleChars={toggleChars}
            toggleAllChars={toggleAllChars}
          />
          <CharGroupSelect
            chars={MONOGRAPH_DIACRITICS}
            selectedChars={`selected${state.selectedScript}MonographDiacritics`}
            toggleChars={toggleChars}
            toggleAllChars={toggleAllChars}
          />
        </div>
        <div class="flex flex-col gap-y-4 md:gap-y-8">
          <CharGroupSelect
            chars={DIAGRAPHS}
            selectedChars={`selected${state.selectedScript}Diagraphs`}
            toggleChars={toggleChars}
            toggleAllChars={toggleAllChars}
          />
          <CharGroupSelect
            chars={DIAGRAPH_DIACRITICS}
            selectedChars={`selected${state.selectedScript}DiagraphDiacritics`}
            toggleChars={toggleChars}
            toggleAllChars={toggleAllChars}
          />
        </div>
      </section>
      {/* /content */}

      {/* floating button */}
      <aside
        ref={(el) => (floatingButtonContainer = el)}
        class="fixed left-0 hidden w-full opacity-0"
      >
        <div class="relative mx-auto flex h-full w-full max-w-5xl justify-end px-4 md:px-8">
          <Show when={isFloatingButtonVisible()}>
            <button
              class="ease w-full rounded-xl bg-slate-700 px-4 py-2 text-lg text-slate-50 shadow-lg shadow-slate-300 transition-all duration-100 hover:bg-slate-600 focus:bg-slate-500"
              onClick={() => {
                setQuestions()
                navigate('/study')
              }}
            >
              let's study!
            </button>
          </Show>
        </div>
      </aside>
      {/* /floating button */}

      {/* footer */}
      <Footer class="md:justify-end" />
      {/* /footer */}
    </General>
  )
}

export default App
