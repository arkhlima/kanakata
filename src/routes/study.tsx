import { For } from 'solid-js'
import { useNavigate } from 'solid-start'

import useStore from '~/store/kanaStore'
import General from '~/layouts/general'
import Footer from '~/components/Footer'

const Study = () => {
  const state = useStore()

  const navigate = useNavigate()

  if (state.questions.length === 0) {
    navigate('/', { replace: true })
  }

  return (
    <General>
      <header class="col-span-12 grid grid-cols-1 items-end gap-2 md:grid-cols-3 md:justify-center">
        <h1 class="order-1 col-span-2 text-center text-5xl font-bold md:order-2 md:col-span-1">
          kanakata
        </h1>

        <div class="order-1">
          <button
            class="text-2xl lowercase text-slate-400 decoration-blue-300 decoration-wavy transition-all duration-75 ease-linear hover:text-slate-700 focus:underline"
            onClick={() => navigate('/')}
          >
            back
          </button>
        </div>
        <div class="order-3 flex justify-end">
          <button
            class="cursor-not-allowed text-2xl lowercase text-slate-400 decoration-blue-300 decoration-wavy transition-all duration-75 ease-linear hover:text-slate-700 focus:underline"
            disabled
          >
            settings
          </button>
        </div>
      </header>

      <section class="col-span-12 flex">
        <div class="relative flex w-full items-center gap-x-2 overflow-x-hidden">
          <ul class="grid min-w-0 shrink-[1] grow-[1] basis-0 grid-flow-col grid-cols-[min-content] justify-end gap-x-2">
            <For each={state.answeredQuestions}>
              {(answeredQuestion) =>
                answeredQuestion && (
                  <li class="ease grid h-28 w-36 grid-flow-row justify-center gap-y-4 rounded-xl border-[3px] border-slate-300 bg-slate-100 p-2 transition-all duration-75">
                    <span class="flex items-end justify-center font-sans text-4xl font-bold leading-none">
                      {answeredQuestion.char}
                    </span>
                    <span class="flex justify-center text-xl leading-none text-slate-400">
                      ...
                    </span>
                  </li>
                )
              }
            </For>
          </ul>
          <div class="ease grid h-28 w-36 grid-flow-row justify-center gap-y-4 rounded-xl border-[3px] border-blue-300 bg-blue-50 p-2 transition-all duration-75">
            <span class="flex items-end justify-center font-sans text-4xl font-bold leading-none">
              {state.questions[0]?.char}
            </span>
            <span class="flex justify-center text-xl leading-none text-slate-400">
              ...
            </span>
          </div>
          <ul class="grid min-w-0 shrink-[1] grow-[1] basis-0 grid-flow-col grid-cols-[min-content] gap-x-2">
            <For each={state.questions.slice(1)}>
              {(question) =>
                question && (
                  <li class="ease grid h-28 w-36 grid-flow-row justify-center gap-y-4 rounded-xl border-[3px] border-slate-300 bg-slate-100 p-2 transition-all duration-75">
                    <span class="flex items-end justify-center font-sans text-4xl font-bold leading-none">
                      {question.char}
                    </span>
                    <span class="flex justify-center text-xl leading-none text-slate-400">
                      ...
                    </span>
                  </li>
                )
              }
            </For>
          </ul>
        </div>
      </section>

      <Footer />
    </General>
  )
}

export default Study
