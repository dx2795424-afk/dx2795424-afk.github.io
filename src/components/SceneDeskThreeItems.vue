<template>
  <div class="vn-scene desk-scene">
    <!-- 水墨涟漪（点击时从图标位置扩散） -->
    <div class="ink-stage" v-if="ripples.length">
      <div v-for="r in ripples" :key="r.id" class="ink-ripple" :style="r.style"></div>
    </div>

    <div class="chapter-badge">序幕 · 眉山</div>
    <div class="scene-title-vn">书案三物</div>
    <p class="scene-intro">
      <span class="intro-prefix">{{ nextItemId ? '点击下方物什：' : '三物皆已阅过。' }}</span>
      <span v-if="nextItemId" class="intro-hint">—— 先看<span class="hint-strong">{{ nextItemName }}</span></span>
    </p>

    <div class="items-grid">
      <div
        v-for="item in items"
        :key="item.id"
        class="desk-item"
        :class="{
          clicked: clickedItems.includes(item.id),
          done: isCompleted,
          next: nextItemId === item.id && !clickedItems.includes(item.id)
        }"
        @click="handleItemClick(item)"
      >
        <!-- 外圈光环：未点提示 / 已点持续光晕 -->
        <div class="item-aura" :class="{
          hint: nextItemId === item.id && !clickedItems.includes(item.id),
          active: clickedItems.includes(item.id)
        }"></div>

        <!-- 图标 -->
        <div class="item-icon">
          <svg v-if="item.id === 'book'" width="68" height="76" viewBox="0 0 68 76" class="icon-svg">
            <defs>
              <linearGradient id="book-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#f0d8a8"/>
                <stop offset="100%" stop-color="#a87a3a"/>
              </linearGradient>
            </defs>
            <!-- 书页阴影 -->
            <rect x="6" y="8" width="56" height="62" rx="2" fill="#3a2818" opacity="0.5"/>
            <!-- 书页主体 -->
            <rect x="8" y="6" width="52" height="62" rx="2" fill="url(#book-grad)" stroke="#5a3a1a" stroke-width="1.5"/>
            <!-- 装订线 -->
            <line x1="34" y1="10" x2="34" y2="64" stroke="#5a3a1a" stroke-width="1" opacity="0.5"/>
            <!-- 字行 -->
            <line x1="14" y1="22" x2="50" y2="22" stroke="#2a1810" stroke-width="1.2" opacity="0.7"/>
            <line x1="14" y1="30" x2="50" y2="30" stroke="#2a1810" stroke-width="1.2" opacity="0.7"/>
            <line x1="14" y1="38" x2="46" y2="38" stroke="#2a1810" stroke-width="1.2" opacity="0.7"/>
            <line x1="14" y1="46" x2="42" y2="46" stroke="#2a1810" stroke-width="1.2" opacity="0.7"/>
            <!-- 题签 -->
            <rect x="18" y="54" width="28" height="7" fill="none" stroke="#5a3a1a" stroke-width="0.8" opacity="0.6"/>
            <!-- 印章 -->
            <rect x="46" y="52" width="10" height="10" fill="#a8331f" stroke="#7a1810" stroke-width="0.8"/>
            <text x="51" y="60" font-size="7" fill="#fff8e8" text-anchor="middle" font-family="serif" font-weight="bold">苏</text>
          </svg>
          <svg v-else-if="item.id === 'inkstone'" width="76" height="58" viewBox="0 0 76 58" class="icon-svg">
            <defs>
              <radialGradient id="ink-grad" cx="0.5" cy="0.5">
                <stop offset="0%" stop-color="#0a0608"/>
                <stop offset="70%" stop-color="#1a1014"/>
                <stop offset="100%" stop-color="#3a2818"/>
              </radialGradient>
              <radialGradient id="ink-shine" cx="0.5" cy="0.4">
                <stop offset="0%" stop-color="#fff" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="#fff" stop-opacity="0"/>
              </radialGradient>
            </defs>
            <!-- 砚身阴影 -->
            <ellipse cx="38" cy="32" rx="34" ry="14" fill="#000" opacity="0.4"/>
            <!-- 砚身 -->
            <ellipse cx="38" cy="30" rx="32" ry="13" fill="url(#ink-grad)" stroke="#6e4a2a" stroke-width="1.5"/>
            <!-- 砚堂（深陷） -->
            <ellipse cx="38" cy="28" rx="24" ry="9" fill="#000" opacity="0.85"/>
            <!-- 墨池 -->
            <ellipse cx="28" cy="27" rx="7" ry="4.5" fill="#000"/>
            <!-- 墨水反光 -->
            <ellipse cx="26" cy="25" rx="3" ry="1.5" fill="#fff" opacity="0.3"/>
            <!-- 砚面高光 -->
            <ellipse cx="38" cy="30" rx="22" ry="6" fill="url(#ink-shine)"/>
          </svg>
          <svg v-else-if="item.id === 'lamp'" width="60" height="80" viewBox="0 0 60 80" class="icon-svg">
            <defs>
              <radialGradient id="flame-grad" cx="0.5" cy="0.7">
                <stop offset="0%" stop-color="#fff8d8"/>
                <stop offset="40%" stop-color="#ffd45a"/>
                <stop offset="100%" stop-color="#ff7a1a" stop-opacity="0"/>
              </radialGradient>
              <radialGradient id="light-grad" cx="0.5" cy="0.5">
                <stop offset="0%" stop-color="#ffd45a" stop-opacity="0.55"/>
                <stop offset="60%" stop-color="#ffaa3a" stop-opacity="0.18"/>
                <stop offset="100%" stop-color="#ff7a1a" stop-opacity="0"/>
              </radialGradient>
            </defs>
            <!-- 灯光晕（持续呼吸） -->
            <ellipse cx="30" cy="22" rx="28" ry="28" fill="url(#light-grad)" class="lamp-glow"/>
            <!-- 灯座阴影 -->
            <ellipse cx="30" cy="66" rx="20" ry="4" fill="#000" opacity="0.45"/>
            <!-- 灯座 -->
            <ellipse cx="30" cy="64" rx="18" ry="4" fill="#3a2818" stroke="#6e4a2a" stroke-width="1"/>
            <!-- 灯柱 -->
            <rect x="23" y="44" width="14" height="20" fill="#2a1f14" rx="1" stroke="#1a1410" stroke-width="0.5"/>
            <!-- 灯盏 -->
            <path d="M16 44 L44 44 L40 32 L20 32 Z" fill="#3a2818" stroke="#6e4a2a" stroke-width="1"/>
            <!-- 灯芯 -->
            <line x1="30" y1="32" x2="30" y2="22" stroke="#5a3a1a" stroke-width="1.2"/>
            <!-- 火焰（持续摇曳） -->
            <g class="lamp-flame">
              <ellipse cx="30" cy="22" rx="5" ry="9" fill="url(#flame-grad)"/>
              <ellipse cx="30" cy="19" rx="2.5" ry="5" fill="#fff8d8"/>
              <ellipse cx="30" cy="17" rx="1" ry="2" fill="#fff"/>
            </g>
          </svg>
        </div>

        <p class="item-name">{{ item.name }}</p>

        <!-- 未点击提示文字 -->
        <p v-if="!clickedItems.includes(item.id)" class="item-hint">
          <span class="hint-arrow">▶</span>
          <span>{{ hintText(item.id) }}</span>
        </p>

        <!-- 点击后的描述 -->
        <div class="item-feedback" :class="{ show: clickedItems.includes(item.id) }">
          {{ item.description }}
        </div>

        <!-- 已点击的对勾 -->
        <div v-if="clickedItems.includes(item.id)" class="item-check">✓</div>
      </div>
    </div>

    <!-- 进度条（3 个里程碑） -->
    <div class="progress-bar-wrap">
      <div class="prog-track">
        <div class="prog-fill" :style="{ width: (clickedItems.length / 3 * 100) + '%' }"></div>
        <div v-for="i in 3" :key="i" class="prog-mark" :class="{ on: clickedItems.length >= i }">
          <span class="prog-num">{{ i }}</span>
        </div>
      </div>
      <span class="prog-label">{{ clickedItems.length }} / 3 已阅</span>
    </div>

    <button v-if="isCompleted" class="vn-next-btn" @click="() => setScene('S12')">
      <span class="vn-btn-text">去京城</span>
      <span class="vn-arrow">→</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import { setScene, recordItemClick } from "../store/gameState.js"

const items = [
  { id: "book", name: "书卷", description: "家学是一条起点，也是一种约束。他要学会的不只是文章，还有如何做人。" },
  { id: "inkstone", name: "砚台", description: "墨是黑的，话是锋利的。有些字会成为名声。有些字会成为风暴。" },
  { id: "lamp", name: "小灯", description: "灯很小。但少年相信，它能照见更远的地方。" }
]

const clickedItems = ref([])
const isCompleted = computed(() => clickedItems.value.length === 3)
const nextItemId = computed(() => {
  for (const it of items) if (!clickedItems.value.includes(it.id)) return it.id
  return null
})
const nextItemName = computed(() => {
  const it = items.find(x => x.id === nextItemId.value)
  return it ? it.name : ''
})
const hintText = (id) => {
  if (id === 'book') return '家学的起点'
  if (id === 'inkstone') return '锋芒的预兆'
  if (id === 'lamp') return '少年的心'
  return ''
}

// 墨水涟漪（水墨主题反馈）
const ripples = ref([])
let rippleId = 0
function spawnRipple(itemId) {
  const id = ++rippleId
  // 屏幕中心大致位置（绝对定位从中心散开）
  const x = 50 + (Math.random() - 0.5) * 30
  const y = 50 + (Math.random() - 0.5) * 20
  ripples.value.push({
    id,
    style: {
      left: x + '%',
      top: y + '%',
      animationDelay: (Math.random() * 0.1) + 's'
    }
  })
  setTimeout(() => {
    ripples.value = ripples.value.filter(r => r.id !== id)
  }, 1600)
}

function handleItemClick(item) {
  if (clickedItems.value.includes(item.id) || isCompleted.value) return
  clickedItems.value.push(item.id)
  recordItemClick("S11", item.id)
  spawnRipple(item.id)
}
</script>

<style scoped>
/* ================= 基础布局 ================= */
.vn-scene { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; padding: 60px 20px 80px; overflow: hidden; pointer-events: none; }
.vn-scene > * { pointer-events: auto; }

/* ================= 章节徽章 ================= */
.chapter-badge {
  position: fixed; top: 60px; left: 16px; z-index: 40;
  padding: 4px 14px;
  background: rgba(13,13,18,0.85);
  border: 1px solid rgba(184,149,108,0.25);
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  color: rgba(220,200,170,0.7);
  letter-spacing: 0.15em;
  backdrop-filter: blur(4px);
}

/* ================= 标题 ================= */
.scene-title-vn {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: rgba(255,230,200,0.92);
  text-align: center;
  margin-top: 8px;
  margin-bottom: 6px;
  letter-spacing: 0.1em;
  text-shadow: 0 0 16px rgba(255,200,120,0.25);
}
.scene-intro {
  font-family: var(--font-sans);
  font-size: 0.95rem;
  color: rgba(220,200,170,0.7);
  margin-bottom: 32px;
  text-align: center;
}
.intro-prefix { color: rgba(220,200,170,0.85); }
.intro-hint { color: rgba(184,149,108,0.7); margin-left: 6px; font-size: 1rem; }     /* V1.1 字号规范：0.88→1rem (16px) */
.hint-strong {
  color: #ffd45a;
  font-weight: 600;
  font-size: 1.05rem;
  text-shadow: 0 0 8px rgba(255,212,90,0.5);
  margin: 0 2px;
}

/* ================= 三物网格 ================= */
.items-grid {
  display: flex;
  gap: 28px;
  margin-bottom: 36px;
  flex-wrap: wrap;
  justify-content: center;
}

/* 单个物品卡 */
.desk-item {
  position: relative;
  width: 150px;
  padding: 22px 14px 18px;
  background: rgba(28,24,20,0.55);
  border: 2px solid rgba(184,149,108,0.18);
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.32s cubic-bezier(0.16,1,0.3,1);
  overflow: visible;
}
.desk-item:hover:not(.done):not(.clicked) {
  background: rgba(58,46,32,0.7);
  border-color: rgba(255,212,90,0.5);
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 12px 28px rgba(0,0,0,0.5), 0 0 24px rgba(255,212,90,0.15);
}

/* 当前待点目标（呼吸光环） */
.desk-item.next {
  border-color: rgba(255,212,90,0.45);
  animation: next-pulse 2.4s ease-in-out infinite;
}
@keyframes next-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(255,212,90,0.0), 0 0 0 0 rgba(255,212,90,0.0); }
  50% { box-shadow: 0 0 0 6px rgba(255,212,90,0.06), 0 0 22px 4px rgba(255,212,90,0.22); }
}

/* 已点击：金色持续光晕 */
.desk-item.clicked {
  background: rgba(72,52,28,0.65);
  border-color: rgba(255,212,90,0.65);
  box-shadow: 0 0 24px rgba(255,212,90,0.28), 0 8px 20px rgba(0,0,0,0.4);
}
.desk-item.clicked .item-icon { filter: drop-shadow(0 0 12px rgba(255,212,90,0.45)); }
.desk-item.clicked .item-name { color: #ffe4a8; }

/* 已完成态 */
.desk-item.done {
  cursor: default;
}

/* ================= 光环层 ================= */
.item-aura {
  position: absolute;
  inset: -10px;
  border-radius: 16px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.4s;
}
.item-aura.hint {
  opacity: 0;
}
.item-aura.active {
  opacity: 1;
  box-shadow: inset 0 0 30px rgba(255,212,90,0.15);
}

/* ================= 图标 ================= */
.item-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 88px;
  margin-bottom: 10px;
  position: relative;
}
.icon-svg {
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
  transition: filter 0.32s;
}

/* 灯光持续摇曳 */
.lamp-glow {
  animation: lamp-flicker 3.2s ease-in-out infinite;
  transform-origin: 30px 22px;
}
.lamp-flame {
  animation: lamp-flame-dance 1.6s ease-in-out infinite alternate;
  transform-origin: 30px 32px;
}
@keyframes lamp-flicker {
  0%, 100% { opacity: 0.85; transform: scale(1); }
  30% { opacity: 1; transform: scale(1.04); }
  60% { opacity: 0.78; transform: scale(0.98); }
}
@keyframes lamp-flame-dance {
  0% { transform: scaleY(1) translateX(0); }
  50% { transform: scaleY(1.08) translateX(0.5px); }
  100% { transform: scaleY(0.96) translateX(-0.5px); }
}

/* ================= 名称 ================= */
.item-name {
  font-family: var(--font-serif);
  font-size: 1.05rem;
  color: rgba(232,228,223,0.85);
  margin-bottom: 4px;
  letter-spacing: 0.08em;
  transition: color 0.32s;
}

/* ================= 未点提示文字 ================= */
.item-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-family: var(--font-sans);
  font-size: 0.95rem;            /* V1.1 字号规范：0.78→0.95rem (15.2px) */
  color: rgba(220,200,170,0.5);
  font-style: italic;
  margin-bottom: 4px;
}
.hint-arrow {
  display: inline-block;
  color: #ffd45a;
  font-size: 0.65rem;
  animation: arrow-blink 1.4s ease-in-out infinite;
}
@keyframes arrow-blink {
  0%, 100% { opacity: 0.5; transform: translateX(0); }
  50% { opacity: 1; transform: translateX(2px); }
}

/* ================= 点击后描述（浮窗） ================= */
.item-feedback {
  position: absolute;
  left: 50%;
  top: calc(100% + 14px);
  transform: translateX(-50%) translateY(-6px);
  width: 220px;
  padding: 12px 14px;
  background: rgba(20,18,14,0.92);
  border: 1px solid rgba(255,212,90,0.4);
  border-radius: 8px;
  font-size: 0.95rem;            /* V1.1 字号规范：0.82→0.95rem (15.2px) */
  color: rgba(255,230,200,0.92);
  opacity: 0;
  pointer-events: none;
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
  line-height: 1.65;
  font-family: var(--font-serif);
  letter-spacing: 0.02em;
  box-shadow: 0 6px 18px rgba(0,0,0,0.6), 0 0 16px rgba(255,212,90,0.1);
  z-index: 50;
}
.item-feedback::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
  width: 10px;
  height: 10px;
  background: rgba(20,18,14,0.92);
  border-top: 1px solid rgba(255,212,90,0.4);
  border-left: 1px solid rgba(255,212,90,0.4);
}
.item-feedback.show {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

/* ================= 已点对勾 ================= */
.item-check {
  position: absolute;
  top: 8px;
  right: 10px;
  width: 22px;
  height: 22px;
  background: #ffd45a;
  color: #2a1810;
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: 900;
  line-height: 22px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(255,212,90,0.5);
  animation: check-pop 0.4s cubic-bezier(0.34,1.56,0.64,1);
}
@keyframes check-pop {
  0% { transform: scale(0); opacity: 0; }
  60% { transform: scale(1.3); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

/* ================= 进度条（3 里程碑） ================= */
.progress-bar-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}
.prog-track {
  position: relative;
  width: 280px;
  height: 6px;
  background: rgba(255,255,255,0.08);
  border-radius: 3px;
  overflow: visible;
}
.prog-fill {
  position: absolute;
  left: 0; top: 0;
  height: 100%;
  background: linear-gradient(90deg, #ffd45a 0%, #ffaa3a 100%);
  border-radius: 3px;
  transition: width 0.5s cubic-bezier(0.16,1,0.3,1);
  box-shadow: 0 0 12px rgba(255,212,90,0.5);
}
.prog-mark {
  position: absolute;
  top: 50%;
  width: 18px;
  height: 18px;
  background: rgba(28,24,20,0.9);
  border: 2px solid rgba(184,149,108,0.3);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.62rem;
  color: rgba(184,149,108,0.5);
  font-family: var(--font-sans);
  font-weight: 600;
  transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
}
.prog-mark:nth-child(2) { left: 0%; }
.prog-mark:nth-child(3) { left: 50%; }
.prog-mark:nth-child(4) { left: 100%; }
.prog-mark.on {
  background: #ffd45a;
  border-color: #ffd45a;
  color: #2a1810;
  box-shadow: 0 0 12px rgba(255,212,90,0.6);
  transform: translate(-50%, -50%) scale(1.15);
}
.prog-label {
  font-size: 0.78rem;
  color: rgba(220,200,170,0.6);
  font-family: var(--font-sans);
  letter-spacing: 0.05em;
}

/* ================= 下一步按钮 ================= */
.vn-next-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, rgba(60,46,28,0.92) 0%, rgba(40,30,18,0.95) 100%);
  border: 1px solid rgba(255,212,90,0.5);
  border-radius: 24px;
  color: rgba(255,230,200,0.95);
  font-family: var(--font-serif);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  z-index: 90;
  backdrop-filter: blur(4px);
  animation: btn-fade-in 0.5s cubic-bezier(0.16,1,0.3,1);
  box-shadow: 0 6px 18px rgba(0,0,0,0.4), 0 0 20px rgba(255,212,90,0.2);
  letter-spacing: 0.1em;
  transition: all 0.25s;
}
.vn-next-btn:hover {
  background: linear-gradient(135deg, rgba(80,60,32,0.95) 0%, rgba(60,42,22,0.98) 100%);
  border-color: rgba(255,212,90,0.8);
  color: #fff4d8;
  transform: translateY(-2px);
  box-shadow: 0 8px 22px rgba(0,0,0,0.5), 0 0 28px rgba(255,212,90,0.35);
}
.vn-arrow {
  font-size: 1rem;
  color: #ffd45a;
  transition: transform 0.25s;
}
.vn-next-btn:hover .vn-arrow { transform: translateX(3px); }
@keyframes btn-fade-in { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

/* ================= 墨水涟漪（全屏反馈） ================= */
.ink-stage {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 100;
  overflow: hidden;
}
.ink-ripple {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,212,90,0.5) 0%, rgba(184,149,108,0.3) 40%, transparent 70%);
  transform: translate(-50%, -50%);
  animation: ink-spread 1.5s cubic-bezier(0.16,1,0.3,1) forwards;
}
@keyframes ink-spread {
  0% {
    width: 12px;
    height: 12px;
    opacity: 0.9;
    filter: blur(0px);
  }
  60% {
    width: 280px;
    height: 280px;
    opacity: 0.35;
    filter: blur(2px);
  }
  100% {
    width: 480px;
    height: 480px;
    opacity: 0;
    filter: blur(6px);
  }
}
</style>