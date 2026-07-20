import { watch } from 'vue'

const TRACKS = {
  home: '/assets/dongpo/audio/dongpo_final_dawn.mp3',
  intro: '/assets/dongpo/audio/dongpo_final_dawn.mp3',
  meishan: '/assets/dongpo/audio/dongpo_final_dawn.mp3',
  capital: '/assets/dongpo/audio/dongpo_mizhou_intro.mp3',
  mizhou: '/assets/dongpo/audio/dongpo_mizhou_intro.mp3',
  wutai: '/assets/dongpo/audio/dongpo_wutai_arrest.mp3',
  huangzhou: '/assets/dongpo/audio/dongpo_huangzhou_farm.mp3',
  chengtian: '/assets/dongpo/audio/dongpo_chengtian_temple.mp3',
  hangzhou: '/assets/dongpo/audio/dongpo_west_lake_spring.mp3',
  danzhou: '/assets/dongpo/audio/dongpo_danzhou_exile.mp3',
  result: '/assets/dongpo/audio/dongpo_end_credits.mp3'
}

const BASE_VOLUME = 0.26
const FADE_STEP_MS = 60
const FADE_STEP = 0.035

export function useSceneAudio(gameState, atmosphereRef) {
  let audio = null
  let activeSrc = ''
  let unlocked = false
  let fadeTimer = null

  function getTrack() {
    return TRACKS[atmosphereRef.value] || TRACKS.home
  }

  function stopFade() {
    if (fadeTimer) {
      clearInterval(fadeTimer)
      fadeTimer = null
    }
  }

  function fadeTo(targetVolume, onDone) {
    if (!audio) return
    stopFade()
    fadeTimer = setInterval(() => {
      if (!audio) return stopFade()
      const direction = audio.volume < targetVolume ? FADE_STEP : -FADE_STEP
      const next = audio.volume + direction
      const reached = Math.abs(next - targetVolume) <= FADE_STEP
      audio.volume = reached ? targetVolume : Math.max(0, Math.min(BASE_VOLUME, next))
      if (reached) {
        stopFade()
        if (onDone) onDone()
      }
    }, FADE_STEP_MS)
  }

  async function playCurrentTrack({ forceRestart = false } = {}) {
    if (!unlocked || !gameState.audioEnabled || !gameState.gameStarted) return
    const nextSrc = getTrack()
    if (!nextSrc) return

    if (!audio) {
      audio = new Audio(nextSrc)
      audio.loop = true
      audio.preload = 'auto'
      audio.volume = 0
      activeSrc = nextSrc
    } else if (activeSrc !== nextSrc || forceRestart) {
      const oldAudio = audio
      fadeTo(0, () => {
        oldAudio.pause()
        oldAudio.currentTime = 0
        audio = new Audio(nextSrc)
        audio.loop = true
        audio.preload = 'auto'
        audio.volume = 0
        activeSrc = nextSrc
        audio.play().then(() => fadeTo(BASE_VOLUME)).catch(() => {})
      })
      return
    }

    try {
      await audio.play()
      fadeTo(BASE_VOLUME)
    } catch (e) {
      // Mobile browsers can still reject until the first trusted gesture.
    }
  }

  function pauseAudio() {
    if (!audio) return
    fadeTo(0, () => audio?.pause())
  }

  function unlock() {
    unlocked = true
    playCurrentTrack()
  }

  window.addEventListener('pointerdown', unlock, { once: true, passive: true })
  window.addEventListener('keydown', unlock, { once: true })
  window.addEventListener('touchstart', unlock, { once: true, passive: true })

  watch(
    () => [gameState.audioEnabled, gameState.gameStarted, atmosphereRef.value],
    ([enabled, started]) => {
      if (enabled && started) playCurrentTrack()
      else pauseAudio()
    },
    { immediate: true }
  )
}
