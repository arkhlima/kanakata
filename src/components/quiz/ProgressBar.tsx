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
    <div
      class="progress-bar relative flex h-4 w-full items-center justify-center overflow-hidden rounded-full border-2 border-slate-200 bg-slate-50 before:absolute before:top-0 before:left-0 before:h-full before:rounded-full before:transition-all before:duration-300 before:ease-out before:content-['']"
      style={{
        '--progress-width': `${(props.state.currentQuestion / props.state.questions.length) * 100}%`,
        '--progress-gradient': progressBarGradient() || PROGRESS_COLORS.CORRECT,
      }}
    >
      <small class="relative z-10 font-medium text-[10px] text-slate-700 drop-shadow-sm">
        {props.state.currentQuestion} of {props.state.questions.length}
      </small>
    </div>
  )
}

export default ProgressBar
