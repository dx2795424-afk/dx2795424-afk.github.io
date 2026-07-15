<template>
  <div
    class="archive-card"
    :class="[`archive-card--${type}`, { 'archive-card--focused': isFocused, 'archive-card--blurred': isBlurred }]"
    :style="cardStyle"
    @click="$emit('click', card)"
  >
    <!-- Seal stamp overlay -->
    <div v-if="sealText" class="archive-card__seal">{{ sealText }}</div>

    <!-- Card header -->
    <div class="archive-card__header">
      <span class="archive-card__chapter">{{ chapterLabel }}</span>
      <span v-if="sceneId" class="archive-card__scene">{{ sceneId }}</span>
    </div>

    <!-- Card body -->
    <div class="archive-card__body">
      <h3 class="archive-card__title">{{ title }}</h3>
      <p v-if="content" class="archive-card__content">{{ content }}</p>
    </div>

    <!-- Card meta -->
    <div v-if="meta" class="archive-card__meta">
      <span v-if="meta.time" class="archive-card__time">{{ meta.time }}</span>
      <span v-if="meta.variable" class="archive-card__variable" :class="meta.variableDelta > 0 ? 'positive' : 'negative'">
        {{ meta.variableLabel }} {{ meta.variableDelta > 0 ? '+' : '' }}{{ meta.variableDelta }}
      </span>
    </div>

    <!-- Archive edge decoration -->
    <div class="archive-card__edge" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  card: { type: Object, default: () => ({}) },
  title: { type: String, default: '' },
  content: { type: String, default: '' },
  type: { type: String, default: 'default' }, // 'fact' | 'choice' | 'scene' | 'result' | 'default'
  sceneId: { type: String, default: '' },
  chapter: { type: String, default: '' }, // 'meishan' | 'capital' | 'wutai' | 'huangzhou' | 'chengtian'
  meta: { type: Object, default: null },
  sealText: { type: String, default: '' },
  isFocused: { type: Boolean, default: false },
  isBlurred: { type: Boolean, default: false },
  depth: { type: Number, default: 0 }, // -2 to 2, for 3D transform
})

defineEmits(['click'])

const chapterLabels = {
  meishan: '眉山卷',
  capital: '京城卷',
  wutai: '乌台卷',
  huangzhou: '黄州卷',
  chengtian: '承天寺卷',
  result: '结卷',
}

const chapterLabel = computed(() => chapterLabels[props.chapter] || '')

// Compute 3D depth style
const cardStyle = computed(() => {
  const z = props.depth * 30 // 30px per depth level
  const rotateY = props.depth * 3 // slight rotation for 3D feel
  return {
    transform: `translateZ(${z}px) rotateY(${rotateY}deg)`,
    filter: props.isBlurred ? 'blur(3px) brightness(0.6)' : props.isFocused ? 'none' : 'brightness(0.85)',
    '--card-depth': props.depth,
  }
})
</script>

<style scoped>
.archive-card {
  position: relative;
  background: rgba(245, 240, 230, 0.92);
  border: 1px solid rgba(74, 74, 74, 0.25);
  border-radius: 4px;
  padding: 14px 16px;
  cursor: pointer;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.3s ease,
              box-shadow 0.3s ease;
  box-shadow:
    0 2px 8px rgba(0,0,0,0.3),
    0 calc(var(--card-depth, 0) * 8px) 20px rgba(0,0,0,0.15);
  min-width: 180px;
  max-width: 260px;
  pointer-events: auto;
  z-index: calc(10 + var(--card-depth, 0));
  transform-style: preserve-3d;
  will-change: transform, filter;
  overflow: hidden;
}

.archive-card:hover {
  transform: translateZ(20px) rotateY(0deg) scale(1.03) !important;
  box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  filter: none !important;
  z-index: 50;
}

.archive-card--focused {
  filter: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.35), 0 0 0 1px rgba(184,149,108,0.4);
}

.archive-card--blurred {
  filter: blur(3px) brightness(0.6);
  pointer-events: none;
}

/* Paper texture via CSS */
.archive-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 28px,
      rgba(74,74,74,0.04) 28px,
      rgba(74,74,74,0.04) 29px
    );
  pointer-events: none;
  border-radius: 4px;
}

/* Aged paper edge */
.archive-card__edge {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, rgba(74,74,74,0.15), transparent);
  pointer-events: none;
}

.archive-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.archive-card__chapter {
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.2em;
  color: var(--vermillion);
  text-transform: uppercase;
}

.archive-card__scene {
  font-family: var(--font-sans);
  font-size: 0.55rem;
  color: rgba(74,74,74,0.5);
  letter-spacing: 0.1em;
}

.archive-card__body {
  position: relative;
  z-index: 1;
}

.archive-card__title {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  color: #1a1a1a;
  line-height: 1.4;
  margin-bottom: 6px;
}

.archive-card__content {
  font-family: var(--font-serif);
  font-size: 0.78rem;
  color: #4a4a4a;
  line-height: 1.6;
}

.archive-card__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  padding-top: 8px;
  border-top: 1px solid rgba(74,74,74,0.1);
}

.archive-card__time {
  font-family: var(--font-sans);
  font-size: 0.6rem;
  color: rgba(74,74,74,0.5);
  letter-spacing: 0.05em;
}

.archive-card__variable {
  font-family: var(--font-sans);
  font-size: 0.6rem;
  padding: 1px 6px;
  border-radius: 10px;
}

.archive-card__variable.positive {
  background: rgba(92,122,92,0.15);
  color: #5c7a5c;
}

.archive-card__variable.negative {
  background: rgba(139,58,58,0.1);
  color: var(--vermillion);
}

/* Seal stamp */
.archive-card__seal {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  background: var(--vermillion);
  color: #f5f0e6;
  font-family: var(--font-serif);
  font-size: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.1;
  border-radius: 2px;
  opacity: 0.85;
  pointer-events: none;
  transform: rotate(-5deg);
  box-shadow: 0 1px 4px rgba(0,0,0,0.25);
}

/* Type variants */
.archive-card--fact {
  border-left: 3px solid var(--bamboo-green);
  background: rgba(240, 248, 240, 0.92);
}

.archive-card--choice {
  border-left: 3px solid var(--old-gold);
  background: rgba(248, 244, 236, 0.92);
}

.archive-card--scene {
  border-left: 3px solid var(--capital-cold);
  background: rgba(240, 244, 248, 0.92);
}

.archive-card--result {
  border-left: 3px solid var(--vermillion);
  background: rgba(248, 240, 236, 0.92);
}
</style>
