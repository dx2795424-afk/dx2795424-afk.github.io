<template>
  <!-- Full-screen archive wall overlay -->
  <div
    v-if="visible"
    class="archive-wall"
    :class="`archive-wall--${mode}`"
    ref="wallRef"
    role="dialog"
    aria-modal="true"
    :aria-label="titleText"
  >
    <!-- 独立资产背景图：档案墙底图 -->
    <img src="/assets/dongpo/transitions/archive_wall_bg.png" class="aw-bg-image" alt="" draggable="false" />
    <div class="aw-bg-overlay" aria-hidden="true"></div>

    <!-- Layer 1: Background depth - subtle moon glow -->
    <div class="aw-layer aw-layer--bg" aria-hidden="true">
      <!-- Moon glow -->
      <div class="aw-moon"></div>
      <!-- Mist -->
      <div class="aw-mist"></div>
    </div>

    <!-- Layer 2: Floating poem fragments -->
    <FloatingPoemLayer :active="isAnimating" />

    <!-- Layer 3: Archive cards layer (background cards) -->
    <div class="aw-layer aw-layer--archive-bg" aria-hidden="true">
      <div
        v-for="card in backgroundArchiveCards"
        :key="card.id"
        class="aw-archive-bg-card"
        :style="card.style"
      >
        <span class="aw-archive-bg-card__title">{{ card.title }}</span>
      </div>
    </div>

    <!-- Layer 4: Scene / chapter cards (interactive) -->
    <div class="aw-layer aw-layer--chapter-cards">
      <TransitionGroup name="card-list" tag="div" class="aw-cards-container">
        <MemoryCard
          v-for="(card, index) in chapterCards"
          :key="card.chapter"
          :chapter="card.chapter"
          :title="card.title"
          :subtitle="card.subtitle"
          :chapter-number="index + 1"
          :is-active="activeChapter === card.chapter"
          :is-completed="isChapterCompleted(card.chapter)"
          :depth="getCardDepth(card.chapter)"
          :target-scene="card.targetScene"
          :style="getCardPosition(index)"
          @select="handleChapterSelect"
        />
      </TransitionGroup>
    </div>

    <!-- Layer 5: Character shadows -->
    <div class="aw-layer aw-layer--characters" aria-hidden="true">
      <div class="aw-character aw-character--sushi" :class="{ 'aw-character--visible': activeChapter === 'meishan' || activeChapter === 'capital' }"></div>
      <div class="aw-character aw-character--zidi" :class="{ 'aw-character--visible': activeChapter === 'mizhou' || activeChapter === 'wutai' }"></div>
      <div class="aw-character aw-character--huaimin" :class="{ 'aw-character--visible': activeChapter === 'chengtian' }"></div>
    </div>

    <!-- Layer 6: Particle light layer -->
    <div class="aw-layer aw-layer--particles" aria-hidden="true">
      <div
        v-for="p in particles"
        :key="p.id"
        class="aw-particle"
        :style="p.style"
      ></div>
    </div>

    <!-- Layer 7: UI / action layer (interactive) -->
    <div class="aw-layer aw-layer--ui">
      <!-- Title area -->
      <div class="aw-title-area">
        <Transition name="aw-title">
          <div :key="mode" class="aw-title-block">
            <h2 class="aw-title-main">{{ titleMain }}</h2>
            <p class="aw-title-sub">{{ titleSub }}</p>
          </div>
        </Transition>
      </div>

      <!-- Central narration -->
      <Transition name="aw-narrate">
        <div v-if="showNarrate" :key="narrateText" class="aw-narrate">
          <p class="aw-narrate__text">{{ narrateText }}</p>
        </div>
      </Transition>

      <!-- Action buttons -->
      <div class="aw-actions">
        <button
          v-if="showCloseAction"
          class="aw-btn aw-btn--close"
          @click="handleClose"
          aria-label="收起档案"
        >
          收起此卷
        </button>
        <button
          v-if="showBackAction"
          class="aw-btn aw-btn--back"
          @click="handleBack"
          aria-label="返回"
        >
          ← 返回
        </button>
      </div>

      <!-- Chapter status ribbon -->
      <div v-if="mode === 'opening'" class="aw-chapter-ribbon">
        <span
          v-for="c in chapterDefs"
          :key="c.chapter"
          class="aw-ribbon-item"
          :class="{
            'aw-ribbon-item--active': activeChapter === c.chapter,
            'aw-ribbon-item--done': isChapterCompleted(c.chapter)
          }"
        >{{ c.shortName }}</span>
      </div>

      <!-- Progress indicator (for log mode) -->
      <div v-if="mode === 'log' && logStats" class="aw-log-stats">
        <span class="aw-stat">{{ logStats.entries }} 条记录</span>
        <span class="aw-stat-divider">|</span>
        <span class="aw-stat">{{ logStats.chapters }} 章</span>
        <span class="aw-stat-divider">|</span>
        <span class="aw-stat">{{ logStats.choices }} 次选择</span>
      </div>
    </div>

    <!-- Archive grid overlay (decorative lines) -->
    <div class="aw-grid-overlay" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onUnmounted } from 'vue'
import FloatingPoemLayer from './FloatingPoemLayer.vue'
import MemoryCard from './MemoryCard.vue'
import { gameState } from '../store/gameState.js'

const props = defineProps({
  visible: { type: Boolean, default: false },
  mode: {
    type: String,
    default: 'opening' // 'opening' | 'log' | 'retrospective' | 'chapter-transition'
  },
  initialChapter: { type: String, default: 'meishan' },
  transitionFrom: { type: String, default: '' },
  transitionTo: { type: String, default: '' },
  narrateText: { type: String, default: '' },
  logStats: { type: Object, default: null },
  onSelect: { type: Function, default: null },
  onClose: { type: Function, default: null },
  onBack: { type: Function, default: null },
})

const wallRef = ref(null)
const isAnimating = ref(false)
const showNarrate = ref(false)
const activeChapter = ref(props.initialChapter)

// Chapter definitions
const chapterDefs = [
  { chapter: 'meishan',   title: '眉山少年',  subtitle: '家学、少年与成长',    shortName: '眉山', targetScene: 'S10', order: 0 },
  { chapter: 'capital',    title: '京城成名',  subtitle: '才名、风波与京城',    shortName: '京城', targetScene: 'S20', order: 1 },
  { chapter: 'mizhou',    title: '密州治理',  subtitle: '蝗灾、旱情与民生账',    shortName: '密州', targetScene: 'S26', order: 2 },
  { chapter: 'wutai',      title: '乌台风暴',  subtitle: '文字狱与子由救援',    shortName: '乌台', targetScene: 'S23', order: 3 },
  { chapter: 'huangzhou',  title: '黄州坠落',  subtitle: '小灶、烟火与账本',    shortName: '黄州', targetScene: 'S34', order: 4 },
  { chapter: 'chengtian', title: '承天夜游',  subtitle: '月色、怀民与自省',    shortName: '承天寺', targetScene: 'S39', order: 5 },
  { chapter: 'result',     title: '清风结卷',  subtitle: '东坡一生，一本清账',  shortName: '结卷', targetScene: 'S43', order: 6 },
]

const chapterCards = computed(() => {
  return chapterDefs.map((c) => ({
    ...c,
    subtitle: props.mode === 'retrospective' ? getChapterSummary(c.chapter) : c.subtitle,
    depth: activeChapter.value === c.chapter ? 0 : -1,
  }))
})

const backgroundArchiveCards = ref([])
const particles = ref([])

const titleMain = computed(() => {
  if (props.mode === 'log') return '清风档案墙'
  if (props.mode === 'retrospective') return '人生回溯'
  if (props.mode === 'opening') return '东坡清风纪'
  return ''
})

const titleSub = computed(() => {
  if (props.mode === 'log') return '翻阅你的修复记录'
  if (props.mode === 'retrospective') return '那些选择，都在这本账里'
  if (props.mode === 'opening') return '苏轼一生互动叙事游戏'
  return ''
})

const titleText = computed(() => {
  if (props.mode === 'log') return '清风档案墙'
  if (props.mode === 'retrospective') return '人生回溯墙'
  if (props.mode === 'opening') return '东坡清风纪 - 选择章节'
  return ''
})

const showCloseAction = computed(() => props.mode !== 'opening' || activeChapter.value !== null)
const showBackAction = computed(() => props.mode === 'log' || props.mode === 'retrospective')

function getChapterSummary(chapter) {
  const summaries = {
    meishan: '书案三物，兄弟并行',
    capital: '锋芒表达，京城成名',
    mizhou: '蝗灾旱灾，密州治理',
    wutai: '子由救援，乌台惊魂',
    huangzhou: '村民送肉，东坡肉预算',
    chengtian: '月下夜游，怀民相伴',
    result: '黄州一页，风清月明',
  }
  return summaries[chapter] || ''
}

function isChapterCompleted(chapter) {
  const order = chapterDefs.findIndex(c => c.chapter === chapter)
  const currentOrder = chapterDefs.findIndex(c => c.chapter === activeChapter.value)
  return currentOrder > order
}

function getCardDepth(chapter) {
  const order = chapterDefs.findIndex(c => c.chapter === chapter)
  const currentOrder = chapterDefs.findIndex(c => c.chapter === activeChapter.value)
  const diff = order - currentOrder
  if (diff === 0) return 0
  if (diff === 1) return 1
  if (diff === -1) return -1
  return diff > 0 ? 2 : -2
}

function getCardPosition(index) {
  const positions = [
    { x: 0, y: 0 },
    { x: 180, y: 40 },
    { x: -170, y: 50 },
    { x: 130, y: -60 },
    { x: -120, y: -50 },
    { x: 50, y: 100 },
  ]
  return {
    position: 'absolute',
    left: `calc(50% - 80px + ${positions[index % positions.length].x}px)`,
    top: `calc(45% - 105px + ${positions[index % positions.length].y}px)`,
  }
}

function handleChapterSelect(targetScene) {
  // Only navigate when player actively clicks a chapter card
  const card = chapterDefs.find(c => c.targetScene === targetScene)
  if (card) {
    activeChapter.value = card.chapter
    if (typeof props.onSelect === 'function') {
      props.onSelect(targetScene, card.chapter)
    }
  }
}

// 关闭：仅关闭浮层，不导航回到原场景
function handleClose() {
  if (typeof props.onClose === 'function') {
    props.onClose()
  }
}

// 返回（回到 S01 首页，仅在 log/retrospective 模式触发）
function handleBack() {
  if (typeof props.onBack === 'function') {
    props.onBack()
  }
}

function playEntrance() {
  if (!wallRef.value) return
  isAnimating.value = true
  // Reset
  const wall = wallRef.value
  wall.style.opacity = '0'
  const layers = wall.querySelectorAll('.aw-layer--chapter-cards, .aw-layer--archive-bg, .aw-layer--characters, .aw-layer--particles, .aw-layer--ui')
  layers.forEach((el) => {
    el.style.opacity = '0'
  })
  // 简单 CSS fade-in
  requestAnimationFrame(() => {
    wall.style.transition = 'opacity 0.8s ease, transform 0.8s ease'
    wall.style.opacity = '1'
    setTimeout(() => {
      layers.forEach((el) => {
        el.style.transition = 'opacity 0.6s ease'
        el.style.opacity = '1'
      })
      showNarrate.value = true
    }, 200)
  })
}

function generateBackgroundCards() {
  const cards = [
    { id: 1, title: '乌台案卷·其一', style: { top: '15%', left: '3%', transform: 'rotate(-3deg)' } },
    { id: 2, title: '子由来信', style: { top: '20%', right: '5%', transform: 'rotate(2deg)' } },
    { id: 3, title: '黄州账页·甲', style: { bottom: '25%', left: '6%', transform: 'rotate(1deg)' } },
    { id: 4, title: '东坡肉谱', style: { bottom: '18%', right: '8%', transform: 'rotate(-2deg)' } },
    { id: 5, title: '承天寺夜游记', style: { top: '35%', left: '8%', transform: 'rotate(-1deg)' } },
    { id: 6, title: '诗文残稿·壬', style: { top: '40%', right: '3%', transform: 'rotate(3deg)' } },
    { id: 7, title: '清风账', style: { bottom: '35%', left: '15%', transform: 'rotate(-2deg)' } },
  ]
  backgroundArchiveCards.value = cards
}

function generateParticles() {
  const ps = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    style: {
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 3 + 1}px`,
      height: `${Math.random() * 3 + 1}px`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${Math.random() * 8 + 6}s`,
      opacity: Math.random() * 0.3 + 0.05,
    }
  }))
  particles.value = ps
}

watch(() => props.visible, (val) => {
  if (val) {
    generateBackgroundCards()
    generateParticles()
    setTimeout(() => playEntrance(), 50)
  } else {
    isAnimating.value = false
    showNarrate.value = false
  }
})

onUnmounted(() => {
  isAnimating.value = false
})
</script>

<style scoped>
/* ── Main container ─────────────────────────────────────── */
.archive-wall {
  position: fixed;
  inset: 0;
  z-index: 900;
  background: #0a0a12;
  overflow: hidden;
  will-change: opacity, transform;
}

/* 独立资产档案墙底图 */
.aw-bg-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
}

.aw-bg-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(10, 10, 18, 0.45) 0%, rgba(10, 10, 18, 0.85) 100%),
    linear-gradient(180deg, rgba(8, 8, 14, 0.4), rgba(8, 8, 14, 0.7));
}

/* ── Layers ─────────────────────────────────────────────── */
.aw-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.aw-layer--chapter-cards,
.aw-layer--ui {
  pointer-events: auto;
  z-index: 20;
}

/* ── Layer 1: Background ───────────────────────────────── */
.aw-layer--bg {
  z-index: 1;
}

.aw-moon {
  position: absolute;
  top: 8%;
  right: 15%;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 40%, #f0ead8, #d8d0bc 50%, #b8b0a0);
  box-shadow:
    0 0 30px rgba(216, 220, 232, 0.3),
    0 0 80px rgba(216, 220, 232, 0.12),
    0 0 160px rgba(216, 220, 232, 0.06);
  opacity: 0.85;
  will-change: transform;
}

.aw-mountains {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 45%;
}

.mountain-1 {
  fill: #1a1a28;
  opacity: 0.9;
}

.mountain-2 {
  fill: #12121e;
  opacity: 0.95;
}

.aw-mist {
  position: absolute;
  bottom: 20%;
  left: -10%;
  right: -10%;
  height: 30%;
  background: linear-gradient(180deg, transparent, rgba(26,26,40,0.4) 50%, transparent);
  animation: mist-drift 25s ease-in-out infinite;
}

@keyframes mist-drift {
  0%, 100% { transform: translateX(0); opacity: 0.6; }
  50% { transform: translateX(5%); opacity: 0.9; }
}

/* ── Layer 3: Background archive cards ───────────────────── */
.aw-layer--archive-bg {
  z-index: 3;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 40px;
}

.aw-archive-bg-card {
  position: absolute;
  background: rgba(245, 240, 230, 0.06);
  border: 1px solid rgba(232, 228, 223, 0.08);
  border-radius: 3px;
  padding: 8px 12px;
  min-width: 120px;
}

.aw-archive-bg-card__title {
  font-family: var(--font-serif);
  font-size: 0.65rem;
  color: rgba(232, 228, 223, 0.2);
  letter-spacing: 0.1em;
  white-space: nowrap;
}

/* ── Layer 4: Chapter cards ─────────────────────────────── */
.aw-layer--chapter-cards {
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.aw-cards-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* ── Layer 5: Character shadows ─────────────────────────── */
.aw-layer--characters {
  z-index: 5;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 60px;
  padding-bottom: 8%;
}

.aw-character {
  width: 60px;
  height: 120px;
  background: linear-gradient(180deg, rgba(26,26,40,0.6), transparent);
  border-radius: 30px 30px 0 0;
  opacity: 0;
  transition: opacity 1s ease;
  will-change: opacity;
  filter: blur(1px);
}

.aw-character--sushi { background: linear-gradient(180deg, rgba(212,196,168,0.25), transparent); }
.aw-character--zidi  { background: linear-gradient(180deg, rgba(184,149,108,0.2), transparent); }
.aw-character--huaimin { background: linear-gradient(180deg, rgba(216,220,232,0.3), transparent); }

.aw-character--visible {
  opacity: 1;
  animation: character-breathe 4s ease-in-out infinite;
}

@keyframes character-breathe {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.02); }
}

/* ── Layer 6: Particles ────────────────────────────────── */
.aw-layer--particles {
  z-index: 6;
}

.aw-particle {
  position: absolute;
  border-radius: 50%;
  background: rgba(232, 228, 223, 0.6);
  animation: particle-float linear infinite;
  will-change: transform, opacity;
}

@keyframes particle-float {
  0% { transform: translateY(0) translateX(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(-100vh) translateX(20px); opacity: 0; }
}

/* ── Layer 7: UI ────────────────────────────────────────── */
.aw-layer--ui {
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: center;
  pointer-events: none;
}

.aw-layer--ui > * {
  pointer-events: auto;
}

/* Title area */
.aw-title-area {
  padding: env(safe-area-inset-top, 16px) 20px 0;
  text-align: center;
  margin-top: 24px;
}

.aw-title-main {
  font-family: var(--font-serif);
  font-size: 1.6rem;
  color: var(--moon-white);
  letter-spacing: 0.15em;
  font-weight: 600;
  text-shadow: 0 2px 12px rgba(0,0,0,0.6);
  margin-bottom: 6px;
}

.aw-title-sub {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  color: rgba(232,228,223,0.45);
  letter-spacing: 0.2em;
}

/* Narration */
.aw-narrate {
  position: absolute;
  bottom: 100px;
  left: 20px;
  right: 20px;
  text-align: center;
  pointer-events: none;
}

.aw-narrate__text {
  display: inline-block;
  font-family: var(--font-serif);
  font-size: 0.85rem;
  color: rgba(232,228,223,0.6);
  line-height: 1.8;
  background: rgba(10,10,18,0.6);
  padding: 10px 20px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(232,228,223,0.08);
  letter-spacing: 0.05em;
}

/* Actions */
.aw-actions {
  position: absolute;
  top: env(safe-area-inset-top, 16px);
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-end;
}

.aw-btn {
  font-family: var(--font-sans);
  font-size: 0.7rem;
  letter-spacing: 0.15em;
  background: rgba(20,18,14,0.7);
  border: 1px solid rgba(184,149,108,0.25);
  border-radius: 16px;
  color: rgba(200,190,170,0.6);
  padding: 6px 14px;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s;
}

.aw-btn:hover {
  background: rgba(30,28,24,0.85);
  border-color: rgba(184,149,108,0.45);
  color: rgba(200,190,170,0.9);
}

/* Chapter ribbon */
.aw-chapter-ribbon {
  position: absolute;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(10,10,18,0.6);
  border: 1px solid rgba(232,228,223,0.08);
  border-radius: 20px;
  padding: 6px 12px;
  backdrop-filter: blur(4px);
}

.aw-ribbon-item {
  font-family: var(--font-sans);
  font-size: 0.6rem;
  color: rgba(232,228,223,0.25);
  letter-spacing: 0.1em;
  padding: 2px 6px;
  border-radius: 8px;
  transition: all 0.3s;
  cursor: default;
}

.aw-ribbon-item--active {
  color: rgba(184,149,108,0.9);
  background: rgba(184,149,108,0.08);
}

.aw-ribbon-item--done {
  color: rgba(92,122,92,0.7);
}

/* Log stats */
.aw-log-stats {
  position: absolute;
  top: env(safe-area-inset-top, 16px);
  left: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.aw-stat {
  font-family: var(--font-sans);
  font-size: 0.65rem;
  color: rgba(232,228,223,0.4);
  letter-spacing: 0.1em;
}

.aw-stat-divider {
  color: rgba(232,228,223,0.15);
}

/* Grid overlay (decorative) */
.aw-grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(232,228,223,0.015) 1px, transparent 1px),
    linear-gradient(90deg, rgba(232,228,223,0.015) 1px, transparent 1px);
  background-size: 60px 60px;
  pointer-events: none;
  z-index: 2;
}

/* ── Transitions ────────────────────────────────────────── */
.card-list-enter-active {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}
.card-list-leave-active {
  transition: all 0.4s ease;
  position: absolute;
}
.card-list-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}
.card-list-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.aw-title-enter-active,
.aw-title-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}
.aw-title-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.aw-title-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.aw-narrate-enter-active,
.aw-narrate-leave-active {
  transition: opacity 0.6s ease;
}
.aw-narrate-enter-from,
.aw-narrate-leave-to {
  opacity: 0;
}
</style>
