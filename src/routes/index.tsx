import { useNavigate } from '@solidjs/router'
import { clsx } from 'clsx'
import { Match, onMount, Show, Switch } from 'solid-js'
import { Transition } from 'solid-transition-group'
import CharGroupSelect from '~/components/CharGroupSelect'
import Menu from '~/components/Menu'
import { DEFAULT_INTERACTION_CLASS } from '~/constants/classes'
import {
  DIAGRAPH_DIACRITICS,
  DIAGRAPHS,
  HIRAGANA_LOOK_ALIKE,
  KATAKANA_LOOK_ALIKE,
  MONOGRAPH_DIACRITICS,
  MONOGRAPHS,
} from '~/constants/kana'
import General from '~/layouts/general'
import useStore from '~/store/kanaStore'

const Home = () => {
  const state = useStore()
  const { toggleAllChars, toggleChars, setQuestions, resetAll } = state

  const navigate = useNavigate()

  onMount(() => {
    resetAll()
  })

  return (
    <General>
      {/* header */}
      <header class="col-span-12 grid grid-cols-1 items-end gap-2 md:grid-cols-2 md:justify-center">
        <h1 class="text-center text-5xl md:order-last md:text-right">kanakata</h1>

        {/* menu */}
        <Menu />
        {/* /menu */}
      </header>
      {/* /header */}

      {/* content */}
      <section class="col-span-12 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <h2 class="sr-only lowercase">Character Selection</h2>

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
          <Switch>
            <Match when={state.selectedScript === 'Hiragana'}>
              <CharGroupSelect
                chars={HIRAGANA_LOOK_ALIKE}
                selectedChars={`selected${state.selectedScript}LookAlike`}
                toggleChars={toggleChars}
                toggleAllChars={toggleAllChars}
              />
            </Match>
            <Match when={state.selectedScript === 'Katakana'}>
              <CharGroupSelect
                chars={KATAKANA_LOOK_ALIKE}
                selectedChars={`selected${state.selectedScript}LookAlike`}
                toggleChars={toggleChars}
                toggleAllChars={toggleAllChars}
              />
            </Match>
          </Switch>
        </div>
      </section>
      {/* /content */}

      {/* floating button */}
      <Transition name="tr--from-bottom">
        <Show when={state.totalHiragana + state.totalKatakana > 0}>
          <aside class="fixed bottom-8 left-0 w-full">
            <div class="relative mx-auto flex h-full w-full max-w-3xl justify-end px-4 md:px-8">
              <button
                type="button"
                class={clsx(
                  'flex h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-slate-700 text-lg text-slate-50 lowercase decoration-slate-50 decoration-wavy shadow-md shadow-slate-200 hover:bg-slate-600 focus:underline active:bg-slate-500',
                  DEFAULT_INTERACTION_CLASS
                )}
                onClick={() => {
                  setQuestions()
                  navigate('/quiz')
                }}
              >
                Let's start!
              </button>
            </div>
          </aside>
        </Show>
      </Transition>
      {/* /floating button */}

      {/* footer */}
      <footer class="col-span-12 flex justify-center md:justify-end">
        <a
          class={clsx(
            'text-slate-700 text-sm underline decoration-blue-300 decoration-wavy',
            DEFAULT_INTERACTION_CLASS
          )}
          href="https://arkhlima.xyz"
          target="_blank"
          rel="noreferrer noopener"
        >
          @arkhlima
        </a>
      </footer>
      {/* /footer */}
    </General>
  )
}

export default Home
