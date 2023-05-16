import { JSX } from 'solid-js'

interface HeaderProps {
  children?: JSX.Element
}

const Header = (props: HeaderProps) => {
  return (
    <header class="col-span-12 grid grid-cols-1 items-end gap-2 md:grid-cols-2 md:justify-center">
      <h1 class="text-center text-5xl font-bold md:order-last md:text-right">
        kanakata
      </h1>

      {props.children ? props.children : <div />}
    </header>
  )
}

export default Header
