import { createEffect, JSX } from 'solid-js'

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
      class="w-full max-w-xs rounded-xl border-2 border-slate-500 bg-slate-50 p-8 shadow-lg backdrop:backdrop-blur-[1px] backdrop:transition-all backdrop:duration-75 backdrop:ease-[cubic-bezier(0.19,1,0.22,1)] focus-visible:outline-none"
    >
      {props.children}
    </dialog>
  )
}

export default Dialog
