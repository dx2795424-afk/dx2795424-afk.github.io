<template>
  <div class="scene-frame">
    <!-- 全屏背景：密州干旱独立资产 -->
    <BackgroundScene theme="mizhou" />

    <!-- 章节标记 -->
    <div class="chapter-mark">第二�?· 密州治理</div>

    <!-- V0.3: 黄州太守立绘（密州太守苏轼，左侧） -->
    <img
      class="dp-character dp-character--left is-visible"
      src="/assets/dongpo/characters/char_prefect.png"
      alt="密州太守苏轼"
      draggable="false"
    />

    <!-- 场景视觉 -->
    <div class="mizhou-visual">
      <!-- 苏轼立绘 -->
      <div class="su-figure" :class="{ visible: figureVisible }" @click.stop="handleFigureClick">
        <img
          src="/assets/dongpo/characters/char_sushi_adult.png"
          alt="苏轼"
          class="su-portrait"
          draggable="false"
        />
        <div class="su-figure-glow"></div>
        <div v-if="showAnnotation" class="su-annotation">他看着枯田，没有先看自己的名声。</div>
      </div>

      <!-- 蝗虫飞行动画（前景氛围） -->
      <div class="locusts-layer">
        <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
          <g class="locust locust-1" opacity="0.25">
            <path d="M80 250 Q95 238 110 250 Q95 262 80 250" stroke="#3a2818" stroke-width="1.5" fill="none"/>
            <line x1="78" y1="248" x2="70" y2="244" stroke="#3a2818" stroke-width="1"/>
            <line x1="110" y1="250" x2="118" y2="246" stroke="#3a2818" stroke-width="1"/>
          </g>
          <g class="locust locust-2" opacity="0.2">
            <path d="M220 180 Q235 166 250 180 Q235 194 220 180" stroke="#3a2818" stroke-width="1.5" fill="none"/>
            <line x1="218" y1="178" x2="210" y2="174" stroke="#3a2818" stroke-width="1"/>
            <line x1="250" y1="180" x2="258" y2="176" stroke="#3a2818" stroke-width="1"/>
          </g>
          <g class="locust locust-3" opacity="0.18">
            <path d="M320 220 Q335 206 350 220 Q335 234 320 220" stroke="#3a2818" stroke-width="1.5" fill="none"/>
            <line x1="318" y1="218" x2="310" y2="214" stroke="#3a2818" stroke-width="1"/>
            <line x1="350" y1="220" x2="358" y2="216" stroke="#3a2818" stroke-width="1"/>
          </g>
          <g class="locust locust-4" opacity="0.15">
            <path d="M150 310 Q165 296 180 310 Q165 324 150 310" stroke="#3a2818" stroke-width="1.5" fill="none"/>
          </g>
        </svg>
      </div>

    <!-- 可点道具层 -->
    <div class="props-layer">
      <!-- 粮仓 -->
      <div class="prop-item prop-granary" :class="{ revealed: propRevealed.granary }" @click.stop="clickProp('granary')">
        <svg viewBox="0 0 80 100" width="80" height="100">
          <rect x="10" y="30" width="60" height="70" fill="#5a4a30" rx="2" opacity="0.6"/>
          <polygon points="5,30 40,5 75,30" fill="#4a3a20" opacity="0.6"/>
          <rect x="32" y="60" width="16" height="40" fill="#3a2a18" opacity="0.5"/>
          <text x="40" y="52" text-anchor="middle" font-size="8" fill="#8a7a60" opacity="0.6">仓</text>
        </svg>
        <div v-if="propRevealed.granary" class="prop-popup granary-popup">
          <p>仓门打开时，里面的米比奏章上的数字更轻。</p>
        </div>
      </div>

      <!-- 青苗账册 -->
      <div class="prop-item prop-book" :class="{ revealed: propRevealed.book }" @click.stop="clickProp('book')">
        <svg viewBox="0 0 50 65" width="50" height="65">
          <rect x="5" y="5" width="40" height="55" fill="#4a3a28" rx="2" opacity="0.5"/>
          <rect x="8" y="8" width="34" height="49" fill="#3a2a18" rx="1" opacity="0.4"/>
          <line x1="12" y1="20" x2="38" y2="20" stroke="#8a7a60" stroke-width="1" opacity="0.5"/>
          <line x1="12" y1="28" x2="38" y2="28" stroke="#8a7a60" stroke-width="1" opacity="0.5"/>
          <line x1="12" y1="36" x2="30" y2="36" stroke="#8a7a60" stroke-width="1" opacity="0.5"/>
          <text x="25" y="17" text-anchor="middle" font-size="6" fill="#8a7a60" opacity="0.6">青苗</text>
        </svg>
        <div v-if="propRevealed.book" class="prop-popup book-popup">
          <p>这一页写的是钱，压着的却是来年的苗。</p>
        </div>
      </div>

      <!-- 蝗虫（可点） -->
      <div class="prop-item prop-locust" :class="{ revealed: propRevealed.locust }" @click.stop="clickProp('locust')">
        <svg viewBox="0 0 50 35" width="50" height="35">
          <g class="locust-clickable" opacity="0.25">
            <path d="M10 18 Q20 10 30 18 Q20 26 10 18" stroke="#3a3020" stroke-width="1.5" fill="none"/>
            <line x1="8" y1="16" x2="2" y2="12" stroke="#3a3020" stroke-width="1"/>
            <line x1="30" y1="18" x2="36" y2="14" stroke="#3a3020" stroke-width="1"/>
          </g>
        </svg>
        <div v-if="propRevealed.locust" class="prop-popup locust-popup">
          <p>风一过，田里像被擦去了一层颜色。</p>
        </div>
      </div>
    </div>

    <!-- 风沙浮动动画 -->
    <div class="wind-sand-layer">
      <div class="sand-grain sand-1"></div>
      <div class="sand-grain sand-2"></div>
      <div class="sand-grain sand-3"></div>
    </div>

    <!-- 赈灾粮仓（静态背景） -->
    <div class="granary" :class="{ visible: showGranary }">
      <svg viewBox="0 0 80 100" width="80" height="100">
        <rect x="10" y="30" width="60" height="70" fill="#5a4a30" rx="2" opacity="0.5"/>
        <polygon points="5,30 40,5 75,30" fill="#4a3a20" opacity="0.5"/>
        <rect x="32" y="60" width="16" height="40" fill="#3a2a18" opacity="0.4"/>
        <text x="40" y="55" text-anchor="middle" font-size="8" fill="#8a7a60" opacity="0.5">仓</text>
      </svg>
    </div>
  </div>

  <!-- 道具层提示 -->
  <div v-if="showPropHint" class="prop-hint-bar">
    <p>可点击画面中的物件</p>
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
      data-testid="btn-next-S26"
    >
      <span>{{ nextText }}</span>
      <span class="arrow">→</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, inject, onMounted } from 'vue'
import { setScene, addLogEntry } from '../store/gameState.js'
import DialogueBox from './DialogueBox.vue'
import BackgroundScene from './BackgroundScene.vue'

const openChapterTransition = inject('openChapterTransition', null)

const textIndex = ref(0)
const showDialogue = ref(false)
const showContinue = ref(false)
const figureVisible = ref(false)
const showGranary = ref(false)
const showPropHint = ref(false)
const showAnnotation = ref(false)
const propRevealed = ref({ granary: false, book: false, locust: false })

const texts = [
  '这里是密州。',
  '蝗灾刚过，旱灾又来。',
  '粮仓空了，税还要收。',
  '他不只是一个诗人。',
  '密州的风，把账页吹得发皱。'
]

const currentText = computed(() => texts[textIndex.value] || '')
const nextText = computed(() => {
  // Next scene from scenes.json
  return '翻到下一页'
})

onMounted(() => {
  setTimeout(() => {
    showDialogue.value = true
    figureVisible.value = true
  }, 600)
  setTimeout(() => {
    showGranary.value = true
  }, 1200)
  // After dialogue, show prop hint
  setTimeout(() => {
    if (textIndex.value >= texts.length - 1) {
      showPropHint.value = true
    }
  }, 2000)
})

function onTextComplete() {
  setTimeout(() => {
    if (textIndex.value < texts.length - 1) {
      textIndex.value++
    } else {
      showDialogue.value = false
      showContinue.value = true
    }
  }, 600)
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
  addLogEntry({ type: 'scene_enter', sceneId: 'S26', content: '进入密州入境场景' })
  setScene('S27')
}

function handleFigureClick() {
  showAnnotation.value = !showAnnotation.value
  if (showAnnotation.value) {
    setTimeout(() => { showAnnotation.value = false }, 4000)
  }
}
function clickProp(prop) {
  propRevealed.value[prop] = true
  const captions = {
    granary: '【密州·粮仓】仓门打开时，里面的米比奏章上的数字更轻。',
    book: '【密州·青苗账册】这一页写的是钱，压着的却是来年的苗。',
    locust: '【密州·蝗虫】风一过，田里像被擦去了一层颜色。'
  }
  addLogEntry({ type: 'prop_click', sceneId: 'S26', content: captions[prop] })
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

/* 苏轼立绘 — 透明 PNG 自然融合密州场景 */
.su-figure {
  position: absolute;
  left: 54%;
  bottom: 190px;
  z-index: 5;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1s ease, transform 1s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: auto;
  padding: 0;
  background: transparent;
  border: none;
  box-shadow: none;
  cursor: pointer;
}
.su-figure.visible { opacity: 1; transform: translateY(0); }
.su-figure::before { display: none; }
.su-portrait {
  width: min(480px, 55vw);
  height: auto;
  max-width: none;
  object-fit: contain;
  background-color: transparent;
  border-radius: 0;
  filter: drop-shadow(2px 4px 8px rgba(60,40,20,0.5));
  user-select: none;
  position: relative;
  z-index: 1;
  mix-blend-mode: multiply;
  opacity: 0.88;
  transition: transform 0.3s ease, filter 0.3s ease;
}
.su-figure:hover .su-portrait {
  transform: scale(1.02);
  filter: drop-shadow(2px 4px 12px rgba(60,40,20,0.6));
}
.su-figure-glow {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 30px;
  background: radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%);
  filter: blur(8px);
  z-index: -2;
}

/* 角色点击批注 */
.su-annotation {
  position: absolute;
  bottom: -64px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(245, 235, 215, 0.95);
  border: 1px solid rgba(184, 149, 108, 0.5);
  border-radius: 8px;
  padding: 10px 16px;
  font-family: var(--font-serif, serif);
  font-size: 14px;
  color: #2a1f12;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  z-index: 6;
  pointer-events: none;
  animation: fadeInUp 0.4s ease;
}
.su-annotation::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 10px;
  height: 10px;
  background: rgba(245, 235, 215, 0.95);
  border-top: 1px solid rgba(184, 149, 108, 0.5);
  border-left: 1px solid rgba(184, 149, 108, 0.5);
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateX(-50%) translateY(8px); }
  to   { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* 对话框覆盖（密州场景专用） */
:deep(.dialogue-box) {
  bottom: 28px !important;
  max-height: 26vh;
  overflow-y: auto;
}
@keyframes dust-haze {
  0%, 100% { opacity: 0.5; transform: translateX(-50%) scaleX(0.9); }
  50% { opacity: 0.9; transform: translateX(-50%) scaleX(1.1); }
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

.mizhou-visual {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50%;
  z-index: 10;
  pointer-events: none;
}

.locusts-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60%;
}

.locusts-layer svg {
  width: 100%;
  height: 100%;
}

.locust {
  transform-origin: center;
}

.locust-1 { animation: locust-drift-1 6s ease-in-out infinite; }
.locust-2 { animation: locust-drift-2 8s ease-in-out infinite 1s; }
.locust-3 { animation: locust-drift-1 7s ease-in-out infinite 2s; }
.locust-4 { animation: locust-drift-2 9s ease-in-out infinite 0.5s; }

@keyframes locust-drift-1 {
  0%, 100% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(15px) translateY(-10px); }
}

@keyframes locust-drift-2 {
  0%, 100% { transform: translateX(0) translateY(0); }
  50% { transform: translateX(-12px) translateY(8px); }
}

.cracked-earth {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 35%;
  opacity: 0.7;
}

.cracked-earth svg {
  width: 100%;
  height: 100%;
}

.granary {
  position: absolute;
  right: 15%;
  bottom: 20%;
  opacity: 0;
  transition: opacity 1.5s ease;
}

.granary.visible {
  opacity: 1;
}

/* 可点道具层 */
.props-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 20;
}

.prop-item {
  position: absolute;
  cursor: pointer;
  pointer-events: auto;
  transition: opacity 0.3s;
}

.prop-granary {
  right: 12%;
  bottom: 18%;
  opacity: 0.5;
}
.prop-granary.revealed { opacity: 1; }

.prop-book {
  right: 45%;
  bottom: 28%;
  opacity: 0;
}
.prop-book.revealed { opacity: 0.8; }

.prop-locust {
  left: 25%;
  top: 35%;
  opacity: 0;
}
.prop-locust.revealed { opacity: 1; }

/* 道具弹出批注 */
.prop-popup {
  position: absolute;
  bottom: 110%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(18, 14, 10, 0.92);
  border: 1px solid rgba(184, 149, 108, 0.35);
  border-radius: 4px;
  padding: 8px 14px;
  max-width: 200px;
  pointer-events: none;
  animation: popup-rise 0.3s ease;
}

.granary-popup { left: -20px; }
.book-popup { left: -60px; }
.locust-popup { left: -50px; bottom: 110%; top: auto; }

.prop-popup p {
  font-family: var(--font-serif);
  font-size: 0.95rem;            /* V1.1 字号规范：正文 ≥ 15px */
  color: rgba(212, 200, 168, 0.9);
  line-height: 1.6;
  margin: 0;
}

@keyframes popup-rise {
  from { opacity: 0; transform: translateX(-50%) translateY(6px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* 风沙浮动 */
.wind-sand-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 5;
}

.sand-grain {
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(160, 140, 100, 0.3);
  border-radius: 50%;
}

.sand-1 { top: 30%; left: -5%; animation: sand-drift 8s linear infinite; }
.sand-2 { top: 55%; left: -5%; animation: sand-drift 10s linear infinite 2s; width: 3px; height: 1px; }
.sand-3 { top: 70%; left: -5%; animation: sand-drift 7s linear infinite 4s; }

@keyframes sand-drift {
  from { transform: translateX(0) translateY(0); opacity: 0; }
  10% { opacity: 0.4; }
  90% { opacity: 0.4; }
  to { transform: translateX(420px) translateY(-20px); opacity: 0; }
}

/* 道具提示 */
.prop-hint-bar {
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  animation: hint-fade 0.5s ease;
}

.prop-hint-bar p {
  font-family: var(--font-sans);
  font-size: 0.95rem;            /* V1.1 字号规范：正文 ≥ 15px */
  color: rgba(180, 170, 140, 0.55);
  letter-spacing: 0.1em;
}

@keyframes hint-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}

.continue-btn {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 32px;
  background: rgba(35, 30, 22, 0.9);
  border: 1px solid rgba(184, 149, 108, 0.4);
  border-radius: 3px;
  color: #d4c8a8;
  font-family: "Noto Serif SC", serif;
  font-size: 0.95rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.3s;
  animation: btn-rise 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.continue-btn:hover {
  background: rgba(50, 44, 32, 0.95);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  transform: translateX(-50%) translateY(-2px);
}

.arrow { opacity: 0.6; }

@keyframes btn-rise {
  from { opacity: 0; transform: translateX(-50%) translateY(16px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}

/* 蝗虫飞行动画 */
.locusts-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 4;
  opacity: 0.8;
}

.locust { animation: locust-fly 4s ease-in-out infinite alternate; }
.locust-1 { animation: locust-fly 5s ease-in-out infinite alternate; }
.locust-2 { animation: locust-fly 4.5s ease-in-out infinite alternate-reverse; }
.locust-3 { animation: locust-fly 6s ease-in-out infinite alternate 1s; }
.locust-4 { animation: locust-fly 5.5s ease-in-out infinite alternate-reverse 2s; }

@keyframes locust-fly {
  0%   { transform: translate(0, 0) rotate(-5deg); }
  33%  { transform: translate(12px, -8px) rotate(3deg); }
  66%  { transform: translate(6px, 6px) rotate(-2deg); }
  100% { transform: translate(-10px, -4px) rotate(5deg); }
}

/* 干裂田地微动 */
.cracked-earth {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 240px;
  pointer-events: none;
  z-index: 2;
  animation: earth-drift 8s ease-in-out infinite alternate;
  filter: sepia(0.15);
}

@keyframes earth-drift {
  0%   { transform: scaleY(1.0); filter: sepia(0.12); }
  100% { transform: scaleY(1.015); filter: sepia(0.2); }
}
</style>
