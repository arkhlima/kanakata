import gsap from 'gsap'
import { onCleanup, onMount } from 'solid-js'
import { cleanupAnimation } from '~/utils/animations'

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
    cleanupAnimation(animation, char)
  })

  return <span ref={(el) => (char = el)}>{props.children}</span>
}

export default RomajiChar
