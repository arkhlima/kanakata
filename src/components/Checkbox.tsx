import { clsx } from 'clsx'
import type { JSX } from 'solid-js'
import { DEFAULT_INTERACTION_CLASS } from '~/constants/classes'

interface CheckboxProps {
  label: string
  isChecked: boolean
  isLabelHidden?: boolean
  onChange: () => void
}

const Checkbox = (props: CheckboxProps): JSX.Element => {
  return (
    <label
      class={clsx(
        'flex cursor-pointer items-center gap-x-2 lowercase',
        props.isChecked ? 'underline decoration-blue-300 decoration-wavy' : ''
      )}
    >
      <input
        type="checkbox"
        checked={props.isChecked}
        class={clsx('cursor-pointer', DEFAULT_INTERACTION_CLASS)}
        onClick={() => props.onChange()}
      />
      <span class={clsx(props.isLabelHidden ? 'absolute left-[-999px] z-[-1] overflow-hidden' : '')}>
        {props.label}
      </span>
    </label>
  )
}

export default Checkbox
