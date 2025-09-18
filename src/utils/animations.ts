import gsap from 'gsap'

export const cleanupAnimation = (
  animation: gsap.core.Timeline | gsap.core.Tween | null,
  element?: HTMLElement | null
) => {
  if (animation) {
    animation.kill()
    if (element) {
      gsap.set(element, { clearProps: 'all' })
    }
  }
}

export const cleanupAnimations = (animations: gsap.core.Timeline[], selector?: string) => {
  animations.forEach((animation) => {
    animation.kill()
  })

  if (selector) {
    const elements = document.querySelectorAll(selector)
    elements.forEach((element) => {
      gsap.set(element, { clearProps: 'all' })
    })
  }
}
