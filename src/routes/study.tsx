import gsap from 'gsap'

import { For, createEffect, createSignal, onMount, onCleanup } from 'solid-js'
import { useNavigate } from 'solid-start'

import useStore from '~/store/kanaStore'
import General from '~/layouts/general'
import Footer from '~/components/Footer'

import { DEFAULT_INTERACTION_CLASS } from '~/constants/classes'

interface AnimatedCharProps {
  children: string
}

const AnimatedChar = (props: AnimatedCharProps) => {
  let char: HTMLSpanElement
  let animation: gsap.core.Tween

  createEffect(() => {
    // individual char animation
    animation = gsap.fromTo(
      char,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, ease: 'expo.in.out', duration: 0.2 }
    )
  })

  onCleanup(() => {
    animation.kill()
  })

  return <span ref={(el) => (char = el)}>{props.children}</span>
}

const Study = () => {
  const state = useStore()
  const { setAnswer } = state

  const navigate = useNavigate()
  let answerInput: HTMLInputElement
  let questionList: HTMLUListElement
  let animation: gsap.core.Tween

  const [currentAnswer, setCurrentAnswer] = createSignal<string[]>([
    '.',
    '.',
    '.',
  ])

  onMount(() => {
    if (state.questions.length === 0) {
      navigate('/', { replace: true })
    }

    answerInput.focus()
  })

  createEffect(() => {
    if (state.questions) {
      const calcValue =
        -8 * state.currentQuestion - 0.25 * state.currentQuestion
      animation = gsap.to(questionList, {
        x: `${calcValue}rem`,
        duration: 1,
        ease: 'expo.out',
      })
      answerInput.focus()
      answerInput.value = ''
    }
  })

  onCleanup(() => {
    animation.kill()
  })

  const handleAnswerInput = (event: InputEvent) => {
    const target = event.target as HTMLInputElement
    setCurrentAnswer(target.value ? target.value.split('') : ['.', '.', '.'])
  }

  const handleSubmit = (event: Event): void => {
    event.preventDefault()
    setAnswer(currentAnswer().join(''))
    setCurrentAnswer(['.', '.', '.'])
  }

  return (
    <General>
      <header class="col-span-12 grid grid-cols-1 items-end gap-2 md:grid-cols-3 md:justify-center">
        <h1 class="order-1 col-span-2 text-center text-5xl font-bold md:order-2 md:col-span-1">
          kanakata
        </h1>

        <div class="order-1">
          <button
            class={`text-2xl lowercase text-slate-400 decoration-blue-300 decoration-wavy hover:text-slate-700 focus:underline ${DEFAULT_INTERACTION_CLASS}`}
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

      <section class="col-span-12 flex flex-col items-center justify-center gap-y-4">
        <div class="relative flex w-full justify-center overflow-x-hidden">
          <ul
            ref={(el) => (questionList = el)}
            class="relative grid w-32 grid-flow-col gap-x-1"
          >
            <For each={state.questions}>
              {(question, idx) =>
                question && (
                  <li
                    class={`grid h-24 w-32 grid-flow-row justify-center gap-y-4 rounded-xl border-2 p-2 transition-all duration-75 ease-linear ${
                      state.currentQuestion === idx()
                        ? 'border-blue-300 bg-blue-50'
                        : 'border-slate-300 bg-slate-100'
                    }`}
                  >
                    <span class="flex items-end justify-center font-sans text-3xl font-bold leading-none">
                      {question.char}
                    </span>
                    <span class="flex justify-center text-xl leading-none text-slate-400">
                      {state.currentQuestion === idx() && !question.answer ? (
                        <For each={currentAnswer()}>
                          {(char) => <AnimatedChar>{char}</AnimatedChar>}
                        </For>
                      ) : (
                        question.answer || '...'
                      )}
                    </span>
                  </li>
                )
              }
            </For>
          </ul>
        </div>

        <form class="" onSubmit={handleSubmit}>
          <input
            ref={(el) => (answerInput = el)}
            id="answer"
            type="text"
            maxlength="3"
            minlength="1"
            tabindex="2"
            placeholder="answer..."
            class={`w-32 appearance-none rounded-md border-2 border-slate-400 bg-slate-50 px-3 py-2 text-center placeholder:text-slate-400 ${DEFAULT_INTERACTION_CLASS}`}
            onInput={handleAnswerInput}
          />
        </form>
      </section>

      <Footer />
    </General>
  )
}

export default Study
