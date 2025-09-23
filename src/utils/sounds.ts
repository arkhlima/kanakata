// lazy load howler.js
let Howl: typeof import('howler').Howl | null = null
let isHowlerLoaded = false

// sound cache to avoid creating multiple instances
const soundCache = new Map<string, InstanceType<typeof import('howler').Howl>>()

// load howler.js dynamically
const loadHowler = async (): Promise<typeof import('howler').Howl> => {
  if (isHowlerLoaded && Howl) {
    return Howl
  }

  try {
    const howlerModule = await import('howler')
    Howl = howlerModule.Howl
    isHowlerLoaded = true
    return Howl
  } catch (error) {
    console.warn('failed to load howler.js:', error)
    throw error
  }
}

// get cached sound instance
const getSound = async (src: string): Promise<InstanceType<typeof import('howler').Howl>> => {
  const cachedSound = soundCache.get(src)
  if (cachedSound) {
    return cachedSound
  }

  const HowlClass = await loadHowler()
  const sound = new HowlClass({
    src: [src],
    volume: 1,
    preload: true,
  })

  soundCache.set(src, sound)
  return sound
}

// play sound
export const playSound = async (src: string, volume?: number): Promise<void> => {
  try {
    const sound = await getSound(src)

    if (volume !== undefined) {
      sound.volume(volume)
    }

    sound.play()
  } catch (error) {
    console.warn('failed to play sound:', src, error)
  }
}

// preload sounds
export const preloadSounds = async (sources: string[]): Promise<void> => {
  try {
    await Promise.all(sources.map((src) => getSound(src)))
  } catch (error) {
    console.warn('failed to preload sounds:', error)
  }
}

// cleanup all cached sounds
export const cleanupSounds = (): void => {
  soundCache.forEach((sound) => {
    try {
      sound.unload()
    } catch (error) {
      console.warn('failed to unload sound:', error)
    }
  })
  soundCache.clear()
}
