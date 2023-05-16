/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { JSX } from 'solid-js'

interface CheckboxProps {
  label: string
  isChecked: boolean
  onChange: () => void
}

const Checkbox = (props: CheckboxProps): JSX.Element => {
  return (
    <label
      class="flex cursor-pointer gap-x-2"
      classList={{
        'underline decoration-blue-300 decoration-wavy': props.isChecked,
      }}
    >
      <input
        type="checkbox"
        checked={props.isChecked}
        class="cursor-pointer"
        onClick={() => props.onChange()}
      />
      {props.label}
    </label>
  )
}

export default Checkbox
