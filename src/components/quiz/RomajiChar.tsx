import gsap from 'gsap'
import { onCleanup, onMount } from 'solid-js'

interface RomajiCharProps {
  children: string
}

const RomajiChar = (props: RomajiCharProps) => {
  let char: HTMLSpanElement
  let animation: gsap.core.Tween

  const ROMAJI_ANIMATION = {
    DURATION: 0.2,
    EASE: 'expo.in.out',
  } as const

  onMount(() => {
    // individual char animation
    animation = gsap.fromTo(
      char,
      { opacity: 0, scale: 0 },
      { opacity: 1, scale: 1, ease: ROMAJI_ANIMATION.EASE, duration: ROMAJI_ANIMATION.DURATION }
    )
  })

  onCleanup(() => {
    // kill animations and clear properties
    if (animation) {
      animation.kill()
      if (char) {
        gsap.set(char, { clearProps: 'all' })
      }
    }
  })

  return <span ref={(el) => (char = el)}>{props.children}</span>
}

export default RomajiChar
