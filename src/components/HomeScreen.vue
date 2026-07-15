<template>
  <div class="home-screen scene-frame" :class="{ 'started': hasStarted }">

    <!-- ── 墨滴扩散动画层（z-index 低，永远在内容之下）────────── -->
    <div class="ink-drop-layer" :class="{ 'ink-dropped': inkDropped }">
      <div class="ink-drop-core"></div>
      <div class="ink-ripple ripple-1"></div>
      <div class="ink-ripple ripple-2"></div>
      <div class="ink-ripple ripple-3"></div>
    </div>

    <!-- ── 宣纸显影遮罩（z-index 低，覆盖动画层）──────────────── -->
    <div class="paper-reveal" :class="{ 'paper-cleared': paperCleared }">
      <div class="paper-texture"></div>
    </div>

    <!-- ── 墨水氛围层（最低层，装饰性）─────────────────────── -->
    <div class="ink-atmosphere" :class="{ 'atmosphere-visible': atmosphereVisible }">
      <div class="ink-blob blob-1"></div>
      <div class="ink-blob blob-2"></div>
      <div class="ink-blob blob-3"></div>
    </div>

    <!-- ══════════════════════════════════════════════════════
         中心内容：z-index 20，永远在动画层之上
         标题和按钮立即可见，不依赖 inkDropped/paperCleared
         ══════════════════════════════════════════════════════ -->
    <div class="home-center" :class="{ 'compact': hasStarted }">

      <!-- 印章 -->
      <div class="seal-container">
        <div class="seal-rotate">
          <div class="seal-body">
            <span class="seal-text">东坡</span>
          </div>
        </div>
      </div>

      <!-- 标题区 -->
      <div class="title-container">
        <p class="title-chapter">遗卷修复人</p>
        <h1 class="main-title">
          <span class="title-char" v-for="(c, i) in '东坡清风纪'" :key="i" :style="{animationDelay: `${0.8 + i * 0.08}s`}">{{ c }}</span>
        </h1>
        <p class="title-sub">苏轼一生互动叙事游戏</p>
        <p class="title-tagline">「{{ fixedTagline }}」</p>
      </div>

      <!-- 按钮组 -->
      <div class="home-actions">
        <button class="btn-start" data-testid="btn-start-game" @click="handleStart">
          <span class="btn-inner">开始修复遗卷</span>
        </button>
        <button class="btn-info" data-testid="btn-project-info" @click="showInfo = true">
          项目说明
        </button>
      </div>

    </div>

    <!-- ── 底部关键词 ─────────────────────────────────── -->
    <div class="keywords">
      <span>眉山</span>
      <span class="dot">·</span>
      <span>京城</span>
      <span class="dot">·</span>
      <span>乌台</span>
      <span class="dot">·</span>
      <span>黄州</span>
      <span class="dot">·</span>
      <span>承天寺</span>
    </div>

    <!-- ── 项目说明弹窗 ───────────────────────────────── -->
    <Transition name="modal-fade">
      <div v-if="showInfo" class="modal-overlay" @click.self="showInfo = false">
        <div class="info-panel">
          <div class="info-header">
            <span class="info-seal">编</span>
            <h2>关于本游戏</h2>
          </div>
          <div class="info-body">
            <p>这是一款基于苏轼生平史实、适度情景改编的互动叙事游戏。</p>
            <p>历史大节点不乱改，玩家选择影响人物状态、关系负担和最终结局。</p>
            <p>游戏中涉及的二创桥段会在「史实卡/改编卡」中说明边界。</p>
            <hr>
            <p class="info-note">玩家作为「东坡遗卷修复人」，修复苏轼人生中的关键残页。每翻开一页，就进入苏轼人生的一个关键节点。</p>
          </div>
          <button class="btn-close" @click="showInfo = false">关闭</button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, watch, inject, onMounted } from 'vue'
import { setScene, gameState } from '../store/gameState.js'

const openArchiveWall = inject('openArchiveWall', null)

const showInfo   = ref(false)
const hasStarted = ref(false)

// 固定首页 tagline，不从 scenes.json 读取
const fixedTagline = '一生风雨，一本清账'

// Close project-info modal when navigating away from home
watch(() => gameState.currentScene, (scene) => {
  if (scene !== 'S01') {
    showInfo.value = false
  }
})

const inkDropped        = ref(false)
const paperCleared      = ref(false)
const atmosphereVisible = ref(false)

function handleStart() {
  hasStarted.value = true
  gameState.gameStarted = true
  setScene('S02')
}

onMounted(() => {
  // 动画序列：墨滴 → 宣纸 → 氛围（不影响内容可见性）
  setTimeout(() => { inkDropped.value = true }, 100)
  setTimeout(() => { paperCleared.value = true }, 900)
  setTimeout(() => { atmosphereVisible.value = true }, 1300)
})
</script>

<style scoped>
/* ── 主容器布局 ────────────────────────────────────── */
.home-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

/* ── 墨滴扩散动画层：永远在内容之下 ─────────────────── */
.ink-drop-layer {
  position: absolute;
  inset: 0;
  z-index: 1;        /* 降低：内容在 z-index 20 */
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ink-drop-core {
  position: absolute;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: rgba(30, 22, 15, 1);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: none;
}

.ink-ripple {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(20, 15, 10, 0);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

/* 墨滴展开：核心从小点 → 覆盖全屏 */
.ink-dropped .ink-drop-core {
  animation: ink-expand 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.ink-dropped .ripple-1 {
  width: 4px;
  height: 4px;
  border-color: rgba(20, 15, 10, 0.4);
  animation: ripple-expand 1.0s 0.05s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.ink-dropped .ripple-2 {
  width: 4px;
  height: 4px;
  border-color: rgba(20, 15, 10, 0.25);
  animation: ripple-expand 0.9s 0.12s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.ink-dropped .ripple-3 {
  width: 4px;
  height: 4px;
  border-color: rgba(20, 15, 10, 0.15);
  animation: ripple-expand 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes ink-expand {
  0%   { width: 4px; height: 4px; border-radius: 50%; opacity: 1; }
  60%  { width: 160px; height: 160px; border-radius: 42% 58% 55% 45% / 48% 52% 55% 45%; opacity: 0.95; }
  100% { width: 280px; height: 280px; border-radius: 42% 58% 55% 45% / 48% 52% 55% 45%; opacity: 0.9; }
}

@keyframes ripple-expand {
  0%   { width: 4px; height: 4px; opacity: 0.8; }
  100% { width: 600px; height: 600px; opacity: 0; }
}

/* ── 宣纸显影遮罩：永远在动画层之下 ─────────────────── */
.paper-reveal {
  position: absolute;
  inset: 0;
  z-index: 2;        /* 动画遮罩，降低层级 */
  pointer-events: none;
  background: #0d0b08;
  opacity: 1;
  transition: opacity 0.8s ease;
}

.paper-reveal.paper-cleared {
  opacity: 0;
  pointer-events: none;
}

.paper-texture {
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(
      0deg,
      rgba(255,248,230,0.015) 0px,
      rgba(255,248,230,0.015) 1px,
      transparent 1px,
      transparent 3px
    ),
    repeating-linear-gradient(
      90deg,
      rgba(255,248,230,0.010) 0px,
      rgba(255,248,230,0.010) 1px,
      transparent 1px,
      transparent 5px
    );
}

/* ── 墨水氛围层（最低层）────────────────────────────── */
.ink-atmosphere {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;       /* 最低层 */
  opacity: 0;
  transition: opacity 1.2s ease;
}

.atmosphere-visible .ink-atmosphere {
  opacity: 1;
}

/* ── 中心内容：z-index 20，永远在动画层之上 ──────────── */
.home-center {
  position: relative;
  z-index: 20;       /* 关键：永远在 ink-drop-layer (z:1) 之上 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  max-width: 420px;
  padding: 1rem;
}

/* ── 印章 ──────────────────────────────────────────── */
.seal-container {
  margin-bottom: 1.5rem;
  animation: seal-entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both;
}

@keyframes seal-entrance {
  from { opacity: 0; transform: translateY(-16px) scale(0.88); }
  to   { opacity: 1; transform: translateY(0) scale(1); }
}

.seal-rotate {
  display: inline-block;
  animation: seal-spin 0.6s ease 1s both;
}

@keyframes seal-spin {
  from { transform: rotate(-15deg) scale(0.8); opacity: 0; }
  to   { transform: rotate(0deg) scale(1); opacity: 1; }
}

.seal-body {
  width: 52px;
  height: 52px;
  border: 2px solid var(--vermilion, #c84030);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(200, 64, 48, 0.06);
  transform: rotate(3deg);
}

.seal-text {
  font-family: var(--font-serif, serif);
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--vermilion, #c84030);
  letter-spacing: 0.1em;
  line-height: 1;
}

/* ── 标题 ─────────────────────────────────────────── */
.title-container {
  margin-bottom: 2.5rem;
  animation: title-entrance 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both;
}

@keyframes title-entrance {
  from { opacity: 0; transform: translateY(-10px); }
  to   { opacity: 1; transform: translateY(0); }
}

.title-chapter {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.75rem;
  color: rgba(184, 149, 108, 0.7);
  letter-spacing: 0.25em;
  text-transform: uppercase;
  margin: 0 0 0.6rem;
}

.main-title {
  font-family: var(--font-serif, serif);
  font-size: 2.4rem;
  font-weight: 700;
  color: var(--moon-white, #e8e4df);
  letter-spacing: 0.12em;
  margin: 0 0 0.6rem;
  line-height: 1.2;
  overflow: visible;
}

.title-sub {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.8rem;
  color: rgba(200, 190, 170, 0.6);
  letter-spacing: 0.2em;
  margin: 0 0 0.8rem;
}

.title-tagline {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.85rem;
  color: rgba(184, 149, 108, 0.8);
  margin: 0;
  font-style: italic;
  letter-spacing: 0.05em;
}

/* 标题逐字动画 */
.title-char {
  display: inline-block;
  opacity: 0;
  transform: translateY(20px);
  animation: char-rise 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes char-rise {
  0%   { opacity: 0; transform: translateY(20px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* ── 按钮组 ─────────────────────────────────────────── */
.home-actions {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  animation: actions-entrance 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.9s both;
}

@keyframes actions-entrance {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

.btn-start {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 220px;
  padding: 0.85rem 2rem;
  background: transparent;
  border: 1px solid rgba(184, 149, 108, 0.6);
  border-radius: 2px;
  color: var(--moon-white, #e8e4df);
  font-family: var(--font-sans, sans-serif);
  font-size: 0.95rem;
  letter-spacing: 0.15em;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.btn-start::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(184, 149, 108, 0.08);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-start:hover::before { opacity: 1; }
.btn-start:hover {
  border-color: rgba(184, 149, 108, 0.9);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}
.btn-start:active { transform: translateY(0); }

.btn-inner {
  position: relative;
  z-index: 1;
}

.btn-info {
  background: none;
  border: none;
  color: rgba(200, 190, 170, 0.45);
  font-family: var(--font-sans, sans-serif);
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  cursor: pointer;
  padding: 0.4rem 0.8rem;
  transition: color 0.2s ease;
}
.btn-info:hover { color: rgba(200, 190, 170, 0.8); }

/* ── 底部关键词 ─────────────────────────────────────── */
.keywords {
  position: absolute;
  bottom: 24px;
  left: 0;
  right: 0;
  text-align: center;
  font-family: var(--font-sans, sans-serif);
  font-size: 0.7rem;
  color: rgba(200, 190, 170, 0.3);
  letter-spacing: 0.2em;
  z-index: 25;       /* 高于动画层 */
  display: flex;
  justify-content: center;
  gap: 4px;
  flex-wrap: wrap;
  animation: keywords-fade 1s ease 1.5s both;
}

@keyframes keywords-fade {
  from { opacity: 0; }
  to   { opacity: 1; }
}

.dot { color: rgba(184, 149, 108, 0.3); }

/* ── 项目说明弹窗 ──────────────────────────────────── */
.modal-overlay {
  position: absolute;
  inset: 0;
  z-index: 200;
  background: rgba(10, 10, 10, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.info-panel {
  background: #1a1a1a;
  border: 1px solid rgba(184, 149, 108, 0.25);
  border-radius: 4px;
  max-width: 380px;
  width: 100%;
  padding: 1.5rem;
  text-align: left;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid rgba(184, 149, 108, 0.15);
}

.info-seal {
  width: 28px;
  height: 28px;
  border: 1px solid var(--vermilion, #c84030);
  border-radius: 2px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: var(--vermilion, #c84030);
  flex-shrink: 0;
  transform: rotate(2deg);
}

.info-header h2 {
  font-family: var(--font-serif, serif);
  font-size: 1rem;
  color: var(--moon-white, #e8e4df);
  margin: 0;
}

.info-body p {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.95rem;          /* V1.1 字号规范：正文 ≥ 15px */
  color: rgba(200, 190, 170, 0.75);
  line-height: 1.7;
  margin: 0 0 0.75rem;
}

.info-body hr {
  border: none;
  border-top: 1px solid rgba(184, 149, 108, 0.15);
  margin: 1rem 0;
}

.info-note {
  color: rgba(184, 149, 108, 0.9) !important;
}

.btn-close {
  margin-top: 1rem;
  width: 100%;
  padding: 0.65rem;
  background: rgba(184, 149, 108, 0.1);
  border: 1px solid rgba(184, 149, 108, 0.3);
  border-radius: 2px;
  color: rgba(200, 190, 170, 0.7);
  font-family: var(--font-sans, sans-serif);
  font-size: 0.8rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-close:hover {
  background: rgba(184, 149, 108, 0.2);
  color: rgba(200, 190, 170, 0.9);
}

/* 弹窗动画 */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-active .info-panel {
  animation: panel-slide 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes panel-slide {
  from { transform: translateY(20px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
</style>
