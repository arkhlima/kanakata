import { createMemo } from 'solid-js'
import { toRomaji } from 'wanakana'
import type { StateWithActions } from '~/store/types'

interface ProgressBarProps {
  state: StateWithActions
}

const ProgressBar = (props: ProgressBarProps) => {
  // progress bar color variables
  const PROGRESS_COLORS = {
    CORRECT: 'oklch(87.1% 0.15 154.449)', // emerald-200
    INCORRECT: 'oklch(82.3% 0.12 346.018)', // pink-200
  } as const

  const progressValue = () => props.state.currentQuestion
  const progressMax = () => props.state.questions.length
  const progressPercent = () => (progressValue() / progressMax()) * 100

  const progressBarGradient = createMemo(() => {
    const answeredQuestions = props.state.questions.slice(0, props.state.currentQuestion)
    const segments: string[] = []

    for (let i = 0; i < answeredQuestions.length; i++) {
      const question = answeredQuestions[i]
      if (question.answer) {
        const isCorrect = question.answer.toLowerCase() === toRomaji(question.char)
        const color = isCorrect ? PROGRESS_COLORS.CORRECT : PROGRESS_COLORS.INCORRECT

        const position = (i / props.state.currentQuestion) * 100
        segments.push(`${color} ${position}%`)
      }
    }

    if (segments.length > 0) {
      const lastQuestion = answeredQuestions[answeredQuestions.length - 1]
      if (lastQuestion.answer) {
        const isCorrect = lastQuestion.answer.toLowerCase() === toRomaji(lastQuestion.char)
        const color = isCorrect ? PROGRESS_COLORS.CORRECT : PROGRESS_COLORS.INCORRECT
        segments.push(`${color} 100%`)
      }
    }

    return segments.length > 0 ? `linear-gradient(90deg, ${segments.join(', ')})` : ''
  })

  return (
    <div class="relative flex h-4 w-full items-center justify-center rounded-full border-2 border-slate-200 bg-slate-50">
      {/* semantic progress */}
      <progress
        value={progressValue()}
        max={progressMax()}
        aria-label={`Quiz progress: question ${progressValue()} of ${progressMax()}`}
        class="sr-only absolute inset-0 h-full w-full appearance-none [&::-moz-progress-bar]:rounded-full [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-slate-50 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:transition-all [&::-webkit-progress-value]:duration-300 [&::-webkit-progress-value]:ease-out"
        style={{
          '--progress-gradient': progressBarGradient() || PROGRESS_COLORS.CORRECT,
        }}
      >
        {progressPercent()}% complete
      </progress>
      {/* /semantic progress */}

      {/* gradient effect */}
      <div
        class="absolute inset-0 h-full rounded-full transition-all duration-300 ease-out"
        style={{
          background: progressBarGradient(),
          width: `${progressPercent()}%`,
        }}
      />
      {/* /gradient effect */}

      {/* progress text */}
      <small class="relative z-10 font-medium text-[10px] text-slate-700 drop-shadow-sm">
        {progressValue()} of {progressMax()}
      </small>
      {/* /progress text */}
    </div>
  )
}

export default ProgressBar
