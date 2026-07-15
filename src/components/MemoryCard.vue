<template>
  <div
    class="memory-card"
    :class="[`memory-card--${chapter}`, { 'memory-card--active': isActive, 'memory-card--locked': isLocked }]"
    :style="cardStyle"
    @click="handleClick"
    role="button"
    :aria-label="`翻开${title}`"
  >
    <!-- Atmospheric glow -->
    <div class="memory-card__glow" aria-hidden="true"></div>

    <!-- Card frame -->
    <div class="memory-card__frame">
      <!-- Chapter mark -->
      <div class="memory-card__chapter-mark">
        <span class="memory-card__chapter-num">{{ chapterNumber }}</span>
        <span class="memory-card__chapter-name">{{ chapterName }}</span>
      </div>

      <!-- Main content -->
      <div class="memory-card__main">
        <!-- Scene icon via CSS -->
        <div class="memory-card__icon" aria-hidden="true">
          <div class="memory-card__icon-inner"></div>
        </div>

        <h3 class="memory-card__title">{{ title }}</h3>
        <p v-if="subtitle" class="memory-card__subtitle">{{ subtitle }}</p>
      </div>

      <!-- Status indicators -->
      <div class="memory-card__status">
        <span v-if="isCompleted" class="memory-card__badge memory-card__badge--done">
          <span class="badge-dot"></span>
          已归档
        </span>
        <span v-else-if="isActive" class="memory-card__badge memory-card__badge--active">
          <span class="badge-dot"></span>
          待翻开
        </span>
        <span v-else class="memory-card__badge memory-card__badge--future">
          未至
        </span>
      </div>

      <!-- Seal / stamp -->
      <div v-if="isCompleted" class="memory-card__seal" aria-hidden="true">
        <span>已阅</span>
      </div>
    </div>

    <!-- Click prompt -->
    <div v-if="isActive && !isLocked" class="memory-card__prompt" aria-hidden="true">
      <span>点击翻开</span>
    </div>

    <!-- Ink edge decoration -->
    <div class="memory-card__ink-edge" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  chapter: {
    type: String,
    default: 'meishan'
  },
  title: { type: String, default: '' },
  subtitle: { type: String, default: '' },
  chapterNumber: { type: Number, default: 1 },
  isActive: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
  isLocked: { type: Boolean, default: false },
  depth: { type: Number, default: 0 },
  targetScene: { type: String, default: '' },
})

const emit = defineEmits(['select'])

const chapterNames = {
  meishan: '序幕',
  capital: '第一幕',
  wutai: '风暴',
  huangzhou: '第二幕',
  chengtian: '第三幕',
  result: '结卷',
}

const chapterName = computed(() => chapterNames[props.chapter] || '')

const cardStyle = computed(() => {
  const z = props.depth * 25
  const rotateY = props.depth * 4
  return {
    transform: `translateZ(${z}px) rotateY(${rotateY}deg)`,
    zIndex: 10 + props.depth,
  }
})

function handleClick() {
  if (!props.isLocked) {
    emit('select', props.targetScene)
  }
}
</script>

<style scoped>
.memory-card {
  position: relative;
  width: 160px;
  height: 210px;
  cursor: pointer;
  pointer-events: auto;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1),
              filter 0.4s ease;
  will-change: transform;
}

.memory-card:hover {
  transform: translateZ(30px) scale(1.06) rotateY(0deg) !important;
  filter: brightness(1.1);
  z-index: 60 !important;
}

.memory-card--active {
  cursor: pointer;
}

.memory-card--locked {
  cursor: default;
  filter: brightness(0.5) saturate(0.3);
  pointer-events: none;
}

.memory-card--meishan { --card-accent: #d4c4a8; }
.memory-card--capital { --card-accent: #a8b4c4; }
.memory-card--wutai   { --card-accent: #6b2a2a; }
.memory-card--huangzhou { --card-accent: #c4a882; }
.memory-card--chengtian { --card-accent: #d8dce8; }
.memory-card--result   { --card-accent: #8b3a3a; }

/* Atmospheric glow behind card */
.memory-card__glow {
  position: absolute;
  inset: -20px;
  background: radial-gradient(ellipse at 50% 30%, var(--card-accent), transparent 70%);
  opacity: 0.15;
  pointer-events: none;
  transition: opacity 0.4s;
  border-radius: 20px;
}

.memory-card:hover .memory-card__glow,
.memory-card--active .memory-card__glow {
  opacity: 0.25;
}

/* Main frame */
.memory-card__frame {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(13, 13, 18, 0.85);
  border: 1px solid rgba(232, 228, 223, 0.15);
  border-radius: 6px;
  padding: 16px 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  box-shadow:
    0 4px 20px rgba(0,0,0,0.4),
    inset 0 1px 0 rgba(232,228,223,0.05);
  transition: border-color 0.3s, box-shadow 0.3s;
}

.memory-card--active .memory-card__frame {
  border-color: rgba(184, 149, 108, 0.4);
  box-shadow: 0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px rgba(184,149,108,0.3);
}

.memory-card:hover .memory-card__frame {
  border-color: rgba(232, 228, 223, 0.3);
}

/* Subtle paper texture */
.memory-card__frame::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(135deg, rgba(245,240,230,0.03) 0%, transparent 60%),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 20px,
      rgba(232,228,223,0.015) 20px,
      rgba(232,228,223,0.015) 21px
    );
  pointer-events: none;
  border-radius: 6px;
}

/* Chapter mark */
.memory-card__chapter-mark {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}

.memory-card__chapter-num {
  font-family: var(--font-serif);
  font-size: 1.4rem;
  color: var(--card-accent);
  opacity: 0.7;
  line-height: 1;
  font-weight: 600;
}

.memory-card__chapter-name {
  font-family: var(--font-sans);
  font-size: 0.6rem;
  color: rgba(232,228,223,0.5);
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

/* Main content */
.memory-card__main {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
}

.memory-card__icon {
  width: 36px;
  height: 36px;
  border: 1px solid rgba(232,228,223,0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.memory-card__icon-inner {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--card-accent);
  opacity: 0.5;
}

.memory-card__title {
  font-family: var(--font-serif);
  font-size: 1rem;
  color: var(--moon-white);
  line-height: 1.4;
  font-weight: 600;
}

.memory-card__subtitle {
  font-family: var(--font-serif);
  font-size: 0.7rem;
  color: rgba(232,228,223,0.45);
  line-height: 1.5;
}

/* Status */
.memory-card__status {
  margin-top: 8px;
}

.memory-card__badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-sans);
  font-size: 0.6rem;
  letter-spacing: 0.15em;
}

.memory-card__badge--done {
  color: rgba(184,149,108,0.7);
}

.memory-card__badge--active {
  color: rgba(184,149,108,0.9);
}

.memory-card__badge--future {
  color: rgba(232,228,223,0.25);
}

.badge-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

.memory-card__badge--active .badge-dot {
  animation: badge-pulse 1.5s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(0.7); }
}

/* Seal stamp */
.memory-card__seal {
  position: absolute;
  bottom: 12px;
  right: 12px;
  width: 30px;
  height: 30px;
  background: var(--vermillion);
  color: #f5f0e6;
  font-family: var(--font-serif);
  font-size: 0.55rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  opacity: 0.75;
  transform: rotate(-5deg);
  pointer-events: none;
}

/* Click prompt */
.memory-card__prompt {
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-family: var(--font-sans);
  font-size: 0.6rem;
  color: rgba(184,149,108,0.6);
  letter-spacing: 0.15em;
  white-space: nowrap;
  animation: prompt-float 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes prompt-float {
  0%, 100% { opacity: 0.5; transform: translateX(-50%) translateY(0); }
  50% { opacity: 0.9; transform: translateX(-50%) translateY(-3px); }
}

/* Ink edge */
.memory-card__ink-edge {
  position: absolute;
  bottom: 0;
  left: 10%;
  right: 10%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(74,74,74,0.4), transparent);
  pointer-events: none;
}
</style>
