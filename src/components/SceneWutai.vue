<template>
  <div class="scene-frame" @click="handleFrameClick">

    <!-- 章节标记 -->
    <div class="chapter-mark">第三幕 · 乌台风暴</div>

    <!-- 场景视觉：牢门+烛火 -->
    <div class="wutai-visual" aria-hidden="true">
      <!-- 牢门竖条 -->
      <div class="cell-bars">
        <div v-for="i in 5" :key="i" class="cell-bar"></div>
      </div>

      <!-- 烛火 -->
      <div class="candle" :class="{ lit: candleLit }">
        <div class="candle-body"></div>
        <div class="candle-flame" v-if="candleLit"></div>
      </div>

      <!-- 脚印 -->
      <div class="footsteps" :class="{ visible: showFootsteps }">
        <div v-for="i in 3" :key="i" class="footstep"></div>
      </div>

      <!-- 苏轼剪影（牢笼中） -->
      <CharacterSilhouette
        character="sushi-adult"
        position="center"
        :opacity="0.4"
        :size="0.8"
      />
    </div>

    <!-- 戏剧旁白对话框（点击不可交互，防止遮挡） -->
    <DialogueBox
      :visible="showDialogue"
      :text="currentText"
      speaker=""
      text-class="narration"
      :pause-sentences="['远处，一封信正在赶来。']"
      class="non-interactive"
      @complete="onTextComplete"
      @advance="handleAdvance"
    />

    <!-- 信封区域 -->
    <Transition name="envelope-rise">
      <div v-if="showEnvelope" class="envelope-area">

        <!-- 信封卡片（真实 button） -->
        <button
          v-if="!letterOpened"
          type="button"
          class="envelope-card"
          :class="{ hovering: envelopeHover }"
          @click="openEnvelope"
          @mouseenter="envelopeHover = true"
          @mouseleave="envelopeHover = false"
          aria-label="点击打开子由来信"
        >
          <div class="envelope-flap">
            <span class="envelope-sender">子由</span>
          </div>
          <p class="envelope-hint">点击打开</p>
        </button>

        <!-- 信件展开弹层 -->
        <Transition name="letter-modal-fade">
          <div v-if="letterOpened" class="letter-modal" role="dialog" aria-modal="true">
            <div class="letter-paper">
              <div class="letter-kicker">子由来信</div>
              <div class="letter-divider"></div>
              <p class="letter-body">
                兄长：<br>
                闻君有难，心急如焚。无论风暴多大，为弟愿与你共同承担。
                有些重量，本就不该一个人扛。
              </p>
              <p class="letter-ps">
                ——子由 字
              </p>
              <div class="letter-divider"></div>

              <!-- 接住这封信按钮 -->
              <button
                type="button"
                class="letter-action-btn"
                @click="handleNext"
              >
                接住这封信
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
            </div>
          </div>
        </Transition>

      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { setScene } from '../store/gameState.js'
import CharacterSilhouette from './CharacterSilhouette.vue'
import DialogueBox from './DialogueBox.vue'

// 烛火
const candleLit = ref(false)
const showEnvelope = ref(false)
const showFootsteps = ref(false)
const envelopeHover = ref(false)

// 信件
const letterOpened = ref(false)
const showDialogue = ref(true)

const textIndex = ref(0)
const texts = [
  '风暴终于落下。',
  '才华、名声、文字，忽然都成了证据。',
  '远处，一封信正在赶来。'
]

const currentText = computed(() => texts[textIndex.value] || '')

// 点击场景 → 点蜡烛 + 出现信封
function handleFrameClick() {
  if (!candleLit.value && !showEnvelope.value) {
    candleLit.value = true
    showFootsteps.value = true
    setTimeout(() => {
      showEnvelope.value = true
    }, 1500)
  }
}

// 对话推进
function handleAdvance() {
  if (textIndex.value < texts.length - 1) {
    textIndex.value++
  }
}

function onTextComplete() {
  setTimeout(() => {
    if (textIndex.value < texts.length - 1) {
      textIndex.value++
    }
  }, 800)
}

// 点击信封 → 展开信件内容
function openEnvelope() {
  letterOpened.value = true
  showDialogue.value = false
}

// 点击"接住这封信" → 进入子由救援选择页
function handleNext() {
  setScene('S24')
}
</script>

<style scoped>
/* ── 根框架 ── */
.scene-frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
}

/* ── 章节标记 ── */
.chapter-mark {
  position: fixed;
  top: 60px;
  left: 16px;
  z-index: 30;
  padding: 4px 14px;
  background: rgba(13, 13, 18, 0.85);
  border: 1px solid rgba(139, 58, 58, 0.3);
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  color: rgba(200, 160, 160, 0.7);
  letter-spacing: 0.15em;
  backdrop-filter: blur(4px);
}

/* ── 视觉层（不拦截点击） ── */
.wutai-visual {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.cell-bars {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: space-evenly;
  padding: 0 40px;
}

.cell-bar {
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg,
    rgba(80, 70, 60, 0.6) 0%,
    rgba(40, 35, 30, 0.8) 50%,
    rgba(20, 18, 15, 0.9) 100%
  );
  box-shadow: 0 0 10px rgba(0,0,0,0.5);
}

.candle {
  position: fixed;
  bottom: 30%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 8;
}

.candle-body {
  width: 16px;
  height: 36px;
  background: linear-gradient(135deg, var(--xuan-paper) 0%, #d8d0c0 100%);
  border-radius: 2px;
  margin: 0 auto;
}

.candle-flame {
  position: absolute;
  top: -16px;
  left: 50%;
  transform: translateX(-50%);
  width: 10px;
  height: 16px;
  background: radial-gradient(ellipse at bottom, #ffcc44, #ff8800);
  border-radius: 50% 50% 50% 50% / 70% 70% 30% 30%;
  animation: flame-flicker 0.25s ease-in-out infinite alternate;
  box-shadow: 0 0 16px rgba(255, 150, 0, 0.7), 0 0 32px rgba(255, 100, 0, 0.3);
}

@keyframes flame-flicker {
  0% { transform: translateX(-50%) scaleY(1) scaleX(1); }
  100% { transform: translateX(-50%) scaleY(1.15) scaleX(0.9); }
}

.footsteps {
  position: fixed;
  bottom: 15%;
  right: 25%;
  display: flex;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.6s ease;
  z-index: 8;
}
.footsteps.visible { opacity: 0.5; }
.footstep {
  width: 10px;
  height: 18px;
  background: rgba(200, 180, 150, 0.4);
  border-radius: 40% 40% 0 0;
}

/* ── 对话框（pointer-events: none，不遮挡信封） ── */
:deep(.dialogue-box) {
  pointer-events: none;
}
:deep(.dialogue-container) {
  pointer-events: none;
}
:deep(.narration-box) {
  pointer-events: none;
}

/* ── 信封区域 ── */
.envelope-area {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 35;
  pointer-events: none; /* 由子元素自己开启 pointer-events */
}

/* ── 信封卡片（真实 button） ── */
.envelope-card {
  pointer-events: auto;
  position: relative;
  z-index: 36;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 26px 36px 22px;
  background: linear-gradient(180deg, rgba(240,228,202,0.99) 0%, rgba(218,199,158,0.97) 100%);
  border: 1px solid rgba(116, 91, 53, 0.5);
  border-radius: 14px;
  box-shadow: 0 20px 50px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.2);
  cursor: pointer;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: center;
}

.envelope-card:hover,
.envelope-card.hovering {
  transform: scale(1.06) translateY(-3px);
  box-shadow: 0 26px 60px rgba(143,47,37,0.28), 0 6px 16px rgba(0,0,0,0.25);
  border-color: rgba(143, 47, 37, 0.7);
}

.envelope-card:active {
  transform: scale(0.98);
  transition-duration: 0.1s;
}

.envelope-flap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 18px;
  border: 1.5px solid rgba(143, 47, 37, 0.5);
  border-radius: 6px;
  background: rgba(143, 47, 37, 0.06);
}

.envelope-sender {
  font-family: "Noto Serif SC", serif;
  font-size: 1.2rem;
  color: #2a241c;
  letter-spacing: 0.15em;
  font-weight: 600;
}

.envelope-hint {
  font-family: "Noto Serif SC", serif;
  font-size: 0.95rem;
  color: rgba(84, 67, 44, 0.65);
  letter-spacing: 0.15em;
  margin: 0;
}

/* ── 信件展开弹层 ── */
.letter-modal {
  pointer-events: auto;
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px 18px;
  background: rgba(8, 10, 16, 0.72);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.letter-paper {
  width: 100%;
  max-width: 400px;
  background:
    linear-gradient(180deg, rgba(242,234,213,0.99) 0%, rgba(218,199,158,0.97) 100%);
  border: 1px solid rgba(116, 91, 53, 0.45);
  border-radius: 16px;
  padding: 28px 26px 24px;
  box-shadow: 0 24px 64px rgba(0,0,0,0.5), 0 4px 16px rgba(0,0,0,0.15);
}

.letter-kicker {
  font-family: "Noto Serif SC", serif;
  font-size: 0.95rem;
  color: #8F2F25;
  letter-spacing: 0.2em;
  margin-bottom: 10px;
}

.letter-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(116,91,53,0.4), transparent);
  margin: 14px 0;
}

.letter-body {
  font-family: "Noto Serif SC", serif;
  font-size: 0.97rem;
  color: #2a241c;
  line-height: 1.9;
  margin: 0 0 8px;
}

.letter-ps {
  font-family: "Noto Serif SC", serif;
  font-size: 0.95rem;
  color: rgba(84, 67, 44, 0.75);
  line-height: 1.6;
  margin: 0;
  text-align: right;
  font-style: italic;
}

/* 接住这封信按钮 */
.letter-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  margin-top: 18px;
  padding: 13px 20px;
  background: linear-gradient(135deg, #8F2F25 0%, #6b2020 100%);
  border: none;
  border-radius: 12px;
  font-family: "Noto Serif SC", serif;
  font-size: 1rem;
  color: #f5f0e6;
  letter-spacing: 0.08em;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(143,47,37,0.4);
  transition: all 0.2s;
}

.letter-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(143,47,37,0.5);
  background: linear-gradient(135deg, #a3362a 0%, #7a2424 100%);
}

.letter-action-btn:active {
  transform: translateY(0);
}

/* ── 过渡动画 ── */
.envelope-rise-enter-active {
  transition: all 0.65s cubic-bezier(0.16, 1, 0.3, 1);
}
.envelope-rise-enter-from {
  opacity: 0;
  transform: translate(-50%, -30%);
}
.envelope-rise-enter-to {
  opacity: 1;
  transform: translate(-50%, -50%);
}
.envelope-rise-leave-active {
  transition: opacity 0.3s ease;
}
.envelope-rise-leave-to {
  opacity: 0;
}

.letter-modal-fade-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.letter-modal-fade-enter-from {
  opacity: 0;
  transform: scale(0.92) translateY(12px);
}
.letter-modal-fade-leave-active {
  transition: all 0.25s ease;
}
.letter-modal-fade-leave-to {
  opacity: 0;
}
</style>
