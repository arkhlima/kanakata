import { clsx } from 'clsx'
import gsap from 'gsap'
import { createEffect, createMemo, For, onCleanup } from 'solid-js'
import { toRomaji } from 'wanakana'
import { CHAR_ANIMATION } from '~/constants/animations'
import type { Questions, StateWithActions } from '~/store/types'
import { cleanupAnimations } from '~/utils/animations'
import RomajiChar from './RomajiChar'

interface QuestionListProps {
  state: StateWithActions
  currentAnswer: () => string[]
  listRef?: (el: HTMLUListElement) => void
  onResetComplete?: (ref: { triggerKaomoji: () => void }) => void
}

const QuestionList = (props: QuestionListProps) => {
  let kaomojiAnimations: gsap.core.Timeline[] = []
  let animationRef: { triggerKaomoji: () => void } | null = null

  const QUESTION_STATE_CLASSES: Record<string, string> = {
    active: 'border-blue-300 bg-blue-50',
    inactive: 'border-slate-300 bg-slate-50',
    correct: 'border-emerald-300 bg-emerald-50',
    incorrect: 'border-pink-300 bg-pink-50',
  }

  const getQuestionStateClass = createMemo(() => {
    return (question: Questions, idx: number): string => {
      return idx === props.state.currentQuestion
        ? 'active'
        : question.answer
          ? question.answer.toLowerCase() === toRomaji(question.char)
            ? 'correct'
            : 'incorrect'
          : 'inactive'
    }
  })

  const animateKaomoji = () => {
    cleanupAnimations(kaomojiAnimations)
    kaomojiAnimations = []

    for (let index = 0; index < props.state.questions.length; index++) {
      const kanaElement = document.querySelector(
        `.question:nth-child(${index + 1}) .question-kana`
      )

      if (kanaElement) {
        kanaElement.textContent = '◕‿◕'

        const animation = gsap
          .timeline()
          .to(kanaElement, {
            scale: 0,
            duration: CHAR_ANIMATION.DURATION,
            ease: CHAR_ANIMATION.EASING.EXPO_IN,
            onComplete: () => {
              kanaElement.textContent = props.state.questions[index].char
            },
          })
          .to(kanaElement, {
            scale: 1,
            duration: CHAR_ANIMATION.DURATION,
            ease: CHAR_ANIMATION.EASING.EXPO_OUT,
          })

        kaomojiAnimations.push(animation)
      }
    }
  }

  createEffect(() => {
    if (props.state.currentQuestion === 0 && props.state.questions.length > 0 && !props.state.resetState) {
      animateKaomoji()
    }
  })

  createEffect(() => {
    if (props.state.resetState && props.state.questions.length > 0) {
    }
  })

  createEffect(() => {
    if (props.onResetComplete) {
      animationRef = { triggerKaomoji: animateKaomoji }
      props.onResetComplete(animationRef)
    }
  })

  onCleanup(() => {
    cleanupAnimations(kaomojiAnimations, '.question-kana')
    kaomojiAnimations = []
  })

  return (
    <div
      class="relative flex w-full justify-center overflow-x-hidden"
      style={{
        '-webkit-mask-image': 'linear-gradient(to right, #0000, #000, #000, #0000)',
      }}
    >
      <ul ref={props.listRef} class="relative grid w-24 grid-flow-col gap-x-2">
        <For each={props.state.questions}>
          {(question, idx) => (
            <li
              class={clsx(
                'question grid h-24 w-24 grid-flow-row justify-center gap-y-4 rounded-xl border-2 p-2',
                QUESTION_STATE_CLASSES[getQuestionStateClass()(question, idx())]
              )}
            >
              <p class="question-kana flex items-end justify-center font-japan font-semibold text-3xl leading-none">
                {question.char}
              </p>
              <p class="flex justify-center text-slate-500 text-xl lowercase leading-none">
                {props.state.currentQuestion === idx() && !question.answer ? (
                  <For each={props.currentAnswer()}>
                    {(char) => <RomajiChar>{char}</RomajiChar>}
                  </For>
                ) : (
                  question.answer || '...'
                )}
              </p>
            </li>
          )}
        </For>
      </ul>
    </div>
  )
}

export default QuestionList
