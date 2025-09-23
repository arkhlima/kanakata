import { onCleanup } from 'solid-js'
import { SOUND_PATHS } from '~/constants/sounds'
import { cleanupSounds, playSound, preloadSounds } from '~/utils/sounds'

export type SoundType = 'correct' | 'incorrect'

export const useSound = () => {
  let hasPreloaded = false

  // preload sounds on first use
  const ensurePreloaded = async (): Promise<void> => {
    if (hasPreloaded) return

    try {
      await preloadSounds(Object.values(SOUND_PATHS))
      hasPreloaded = true
    } catch (error) {
      console.warn('failed to preload sounds:', error)
    }
  }

  // play specific sound type
  const play = async (soundType: SoundType, volume?: number): Promise<void> => {
    await ensurePreloaded()
    const soundPath = SOUND_PATHS[soundType]
    await playSound(soundPath, volume)
  }

  // cleanup on component unmount
  onCleanup(() => {
    cleanupSounds()
  })

  return { play }
}
