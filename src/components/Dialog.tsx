import { createEffect, type JSX, onCleanup } from 'solid-js'

interface DialogProps {
  isVisible: () => boolean
  children?: JSX.Element | JSX.Element[]
}

const Dialog = (props: DialogProps) => {
  let dialog: HTMLDialogElement
  let previousActiveElement: HTMLElement | null = null

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      return
    }

    if (event.key === 'Tab') {
      const focusableElements = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      if (event.shiftKey) {
        if (document.activeElement === firstElement) {
          event.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          event.preventDefault()
          firstElement?.focus()
        }
      }
    }
  }

  createEffect(() => {
    if (props.isVisible()) {
      previousActiveElement = document.activeElement as HTMLElement
      dialog.showModal()

      const firstFocusable = dialog.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement
      firstFocusable?.focus()

      dialog.addEventListener('keydown', handleKeyDown)
    } else {
      dialog.close()
      previousActiveElement?.focus()
      dialog.removeEventListener('keydown', handleKeyDown)
    }
  })

  onCleanup(() => {
    dialog?.removeEventListener('keydown', handleKeyDown)
  })

  return (
    <dialog
      ref={(el) => (dialog = el)}
      aria-modal="true"
      class="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 w-full max-w-xs transform rounded-xl border-2 border-slate-300 bg-slate-50 text-slate-700 shadow-md backdrop:backdrop-blur-[1px] backdrop:transition-all backdrop:duration-100 backdrop:ease-[cubic-bezier(0.19,1,0.22,1)] focus-visible:outline-none"
    >
      {props.children}
    </dialog>
  )
}

export default Dialog
