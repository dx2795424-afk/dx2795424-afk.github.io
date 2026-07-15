<template>
  <div class="start-screen scene-frame">
    <div class="loading-container">
      <!-- Ink drop animation -->
      <div class="ink-animation">
        <div class="ink-drop"></div>
        <div class="ink-ripple" style="animation-delay: 0.3s;"></div>
        <div class="ink-ripple" style="animation-delay: 0.6s;"></div>
        
        <!-- Mountain silhouette -->
        <svg class="mountain-silhouette" viewBox="0 0 200 100" preserveAspectRatio="xMidYMax slice">
          <path d="M0,100 L40,60 L80,80 L120,40 L160,70 L200,50 L200,100 Z" fill="rgba(26,26,26,0.8)"/>
        </svg>
        
        <!-- Water/river -->
        <svg class="river" viewBox="0 0 200 60" preserveAspectRatio="xMidYMax slice">
          <path d="M0,0 Q50,20 100,10 T200,20 L200,60 L0,60 Z" fill="rgba(61,79,95,0.5)"/>
        </svg>
      </div>
      
      <!-- Loading text -->
      <div class="loading-text">
        <p class="loading-title">正在展开</p>
        <h1 class="loading-book-title">《东坡清风纪》</h1>
      </div>
      
      <!-- Ambient text -->
      <div class="ambient-text" :class="{ visible: showAmbient }">
        <p>风从眉山吹来。</p>
        <p>吹过京城，吹进牢门。</p>
        <p>又吹到黄州的一口小锅前。</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { gameState, setScene, startGame } from '../store/gameState.js'

const showAmbient = ref(false)

onMounted(() => {
  // Show ambient text after a delay
  setTimeout(() => {
    showAmbient.value = true
  }, 1500)

  // Auto advance to home after animation (guard: only if still at S00)
  setTimeout(() => {
    if (gameState.currentScene === 'S00') {
      setScene('S01')
      startGame()
    }
  }, 4500)
})
</script>

<style scoped>
.start-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
}

.loading-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.ink-animation {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ink-drop {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, #4a4a4a, #1a1a1a);
  animation: inkDrop 2s ease-out forwards;
  position: relative;
  z-index: 3;
}

.ink-ripple {
  position: absolute;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(232, 228, 223, 0.15);
  animation: ripple 2s ease-out forwards;
}

@keyframes inkDrop {
  0% { transform: scale(0); opacity: 0; }
  30% { transform: scale(1); opacity: 1; }
  100% { transform: scale(1); opacity: 0.7; }
}

@keyframes ripple {
  0% { width: 40px; height: 40px; opacity: 0.6; }
  100% { width: 200px; height: 200px; opacity: 0; }
}

.mountain-silhouette {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
  opacity: 0;
  animation: fadeIn 2s ease-out 0.5s forwards;
}

.river {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 30%;
  opacity: 0;
  animation: fadeIn 2s ease-out 0.8s forwards;
}

.loading-text {
  margin-top: 3rem;
  text-align: center;
  opacity: 0;
  animation: fadeInUp 1s ease-out 1s forwards;
}

.loading-title {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--old-gold);
  letter-spacing: 0.2em;
  margin-bottom: 0.5rem;
}

.loading-book-title {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  color: var(--moon-white);
  letter-spacing: 0.1em;
}

.ambient-text {
  position: absolute;
  bottom: 15%;
  left: 0;
  right: 0;
  text-align: center;
  opacity: 0;
  transform: translateY(20px);
  transition: all 1s ease-out;
}

.ambient-text.visible {
  opacity: 1;
  transform: translateY(0);
}

.ambient-text p {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  color: rgba(232, 228, 223, 0.6);
  line-height: 2;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
