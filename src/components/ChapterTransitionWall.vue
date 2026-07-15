<template>
  <Transition name="chapter-transition">
    <div
      v-if="visible"
      class="chapter-wall"
      ref="wallRef"
      role="dialog"
      aria-modal="true"
    >
      <!-- 独立资产背景图（全屏 + 暗化蒙版） -->
      <img v-if="chapterBg" :src="chapterBg" class="cw-bg-image" alt="" draggable="false" />
      <div class="cw-bg-overlay" aria-hidden="true"></div>

      <!-- Outgoing chapter card (shrinks away) -->
      <div class="cw-card-slot cw-card-slot--out" aria-hidden="true">
        <div class="cw-card cw-card--out" ref="outCardRef">
          <div class="cw-card__chapter-tag">{{ fromChapterName }}</div>
          <h3 class="cw-card__title">{{ fromTitle }}</h3>
          <p class="cw-card__subtitle">{{ fromSubtitle }}</p>
          <div class="cw-card__seal cw-card__seal--archive">归档</div>
        </div>
      </div>

      <!-- Transition connector -->
      <div class="cw-connector" aria-hidden="true">
        <div class="cw-connector__line"></div>
        <p class="cw-connector__text">{{ connectorText }}</p>
      </div>

      <!-- Incoming chapter card (grows in) -->
      <div class="cw-card-slot cw-card-slot--in" aria-hidden="true">
        <div class="cw-card cw-card--in" ref="inCardRef">
          <div class="cw-card__chapter-tag">{{ toChapterName }}</div>
          <h3 class="cw-card__title">{{ toTitle }}</h3>
          <p class="cw-card__subtitle">{{ toSubtitle }}</p>
          <div class="cw-card__seal cw-card__seal--new">翻开</div>
        </div>
      </div>

      <!-- Action layer — 显式进入下一幕按钮 -->
      <div class="cw-actions">
        <button
          class="cw-btn"
          type="button"
          data-testid="btn-enter-next-chapter"
          @click="handleContinue"
        >
          <span class="cw-btn-arrow">→</span>
          <span>{{ continueText }}</span>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: false },
  fromChapter: { type: String, default: '' },
  fromTitle: { type: String, default: '' },
  fromSubtitle: { type: String, default: '' },
  toChapter: { type: String, default: '' },
  toTitle: { type: String, default: '' },
  toSubtitle: { type: String, default: '' },
  continueText: { type: String, default: '进入下一幕' },
  onContinue: { type: Function, default: null },
})

const wallRef = ref(null)
const outCardRef = ref(null)
const inCardRef = ref(null)

const chapterNames = {
  meishan: '序幕',
  capital: '第一幕',
  mizhou: '第三幕',
  wutai: '第四幕',
  huangzhou: '第五幕',
  chengtian: '第六幕',
  hangzhou: '第六幕',
  danzhou: '第七幕',
  result: '结卷',
  credits: '终章',
}

const fromChapterName = computed(() => chapterNames[props.fromChapter] || props.fromChapter)
const toChapterName = computed(() => chapterNames[props.toChapter] || props.toChapter)

// 章节转场背景：根据 from->to 选择对应的独立资产（无烘入文字）
const chapterBg = computed(() => {
  const pairs = {
    'capital-mizhou':   '/assets/dongpo/backgrounds/bg_capital_night.png',
    'mizhou-wutai':     '/assets/dongpo/transitions/chapter_mizhou_to_wutai.png',
    'wutai-huangzhou':  '/assets/dongpo/backgrounds/bg_wutai_storm.png',
    'huangzhou-chengtian': '/assets/dongpo/transitions/chapter_huangzhou_to_chengtian.png',
    'chengtian-hangzhou':  '/assets/dongpo/backgrounds/bg_chengtian_moon.png',
    'hangzhou-danzhou':    '/assets/dongpo/backgrounds/bg_huangzhou_stove.png',
    'danzhou-result':      '/assets/dongpo/backgrounds/bg_chengtian_moon.png',
  }
  return pairs[`${props.fromChapter}-${props.toChapter}`] || '/assets/dongpo/transitions/chapter_mizhou_to_wutai.png'
})

const connectorText = computed(() => {
  const pairs = {
    'meishan-capital': '才华照亮他，也把他推向风暴。',
    'capital-mizhou': '风波未平，远方有灾。',
    'mizhou-wutai': '风暴将至。',
    'wutai-huangzhou': '下一页，是黄州。',
    'huangzhou-chengtian': '月亮升起来了。',
    'chengtian-hangzhou': '月光合上，西湖展开。',
    'hangzhou-danzhou': '水光之后，是天涯海风。',
    'danzhou-result': '余火落账，清风结卷。',
    'chengtian-result': '合上黄州这一页。',
  }
  return pairs[`${props.fromChapter}-${props.toChapter}`] || '翻开下一页。'
})

function handleContinue() {
  // 始终调用：这是"进入下一幕"的明确入口
  if (typeof props.onContinue === 'function') {
    props.onContinue()
  }
}

watch(() => props.visible, (val) => {
  if (val) {
    // 重置卡片入场状态
    if (outCardRef.value) {
      outCardRef.value.style.opacity = '1'
      outCardRef.value.style.transform = 'scale(1) translate(0,0)'
    }
    if (inCardRef.value) {
      inCardRef.value.style.opacity = '0'
      inCardRef.value.style.transform = 'scale(0.85) translateY(40px)'
    }
    const btn = wallRef.value?.querySelector('.cw-btn')
    if (btn) {
      btn.style.opacity = '0'
    }
  }
})
</script>

<style scoped>
.chapter-wall {
  position: fixed;
  inset: 0;
  z-index: 800;
  background: #0c0c18;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 32px;
  overflow: hidden;
  will-change: opacity, transform;
}

/* 全屏背景图 + 暗化蒙版 */
.cw-bg-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
}

.cw-bg-overlay {
  position: absolute;
  inset: 0;
  z-index: 1;
  background:
    radial-gradient(ellipse at 50% 60%, rgba(12, 12, 24, 0.4) 0%, rgba(12, 12, 24, 0.85) 100%),
    linear-gradient(180deg, rgba(8, 8, 18, 0.55), rgba(8, 8, 18, 0.85));
}

/* Card slots */
.cw-card-slot {
  position: relative;
  z-index: 10;
}

.cw-card {
  position: relative;
  background: rgba(245, 240, 230, 0.94);
  border: 1px solid rgba(74, 74, 74, 0.2);
  border-radius: 4px;
  padding: 24px 32px;
  min-width: 220px;
  max-width: 300px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
  will-change: transform, opacity;
  transition: transform 1s cubic-bezier(0.16, 1, 0.3, 1), opacity 1s ease;
}

.cw-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(0deg, transparent, transparent 26px, rgba(74,74,74,0.04) 26px, rgba(74,74,74,0.04) 27px);
  border-radius: 4px;
  pointer-events: none;
}

.cw-card__chapter-tag {
  font-family: "Noto Serif SC", "Source Han Serif SC", var(--font-serif);
  font-size: 0.6rem;
  letter-spacing: 0.25em;
  color: var(--vermillion, #8F2F25);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.cw-card__title {
  font-family: "Noto Serif SC", "Source Han Serif SC", var(--font-serif);
  font-size: 1.3rem;
  color: #1a1a1a;
  line-height: 1.3;
  margin-bottom: 6px;
  font-weight: 600;
}

.cw-card__subtitle {
  font-family: "Noto Serif SC", "Source Han Serif SC", var(--font-serif);
  font-size: 0.8rem;
  color: #4a4a4a;
  line-height: 1.6;
}

.cw-card__seal {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Noto Serif SC", var(--font-serif);
  font-size: 0.55rem;
  color: #f5f0e6;
  border-radius: 2px;
  transform: rotate(-5deg);
  box-shadow: 0 1px 6px rgba(0,0,0,0.25);
}

.cw-card__seal--archive {
  background: rgba(74,74,74,0.5);
}

.cw-card__seal--new {
  background: var(--vermillion, #8F2F25);
}

/* Connector */
.cw-connector {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.cw-connector__line {
  width: 2px;
  height: 40px;
  background: linear-gradient(180deg, rgba(184,149,108,0.6), rgba(184,149,108,0.2));
  transform-origin: top;
  border-radius: 1px;
}

.cw-connector__text {
  font-family: "Noto Serif SC", "Source Han Serif SC", var(--font-serif);
  font-size: 0.8rem;
  color: rgba(232, 220, 195, 0.92);
  text-align: center;
  letter-spacing: 0.1em;
  line-height: 1.5;
  background: rgba(12, 10, 18, 0.5);
  padding: 6px 14px;
  border-radius: 4px;
  backdrop-filter: blur(4px);
}

/* Actions */
.cw-actions {
  position: relative;
  z-index: 10;
}

.cw-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: "Noto Serif SC", "Source Han Serif SC", var(--font-serif);
  font-size: 0.95rem;
  letter-spacing: 0.2em;
  background: rgba(20, 18, 14, 0.85);
  border: 1px solid rgba(184, 149, 108, 0.55);
  border-radius: 22px;
  color: rgba(232, 220, 195, 0.95);
  padding: 12px 28px;
  cursor: pointer;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  transition: all 0.2s;
  animation: cw-btn-fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0,0,0,0.4);
}

.cw-btn:hover {
  background: rgba(35, 30, 20, 0.92);
  border-color: rgba(224, 188, 126, 0.85);
  color: rgba(255, 245, 220, 1);
  transform: translateY(-1px);
  box-shadow: 0 8px 28px rgba(0,0,0,0.5);
}

.cw-btn:active {
  transform: translateY(0);
}

.cw-btn-arrow {
  font-size: 1.1em;
  color: rgba(224, 188, 126, 0.95);
}

@keyframes cw-btn-fade-in {
  0%   { opacity: 0; transform: translateY(8px); }
  100% { opacity: 1; transform: translateY(0); }
}

/* Transitions */
.chapter-transition-enter-active {
  transition: opacity 0.5s ease;
}
.chapter-transition-leave-active {
  transition: opacity 0.4s ease;
}
.chapter-transition-enter-from,
.chapter-transition-leave-to {
  opacity: 0;
}
</style>

