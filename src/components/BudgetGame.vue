<template>
  <div class="budget-game scene-frame">
    <h2 class="scene-title">黄州生活账本</h2>
    
    <p class="scene-intro">今日余额有限。可人还要吃饭。字还要写。日子还要往前过。</p>
    
    <!-- Budget items -->
    <div class="budget-items">
      <div
        v-for="item in budgetItems"
        :key="item.id"
        class="budget-item"
        :class="{ locked: item.locked, allocated: allocations[item.id] > 0 }"
      >
        <!-- 物品图标 -->
        <div class="item-icon" v-html="itemIcons[item.id]"></div>

        <div class="item-info">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-hint" v-if="item.required">(必要)</span>
          <span class="item-hint caution" v-if="item.caution">(谨慎)</span>
        </div>

        <div class="item-controls" v-if="!item.locked">
          <button class="btn-minus" @click="decrease(item.id)" :disabled="allocations[item.id] <= 0">-</button>
          <span class="item-amount">{{ allocations[item.id] }}</span>
          <button class="btn-plus" @click="increase(item.id)" :disabled="totalAllocated >= 10">+</button>
        </div>

        <div v-else class="locked-icon" @click="showLockHint">
          <!-- 公账锁定印章 -->
          <div class="public-lock-seal">
            <span class="seal-char">禁</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Total -->
    <div class="total-bar">
      <span>已分配: {{ totalAllocated }}/10</span>
      <div class="progress-fill-container">
        <div class="progress-fill" :style="{ width: `${totalAllocated * 10}%` }"></div>
      </div>
    </div>
    
    <!-- Lock hint popup -->
    <Transition name="fade">
      <div v-if="showHint" class="lock-hint-popup">
        <p>这不是私人饭钱能碰的地方。</p>
        <button class="btn btn-ghost" @click="showHint = false">知道了</button>
      </div>
    </Transition>

    <!-- Budget feedback -->
    <Transition name="fade">
      <div v-if="budgetFeedback" class="budget-feedback">
        <p>{{ budgetFeedback }}</p>
      </div>
    </Transition>

    <!-- 记下这笔账：始终可见，分配满后可点击 -->
    <div class="budget-confirm-bar">
      <p class="confirm-hint" v-if="totalAllocated < 10">
        请先分配完 10/10（当前 {{ totalAllocated }}/10）
      </p>
      <button
        class="budget-confirm-btn"
        :class="{ 'btn-ready': canConfirm }"
        data-testid="budget-confirm-button"
        :disabled="!canConfirm"
        @click="handleConfirm"
      >
        {{ canConfirm ? '记下这笔账' : '先这样过一天' }}
      </button>
    </div>

    <!-- 分配满提示 -->
    <p v-if="totalAllocated === 10 && !budgetFeedback" class="分配满-hint">
      已分配 10/10 — 记下这笔账
    </p>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { setScene, gameState } from '../store/gameState.js'

const budgetItems = [
  { id: 'rice', name: '米', required: true },
  { id: 'firewood', name: '柴', required: true },
  { id: 'meat', name: '肉' },
  { id: 'ink', name: '笔墨' },
  { id: 'daily', name: '家用' },
  { id: 'guest', name: '待客', caution: true },
  { id: 'public', name: '公账', locked: true }
]

// SVG icons for each budget item
const itemIcons = {
  rice: `<svg viewBox="0 0 28 28" width="28" height="28"><path d="M14 4 C8 4 4 10 4 18 C4 22 8 24 14 24 C20 24 24 22 24 18 C24 10 20 4 14 4Z" fill="rgba(200,190,160,0.5)" stroke="rgba(180,165,130,0.4)" stroke-width="1"/><ellipse cx="14" cy="10" rx="4" ry="3" fill="rgba(220,210,180,0.4)"/><path d="M10 16 Q14 14 18 16" stroke="rgba(180,165,130,0.4)" stroke-width="1" fill="none"/></svg>`,
  firewood: `<svg viewBox="0 0 28 28" width="28" height="28"><rect x="4" y="16" width="20" height="5" rx="2" fill="rgba(160,100,60,0.6)" transform="rotate(-10 14 18)"/><rect x="6" y="11" width="18" height="5" rx="2" fill="rgba(140,80,40,0.5)" transform="rotate(8 14 13)"/><rect x="5" y="6" width="16" height="5" rx="2" fill="rgba(120,70,35,0.4)" transform="rotate(-5 14 8)"/></svg>`,
  meat: `<svg viewBox="0 0 28 28" width="28" height="28"><ellipse cx="14" cy="16" rx="10" ry="7" fill="rgba(180,80,60,0.5)" stroke="rgba(160,60,40,0.4)" stroke-width="1"/><path d="M8 14 Q14 10 20 14" stroke="rgba(200,120,100,0.4)" stroke-width="1.5" fill="none"/><circle cx="14" cy="8" r="3" fill="rgba(200,190,160,0.5)"/></svg>`,
  ink: `<svg viewBox="0 0 28 28" width="28" height="28"><rect x="8" y="6" width="12" height="18" rx="1" fill="rgba(40,35,25,0.7)" stroke="rgba(60,50,35,0.5)" stroke-width="1"/><rect x="10" y="8" width="8" height="4" fill="rgba(30,25,20,0.8)"/><line x1="11" y1="16" x2="17" y2="16" stroke="rgba(80,70,55,0.5)" stroke-width="1"/><line x1="11" y1="19" x2="15" y2="19" stroke="rgba(80,70,55,0.5)" stroke-width="1"/></svg>`,
  daily: `<svg viewBox="0 0 28 28" width="28" height="28"><circle cx="14" cy="14" r="10" fill="none" stroke="rgba(180,165,130,0.4)" stroke-width="1.5"/><path d="M14 8 L14 14 L19 14" stroke="rgba(180,165,130,0.5)" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>`,
  guest: `<svg viewBox="0 0 28 28" width="28" height="28"><path d="M8 20 C8 14 11 10 14 10 C17 10 20 14 20 20" fill="rgba(180,165,130,0.3)" stroke="rgba(180,165,130,0.5)" stroke-width="1"/><circle cx="14" cy="8" r="3" fill="rgba(180,165,130,0.4)"/></svg>`,
  public: `<svg viewBox="0 0 28 28" width="28" height="28"><rect x="6" y="4" width="16" height="20" rx="1" fill="rgba(50,40,30,0.6)" stroke="rgba(80,65,45,0.5)" stroke-width="1"/><line x1="10" y1="10" x2="18" y2="10" stroke="rgba(180,165,130,0.3)" stroke-width="1"/><line x1="10" y1="14" x2="18" y2="14" stroke="rgba(180,165,130,0.3)" stroke-width="1"/><line x1="10" y1="18" x2="15" y2="18" stroke="rgba(180,165,130,0.3)" stroke-width="1"/></svg>`
}

const allocations = ref({
  rice: 2, firewood: 2, meat: 0, ink: 1, daily: 2, guest: 0, public: 0
})

const showHint = ref(false)
const budgetFeedback = ref(null)

const totalAllocated = computed(() =>
  Object.values(allocations.value).reduce((a, b) => a + b, 0)
)

// canConfirm: 必须分配满10，且米和柴满足最低要求
const canConfirm = computed(() =>
  totalAllocated.value === 10 &&
  allocations.value.rice >= 1 &&
  allocations.value.firewood >= 1
)

function increase(itemId) {
  if (totalAllocated.value >= 10) return
  allocations.value[itemId]++
}

function decrease(itemId) {
  if (itemId === 'rice' && allocations.value.rice <= 1) return
  if (itemId === 'firewood' && allocations.value.firewood <= 1) return
  if (allocations.value[itemId] > 0) {
    allocations.value[itemId]--
  }
}

function showLockHint() {
  showHint.value = true
}

function handleConfirm() {
  if (!canConfirm.value) return

  const alloc = allocations.value
  const feedbackLines = []
  const logLines = []

  // Save allocation to gameState
  gameState.budget分配 = { ...allocations.value }

  // Check guest spending
  if (alloc.guest >= 3) {
    gameState.variables.mingsheng = Math.max(0, Math.min(100, gameState.variables.mingsheng + 5))
    gameState.variables.qingfeng = Math.max(0, Math.min(100, gameState.variables.qingfeng - 5))
    feedbackLines.push('体面开始变贵了。')
    logLines.push(`待客分配 ${alloc.guest}，体面变贵。`)
  }

  // Check ink allocation
  if (alloc.ink === 0) {
    gameState.variables.fenggu = Math.max(0, Math.min(100, gameState.variables.fenggu - 5))
    feedbackLines.push('字还没写，风已经冷了。')
  }

  // Check basic needs met + no excess
  const basicsMet = alloc.rice >= 1 && alloc.firewood >= 1
  const noExcess = alloc.guest < 3
  if (basicsMet && noExcess) {
    gameState.variables.yanhuo = Math.max(0, Math.min(100, gameState.variables.yanhuo + 5))
    gameState.variables.qingfeng = Math.max(0, Math.min(100, gameState.variables.qingfeng + 5))
    if (feedbackLines.length === 0) {
      feedbackLines.push('这一天，账还算清楚。')
    }
  }

  // Meat feedback
  if (alloc.meat === 0) {
    feedbackLines.push('肉账为零，黄州的烟火气暂时冷了一些。')
    logLines.push('肉分配 0，烟火气冷。')
  } else {
    logLines.push(`肉分配 ${alloc.meat}。`)
  }

  // Public account locked
  logLines.push('公账锁定，未动用。')

  budgetFeedback.value = feedbackLines.length > 0 ? feedbackLines.join(' ') : '日子照常过着。'

  // Write to dialogue log
  const dialogueLogRef = inject('dialogueLogRef', null)
  if (dialogueLogRef?.value?.addLogEntry) {
    dialogueLogRef.value.addLogEntry({
      type: 'narrate',
      sceneId: 'S35',
      content: `黄州账目分配：米 ${alloc.rice}、柴 ${alloc.firewood}、肉 ${alloc.meat}、笔墨 ${alloc.ink}、家用 ${alloc.daily}、待客 ${alloc.guest}。${logLines.join(' ')}`
    })
  }

  // Delay navigation so user can read feedback
  setTimeout(() => {
    setScene('S36')
  }, 1200)
}
</script>

<style scoped>
.budget-game {
  background: linear-gradient(180deg, var(--huangzhou-earth) 0%, var(--qing-grey) 100%);
}

.scene-title {
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: var(--moon-white);
  margin-bottom: 0.5rem;
}

.scene-intro {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: rgba(232, 228, 223, 0.7);
  margin-bottom: 1.5rem;
  text-align: center;
}

.budget-items {
  width: 100%;
  max-width: 320px;
  margin-bottom: 1.5rem;
}

.budget-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem;
  background: rgba(26, 26, 26, 0.6);
  border: 1px solid rgba(232, 228, 223, 0.1);
  border-radius: 6px;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
}

.budget-item.allocated {
  border-color: var(--bamboo-green);
  background: rgba(92, 122, 92, 0.2);
}

.budget-item.locked {
  opacity: 0.5;
}

.item-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.item-name {
  font-family: var(--font-serif);
  font-size: 0.9375rem;
  color: var(--moon-white);
}

.item-hint {
  font-size: 0.6875rem;
  color: var(--bamboo-green);
}

.item-hint.caution {
  color: var(--old-gold);
}

.item-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-minus, .btn-plus {
  width: 28px;
  height: 28px;
  border: 1px solid rgba(232, 228, 223, 0.2);
  background: transparent;
  color: var(--moon-white);
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
}

.btn-minus:hover:not(:disabled), .btn-plus:hover:not(:disabled) {
  background: rgba(232, 228, 223, 0.1);
}

.btn-minus:disabled, .btn-plus:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.item-amount {
  width: 24px;
  text-align: center;
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--old-gold);
}

.locked-icon {
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.item-icon {
  display: flex;
  align-items: center;
  margin-right: 8px;
  opacity: 0.8;
}

.public-lock-seal {
  width: 28px;
  height: 28px;
  background: rgba(139, 58, 58, 0.4);
  border: 1px solid rgba(139, 58, 58, 0.6);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.public-lock-seal:hover {
  background: rgba(139, 58, 58, 0.6);
}

.seal-char {
  font-family: var(--font-serif);
  font-size: 0.75rem;
  color: rgba(200, 170, 150, 0.8);
  font-weight: bold;
}

.total-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: rgba(232, 228, 223, 0.7);
}

.progress-fill-container {
  flex: 1;
  height: 6px;
  background: rgba(232, 228, 223, 0.1);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--old-gold);
  transition: width 0.3s ease;
}

.lock-hint-popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(26, 26, 26, 0.95);
  border: 1px solid var(--vermillion);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  max-width: 280px;
  z-index: 10;
}

.lock-hint-popup p {
  font-family: var(--font-serif);
  font-size: 0.9375rem;
  color: rgba(232, 228, 223, 0.9);
  margin-bottom: 1rem;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-continue {
  background: linear-gradient(135deg, #3a5a3a 0%, #2a4a2a 100%) !important;
  box-shadow: 0 6px 20px rgba(40, 70, 40, 0.4);
}

.budget-feedback {
  background: rgba(92, 122, 92, 0.2);
  border: 1px solid var(--bamboo-green);
  border-radius: 4px;
  padding: 0.5rem 0.75rem;
  margin-bottom: 1rem;
  max-width: 320px;
  text-align: center;
}

.budget-feedback p {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  color: var(--bamboo-green);
  line-height: 1.5;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

/* ── 底部确认栏：固定在视口底部 ──────────────────────── */
.budget-confirm-bar {
  position: absolute;
  bottom: calc(20px + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  width: min(320px, calc(100% - 32px));
  z-index: 80;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  pointer-events: auto;
}

.confirm-hint {
  font-family: var(--font-sans);
  font-size: 0.75rem;
  color: rgba(200, 190, 170, 0.5);
  text-align: center;
  margin: 0;
  animation: fade-hint 0.3s ease;
}

@keyframes fade-hint {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.budget-confirm-btn {
  width: 100%;
  min-height: 52px;
  border-radius: 6px;
  border: 1px solid rgba(232, 228, 223, 0.2);
  background: rgba(232, 228, 223, 0.08);
  color: rgba(232, 228, 223, 0.4);
  font-family: var(--font-serif);
  font-size: 1rem;
  letter-spacing: 0.12em;
  cursor: not-allowed;
  transition: all 0.3s ease;
  padding: 0 1.5rem;
}

.budget-confirm-btn.btn-ready {
  border-color: rgba(224, 188, 126, 0.75);
  background: rgba(245, 226, 183, 0.92);
  color: #2b2118;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), 0 0 20px rgba(224, 188, 126, 0.3);
  animation: btn-ready-pulse 0.4s cubic-bezier(0.16, 1, 0.3, 1), btn-ready-glow 2s ease-in-out infinite 0.4s;
}

@keyframes btn-ready-pulse {
  0%   { transform: scale(0.96); opacity: 0.7; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes btn-ready-glow {
  0%, 100% { box-shadow: 0 4px 20px rgba(0,0,0,0.3), 0 0 15px rgba(224,188,126,0.25); }
  50% { box-shadow: 0 4px 20px rgba(0,0,0,0.3), 0 0 30px rgba(224,188,126,0.4); }
}

.budget-confirm-btn.btn-ready:hover {
  background: rgba(255, 240, 210, 1);
  transform: translateY(-1px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
}

.budget-confirm-btn.btn-ready:active {
  transform: translateY(0);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}

/* 分配满提示文字 */
.分配满-hint {
  position: absolute;
  bottom: calc(88px + env(safe-area-inset-bottom, 0px));
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-sans);
  font-size: 0.7rem;
  color: rgba(184, 149, 108, 0.6);
  letter-spacing: 0.1em;
  white-space: nowrap;
  animation: fade-hint 0.5s ease;
}
</style>
