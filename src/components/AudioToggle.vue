<template>
  <button class="audio-toggle" data-testid="btn-audio-toggle" @click="toggleAudio" :title="gameState.audioEnabled ? '关闭声音' : '开启声音'">
    <span v-if="gameState.audioEnabled">🔊</span>
    <span v-else>🔇</span>
  </button>
</template>

<script setup>
import { gameState, toggleAudio } from '../store/gameState.js'
</script>

<style scoped>
.audio-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  background: rgba(26, 26, 26, 0.8);
  border: 1px solid rgba(232, 228, 223, 0.2);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  z-index: 100;
  transition: all 0.3s ease;
}

.audio-toggle:hover {
  background: rgba(61, 79, 95, 0.8);
  transform: scale(1.05);
}
</style>
