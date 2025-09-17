import type { JSX } from 'solid-js'

import { DEFAULT_INTERACTION_CLASS } from '~/constants/classes'
import { cn } from '~/utils/cn'

interface CheckboxProps {
  label: string
  isChecked: boolean
  isLabelHidden?: boolean
  onChange: () => void
}

const Checkbox = (props: CheckboxProps): JSX.Element => {
  return (
    <label
      class={cn(
        'flex cursor-pointer items-center gap-x-2 lowercase',
        props.isChecked ? 'underline decoration-blue-300 decoration-wavy' : ''
      )}
    >
      <input
        type="checkbox"
        checked={props.isChecked}
        class={cn('cursor-pointer', DEFAULT_INTERACTION_CLASS)}
        onClick={() => props.onChange()}
      />
      <span class={cn(props.isLabelHidden ? 'absolute left-[-999px] z-[-1] overflow-hidden' : '')}>
        {props.label}
      </span>
    </label>
  )
}

export default Checkbox
