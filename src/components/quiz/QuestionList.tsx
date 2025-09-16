import { createMemo, For } from 'solid-js'
import { toRomaji } from 'wanakana'
import type { Questions, StateWithActions } from '~/store/types'
import { cn } from '~/utils/cn'
import RomajiChar from './RomajiChar'

interface QuestionListProps {
  state: StateWithActions
  currentAnswer: () => string[]
  listRef?: (el: HTMLUListElement) => void
}

const QuestionList = (props: QuestionListProps) => {
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

  return (
    <div
      class="relative flex w-full justify-center overflow-x-hidden"
      style={{
        '-webkit-mask-image': 'linear-gradient(to right, #0000, #000, #000, #0000)',
      }}
    >
      <ul ref={props.listRef} class="relative grid w-32 grid-flow-col gap-x-2">
        <For each={props.state.questions}>
          {(question, idx) => (
            <li
              class={cn(
                'question grid h-24 w-32 grid-flow-row justify-center gap-y-4 rounded-xl border-2 p-2',
                QUESTION_STATE_CLASSES[getQuestionStateClass()(question, idx())]
              )}
            >
              <span class="question-kana flex items-end justify-center font-bold font-sans text-3xl leading-none">
                {question.char}
              </span>
              <span class="flex justify-center text-slate-500 text-xl lowercase leading-none">
                {props.state.currentQuestion === idx() && !question.answer ? (
                  <For each={props.currentAnswer()}>
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
  )
}

export default QuestionList
