import { JSX } from 'solid-js'

interface CheckboxProps {
   label: string
   checked: boolean
   onChange: () => void
}

const Checkbox = (props: CheckboxProps): JSX.Element => {
   return (
      <label>
         <input type="checkbox" checked={props.checked} onClick={() => props.onChange()} />
         {props.label}
      </label>
   )
}

export default Checkbox
