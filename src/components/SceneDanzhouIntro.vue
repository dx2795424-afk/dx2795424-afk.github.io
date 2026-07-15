<template>
  <div class="scene-frame danzhou-intro">
    <div class="chapter-mark">第七幕 · 儋州天涯</div>

    <div class="danzhou-visual">
      <!-- V0.3: 儋州书生（贬谪儋州遇当地文人） -->
      <img
        class="dp-character dp-character--left is-visible"
        src="/assets/dongpo/characters/char_danzhou_scholar.png"
        alt="儋州书生"
        draggable="false"
      />
      <div class="ocean-bg"></div>
      <div class="solitary-light"></div>
    </div>

    <div class="scene-content">
      <div class="narrator-text" :class="{ visible: showText[0] }">
        <p>海南岛，儋州。</p>
      </div>
      <div class="narrator-text" :class="{ visible: showText[1] }">
        <p>天涯海角，几乎失去了一切。</p>
      </div>
      <div class="narrator-text" :class="{ visible: showText[2] }">
        <p>没有权力，没有官署，只有日升月落。</p>
      </div>
      <div class="narrator-text emphasis" :class="{ visible: showText[3] }">
        <p>没有权力之后，还能留下什么？</p>
      </div>
    </div>

    <button
      v-if="allShown"
      class="btn-next"
      data-testid="btn-next-S50"
      @click="handleNext"
    >
      还有人来问学
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { setScene, addLogEntry } from '../store/gameState.js'

const showText = ref([false, false, false, false])
const allShown = ref(false)

onMounted(() => {
  addLogEntry({ type: 'scene', sceneId: 'S50', content: '【第七幕·儋州天涯】余火传灯入口' })
  const delays = [800, 2000, 3200, 4400]
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
  addLogEntry({ type: 'system', sceneId: 'S50', content: '进入讲学选择' })
  setScene('S51')
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
  background: rgba(10, 10, 18, 0.85);
  border: 1px solid rgba(80, 80, 120, 0.2);
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  color: rgba(150, 150, 190, 0.5);
  letter-spacing: 0.15em;
  backdrop-filter: blur(4px);
}

.danzhou-visual {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(170deg, #08080e 0%, #0a0a12 50%, #0d0d18 100%);
  overflow: hidden;
}

.ocean-bg {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 35%;
  background: linear-gradient(0deg, rgba(20, 30, 50, 0.6) 0%, transparent 100%);
}

.solitary-light {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(200, 200, 240, 0.6);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px rgba(200, 200, 240, 0.3), 0 0 40px rgba(200, 200, 240, 0.1);
}

.scene-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
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
  color: rgba(180, 180, 210, 0.7);
  line-height: 2;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.narrator-text.emphasis p {
  color: rgba(190, 190, 220, 0.9);
}

.btn-next {
  position: relative;
  z-index: 10;
  margin-top: 40px;
  padding: 12px 36px;
  background: transparent;
  border: 1px solid rgba(100, 100, 150, 0.35);
  border-radius: 4px;
  color: rgba(160, 160, 200, 0.7);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-next:hover {
  background: rgba(100, 100, 150, 0.08);
  border-color: rgba(120, 120, 170, 0.55);
  color: rgba(190, 190, 230, 0.85);
}
</style>
