import { useNavigate } from '@solidjs/router'
import gsap from 'gsap'

import { createEffect, createMemo, createSignal, onCleanup, onMount, Show } from 'solid-js'
import { Transition } from 'solid-transition-group'
import AnswerInputForm from '~/components/quiz/AnswerInputForm'
import ProgressBar from '~/components/quiz/ProgressBar'
import QuestionList from '~/components/quiz/QuestionList'
import QuizResultsDialog from '~/components/quiz/QuizResultsDialog'
import { DEFAULT_INTERACTION_CLASS } from '~/constants/classes'
import General from '~/layouts/general'
import useStore from '~/store/kanaStore'
import { cleanupAnimation } from '~/utils/animations'
import { cn } from '~/utils/cn'

const Quiz = () => {
  const state = useStore()
  const {
    setQuestions,
    setAnswer,
    resetQuiz,
    setResetState,
    setQuestionsFromWrongAnswers,
    resetIncorrectAnswersFlag,
  } = state

  const navigate = useNavigate()
  let answerInput: HTMLInputElement
  let questionList: HTMLUListElement
  let questionAnimation: gsap.core.Timeline
  let resetAnimation: gsap.core.Timeline

  const DEFAULT_ANSWER: string[] = ['.', '.', '.']

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
  const [isTransitioning, setIsTransitioning] = createSignal<boolean>(false)

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

      setIsTransitioning(true)

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
                setIsTransitioning(false)
              },
            }
          : {
              x: `${calculatedTranslate}rem`,
              duration: ANIMATION.DURATION.SLIDE,
              ease: ANIMATION.EASING.EXPO_IN_OUT,
              onComplete: () => {
                setIsTransitioning(false)
              },
            }
      )

      setAnswerInputValue('')
    }

    if (state.resetState) {
      setCurrentAnswer(DEFAULT_ANSWER)
    }
  })

  createEffect(() => {
    if (
      state.currentQuestion === 0 &&
      state.questions.length > 0 &&
      !state.resetState &&
      !isResetting()
    ) {
      setIsTransitioning(true)

      const charAnimationDuration = 0.2 * 2
      setTimeout(() => {
        setIsTransitioning(false)
      }, charAnimationDuration * 1000)
    }
  })

  createEffect(() => {
    if (!isTransitioning() && answerInput) {
      answerInput.focus()
    }
  })

  createEffect(() => {
    // scale-in & scale-out chars animation
    if (state.resetState) {
      // cleanup previous reset animation
      if (resetAnimation) resetAnimation.kill()

      // Set transitioning state during reset
      setIsTransitioning(true)

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

            // only call setQuestions if this is not a reset from incorrect answers
            if (!state.isResetFromIncorrectAnswers) {
              setQuestions()
            }
          },
        })
        .to('.question-kana', {
          opacity: 1,
          duration: ANIMATION.DURATION.FADE,
          ease: ANIMATION.EASING.EXPO_IN_OUT,
          onComplete: () => {
            setResetState(false)
            setIsResetting(false)
            setIsTransitioning(false)
            if (state.isResetFromIncorrectAnswers) {
              resetIncorrectAnswersFlag()
            }
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
    cleanupAnimation(questionAnimation, questionList)
    gsap.set('.question', { clearProps: 'all' })
    gsap.set('.question-kana', { clearProps: 'all' })

    cleanupAnimation(resetAnimation)
    gsap.set('.reset-icon', { clearProps: 'all' })
    gsap.set('.question-kana', { clearProps: 'all' })
  })

  const translateValue = createMemo(() => {
    return -6 * state.currentQuestion - 0.5 * state.currentQuestion
  })

  const completionPercentage = createMemo(() => {
    return Math.round((state.correctAnswersTotal / state.questions.length) * 100)
  })

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

  const handleAnswerInputChange = (value: string) => {
    setAnswerInputValue(value)
    setCurrentAnswer(value ? value.split('') : DEFAULT_ANSWER)
  }

  return (
    <General>
      {/* header */}
      <header class="col-span-12 grid grid-cols-1 items-end gap-2 md:grid-cols-3 md:justify-center">
        <h1 class="order-1 col-span-2 text-center text-5xl md:order-2 md:col-span-1">kanakata</h1>

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
            <kbd class="rounded-md bg-slate-300 px-1 py-0.5 text-slate-50 text-xs lowercase">
              Esc
            </kbd>
          </button>
        </div>
        <div class="order-3 flex justify-end">
          <button
            type="button"
            class={cn(
              'cursor-pointer text-lg lowercase decoration-blue-300 decoration-wavy hover:text-slate-700 focus:underline disabled:text-slate-300 md:text-2xl',
              DEFAULT_INTERACTION_CLASS
            )}
            disabled
          >
            settings
          </button>
        </div>
      </header>
      {/* /header */}

      {/* quiz results dialog */}
      <Transition name="tr--from-bottom">
        <Show when={!!isResultVisible()}>
          <QuizResultsDialog
            isVisible={isResultVisible}
            setResultVisibility={setResultVisibility}
            state={state}
            setQuestionsFromWrongAnswers={setQuestionsFromWrongAnswers}
            setResetState={setResetState}
            completionPercentage={completionPercentage}
          />
        </Show>
      </Transition>
      {/* /quiz results dialog */}

      <section class="col-span-12 flex flex-col items-center gap-y-8">
        <h2 class="sr-only lowercase">Quiz</h2>

        {/* progress bar */}
        <ProgressBar state={state} />
        {/* /progress bar */}

        {/* question list */}
        <QuestionList
          state={state}
          currentAnswer={currentAnswer}
          listRef={(el) => (questionList = el)}
        />
        {/* /question list */}

        {/* answer input form */}
        <AnswerInputForm
          state={state}
          inputRef={(el: HTMLInputElement) => (answerInput = el)}
          answerInputValue={answerInputValue}
          setAnswerInputValue={handleAnswerInputChange}
          setResetState={setResetState}
          handleSubmit={handleSubmit}
          disabled={isTransitioning()}
        />
        {/* /answer input form */}
      </section>
    </General>
  )
}

export default Quiz
