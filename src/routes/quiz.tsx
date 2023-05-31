import gsap from 'gsap'
import { twMerge } from 'tailwind-merge'

import {
  For,
  createEffect,
  createSignal,
  onMount,
  onCleanup,
  Show,
} from 'solid-js'
import { Transition } from 'solid-transition-group'
import { useNavigate } from 'solid-start'

import useStore from '~/store/kanaStore'
import General from '~/layouts/general'
import Dialog from '~/components/Dialog'
import Footer from '~/components/Footer'

import { toRomaji } from 'wanakana'

import type { Questions } from '~/store/kanaStore'
import { DEFAULT_INTERACTION_CLASS } from '~/constants/classes'

interface RomajiCharProps {
  children: string
}

interface KanaCharProps {
  char: string
}

const RomajiChar = (props: RomajiCharProps) => {
  let char: HTMLSpanElement
  let animation: gsap.core.Tween

  onMount(() => {
    // individual char animation
    animation = gsap.fromTo(
      char,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, ease: 'expo.in.out', duration: 0.2 }
    )
  })

  onCleanup(() => {
    if (animation) animation.kill()
  })

  return <span ref={(el) => (char = el)}>{props.children}</span>
}

const KanaChar = (props: KanaCharProps) => {
  const state = useStore()
  const { setQuestions, setResetState } = state

  let kanaText: HTMLSpanElement
  let animation: gsap.core.Timeline

  createEffect(() => {
    // scale-in & scale-out chars animation
    if (state.resetState) {
      animation = gsap
        .timeline()
        .to(kanaText, {
          scale: 0,
          duration: 0.2,
          ease: 'expo.in',
          onComplete: () => {
            setQuestions()
          },
        })
        .to(kanaText, {
          scale: 1,
          duration: 0.2,
          ease: 'expo.out',
          onComplete: () => {
            setResetState(false)
          },
        })
    }
  })

  onCleanup(() => {
    if (animation) animation.kill()
  })

  return (
    <span class="flex items-end justify-center font-sans text-3xl font-bold leading-none">
      <span ref={(el) => (kanaText = el)}>{props.char}</span>
    </span>
  )
}

const Quiz = () => {
  const state = useStore()
  const { setAnswer, resetQuiz, setResetState } = state

  const navigate = useNavigate()
  let answerInput: HTMLInputElement
  let questionList: HTMLUListElement
  let animation: gsap.core.Timeline

  const DEFAULT_ANSWER: string[] = ['.', '.', '.']
  const QUESTION_STATE_CLASSES: Record<string, string> = {
    active: 'border-blue-300 bg-blue-50',
    inactive: 'border-slate-300 bg-slate-50',
    correct: 'border-emerald-300 bg-emerald-50',
    incorrect: 'border-pink-300 bg-pink-50',
  }

  const [currentAnswer, setCurrentAnswer] =
    createSignal<string[]>(DEFAULT_ANSWER)
  const [answerInputValue, setAnswerInputValue] = createSignal<string>()
  const [isResultVisible, setResultVisibility] = createSignal<boolean>(false)

  onMount(() => {
    if (state.questions.length === 0) navigate('/', { replace: true })
  })

  createEffect(() => {
    if (state.questions.length >= state.currentQuestion) {
      const calculatedTranslate = calculateTranslateValue(state.currentQuestion)
      // slide animation
      animation = gsap
        .timeline()
        .to(
          `.question:nth-child(${
            state.currentQuestion === 0
              ? state.currentQuestion + 1
              : state.currentQuestion
          })`,
          {
            scale: 0.8,
            duration: 0.2,
            ease: 'expo.out',
          }
        )
        .to(
          `.question:nth-child(${
            state.currentQuestion === 0
              ? state.currentQuestion + 1
              : state.currentQuestion
          })`,
          {
            scale: 1,
            duration: 0.2,
            ease: 'expo.out',
          }
        )
        .to(
          questionList,
          state.questions.length > 0 &&
            state.questions.length === state.currentQuestion
            ? {
                onComplete: () => {
                  setResultVisibility(true)
                },
              }
            : {
                x: `${calculatedTranslate}rem`,
                duration: 0.2,
                ease: 'expo.out',
              }
        )
      answerInput.focus()
      answerInput.value = ''
    }

    if (state.resetState) {
      setCurrentAnswer(DEFAULT_ANSWER)
    }
  })

  onCleanup(() => {
    if (animation) animation.kill()
  })

  const calculateTranslateValue = (question: number): number => {
    return -8 * question - 0.5 * question
  }

  const getQuestionStateClass = (question: Questions, idx: number): string => {
    return idx === state.currentQuestion
      ? 'active'
      : question.answer
      ? question.answer.toLowerCase() === toRomaji(question.char)
        ? 'correct'
        : 'incorrect'
      : 'inactive'
  }

  const handleAnswerInput = (event: InputEvent) => {
    const target = event.target as HTMLInputElement
    if (/^[A-Za-z]*$/g.test(target.value)) {
      setAnswerInputValue(target.value)
      setCurrentAnswer(target.value ? target.value.split('') : DEFAULT_ANSWER)
    }
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    const isAlphabet = /[a-zA-Z]/i.test(event.key)

    if (!isAlphabet) {
      event.preventDefault()
    }
  }

  const handleSubmit = (event: Event): void => {
    event.preventDefault()

    if (state.questions.length !== state.currentQuestion) {
      setAnswer(currentAnswer().join(''))
      setCurrentAnswer(DEFAULT_ANSWER)
    }
  }

  return (
    <General>
      <header class="col-span-12 grid grid-cols-1 items-end gap-2 md:grid-cols-3 md:justify-center">
        <h1 class="order-1 col-span-2 text-center text-5xl font-bold md:order-2 md:col-span-1">
          kanakata
        </h1>

        <div class="order-1">
          <button
            class={twMerge(
              'text-lg lowercase text-slate-500 decoration-blue-300 decoration-wavy hover:text-slate-700 focus:underline md:text-2xl',
              DEFAULT_INTERACTION_CLASS
            )}
            onClick={() => navigate('/')}
          >
            back
          </button>
        </div>
        <div class="order-3 flex justify-end">
          <button
            class={twMerge(
              'text-lg lowercase text-slate-500 decoration-blue-300 decoration-wavy hover:text-slate-700 focus:underline md:text-2xl',
              DEFAULT_INTERACTION_CLASS
            )}
            onClick={() => alert('coming soon!')}
          >
            settings
          </button>
        </div>
      </header>

      <Transition name="tr--from-bottom">
        <Show when={!!isResultVisible()}>
          <Dialog isVisible={isResultVisible}>
            <header>
              <h2 class="xs:text-2xl text-center text-xs font-bold text-slate-500">
                complete!
              </h2>
            </header>
            {/* TODO: add statistic & try again button here */}
          </Dialog>
        </Show>
      </Transition>

      <section class="col-span-12 flex flex-col items-center gap-y-8">
        <div
          class="relative flex w-full justify-center overflow-x-hidden"
          style={{
            '-webkit-mask-image':
              'linear-gradient(to right, #0000, #000, #000, #0000)',
          }}
        >
          <ul
            ref={(el) => (questionList = el)}
            class="relative grid w-32 grid-flow-col gap-x-2"
          >
            <For each={state.questions}>
              {(question, idx) => (
                <li
                  class={twMerge(
                    'question grid h-24 w-32 grid-flow-row justify-center gap-y-4 rounded-xl border-2 p-2',
                    QUESTION_STATE_CLASSES[
                      getQuestionStateClass(question, idx())
                    ]
                  )}
                >
                  <KanaChar char={question.char} />
                  <span class="flex justify-center text-xl lowercase leading-none text-slate-500">
                    {state.currentQuestion === idx() && !question.answer ? (
                      <For each={currentAnswer()}>
                        {(char) => <RomajiChar>{char}</RomajiChar>}
                      </For>
                    ) : (
                      question.answer || '...'
                    )}
                  </span>
                </li>
              )}
            </For>
          </ul>
        </div>

        <form class="flex w-full items-center gap-x-4" onSubmit={handleSubmit}>
          <div class="flex min-w-0 shrink-[1] grow-[1] basis-0 justify-end">
            <button
              type="button"
              aria-labelledby="replay-button"
              class={twMerge(
                'w-12 h-12 flex items-center justify-center rounded-full bg-slate-500 text-slate-50 decoration-slate-50 decoration-wavy shadow-md shadow-slate-200 hover:bg-slate-600 active:bg-slate-700 active:scale-90',
                DEFAULT_INTERACTION_CLASS
              )}
              onClick={() => {
                resetQuiz()
                setResetState(true)
              }}
            >
              <span id="replay-button" hidden>
                replay
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="3"
                stroke="currentColor"
                aria-hidden="true"
                class="h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                />
              </svg>
            </button>
          </div>
          <input
            ref={(el) => (answerInput = el)}
            id="answer"
            type="text"
            maxlength="3"
            minlength="1"
            value={answerInputValue()}
            onKeyDown={handleKeyPress}
            placeholder="answer..."
            required
            class={twMerge(
              'w-32 h-12 appearance-none rounded-full border-2 border-slate-300 bg-slate-50 px-3 py-2 text-center lowercase shadow-md shadow-slate-200 placeholder:text-slate-500',
              DEFAULT_INTERACTION_CLASS
            )}
            onInput={handleAnswerInput}
          />
          <div class="min-w-0 shrink-[1] grow-[1] basis-0">
            <button
              type="submit"
              aria-labelledby="submit-button"
              class={twMerge(
                'w-12 h-12 flex items-center justify-center rounded-full bg-slate-500 text-slate-50 decoration-slate-50 decoration-wavy shadow-md shadow-slate-200 hover:bg-slate-600 active:bg-slate-700 active:scale-90',
                DEFAULT_INTERACTION_CLASS
              )}
            >
              <span id="submit-button" hidden>
                check
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="4"
                stroke="currentColor"
                aria-hidden="true"
                class="h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.5 12.75l6 6 9-13.5"
                />
              </svg>
            </button>
          </div>
        </form>
      </section>

      <Footer />
    </General>
  )
}

export default Quiz
