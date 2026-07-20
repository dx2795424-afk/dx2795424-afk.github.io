<template>
  <div class="scene-frame" :class="{ 'account-dirty': isDirty }">
    <!-- 糊涂账预兆遮罩 -->
    <div v-if="isDirty" class="dirty-overlay">
      <div class="dirty-edge dirty-edge-top"></div>
      <div class="dirty-edge dirty-edge-bottom"></div>
      <div class="dirty-edge dirty-edge-left"></div>
      <div class="dirty-edge dirty-edge-right"></div>
      <div class="dirty-text">
        <p>账页合上时，边角仍有一块墨色没有干。</p>
      </div>
    </div>

    <!-- 章节标记 -->
    <div class="chapter-mark">第三�?· 密州小结</div>

    <!-- V0.3: 船夫（贬谪坐船，乌台之后） -->
    <img
      class="dp-character is-visible"
      src="/assets/dongpo/characters/char_boatman_cutout.png"
      alt="船夫"
      draggable="false"
    />

    <!-- 场景视觉 -->
    <div class="wutai-bridge-visual">
      <!-- 牢狱通道 -->
      <div class="prison-passage">
        <div class="passage-wall"></div>
        <div class="passage-light"></div>
      </div>
    </div>

    <!-- 核心文字 -->
    <div class="scene-content">
      <div class="narrator-text" :class="{ visible: showText[0] }">
        <p>密州的蝗灾与旱情，暂时告一段落。</p>
      </div>
      <div class="narrator-text" :class="{ visible: showText[1] }">
        <p>然而，京城那边的文字风暴，正在悄然酝酿。</p>
      </div>
      <div class="narrator-text dark" :class="{ visible: showText[2] }">
        <p>历史没有给他喘息的机会。</p>
        <p>乌台诗案，是他即将面对的命运。</p>
      </div>
    </div>

    <!-- 继续按钮 -->
    <button
      v-if="allShown"
      class="btn-next"
      data-testid="btn-next-S30"
      @click="handleNext"
    >
      风暴将至
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import { setScene, addLogEntry, gameState } from '../store/gameState.js'

const openChapterTransition = inject('openChapterTransition', null)

const showText = ref([false, false, false])
const allShown = ref(false)
const isDirty = computed(() => gameState.account_dirty === true)

onMounted(() => {
  addLogEntry({ type: 'scene', sceneId: 'S30', content: '【第四幕·乌台风暴】乌台入口场景：风暴将至' })
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
  addLogEntry({ type: 'system', sceneId: 'S30', content: '乌台风暴开始，乌台诗案正式展开' })
  // Trigger chapter transition (already showing 乌台 from atmosphere)
  if (openChapterTransition) {
    openChapterTransition('wutai', 'huangzhou', 'S34')
  } else {
    setScene('S34')
  }
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
  background: rgba(13, 13, 18, 0.8);
  border: 1px solid rgba(80, 50, 50, 0.3);
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  color: rgba(200, 160, 150, 0.5);
  letter-spacing: 0.15em;
  backdrop-filter: blur(4px);
}

.wutai-bridge-visual {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: #08080c;
}

.prison-passage {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.passage-wall {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg,
    #0a0808 0%,
    #12100e 40%,
    #0c0a08 100%
  );
}

.passage-light {
  width: 2px;
  height: 60%;
  background: linear-gradient(180deg,
    rgba(180, 60, 40, 0.0) 0%,
    rgba(180, 60, 40, 0.15) 50%,
    rgba(180, 60, 40, 0.0) 100%
  );
  box-shadow: 0 0 20px rgba(180, 60, 40, 0.08);
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
  color: rgba(200, 185, 170, 0.75);
  line-height: 2;
  margin: 0;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}

.narrator-text.dark p {
  color: rgba(180, 150, 140, 0.5);
}

.btn-next {
  position: relative;
  z-index: 10;
  margin-top: 40px;
  padding: 12px 36px;
  background: transparent;
  border: 1px solid rgba(180, 60, 40, 0.4);
  border-radius: 4px;
  color: rgba(200, 170, 160, 0.7);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  letter-spacing: 0.2em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-next:hover {
  background: rgba(180, 60, 40, 0.1);
  border-color: rgba(180, 60, 40, 0.6);
  color: rgba(220, 190, 180, 0.85);
}

/* 糊涂账预兆 */
.dirty-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 50;
}

.dirty-edge-top,
.dirty-edge-bottom {
  position: absolute;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(to bottom, rgba(30, 20, 10, 0.5), transparent);
  animation: dirty-spread 2s ease-out;
}

.dirty-edge-top { top: 0; }
.dirty-edge-bottom {
  bottom: 0;
  background: linear-gradient(to top, rgba(30, 20, 10, 0.5), transparent);
}

.dirty-edge-left,
.dirty-edge-right {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  background: linear-gradient(to right, rgba(30, 20, 10, 0.4), transparent);
  animation: dirty-spread 2s ease-out;
}

.dirty-edge-left { left: 0; }
.dirty-edge-right {
  right: 0;
  background: linear-gradient(to left, rgba(30, 20, 10, 0.4), transparent);
}

.dirty-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  animation: dirty-text-appear 2s ease-out 0.5s both;
}

.dirty-text p {
  font-family: var(--font-serif);
  font-size: 0.95rem;            /* V1.1 字号规范：正文 ≥ 15px */
  color: rgba(160, 140, 110, 0.7);
  font-style: italic;
}

@keyframes dirty-spread {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes dirty-text-appear {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
</style>
