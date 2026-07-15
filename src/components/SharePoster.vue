<template>
  <div class="share-screen scene-frame">
    <h2 class="scene-title">分享海报</h2>
    
    <!-- Poster preview -->
    <div class="poster-preview" ref="posterRef">
      <div class="poster-bg">
        <!-- Moonlight effect -->
        <div class="poster-moon"></div>
        
        <!-- Title area -->
        <div class="poster-title-area">
          <p class="poster-subtitle">我修复了《东坡清风纪》的</p>
          <h1 class="poster-main-title">黄州残页</h1>
        </div>
        
        <!-- Result badge -->
        <div class="result-badge">
          <div class="badge-seal">{{ endingSeal }}</div>
          <span class="badge-text">{{ endingTitle }}</span>
        </div>
        
        <!-- Variables -->
        <div class="poster-vars">
          <div v-for="(value, key) in displayVars" :key="key" class="poster-var">
            <span class="poster-var-name">{{ varShortNames[key] }}</span>
            <div class="poster-var-bar">
              <div class="poster-var-fill" :style="{ width: `${value}%` }" :class="getVarClass(key, value)"></div>
            </div>
          </div>
        </div>
        
        <!-- Quote -->
        <p class="poster-quote">{{ posterQuote }}</p>
        
        <!-- QR placeholder -->
        <div class="qr-placeholder">
          <span>扫码体验</span>
        </div>
        
        <!-- Seal decoration -->
        <div class="poster-seal">东坡清风纪</div>
      </div>
    </div>
    
    <!-- Actions -->
    <div class="share-actions">
      <button class="btn btn-primary" data-testid="btn-share-generate" @click="generatePreview">生成海报预览</button>
      <button class="btn btn-secondary" data-testid="btn-share-restart" @click="handleRestart">再玩一次</button>
      <button class="btn btn-ghost" data-testid="btn-share-credits" @click="handleCredits">查看史实说明</button>
    </div>
    
    <!-- Preview notification -->
    <Transition name="fade">
      <div v-if="showPreview" class="preview-notification">
        <p>海报预览已生成</p>
        <p class="preview-hint">长按海报图片可保存到相册</p>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { gameState, setScene, resetGame, resolveEnding, ENDINGS, getVarBarClass } from '../store/gameState.js'

const posterRef = ref(null)
const showPreview = ref(false)

const varShortNames = {
  qingfeng: '清风', fenggu: '风骨', minsheng: '民生',
  yanhuo: '烟火', qinyou: '亲友', mingsheng: '名声'
}

const displayVars = computed(() => {
  const { qingfeng, fenggu, minsheng, yanhuo, qinyou, mingsheng } = gameState.variables
  return { qingfeng, fenggu, minsheng, yanhuo, qinyou, mingsheng }
})

// Use the SHARED resolver — must match ResultReport exactly
const endingId = computed(() => resolveEnding(gameState))
const endingData = computed(() => ENDINGS[endingId.value])

const endingTitle = computed(() => endingData.value.title)
const endingSeal = computed(() => endingData.value.seal)

const posterQuote = computed(() => {
  const quotes = {
    ziyou_tired: '亲情不是无限救援系统。',
    confused_account: '烟火气不是清廉的反面。糊涂账才是。',
    cold_moon: '黄州的月光仍在，可他还没有真正走进去。',
    qingfeng_born: '黄州的火慢慢烧着。东坡正在诞生。',
    dongpo_landing: '风还在吹。东坡正在落地。'
  }
  return quotes[endingId.value] || ''
})

function getVarClass(key, value) {
  return getVarBarClass(key, value)
}

function generatePreview() {
  showPreview.value = true
  setTimeout(() => {
    showPreview.value = false
  }, 3000)
}

function handleRestart() {
  resetGame()
  setScene('S01')
}

function handleCredits() {
  setScene('S70')
}
</script>

<style scoped>
.share-screen {
  background: linear-gradient(180deg, var(--ink-black) 0%, var(--qing-grey) 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.scene-title {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: var(--old-gold);
  letter-spacing: 0.1em;
  margin-bottom: 1rem;
}

.poster-preview {
  width: 100%;
  max-width: 300px;
  aspect-ratio: 3/4;
  margin-bottom: 1.5rem;
}

.poster-bg {
  width: 100%;
  height: 100%;
  background: linear-gradient(180deg, #1a2030 0%, #2a3040 50%, var(--qing-grey) 100%);
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.poster-moon {
  position: absolute;
  top: -30px;
  right: -30px;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(232, 228, 223, 0.3), transparent);
  border-radius: 50%;
}

.poster-title-area {
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.poster-subtitle {
  font-size: 0.95rem;
  color: rgba(232, 228, 223, 0.6);
  margin-bottom: 0.25rem;
}

.poster-main-title {
  font-family: var(--font-serif);
  font-size: 1.75rem;
  color: var(--moon-white);
  letter-spacing: 0.1em;
}

.result-badge {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.badge-seal {
  width: 36px;
  height: 36px;
  background: var(--vermillion);
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--xuan-paper);
}

.badge-text {
  font-family: var(--font-serif);
  font-size: 1.125rem;
  color: var(--old-gold);
}

.poster-vars {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  margin-bottom: 1rem;
  position: relative;
  z-index: 1;
}

.poster-var {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.poster-var-name {
  width: 40px;
  font-size: 0.6875rem;
  color: rgba(232, 228, 223, 0.6);
}

.poster-var-bar {
  flex: 1;
  height: 4px;
  background: rgba(232, 228, 223, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.poster-var-fill {
  height: 100%;
  background: var(--old-gold);
}

.poster-var-fill.high { background: var(--bamboo-green); }
.poster-var-fill.medium { background: var(--old-gold); }
.poster-var-fill.low { background: var(--vermillion); }
.poster-var-fill.risk-high { background: var(--vermillion); }
.poster-var-fill.risk-mid { background: var(--old-gold); }
.poster-var-fill.risk-low { background: var(--bamboo-green); }
.poster-var-fill.risk-neutral { background: #c9a84c; }

.poster-quote {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  color: rgba(232, 228, 223, 0.7);
  text-align: center;
  font-style: italic;
  margin-bottom: auto;
  position: relative;
  z-index: 1;
}

.qr-placeholder {
  width: 80px;
  height: 80px;
  background: var(--xuan-paper);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem;
  position: relative;
  z-index: 1;
}

.qr-placeholder span {
  font-size: 0.625rem;
  color: var(--ink-black);
}

.poster-seal {
  position: absolute;
  bottom: 15px;
  right: 15px;
  font-family: var(--font-serif);
  font-size: 0.625rem;
  color: var(--vermillion);
  writing-mode: vertical-rl;
  letter-spacing: 0.2em;
  opacity: 0.6;
}

.share-actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 280px;
}

.btn-primary { background: var(--vermillion); }
.btn-secondary { border: 1px solid rgba(232, 228, 223, 0.3); color: var(--moon-white); }

.preview-notification {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid var(--bamboo-green);
  border-radius: 8px;
  padding: 1rem 2rem;
  z-index: 100;
  text-align: center;
}

.preview-notification p {
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--bamboo-green);
}

.preview-hint {
  font-size: 0.75rem !important;
  color: rgba(232, 228, 223, 0.6) !important;
  margin-top: 0.25rem;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
