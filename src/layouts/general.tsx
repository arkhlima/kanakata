import type { JSX } from 'solid-js'

interface GeneralProps {
  children: JSX.Element
}

const General = (props: GeneralProps) => {
  return (
    <main class="relative mx-auto grid min-h-screen max-w-5xl grid-cols-12 grid-rows-[auto_1fr_auto] gap-y-16 overflow-x-hidden px-4 pb-20 pt-16 md:px-8">
      {props.children}
    </main>
  )
}

export default General
