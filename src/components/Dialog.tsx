import { createEffect, type JSX } from 'solid-js'

interface DialogProps {
  isVisible: () => boolean
  children?: JSX.Element | JSX.Element[]
}

const Dialog = (props: DialogProps) => {
  let dialog: HTMLDialogElement

  createEffect(() => {
    if (props.isVisible()) {
      dialog.showModal()
    } else {
      dialog.close()
    }
  })

  return (
    <dialog
      ref={(el) => (dialog = el)}
      class="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full max-w-xs transform rounded-xl border-2 border-slate-500 bg-slate-50 p-8 shadow-md backdrop:backdrop-blur-[1px] backdrop:transition-all backdrop:duration-100 backdrop:ease-[cubic-bezier(0.19,1,0.22,1)] focus-visible:outline-none"
    >
      {props.children}
    </dialog>
  )
}

export default Dialog
