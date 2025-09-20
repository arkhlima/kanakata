import type { JSX } from 'solid-js'

interface GeneralProps {
  children: JSX.Element
}

const General = (props: GeneralProps) => {
  return (
    <>
      <a
        href="#main-content"
        class="sr-only lowercase focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded focus:bg-slate-700 focus:px-4 focus:py-2 focus:text-slate-50"
      >
        Skip to main content
      </a>
      <main
        id="main-content"
        class="relative mx-auto grid min-h-screen max-w-3xl grid-cols-12 grid-rows-[auto_1fr_auto] gap-y-16 overflow-x-hidden px-4 pt-16 pb-20 md:px-8"
      >
        {props.children}
      </main>
    </>
  )
}

export default General
