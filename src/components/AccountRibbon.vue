<template>
  <!-- 顶部账目短签 -->
  <Transition name="ribbon-drop">
    <div v-if="visible" class="account-ribbon">
      <div class="ribbon-inner">
        <span class="ribbon-label">账</span>
        <div class="accounts">
          <div
            v-for="account in displayAccounts"
            :key="account.key"
            class="account-item"
            :class="{
              danger: account.isDanger,
              warning: account.isWarning,
              'just-updated': updatedKeys.has(account.key)
            }"
            :title="account.description"
            :data-key="account.key"
          >
            <span class="account-name">{{ account.label }}</span>
            <span class="account-val">{{ account.value }}</span>
            <div class="account-bar-wrap">
              <div class="account-bar">
                <div
                  class="account-fill"
                  :style="{ width: account.pct + '%', background: account.color }"
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 批注提示 -->
      <Transition name="annotation-pop">
        <div v-if="annotation" class="annotation">
          <span class="annotation-text">{{ annotation }}</span>
        </div>
      </Transition>

      <!-- 数字飘字反馈层（选项确认后从对应账目飘出） -->
      <div class="floaters-layer" aria-hidden="true">
        <div
          v-for="f in floaters"
          :key="f.id"
          class="floater"
          :class="f.delta > 0 ? 'floater-up' : 'floater-down'"
          :style="{ color: f.color }"
        >
          <span class="floater-arrow">{{ f.delta > 0 ? '△' : '▽' }}</span>
          <span class="floater-num">{{ f.delta > 0 ? '+' : '' }}{{ f.delta }}</span>
          <span class="floater-label">{{ f.label }}</span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { gameState } from '../store/gameState.js'

const props = defineProps({
  visible: { type: Boolean, default: true },
  annotation: { type: String, default: '' }
})

const ACCOUNT_META = [
  {
    key: 'qingfeng', label: '清风', danger: false, warning: false,
    description: '清风账：公私边界、拒礼、守规则',
    color: 'var(--bamboo-green, #5c7a5c)'
  },
  {
    key: 'fenggu', label: '风骨', danger: false, warning: false,
    description: '风骨账：风波和困境中是否守住人格',
    color: 'var(--old-gold, #b8956c)'
  },
  {
    key: 'yanhuo', label: '烟火', danger: false, warning: false,
    description: '烟火账：是否能在困境中真实生活',
    color: 'var(--light-terracotta, #c4a77d)'
  },
  {
    key: 'qinyou', label: '亲友', danger: true, warning: false,
    description: '亲友账：亲友承担的代价，越高越危险',
    color: 'var(--vermillion, #8b3a3a)'
  },
  {
    key: 'mingsheng', label: '名声', danger: false, warning: true,
    description: '名声账：才名和传播风险，不是越高越好',
    color: '#8a8aaa'
  }
]

const displayAccounts = computed(() => {
  const v = gameState.variables
  return ACCOUNT_META.map(a => {
    const val = v[a.key] ?? 50
    return {
      ...a,
      value: Math.round(val),
      pct: Math.max(0, Math.min(100, val)),
      isDanger: a.danger && val > 70,
      isWarning: a.warning && val > 70
    }
  })
})

// ── 飘字反馈 ─────────────────────────────────────
const floaters = ref([])
const updatedKeys = ref(new Set())
let floaterId = 0
let prevVars = { ...gameState.variables }

watch(() => ({ ...gameState.variables }), (newVars) => {
  const newFloaterList = []
  const justUpdated = new Set()
  for (const a of ACCOUNT_META) {
    const oldVal = prevVars[a.key] ?? 50
    const newVal = newVars[a.key] ?? 50
    const delta = Math.round(newVal - oldVal)
    if (delta !== 0) {
      justUpdated.add(a.key)
      newFloaterList.push({
        id: ++floaterId,
        key: a.key,
        delta,
        label: a.label,
        color: a.delta > 0 ? '#7ab85a' : '#d65a3a'
      })
    }
  }
  prevVars = { ...newVars }
  if (newFloaterList.length === 0) return

  // 加入飘字数组
  floaters.value.push(...newFloaterList)
  // 标记账目条"刚刚更新"高亮
  updatedKeys.value = new Set([...updatedKeys.value, ...justUpdated])

  // 1.6s 后移除飘字
  setTimeout(() => {
    floaters.value = floaters.value.filter(f => !newFloaterList.find(nf => nf.id === f.id))
  }, 1600)

  // 0.7s 后取消高亮
  setTimeout(() => {
    for (const k of justUpdated) updatedKeys.value.delete(k)
    updatedKeys.value = new Set(updatedKeys.value)
  }, 700)
})
</script>

<style scoped>
.account-ribbon {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding: 8px 12px;
  background: linear-gradient(180deg, rgba(13,13,18,0.95) 0%, rgba(13,13,18,0.85) 100%);
  border-bottom: 1px solid rgba(184,149,108,0.15);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

.ribbon-inner {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ribbon-label {
  font-family: "Noto Serif SC", serif;
  font-size: 0.7rem;
  color: rgba(184,149,108,0.5);
  letter-spacing: 0.1em;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  flex-shrink: 0;
}

.accounts {
  display: flex;
  gap: 10px;
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
}
.accounts::-webkit-scrollbar { display: none; }

.account-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 60px;
  flex-shrink: 0;
  transition: all 0.3s;
  padding: 4px 2px 3px;
  border-radius: 6px;
}

.account-item.just-updated {
  background: rgba(255,212,90,0.18);
  box-shadow: 0 0 12px rgba(255,212,90,0.4);
  animation: account-pulse 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes account-pulse {
  0%   { transform: scale(1); background: rgba(255,212,90,0); box-shadow: 0 0 0 rgba(255,212,90,0); }
  40%  { transform: scale(1.15); background: rgba(255,212,90,0.32); box-shadow: 0 0 20px rgba(255,212,90,0.6); }
  100% { transform: scale(1); background: rgba(255,212,90,0.18); box-shadow: 0 0 12px rgba(255,212,90,0.4); }
}

.account-name {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.7rem;
  color: rgba(200,190,170,0.7);
  letter-spacing: 0.05em;
  text-align: center;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 3px;
}

.account-val {
  font-family: "VT323", "Noto Sans SC", monospace;
  font-size: 0.72rem;
  font-weight: 700;
  color: rgba(232,228,200,0.92);
  letter-spacing: 0;
  min-width: 14px;
  text-align: center;
}

.account-bar-wrap { position: relative; }

.account-bar {
  height: 5px;
  background: rgba(255,255,255,0.08);
  border-radius: 3px;
  overflow: hidden;
  width: 56px;
}

.account-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

.account-item.danger .account-name { color: rgba(220,130,130,0.95); }
.account-item.danger .account-val  { color: #ff8866; }
.account-item.warning .account-name { color: rgba(190,180,220,0.92); }
.account-item.warning .account-val  { color: #b0a8d8; }

/* ── 飘字反馈层 ─────────────────────────── */
.floaters-layer {
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
  max-width: 92%;
  pointer-events: none;
  z-index: 60;
}
.floater {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 10px;
  border-radius: 14px;
  font-family: "Noto Serif SC", serif;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  white-space: nowrap;
  background: rgba(20, 18, 14, 0.94);
  border: 1px solid currentColor;
  box-shadow: 0 4px 16px rgba(0,0,0,0.5), 0 0 12px currentColor;
  animation: floater-rise 1.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  text-shadow: 0 1px 3px rgba(0,0,0,0.8);
}
.floater-up   { color: #7ad85a; }
.floater-down { color: #f0704a; }
.floater-arrow { font-size: 0.95rem; }
.floater-num   { font-family: "VT323", monospace; font-size: 0.95rem; font-weight: 700; }
.floater-label { font-weight: 500; opacity: 0.92; }

@keyframes floater-rise {
  0%   { opacity: 0; transform: translateY(8px) scale(0.6); }
  18%  { opacity: 1; transform: translateY(0) scale(1.15); }
  35%  { opacity: 1; transform: translateY(-4px) scale(1); }
  80%  { opacity: 0.95; transform: translateY(-30px) scale(0.95); }
  100% { opacity: 0; transform: translateY(-44px) scale(0.85); }
}

/* 批注提示 */
.annotation {
  margin-top: 6px;
  padding: 4px 10px;
  border-left: 2px solid rgba(139,58,58,0.6);
  background: rgba(139,58,58,0.08);
  border-radius: 0 4px 4px 0;
}
.annotation-text {
  font-family: "Noto Serif SC", serif;
  font-size: 0.75rem;
  color: rgba(200,160,120,0.85);
  font-style: italic;
  line-height: 1.5;
}

/* 动画 */
.ribbon-drop-enter-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.ribbon-drop-enter-from { opacity: 0; transform: translateY(-20px); }

.annotation-pop-enter-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.annotation-pop-enter-from { opacity: 0; transform: translateX(-10px); }
</style>
