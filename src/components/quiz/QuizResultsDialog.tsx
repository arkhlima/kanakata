import { useNavigate } from '@solidjs/router'
import { For, Show } from 'solid-js'
import Dialog from '~/components/Dialog'
import { DEFAULT_INTERACTION_CLASS } from '~/constants/classes'
import type { StateWithActions } from '~/store/types'
import { clsx } from 'clsx'

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
      {/* header */}
      <header class="bg-slate-300 px-6 py-2">
        <h2 class="text-center text-slate-700">complete!</h2>
      </header>
      {/* /header */}

      {/* statistics */}
      <article class="flex flex-col gap-6 p-6">
        {/* detailed stats */}
        <div class="grid grid-cols-3 gap-2 text-center">
          <div class="flex flex-col items-center justify-center rounded-xl border-2 border-blue-300 bg-blue-50 p-2">
            <p class="text-center text-slate-500 text-xs">score</p>
            <p class="text-center text-4xl">{props.completionPercentage()}</p>
          </div>
          <div class="flex flex-col items-center justify-center rounded-xl border-2 border-emerald-300 bg-emerald-50 p-2">
            <p class="text-2xl">{props.state.correctAnswersTotal}</p>
            <p class="text-slate-500 text-xs">correct</p>
          </div>
          <div class="flex flex-col items-center justify-center rounded-xl border-2 border-pink-300 bg-pink-50 p-2">
            <p class="text-2xl">{props.state.incorrectAnswersTotal}</p>
            <p class="text-slate-500 text-xs">incorrect</p>
          </div>
        </div>
        {/* /detailed stats */}

        {/* answers detail */}
        <Show when={props.state.incorrectAnswers.length > 0}>
          <div>
            <h3 class="mb-1 text-slate-500 text-sm lowercase">Incorrect Answers</h3>
            <div class="max-h-32 space-y-1 overflow-y-auto rounded-xl border-2 border-pink-300 bg-pink-50 p-3">
              <For each={props.state.incorrectAnswers}>
                {(incorrectAnswer) => (
                  <div class="flex items-center justify-between rounded bg-white p-2 text-xs">
                    <div class="flex items-center gap-2">
                      <p class="text-lg">{incorrectAnswer.char}</p>
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
        {/* /answers detail */}

        {/* action buttons */}
        <div class="space-y-2">
          <Show when={props.state.incorrectAnswers.length > 0}>
            <button
              type="button"
              class={clsx(
                'w-full cursor-pointer rounded-xl bg-pink-500 px-4 py-2 text-pink-50 text-sm hover:bg-pink-600 active:bg-pink-700',
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
              class={clsx(
                'flex-1 cursor-pointer rounded-xl bg-slate-500 px-4 py-2 text-slate-50 text-sm hover:bg-slate-600 active:bg-slate-700',
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
              class={clsx(
                'flex-1 cursor-pointer rounded-xl border-2 border-slate-300 px-4 py-2 text-slate-700 text-sm hover:bg-slate-50',
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
