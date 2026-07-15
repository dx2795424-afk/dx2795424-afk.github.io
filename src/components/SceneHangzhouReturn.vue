<template>
  <div class="scene-frame hangzhou-return">
    <div class="chapter-mark">第六幕 · 再入杭州</div>

    <div class="hangzhou-visual">
      <!-- V0.3: 惠州父老（杭州/惠州一带父老） -->
      <img
        class="dp-character is-visible"
        src="/assets/dongpo/characters/char_lingnan_elder.png"
        alt="惠州父老"
        draggable="false"
      />
      <div class="west-lake-bg">
        <div class="wl-light-1"></div>
        <div class="wl-light-2"></div>
      </div>
    </div>

    <div class="scene-content">
      <div class="narrator-text" :class="{ visible: showText[0] }">
        <p>从黄州到京城，再到杭州。</p>
      </div>
      <div class="narrator-text" :class="{ visible: showText[1] }">
        <p>杭州不是目的地，而是一次新的起点。</p>
      </div>
      <div class="narrator-text emphasis" :class="{ visible: showText[2] }">
        <p>当权力重新回到手中，清风账能否继续守住？</p>
      </div>
    </div>

    <button
      v-if="allShown"
      class="btn-next"
      data-testid="btn-next-S44"
      @click="handleNext"
    >
      西湖在等
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue'
import { setScene, addLogEntry } from '../store/gameState.js'

const showText = ref([false, false, false])
const allShown = ref(false)

onMounted(() => {
  addLogEntry({ type: 'scene', sceneId: 'S44', content: '【第六幕·再入杭州】清风试炼入口' })
  const delays = [800, 2000, 3400]
  delays.forEach((delay, i) => {
    setTimeout(() => {
      showText.value[i] = true
      if (i === delays.length - 1) {
        setTimeout(() => { allShown.value = true }, 600)
      }
    }, delay)
  })
})

function handleNext() {
  addLogEntry({ type: 'system', sceneId: 'S44', content: '进入西湖疏浚选择' })
  setScene('S45')
}
</script>

<style scoped>
.scene-frame {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.chapter-mark {
  position: fixed;
  top: 60px;
  left: 16px;
  z-index: 30;
  padding: 4px 14px;
  background: rgba(10, 20, 18, 0.85);
  border: 1px solid rgba(80, 140, 120, 0.25);
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  color: rgba(160, 200, 180, 0.55);
  letter-spacing: 0.15em;
  backdrop-filter: blur(4px);
}

.hangzhou-visual {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(160deg, #0a1814 0%, #0d2018 40%, #101a14 100%);
  overflow: hidden;
}

.west-lake-bg {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wl-light-1 {
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(80, 180, 140, 0.12) 0%, transparent 70%);
  top: 20%;
  left: 30%;
}

.wl-light-2 {
  position: absolute;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(120, 200, 160, 0.08) 0%, transparent 70%);
  bottom: 30%;
  right: 25%;
}

.scene-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
  padding: 0 40px;
  text-align: center;
  max-width: 600px;
}

.narrator-text {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.narrator-text.visible {
  opacity: 1;
  transform: translateY(0);
}

.narrator-text p {
  font-family: var(--font-serif);
  font-size: 1.2rem;
  color: rgba(180, 210, 195, 0.75);
  line-height: 2;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.narrator-text.emphasis p {
  color: rgba(160, 210, 180, 0.9);
  font-style: normal;
}

.btn-next {
  position: relative;
  z-index: 10;
  margin-top: 40px;
  padding: 12px 36px;
  background: transparent;
  border: 1px solid rgba(80, 160, 120, 0.4);
  border-radius: 4px;
  color: rgba(160, 210, 185, 0.75);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-next:hover {
  background: rgba(80, 160, 120, 0.1);
  border-color: rgba(80, 160, 120, 0.65);
  color: rgba(180, 230, 205, 0.9);
}
</style>
