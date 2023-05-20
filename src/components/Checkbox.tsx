import { JSX } from 'solid-js'

import { DEFAULT_INTERACTION_CLASS } from '~/constants/classes'

interface CheckboxProps {
  label: string
  isChecked: boolean
  onChange: () => void
}

const Checkbox = (props: CheckboxProps): JSX.Element => {
  return (
    <label
      class="flex cursor-pointer items-center gap-x-2"
      classList={{
        'underline decoration-blue-300 decoration-wavy': props.isChecked,
      }}
    >
      <input
        type="checkbox"
        checked={props.isChecked}
        class={`cursor-pointer ${DEFAULT_INTERACTION_CLASS}`}
        onClick={() => props.onChange()}
      />
      {props.label}
    </label>
  )
}

export default Checkbox
