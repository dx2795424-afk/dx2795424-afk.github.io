<template>
  <div class="scene-frame result-root">
    <!-- 背景由 BackgroundScene(result) 全局提供 -->

    <!-- 顶部：章节标记 -->
    <div class="result-header">
      <span class="chapter-badge">{{ isFullGamePath ? '东坡一生 · 全流程完成' : '黄州残页 · 修复完成' }}</span>
    </div>

    <!-- 判词主体 -->
    <div class="report-scroll">

      <!-- 判词卷首 -->
      <div class="verdict-scroll-top">
        <div class="verdict-seal">
          <span>{{ currentEnding.seal }}</span>
        </div>
        <h1 class="verdict-title">{{ currentEnding.title }}</h1>
      </div>

      <!-- 判词正文 -->
      <div class="verdict-body">
        <div class="verdict-lines">
          <p v-for="(line, i) in contentLines" :key="i" class="verdict-line">{{ line }}</p>
        </div>
      </div>

      <!-- 账目短签 -->
      <div class="verdict-accounts">
        <p class="accounts-label">账目记录</p>
        <div class="account-strips">
          <div
            v-for="item in varDisplayList"
            :key="item.key"
            class="account-strip"
            :class="{ danger: item.isDanger }"
          >
            <span class="strip-name">{{ item.shortLabel }}</span>
            <div class="strip-bar">
              <div
                class="strip-fill"
                :style="{ width: item.value + '%', background: item.color }"
              ></div>
            </div>
            <span class="strip-val">{{ item.value }}</span>
          </div>
        </div>
      </div>

      <!-- 组合批注 -->
      <div v-if="comboHints.length" class="verdict-annotation">
        <div v-for="(hint, i) in comboHints" :key="i" class="annotation-line">
          <span class="annotation-seal">·</span>
          <span>{{ hint }}</span>
        </div>
      </div>

    </div>

    <!-- 操作按钮 -->
    <div class="result-actions">
      <button class="btn-share" data-testid="btn-result-share" @click="handleShare">
        <span class="btn-icon">⬡</span>
        生成分享海报
      </button>
      <button class="btn-restart" data-testid="btn-result-restart" @click="handleRestart">再玩一次</button>
      <button class="btn-retro" data-testid="btn-result-retro" @click="handleRetrospective">人生回溯</button>
      <button class="btn-credits" data-testid="btn-result-credits" @click="handleCredits">史实与改编说明</button>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { gameState, setScene, resetGame, resolveEnding, ENDINGS, getVarBarClass, addLogEntry } from '../store/gameState.js'

// Log result display once when this component mounts
let logged = false
onMounted(() => {
  if (!logged) {
    logged = true
    const endingId = resolveEnding(gameState)
    const ending = ENDINGS[endingId]
    addLogEntry({ type: 'result', sceneId: gameState.currentScene, content: `结局：${ending.title}` })
    addLogEntry({
      type: 'system',
      sceneId: gameState.currentScene,
      content: `最终变量 → qingfeng:${gameState.variables.qingfeng} fenggu:${gameState.variables.fenggu} yanhuo:${gameState.variables.yanhuo} qinyou:${gameState.variables.qinyou}`
    })
  }
})

const varLabels = {
  qingfeng: { short: '清风', color: 'var(--bamboo-green)' },
  fenggu: { short: '风骨', color: 'var(--old-gold)' },
  minsheng: { short: '民生', color: 'var(--bamboo-green)' },
  yanhuo: { short: '烟火', color: 'var(--light-terracotta)' },
  qinyou: { short: '亲友', color: 'var(--vermillion)' },
  mingsheng: { short: '名声', color: '#8a8aaa' }
}

const endingId = computed(() => resolveEnding(gameState))
const currentEnding = computed(() => ENDINGS[endingId.value])
const contentLines = computed(() => currentEnding.value.content.split('\n'))
// S60 = full path (杭州+儋州), S43 = MVP 黄州 path only
const isFullGamePath = computed(() => gameState.currentScene === 'S60')

const varDisplayList = computed(() => {
  return Object.entries(gameState.variables).map(([key, value]) => {
    const labelInfo = varLabels[key] || { short: key, color: '#888' }
    const isDanger = key === 'qinyou' && value > 70
    return {
      key,
      shortLabel: labelInfo.short,
      value,
      color: labelInfo.color,
      isDanger
    }
  })
})

const comboHints = computed(() => {
  const hints = []
  const f = gameState.flags
  if (f.meat === 'clean_human_touch' && f.cook === 'slow_stew') {
    hints.push('烟火可近，账目须清。')
  }
  if (f.expression === 'reckless' && f.ziyou === 'accepted_no_reflection') {
    hints.push('子由救援卡消耗过高。')
  }
  if (f.account_dirty) {
    hints.push('糊涂账。')
  }
  if (f.life_cold) {
    hints.push('生活冷了。')
  }
  // 杭州新增
  if (f.hangzhou_project === 'people_first' && f.hangzhou_account === 'open_account') {
    hints.push('西湖之水，先流向民生。')
  }
  if (f.hangzhou_project === 'relation_contract' || f.hangzhou_account === 'private_margin') {
    hints.push('杭州账中已有浊痕。')
  }
  // 儋州新增
  if (f.danzhou_teach === 'open_teach' && f.tangzuo === 'spark') {
    hints.push('余火传灯。')
  }
  if (f.danzhou_teach === 'closed_door' || f.danzhou_life === 'resentment') {
    hints.push('天涯更冷。')
  }
  if (f.tangzuo === 'fame_use') {
    hints.push('名声账再起波澜。')
  }
  return hints
})

function handleShare() { setScene('S61') }
function handleRestart() { resetGame(); setScene('S01') }
function handleCredits() { setScene('S62') }
function handleRetrospective() {
  gameState.archiveWallMode = 'retrospective'
  gameState.showArchiveWall = true
}
</script>

<style scoped>
.result-root {
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 60px 16px 24px;
  -webkit-overflow-scrolling: touch;
}

.result-header {
  margin-bottom: 1rem;
  animation: fade-in 0.6s ease;
}

.chapter-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 14px;
  background: rgba(13,13,18,0.8);
  border: 1px solid rgba(184,149,108,0.25);
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  color: rgba(200,190,170,0.55);
  letter-spacing: 0.15em;
  backdrop-filter: blur(4px);
}

/* 判词卷 */
.report-scroll {
  width: 100%;
  max-width: 440px;
  background:
    linear-gradient(135deg, rgba(242,235,216,0.95) 0%, rgba(234,226,206,0.97) 100%);
  border: 1px solid rgba(184,149,108,0.3);
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow:
    0 20px 60px rgba(0,0,0,0.4),
    0 4px 16px rgba(0,0,0,0.2);
  animation: scroll-unroll 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  overflow: hidden;
}

/* 纸纹 */
.report-scroll::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
  pointer-events: none;
  border-radius: 16px;
}

@keyframes scroll-unroll {
  from { opacity: 0; transform: translateY(30px) scale(0.97); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* 卷首 */
.verdict-scroll-top {
  text-align: center;
  margin-bottom: 1.25rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid rgba(184,149,108,0.25);
}

.verdict-seal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  background: var(--vermillion);
  border-radius: 6px;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 10px rgba(139,58,58,0.4);
  transform: rotate(-4deg);
  animation: seal-drop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s backwards;
}

.verdict-seal span {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: #f5f0e6;
  letter-spacing: 0.1em;
}

.verdict-title {
  font-family: var(--font-serif);
  font-size: 1.3rem;
  color: #2a241c;
  letter-spacing: 0.08em;
  font-weight: 600;
}

/* 正文 */
.verdict-body {
  margin-bottom: 1.25rem;
}

.verdict-lines {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.verdict-line {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  color: #3a3428;
  line-height: 1.8;
  text-align: justify;
  letter-spacing: 0.02em;
}

/* 账目短签 */
.verdict-accounts {
  background: rgba(184,149,108,0.06);
  border: 1px solid rgba(184,149,108,0.2);
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 1rem;
}

.accounts-label {
  font-family: var(--font-sans);
  font-size: 0.65rem;
  color: rgba(84,67,44,0.5);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.account-strips {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.account-strip {
  display: flex;
  align-items: center;
  gap: 8px;
}

.strip-name {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: rgba(84,67,44,0.7);
  width: 32px;
  flex-shrink: 0;
}

.strip-bar {
  flex: 1;
  height: 5px;
  background: rgba(84,67,44,0.1);
  border-radius: 3px;
  overflow: hidden;
}

.strip-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.account-strip.danger .strip-name { color: var(--vermillion); }

.strip-val {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  color: rgba(84,67,44,0.5);
  width: 24px;
  text-align: right;
  flex-shrink: 0;
}

/* 组合批注 */
.verdict-annotation {
  border-top: 1px solid rgba(184,149,108,0.15);
  padding-top: 10px;
}

.annotation-line {
  display: flex;
  gap: 6px;
  align-items: flex-start;
  margin-bottom: 4px;
}

.annotation-seal {
  color: var(--vermillion);
  font-size: 0.85rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.annotation-line span:last-child {
  font-family: var(--font-serif);
  font-size: 0.85rem;
  color: rgba(84,67,44,0.7);
  font-style: italic;
  line-height: 1.6;
}

/* 操作按钮 */
.result-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 440px;
  margin-top: 1.25rem;
  padding-bottom: 1rem;
}

.btn-share {
  width: 100%;
  padding: 14px 20px;
  background: linear-gradient(135deg, var(--vermillion) 0%, var(--vermillion-dark) 100%);
  color: #f5f0e6;
  border: none;
  border-radius: 10px;
  font-family: var(--font-serif);
  font-size: 1rem;
  letter-spacing: 0.12em;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 6px 20px rgba(139,58,58,0.35);
  transition: all 0.2s;
}
.btn-share:hover {
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(139,58,58,0.45);
}
.btn-icon { font-size: 0.9rem; }

.btn-restart {
  width: 100%;
  padding: 12px 20px;
  background: transparent;
  border: 1px solid rgba(184,149,108,0.35);
  border-radius: 10px;
  color: rgba(200,190,170,0.75);
  font-family: var(--font-sans);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.08em;
}
.btn-restart:hover {
  border-color: rgba(184,149,108,0.55);
  color: rgba(200,190,170,0.9);
}

.btn-credits {
  background: none;
  border: none;
  color: rgba(200,190,170,0.4);
  font-family: var(--font-sans);
  font-size: 0.78rem;
  cursor: pointer;
  letter-spacing: 0.05em;
  padding: 6px;
  transition: color 0.2s;
}
.btn-credits:hover { color: rgba(200,190,170,0.65); }

.btn-retro {
  width: 100%;
  padding: 12px 20px;
  background: transparent;
  border: 1px solid rgba(184,149,108,0.25);
  border-radius: 10px;
  color: rgba(200,190,170,0.55);
  font-family: var(--font-sans);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  letter-spacing: 0.08em;
}
.btn-retro:hover {
  border-color: rgba(184,149,108,0.45);
  color: rgba(200,190,170,0.8);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
