import { Show } from 'solid-js'
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

  const navigate = useNavigate()

  return (
    <General>
      <header class="col-span-12 grid grid-cols-1 items-end gap-2 md:grid-cols-2 md:justify-center">
        <h1 class="text-center text-5xl font-bold md:order-last md:text-right">
          kanakata
        </h1>

        <Menu />
      </header>

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

      <Show when={state.totalHiragana + state.totalKatakana > 0}>
        <aside class="fixed bottom-8 left-0 w-full">
          <div class="relative mx-auto flex h-full w-full max-w-5xl justify-end px-4 md:px-8">
            <button
              class="ease w-full rounded-xl bg-slate-700 px-4 py-2 text-lg text-slate-50 shadow-lg shadow-slate-300 transition-all duration-100 hover:bg-slate-600 focus:bg-slate-500"
              onClick={() => {
                setQuestions()
                navigate('/study')
              }}
            >
              let's study!
            </button>
          </div>
        </aside>
      </Show>

      <Footer class="md:justify-end" />
    </General>
  )
}

export default App
