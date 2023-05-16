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
        class="text-slate-700 underline decoration-blue-300 decoration-wavy"
        href="https://arkhlima.xyz"
      >
        @arkhlima
      </a>
    </footer>
  )
}

export default Header
