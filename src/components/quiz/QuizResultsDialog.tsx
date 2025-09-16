import { useNavigate } from '@solidjs/router'
import { For, Show } from 'solid-js'
import Dialog from '~/components/Dialog'
import { DEFAULT_INTERACTION_CLASS } from '~/constants/classes'
import type { StateWithActions } from '~/store/types'
import { cn } from '~/utils/cn'

interface QuizResultsDialogProps {
  isVisible: () => boolean
  setResultVisibility: (visible: boolean) => void
  state: StateWithActions
  setQuestionsFromWrongAnswers: () => void
  setResetState: (reset: boolean) => void
  completionPercentage: () => number
}

const QuizResultsDialog = (props: QuizResultsDialogProps) => {
  const navigate = useNavigate()

  return (
    <Dialog isVisible={props.isVisible}>
      <header class="mb-4">
        <h2 class="text-center font-bold text-lg text-slate-700 xs:text-2xl">quiz complete!</h2>
      </header>

      {/* statistics */}
      <article class="space-y-4">
        {/* score overview */}
        <p class="text-center font-bold text-2xl text-slate-700">{props.completionPercentage()}%</p>
        {/* /score overview */}

        {/* detailed stats */}
        <div class="grid grid-cols-2 gap-4 text-center">
          <div class="rounded-lg bg-emerald-50 p-3">
            <p class="font-bold text-emerald-700 text-lg">{props.state.correctAnswersTotal}</p>
            <p class="text-emerald-600 text-xs">correct</p>
          </div>
          <div class="rounded-lg bg-pink-50 p-3">
            <p class="font-bold text-lg text-pink-700">{props.state.incorrectAnswersTotal}</p>
            <p class="text-pink-600 text-xs">incorrect</p>
          </div>
        </div>
        {/* /detailed stats */}

        {/* answers detail */}
        <div class="space-y-3">
          <Show when={props.state.correctAnswers.length > 0}>
            <div class="space-y-2">
              <h3 class="font-semibold text-emerald-700 text-sm">Correct Answers:</h3>
              <div class="max-h-32 space-y-1 overflow-y-auto rounded-lg bg-emerald-50 p-3">
                <For each={props.state.correctAnswers}>
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

          <Show when={props.state.incorrectAnswers.length > 0}>
            <div class="space-y-2">
              <h3 class="font-semibold text-pink-700 text-sm">Incorrect Answers:</h3>
              <div class="max-h-32 space-y-1 overflow-y-auto rounded-lg bg-pink-50 p-3">
                <For each={props.state.incorrectAnswers}>
                  {(incorrectAnswer) => (
                    <div class="flex items-center justify-between rounded bg-white p-2 text-xs">
                      <div class="flex items-center gap-2">
                        <p class="font-bold text-lg">{incorrectAnswer.char}</p>
                        <span class="text-slate-500">→</span>
                      </div>
                      <div class="flex items-center gap-2 text-right">
                        <p class="text-pink-600">your: {incorrectAnswer.userAnswer}</p>
                        <p class="text-emerald-600">correct: {incorrectAnswer.correctAnswer}</p>
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
          <Show when={props.state.incorrectAnswers.length > 0}>
            <button
              type="button"
              class={cn(
                'w-full cursor-pointer rounded-lg bg-pink-500 px-4 py-2 text-pink-50 text-sm hover:bg-pink-600 active:bg-pink-700',
                DEFAULT_INTERACTION_CLASS
              )}
              onClick={() => {
                props.setQuestionsFromWrongAnswers()
                props.setResultVisibility(false)
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
                props.setResetState(true)
                props.setResultVisibility(false)
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
  )
}

export default QuizResultsDialog
