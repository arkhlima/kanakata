import { useNavigate } from '@solidjs/router'
import gsap from 'gsap'

import { createEffect, createMemo, createSignal, For, onCleanup, onMount, Show } from 'solid-js'
import { Transition } from 'solid-transition-group'
import { toRomaji } from 'wanakana'
import Dialog from '~/components/Dialog'
import { DEFAULT_INTERACTION_CLASS } from '~/constants/classes'
import General from '~/layouts/general'
import type { Questions } from '~/store/kanaStore'
import useStore from '~/store/kanaStore'
import { cn } from '~/utils/cn'

interface RomajiCharProps {
  children: string
}

const RomajiChar = (props: RomajiCharProps) => {
  let char: HTMLSpanElement
  let animation: gsap.core.Tween

  const ROMAJI_ANIMATION = {
    DURATION: 0.2,
    EASE: 'expo.in.out',
  } as const

  onMount(() => {
    // individual char animation
    animation = gsap.fromTo(
      char,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, ease: ROMAJI_ANIMATION.EASE, duration: ROMAJI_ANIMATION.DURATION }
    )
  })

  onCleanup(() => {
    // kill animations and clear properties
    if (animation) {
      animation.kill()
      if (char) {
        gsap.set(char, { clearProps: 'all' })
      }
    }
  })

  return <span ref={(el) => (char = el)}>{props.children}</span>
}

const Quiz = () => {
  const state = useStore()
  const { setQuestions, setAnswer, resetQuiz, setResetState, setQuestionsFromWrongAnswers } = state

  const navigate = useNavigate()
  let answerInput: HTMLInputElement
  let questionList: HTMLUListElement
  let questionAnimation: gsap.core.Timeline
  let resetAnimation: gsap.core.Timeline

  const DEFAULT_ANSWER: string[] = ['.', '.', '.']
  const QUESTION_STATE_CLASSES: Record<string, string> = {
    active: 'border-blue-300 bg-blue-50',
    inactive: 'border-slate-300 bg-slate-50',
    correct: 'border-emerald-300 bg-emerald-50',
    incorrect: 'border-pink-300 bg-pink-50',
  }

  const ANIMATION = {
    DURATION: {
      SCALE: 0.2,
      SLIDE: 0.2,
      FADE: 0.1,
      RESET_DELAY: 0.4,
    },
    EASING: {
      EXPO_IN: 'expo.in',
      EXPO_OUT: 'expo.out',
      EXPO_IN_OUT: 'expo.in.out',
    },
    RESET_ROTATION: '75deg',
  } as const

  const [currentAnswer, setCurrentAnswer] = createSignal<string[]>(DEFAULT_ANSWER)
  const [answerInputValue, setAnswerInputValue] = createSignal<string>()
  const [isResultVisible, setResultVisibility] = createSignal<boolean>(false)
  const [isResetting, setIsResetting] = createSignal<boolean>(false)

  onMount(() => {
    if (state.questions.length === 0) navigate('/', { replace: true })

    // keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      // escape key
      if (event.key === 'Escape') {
        navigate('/')
        return
      }

      // enter key
      if (event.key === 'Enter') {
        const currentAnswerValue = answerInputValue()
        if (currentAnswerValue && currentAnswerValue.trim().length > 0) {
          const submitEvent = new Event('submit', { bubbles: true, cancelable: true })
          answerInput.form?.dispatchEvent(submitEvent)
        } else {
          // autofocus input when enter with blank input
          answerInput.focus()
        }
        return
      }

      // spacebar
      if (event.key === ' ' && state.currentQuestion > 0) {
        event.preventDefault()
        setResetState(true)
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    // cleanup event listener
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  })

  createEffect(() => {
    // quiz animation
    if (!state.resetState && state.questions.length >= state.currentQuestion && !isResetting()) {
      // cleanup previous animation
      if (questionAnimation) questionAnimation.kill()

      const calculatedTranslate = translateValue()
      const currentQuestionIndex =
        state.currentQuestion === 0 ? state.currentQuestion + 1 : state.currentQuestion

      // only animate if not the first question
      const isShowFeedbackAnimation = state.currentQuestion > 0

      questionAnimation = gsap.timeline()

      if (isShowFeedbackAnimation) {
        // get the previous question to check if answer was correct
        const previousQuestion = state.questions[state.currentQuestion - 1]
        const isCorrect = previousQuestion?.isCorrect

        if (isCorrect) {
          // scale animation for correct answers
          questionAnimation
            .to(`.question:nth-child(${currentQuestionIndex})`, {
              scale: 0.8,
              duration: ANIMATION.DURATION.SCALE,
              ease: ANIMATION.EASING.EXPO_IN,
            })
            .to(`.question:nth-child(${currentQuestionIndex})`, {
              scale: 1,
              duration: ANIMATION.DURATION.SCALE,
              ease: ANIMATION.EASING.EXPO_OUT,
            })
        } else {
          // shake animation for incorrect answers
          questionAnimation
            .to(`.question:nth-child(${currentQuestionIndex})`, {
              x: -8,
              duration: ANIMATION.DURATION.SCALE / 3,
              ease: ANIMATION.EASING.EXPO_IN_OUT,
              yoyo: true,
              repeat: 3,
            })
            .set(`.question:nth-child(${currentQuestionIndex})`, {
              x: 0,
              clearProps: 'transform',
            })
        }
      }

      questionAnimation.to(
        questionList,
        state.questions.length > 0 && state.questions.length === state.currentQuestion
          ? {
              onComplete: () => {
                setResultVisibility(true)
              },
            }
          : {
              x: `${calculatedTranslate}rem`,
              duration: ANIMATION.DURATION.SLIDE,
              ease: ANIMATION.EASING.EXPO_IN_OUT,
            }
      )

      answerInput.focus()
      setAnswerInputValue('')
    }

    if (state.resetState) {
      setCurrentAnswer(DEFAULT_ANSWER)
    }
  })

  createEffect(() => {
    // scale-in & scale-out chars animation
    if (state.resetState) {
      // cleanup previous reset animation
      if (resetAnimation) resetAnimation.kill()

      resetAnimation = gsap
        .timeline()
        .to('.reset-icon', {
          rotate: ANIMATION.RESET_ROTATION,
          duration: ANIMATION.DURATION.SCALE,
          ease: ANIMATION.EASING.EXPO_IN,
        })
        .to('.question-kana', {
          opacity: 0,
          duration: ANIMATION.DURATION.FADE,
          ease: ANIMATION.EASING.EXPO_IN_OUT,
          onComplete: () => {
            setIsResetting(true)
            resetQuiz()
            setQuestions()
          },
        })
        .to('.question-kana', {
          opacity: 1,
          duration: ANIMATION.DURATION.FADE,
          ease: ANIMATION.EASING.EXPO_IN_OUT,
          onComplete: () => {
            setResetState(false)
            setIsResetting(false)
          },
        })
        .to('.reset-icon', {
          rotate: '0deg',
          delay: ANIMATION.DURATION.RESET_DELAY,
          duration: ANIMATION.DURATION.SCALE,
          ease: ANIMATION.EASING.EXPO_OUT,
        })
    }
  })

  onCleanup(() => {
    // kill animations and clear properties
    if (questionAnimation) {
      questionAnimation.kill()
      if (questionList) {
        gsap.set(questionList, { clearProps: 'all' })
      }
      gsap.set('.question', { clearProps: 'all' })
      gsap.set('.question-kana', { clearProps: 'all' })
    }
    if (resetAnimation) {
      resetAnimation.kill()
      gsap.set('.reset-icon', { clearProps: 'all' })
      gsap.set('.question-kana', { clearProps: 'all' })
    }
  })

  const translateValue = createMemo(() => {
    return -8 * state.currentQuestion - 0.5 * state.currentQuestion
  })

  const getQuestionStateClass = createMemo(() => {
    return (question: Questions, idx: number): string => {
      return idx === state.currentQuestion
        ? 'active'
        : question.answer
          ? question.answer.toLowerCase() === toRomaji(question.char)
            ? 'correct'
            : 'incorrect'
          : 'inactive'
    }
  })

  const completionPercentage = createMemo(() => {
    return Math.round((state.correctAnswersTotal / state.questions.length) * 100)
  })

  const handleAnswerInput = (event: InputEvent) => {
    const target = event.target as HTMLInputElement
    if (/^[A-Za-z]*$/g.test(target.value)) {
      setAnswerInputValue(target.value)
      setCurrentAnswer(target.value ? target.value.split('') : DEFAULT_ANSWER)
    }
  }

  const handleKeyPress = (event: KeyboardEvent) => {
    const isAlphabet = /[a-zA-Z]/i.test(event.key)
    const isAllowedKey = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight'].includes(
      event.key
    )

    if (!isAlphabet && !isAllowedKey) {
      event.preventDefault()
    }
  }

  const handleSubmit = (event: Event): void => {
    event.preventDefault()

    // manual validation — check if answer is not empty
    const currentAnswerValue = answerInputValue()
    if (!currentAnswerValue || currentAnswerValue.trim().length === 0) {
      // autofocus input when submit with blank input
      answerInput.focus()
      return // don't submit if empty
    }

    if (state.questions.length !== state.currentQuestion) {
      setAnswer(currentAnswerValue)
      setCurrentAnswer(DEFAULT_ANSWER)
      setAnswerInputValue('')
    }
  }

  return (
    <General>
      <header class="col-span-12 grid grid-cols-1 items-end gap-2 md:grid-cols-3 md:justify-center">
        <h1 class="order-1 col-span-2 text-center font-bold text-5xl md:order-2 md:col-span-1">
          kanakata
        </h1>

        <div class="order-1">
          <button
            type="button"
            class={cn(
              'flex cursor-pointer items-center gap-1 text-lg text-slate-500 lowercase decoration-blue-300 decoration-wavy hover:text-slate-700 focus:underline md:text-2xl',
              DEFAULT_INTERACTION_CLASS
            )}
            onClick={() => navigate('/')}
          >
            back
            <kbd class="rounded bg-slate-200 px-1 py-0.5 text-xs lowercase">Esc</kbd>
          </button>
        </div>
        <div class="order-3 flex justify-end">
          <button
            type="button"
            class={cn(
              'cursor-pointer text-lg text-slate-500 lowercase decoration-blue-300 decoration-wavy hover:text-slate-700 focus:underline md:text-2xl',
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
            <header class="mb-4">
              <h2 class="text-center font-bold text-lg text-slate-700 xs:text-2xl">
                quiz complete!
              </h2>
            </header>

            {/* statistics */}
            <article class="space-y-4">
              {/* score overview */}
              <p class="text-center font-bold text-2xl text-slate-700">{completionPercentage()}%</p>
              {/* /score overview */}

              {/* detailed stats */}
              <div class="grid grid-cols-2 gap-4 text-center">
                <div class="rounded-lg bg-emerald-50 p-3">
                  <p class="font-bold text-emerald-700 text-lg">{state.correctAnswersTotal}</p>
                  <p class="text-emerald-600 text-xs">correct</p>
                </div>
                <div class="rounded-lg bg-pink-50 p-3">
                  <p class="font-bold text-lg text-pink-700">{state.incorrectAnswersTotal}</p>
                  <p class="text-pink-600 text-xs">incorrect</p>
                </div>
              </div>
              {/* /detailed stats */}

              {/* answers detail */}
              <div class="space-y-3">
                <Show when={state.correctAnswers.length > 0}>
                  <div class="space-y-2">
                    <h3 class="font-semibold text-emerald-700 text-sm">Correct Answers:</h3>
                    <div class="max-h-32 space-y-1 overflow-y-auto rounded-lg bg-emerald-50 p-3">
                      <For each={state.correctAnswers}>
                        {(correctAnswer) => (
                          <div class="flex items-center justify-between rounded bg-white p-2 text-xs">
                            <div class="flex items-center gap-2">
                              <p class="font-bold text-lg">{correctAnswer.char}</p>
                              <span class="text-slate-500">→</span>
                            </div>
                            <div class="flex items-center gap-2 text-right">
                              <p class="text-emerald-600">your: {correctAnswer.userAnswer}</p>
                              <p class="text-emerald-600">correct: {correctAnswer.correctAnswer}</p>
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                </Show>

                <Show when={state.incorrectAnswers.length > 0}>
                  <div class="space-y-2">
                    <h3 class="font-semibold text-pink-700 text-sm">Incorrect Answers:</h3>
                    <div class="max-h-32 space-y-1 overflow-y-auto rounded-lg bg-pink-50 p-3">
                      <For each={state.incorrectAnswers}>
                        {(incorrectAnswer) => (
                          <div class="flex items-center justify-between rounded bg-white p-2 text-xs">
                            <div class="flex items-center gap-2">
                              <p class="font-bold text-lg">{incorrectAnswer.char}</p>
                              <span class="text-slate-500">→</span>
                            </div>
                            <div class="flex items-center gap-2 text-right">
                              <p class="text-pink-600">your: {incorrectAnswer.userAnswer}</p>
                              <p class="text-emerald-600">
                                correct: {incorrectAnswer.correctAnswer}
                              </p>
                            </div>
                          </div>
                        )}
                      </For>
                    </div>
                  </div>
                </Show>
              </div>
              {/* /answers detail */}

              {/* action buttons */}
              <div class="space-y-2">
                <Show when={state.incorrectAnswers.length > 0}>
                  <button
                    type="button"
                    class={cn(
                      'w-full cursor-pointer rounded-lg bg-pink-500 px-4 py-2 text-pink-50 text-sm hover:bg-pink-600 active:bg-pink-700',
                      DEFAULT_INTERACTION_CLASS
                    )}
                    onClick={() => {
                      setQuestionsFromWrongAnswers()
                      setResultVisibility(false)
                    }}
                  >
                    quiz from incorrect answers
                  </button>
                </Show>
                <div class="flex gap-2">
                  <button
                    type="button"
                    class={cn(
                      'flex-1 cursor-pointer rounded-lg bg-slate-500 px-4 py-2 text-slate-50 text-sm hover:bg-slate-600 active:bg-slate-700',
                      DEFAULT_INTERACTION_CLASS
                    )}
                    onClick={() => {
                      setResetState(true)
                      setResultVisibility(false)
                    }}
                  >
                    try again
                  </button>
                  <button
                    type="button"
                    class={cn(
                      'flex-1 cursor-pointer rounded-lg border-2 border-slate-300 px-4 py-2 text-slate-700 text-sm hover:bg-slate-50',
                      DEFAULT_INTERACTION_CLASS
                    )}
                    onClick={() => navigate('/')}
                  >
                    new quiz
                  </button>
                </div>
              </div>
              {/* /action buttons */}
            </article>
            {/* /statistics */}
          </Dialog>
        </Show>
      </Transition>

      <section class="col-span-12 flex flex-col items-center gap-y-8">
        <div class="w-full">
          <div class="flex h-6 w-full items-center justify-center rounded-t-xl border-2 border-slate-200 border-b-0">
            <small class="text-slate-500 text-xs">
              {state.currentQuestion} of {state.questions.length}
            </small>
          </div>

          <div
            class="relative flex w-full justify-center overflow-x-hidden"
            style={{
              '-webkit-mask-image': 'linear-gradient(to right, #0000, #000, #000, #0000)',
            }}
          >
            <ul ref={(el) => (questionList = el)} class="relative grid w-32 grid-flow-col gap-x-2">
              <For each={state.questions}>
                {(question, idx) => (
                  <li
                    class={cn(
                      'question grid h-24 w-32 grid-flow-row justify-center gap-y-4 rounded-xl border-2 p-2',
                      QUESTION_STATE_CLASSES[getQuestionStateClass()(question, idx())]
                    )}
                  >
                    <span
                      class="question-kana flex items-end justify-center font-bold font-sans text-3xl leading-none"
                    >
                      {question.char}
                    </span>
                    <span class="flex justify-center text-slate-500 text-xl lowercase leading-none">
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
        </div>

        <form class="flex w-full items-center gap-x-4" onSubmit={handleSubmit}>
          <div class="flex min-w-0 shrink-[1] grow-[1] basis-0 justify-end">
            <button
              type="button"
              aria-labelledby="reset-button"
              title="Reset quiz"
              class={cn(
                'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-slate-500 text-slate-50 decoration-slate-50 decoration-wavy shadow-md shadow-slate-200 hover:bg-slate-600 disabled:bg-slate-300 [&:not(:disabled)]:active:scale-90 [&:not(:disabled)]:active:bg-slate-700',
                DEFAULT_INTERACTION_CLASS
              )}
              disabled={!state.currentQuestion}
              onClick={() => state.currentQuestion && setResetState(true)}
            >
              <span id="reset-button" hidden>
                reset
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="3"
                stroke="currentColor"
                aria-hidden="true"
                class="reset-icon h-5 w-5"
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
            class={cn(
              'h-12 w-32 appearance-none rounded-full border-2 border-slate-300 bg-slate-50 px-3 py-2 text-center lowercase shadow-md shadow-slate-200 placeholder:text-slate-500',
              DEFAULT_INTERACTION_CLASS
            )}
            onInput={handleAnswerInput}
          />
          <div class="min-w-0 shrink-[1] grow-[1] basis-0">
            <button
              type="submit"
              aria-labelledby="submit-button"
              class={cn(
                'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-slate-500 text-slate-50 decoration-slate-50 decoration-wavy shadow-md shadow-slate-200 disabled:bg-slate-300 [&:not(:disabled)]:active:scale-90 [&:not(:disabled)]:active:bg-slate-700',
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
                stroke-width="3"
                stroke="currentColor"
                aria-hidden="true"
                class="h-5 w-5"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"
                />
              </svg>
            </button>
          </div>
        </form>
      </section>
    </General>
  )
}

export default Quiz
