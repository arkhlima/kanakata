import { DEFAULT_INTERACTION_CLASS } from '~/constants/classes'
import { cn } from '~/utils/cn'

interface FooterProps {
  class?: string
}

const Header = (props: FooterProps) => {
  return (
    <footer
      class="col-span-12 flex justify-center"
      classList={props.class ? { [props.class]: true } : {}}
    >
      <a
        class={cn(
          'text-slate-700 text-sm underline decoration-blue-300 decoration-wavy',
          DEFAULT_INTERACTION_CLASS
        )}
        href="https://arkhlima.xyz"
        target="_blank"
        rel="noreferrer noopener"
      >
        @arkhlima
      </a>
    </footer>
  )
}

export default Header
