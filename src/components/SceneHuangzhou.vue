<template>
  <div class="scene-frame" @click="handleClick">
    <!-- 背景由 BackgroundScene(huangzhou) 全局提供 -->

    <!-- 章节标记 -->
    <div class="chapter-mark">第四幕 · 黄州坠落</div>

    <!-- 场景视觉：船只靠岸动画 -->
    <div class="shore-visual">
      <!-- V0.3: 渔翁立绘（黄州赤壁垂钓，左侧，与苏轼共存） -->
      <img
        class="dp-character dp-character--left is-visible"
        src="/assets/dongpo/characters/char_fisherman.png"
        alt="黄州渔翁"
        draggable="false"
      />
      <!-- 船只 -->
      <div class="boat" :class="{ docked: boatDocked }">
        <div class="boat-body"></div>
        <div class="boat-sail"></div>
      </div>

      <!-- 苏轼上岸立绘（黄州专属形象） -->
      <div class="su-figure" :class="{ visible: figureVisible }">
        <img
          src="/assets/dongpo/characters/char_sushi_huangzhou.png"
          alt="黄州苏轼"
          class="su-portrait"
          draggable="false"
        />
        <div class="su-figure-glow"></div>
      </div>
    </div>

    <!-- 对话框 -->
    <DialogueBox
      :visible="showDialogue"
      :text="currentText"
      speaker=""
      text-class="narration"
      @complete="onTextComplete"
      @advance="handleAdvance"
    />

    <!-- 继续按钮 -->
    <button
      v-if="showContinue"
      class="continue-btn"
      @click.stop="handleNext"
    >
      <span>翻到下一页</span>
      <span class="arrow">→</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { setScene } from '../store/gameState.js'
import DialogueBox from './DialogueBox.vue'

const boatDocked = ref(false)
const figureVisible = ref(false)
const showDialogue = ref(true)
const showContinue = ref(false)

const textIndex = ref(0)
const texts = [
  '黄州不是一个景点。',
  '至少此刻不是。',
  '这里是坠落之后的地面。',
  '名声还在身后，日子已经落到脚边。'
]

const currentText = computed(() => texts[textIndex.value] || '')

function handleClick() {
  if (!boatDocked.value) {
    boatDocked.value = true
    setTimeout(() => {
      figureVisible.value = true
    }, 800)
  }
}

function onTextComplete() {
  // 取消 600ms 延迟，玩家体验更流畅
  if (textIndex.value < texts.length - 1) {
    textIndex.value++
  } else {
    showDialogue.value = false
    showContinue.value = true
  }
}

function handleAdvance() {
  if (textIndex.value < texts.length - 1) {
    textIndex.value++
  } else {
    showDialogue.value = false
    showContinue.value = true
  }
}

function handleNext() {
  setScene('S35')
}
</script>

<style scoped>
.scene-frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
}

.chapter-mark {
  position: fixed;
  top: 60px;
  left: 16px;
  z-index: 30;
  padding: 4px 14px;
  background: rgba(13, 13, 18, 0.8);
  border: 1px solid rgba(184, 149, 108, 0.25);
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  color: rgba(200, 190, 170, 0.55);
  letter-spacing: 0.15em;
  backdrop-filter: blur(4px);
}

/* 岸景视觉 */
.shore-visual {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 45%;
  z-index: 10;
  pointer-events: none;
}

.boat {
  position: absolute;
  top: 20%;
  left: 15%;
  transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.boat.docked {
  left: 30%;
  top: 35%;
}

.boat-body {
  width: 70px;
  height: 28px;
  background: linear-gradient(135deg, #4a3a28 0%, #3a2a1a 100%);
  border-radius: 0 0 50% 50%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.boat-sail {
  position: absolute;
  bottom: 22px;
  left: 22px;
  width: 0;
  height: 0;
  border-left: 24px solid transparent;
  border-bottom: 45px solid rgba(200, 210, 220, 0.5);
}

/* 苏轼黄州立绘 — 矩形宣纸卡挂画 */
.su-figure {
  position: absolute;
  right: 8%;
  bottom: 12%;
  z-index: 5;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 1.2s ease, transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;
  padding: 18px 16px 22px;
  background:
    linear-gradient(135deg, rgba(232,216,180,0.94) 0%, rgba(216,192,148,0.9) 50%, rgba(184,148,96,0.85) 100%);
  border: 2px solid rgba(184,149,108,0.55);
  border-radius: 8px;
  box-shadow:
    0 14px 36px rgba(0,0,0,0.55),
    0 0 28px rgba(140,170,200,0.15),
    inset 0 0 40px rgba(184,148,96,0.15);
}
.su-figure.visible { opacity: 1; transform: translateY(0); }
.su-figure::before {
  content: '';
  position: absolute;
  inset: 5px;
  border: 1px solid rgba(180,200,220,0.35);
  border-radius: 4px;
  pointer-events: none;
}
.su-portrait {
  width: auto;
  height: 320px;
  max-width: 55vw;
  object-fit: contain;
  /* 透明 PNG 区域透出米色宣纸底 */
  background-color: #e8d8b8;
  filter: drop-shadow(2px 4px 8px rgba(60,40,20,0.5));
  user-select: none;
  position: relative;
  z-index: 1;
  border-radius: 4px;
}
.su-figure-glow {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 240px;
  height: 30px;
  background: radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%);
  filter: blur(8px);
  z-index: -2;
}

/* 继续按钮 */
.continue-btn {
  position: fixed;
  bottom: 24px;
  right: 20px;
  z-index: 50;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: rgba(20, 18, 14, 0.7);
  border: 1px solid rgba(184, 149, 108, 0.35);
  border-radius: 20px;
  color: rgba(200, 190, 170, 0.75);
  font-family: var(--font-sans);
  font-size: 0.82rem;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s;
  animation: co-pulse 2s ease-in-out infinite;
}
.continue-btn:hover {
  background: rgba(30, 28, 24, 0.85);
  border-color: rgba(184, 149, 108, 0.55);
}
.arrow { font-size: 0.8rem; }

@keyframes co-pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
</style>
