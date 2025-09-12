import { twMerge } from 'tailwind-merge'

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
      class="flex cursor-pointer items-center gap-x-2 lowercase"
      classList={{
        'underline decoration-blue-300 decoration-wavy': props.isChecked,
      }}
    >
      <input
        type="checkbox"
        checked={props.isChecked}
        class={twMerge('cursor-pointer', DEFAULT_INTERACTION_CLASS)}
        onClick={() => props.onChange()}
      />
      <span
        classList={{
          'absolute z-[-1] left-[-999px] overflow-hidden': props.isLabelHidden,
        }}
      >
        {props.label}
      </span>
    </label>
  )
}

export default Checkbox
