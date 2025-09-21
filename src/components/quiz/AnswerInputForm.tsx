import { clsx } from 'clsx'
import { DEFAULT_INTERACTION_CLASS } from '~/constants/classes'
import type { StateWithActions } from '~/store/types'

interface AnswerInputFormProps {
  state: StateWithActions
  inputRef?: (el: HTMLInputElement) => void
  answerInputValue: () => string | undefined
  setAnswerInputValue: (value: string) => void
  setResetState: (reset: boolean) => void
  handleSubmit: (event: Event) => void
  disabled?: boolean
}

const AnswerInputForm = (props: AnswerInputFormProps) => {
  const handleAnswerInput = (event: InputEvent) => {
    const target = event.target as HTMLInputElement
    if (/^[A-Za-z]*$/g.test(target.value)) {
      props.setAnswerInputValue(target.value)
    }
  }

  return (
    <form class="flex w-full items-center gap-x-4" onSubmit={props.handleSubmit}>
      {/* reset button */}
      <div class="flex min-w-0 shrink-[1] grow-[1] basis-0 justify-end">
        <button
          type="button"
          aria-labelledby="reset-button"
          title="Reset quiz"
          class={clsx(
            'flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-slate-500 text-slate-50 decoration-slate-50 decoration-wavy shadow-md shadow-slate-200 hover:bg-slate-600 disabled:bg-slate-300 [&:not(:disabled)]:active:scale-90 [&:not(:disabled)]:active:bg-slate-700',
            DEFAULT_INTERACTION_CLASS
          )}
          disabled={!props.state.currentQuestion || props.disabled}
          onClick={() => props.state.currentQuestion && props.setResetState(true)}
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
      {/* /reset button */}

      {/* answer input */}
      <input
        ref={props.inputRef}
        id="answer"
        type="text"
        maxlength="3"
        minlength="1"
        value={props.answerInputValue() || ''}
        placeholder="..."
        class={clsx(
          'h-12 w-24 appearance-none rounded-full border-2 border-slate-300 bg-slate-50 px-3 py-2 text-center lowercase shadow-md shadow-slate-200 placeholder:text-slate-500 disabled:bg-slate-200 disabled:text-slate-400',
          DEFAULT_INTERACTION_CLASS
        )}
        onInput={handleAnswerInput}
      />
      {/* /answer input */}

      {/* check button */}
      <div class="min-w-0 shrink-[1] grow-[1] basis-0">
        <button
          type="submit"
          aria-labelledby="submit-button"
          disabled={props.disabled}
          class={clsx(
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
      {/* /check button */}
    </form>
  )
}

export default AnswerInputForm
