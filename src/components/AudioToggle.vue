<template>
  <button
    class="audio-toggle"
    data-testid="btn-audio-toggle"
    @click="toggleAudio"
    :aria-pressed="gameState.audioEnabled"
    :title="gameState.audioEnabled ? '关闭配乐' : '开启配乐'"
  >
    <span class="audio-icon" aria-hidden="true">{{ gameState.audioEnabled ? '♪' : '×' }}</span>
    <span class="sr-only">{{ gameState.audioEnabled ? '关闭配乐' : '开启配乐' }}</span>
  </button>
</template>

<script setup>
import { gameState, toggleAudio } from '../store/gameState.js'
</script>

<style scoped>
.audio-toggle {
  position: fixed;
  top: max(1rem, env(safe-area-inset-top, 0px));
  right: 70px;
  width: 42px;
  height: 42px;
  background: rgba(18, 16, 12, 0.76);
  border: 1px solid rgba(184, 149, 108, 0.42);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  color: rgba(238, 223, 188, 0.92);
  z-index: 120;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.audio-toggle:hover {
  background: rgba(61, 79, 95, 0.8);
  transform: scale(1.05);
}

.audio-icon {
  line-height: 1;
  font-family: Georgia, serif;
  font-weight: 700;
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 700px) {
  .audio-toggle {
    top: calc(max(8px, env(safe-area-inset-top, 0px)) + 8px);
    right: 72px;
    width: 38px;
    height: 38px;
  }
}
</style>
