<template>
  <div class="scene-frame danzhou-summary">
    <div class="chapter-mark">第七幕 · 儋州天涯</div>

    <div class="summary-visual">
      <div class="tianya-dark"></div>
      <div class="lamp-glow" :class="{ lit: hasLight }"></div>
    </div>

    <div class="scene-content">
      <div class="summary-title">儋州小结：天涯未必无路</div>

      <div class="summary-lines" :class="{ visible: showLines }">
        <!-- 余火传灯 -->
        <p v-if="hasLight" class="summary-line bright">
          余火传灯。
        </p>
        <p v-if="hasLight" class="summary-line bright">
          你在儋州教了书，留了字，救了人。
        </p>

        <!-- 天涯更冷 -->
        <p v-if="isCold" class="summary-line cold">
          天涯更冷了。
        </p>
        <p v-if="isCold" class="summary-line cold">
          你把自己关了起来，风还在外面。
        </p>

        <!-- 名声再起波澜 -->
        <p v-if="fameUsed" class="summary-line caution">
          名声账再起波澜。
        </p>

        <!-- Default -->
        <p v-if="!hasLight && !isCold" class="summary-line">
          儋州这一页，风仍在吹。
        </p>
        <p v-if="!hasLight && !isCold" class="summary-line">
          但火种已经在某处留下了。
        </p>
      </div>
    </div>

    <button
      class="btn-next"
      :class="{ visible: showButton }"
      data-testid="btn-next-S54"
      @click="handleNext"
    >
      查看判词
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { gameState, setScene, addLogEntry } from '../store/gameState.js'

const showLines = ref(false)
const showButton = ref(false)

const hasLight = computed(() =>
  gameState.flags.danzhou_teach === 'open_teach' &&
  gameState.flags.tangzuo === 'spark'
)

const isCold = computed(() =>
  gameState.flags.danzhou_teach === 'closed_door' ||
  gameState.flags.danzhou_life === 'resentment'
)

const fameUsed = computed(() =>
  gameState.flags.danzhou_teach === 'fame_suffering' ||
  gameState.flags.tangzuo === 'fame_use'
)

onMounted(() => {
  addLogEntry({ type: 'scene', sceneId: 'S54', content: '【第七幕·儋州小结】' })
  addLogEntry({
    type: 'system',
    sceneId: 'S54',
    content: `儋州小结：余火=${hasLight.value}, 天涯冷=${isCold.value}, 名声=${fameUsed.value}`
  })
  setTimeout(() => { showLines.value = true }, 800)
  setTimeout(() => { showButton.value = true }, 2000)
})

function handleNext() {
  addLogEntry({ type: 'system', sceneId: 'S54', content: '进入最终判词' })
  setScene('S60')
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

.summary-visual {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: linear-gradient(170deg, #08080e 0%, #0a0a12 50%, #0d0d18 100%);
  overflow: hidden;
}

.tianya-dark {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: linear-gradient(0deg, rgba(15, 20, 30, 0.7) 0%, transparent 100%);
}

.lamp-glow {
  position: absolute;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgba(220, 200, 160, 0.0);
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 2s ease;
}

.lamp-glow.lit {
  background: rgba(220, 200, 160, 0.7);
  box-shadow: 0 0 30px rgba(220, 200, 160, 0.4), 0 0 60px rgba(220, 200, 160, 0.15);
}

.scene-content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  padding: 0 32px;
  text-align: center;
  max-width: 600px;
}

.summary-title {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  color: rgba(170, 170, 210, 0.8);
  letter-spacing: 0.1em;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.summary-lines {
  display: flex;
  flex-direction: column;
  gap: 16px;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.summary-lines.visible {
  opacity: 1;
  transform: translateY(0);
}

.summary-line {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  color: rgba(180, 180, 210, 0.7);
  line-height: 1.8;
  margin: 0;
}

.summary-line.bright {
  color: rgba(210, 200, 160, 0.85);
}

.summary-line.cold {
  color: rgba(150, 160, 200, 0.65);
}

.summary-line.caution {
  color: rgba(200, 180, 140, 0.75);
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
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.5s ease, transform 0.5s ease, background 0.3s ease;
}

.btn-next.visible {
  opacity: 1;
  transform: translateY(0);
}

.btn-next:hover {
  background: rgba(100, 100, 150, 0.08);
  border-color: rgba(120, 120, 170, 0.55);
  color: rgba(190, 190, 230, 0.85);
}
</style>
