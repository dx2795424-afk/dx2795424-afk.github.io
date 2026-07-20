<template>
  <!-- 视觉小说底部对话框：使用 dialogue_box.png 底图，文字由 Vue 渲染 -->
  <Transition name="dialogue-rise">
    <div v-if="visible" class="dialogue-box" @click="handleClick">
      <!-- 独立资产底图（无烘入文字） -->
      <img src="/assets/dongpo/ui/dialogue_box.png" class="dialogue-box-bg" alt="" draggable="false" aria-hidden="true" />

      <!-- 人名牌 -->
      <div v-if="speaker" class="speaker-tag">
        <span class="speaker-name">{{ speaker }}</span>
      </div>

      <!-- 文字区域 -->
      <div class="dialogue-text-wrap">
        <p class="dialogue-text" :class="textClass">
          <span class="text-rendered">{{ displayedText }}</span><span v-if="!isComplete" class="cursor">|</span>
        </p>
      </div>

      <!-- 继续提示 -->
      <div v-if="isComplete" class="continue-hint">
        <span class="continue-arrow">▼</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'

const props = defineProps({
  visible: { type: Boolean, default: true },
  text: { type: String, default: '' },
  speaker: { type: String, default: '' },
  textClass: { type: String, default: 'narration' }, // 'narration' | 'dialogue' | 'system'
  charSpeed: { type: Number, default: 60 }, // ms per character（v0.3 调慢：原 30 → 60）
  autoAdvance: { type: Boolean, default: false },
  pauseSentences: { type: Array, default: () => [] } // sentences that get extra pause
})

const emit = defineEmits(['complete', 'advance'])

const displayedText = ref('')
const isComplete = ref(false)
let typingTimer = null
let charIndex = 0

const fullText = computed(() => props.text)

function getDelayForChar(char) {
  // v0.3 中文句子停顿（再加大：标点更久，给玩家阅读时间）
  if ('。！？…'.includes(char)) return 400
  if ('，、；：'.includes(char)) return 150
  // 关键句单独停顿
  const currentText = displayedText.value + char
  if (props.pauseSentences.some(s => currentText.endsWith(s))) return 500
  return props.charSpeed
}

function typeNext() {
  if (charIndex >= fullText.value.length) {
    completeTyping()
    return
  }
  const char = fullText.value[charIndex]
  displayedText.value += char
  charIndex++
  typingTimer = setTimeout(typeNext, getDelayForChar(char))
}

function completeTyping() {
  clearTimeout(typingTimer)
  displayedText.value = fullText.value
  isComplete.value = true
  emit('complete')
}

function startTyping() {
  clearTimeout(typingTimer)
  displayedText.value = ''
  charIndex = 0
  isComplete.value = false
  typingTimer = setTimeout(typeNext, 100)
}

function handleClick() {
  if (!isComplete.value) {
    completeTyping()
  } else {
    emit('advance')
  }
}

// Watch for text changes
watch(() => props.text, (newText) => {
  if (newText) {
    startTyping()
  }
})

watch(() => props.visible, (v) => {
  if (v && props.text) {
    startTyping()
  }
})

onMounted(() => {
  if (props.text && props.visible) {
    startTyping()
  }
})

onUnmounted(() => {
  clearTimeout(typingTimer)
})
</script>

<style scoped>
.dialogue-box {
  position: fixed;
  left: 16px;
  right: 16px;
  bottom: calc(44px + env(safe-area-inset-bottom, 0px));
  min-height: 160px;
  background:
    linear-gradient(135deg, rgba(242,235,216,0.62) 0%, rgba(236,228,208,0.65) 100%),
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  background-size: cover, 300px 300px;
  background-position: center, 0 0;
  background-repeat: no-repeat, repeat;
  border: 1px solid rgba(84,67,44,0.45);
  border-radius: 16px;
  box-shadow:
    0 16px 40px rgba(0,0,0,0.35),
    0 2px 8px rgba(0,0,0,0.15),
    inset 0 1px 0 rgba(255,255,255,0.3);
  padding: 18px 22px 14px;
  cursor: pointer;
  z-index: 100;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  overflow: hidden;
}

/* 独立资产对话底图（全屏覆盖在容器内） */
.dialogue-box-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
  pointer-events: none;
  opacity: 0.92;
}

.dialogue-box > *:not(.dialogue-box-bg) {
  position: relative;
  z-index: 1;
}

/* 人名牌 */
.speaker-tag {
  position: absolute;
  top: -14px;
  left: 20px;
  background: linear-gradient(135deg, var(--vermillion, #8b3a3a) 0%, #6b2a2a 100%);
  color: #f5f0e6;
  padding: 3px 12px;
  border-radius: 4px;
  font-family: var(--font-serif, serif);
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  box-shadow: 0 2px 8px rgba(0,0,0,0.25);
  border: 1px solid rgba(139,58,58,0.5);
}

.speaker-name {
  font-weight: 600;
}

/* 文字区 */
.dialogue-text-wrap {
  min-height: 80px;
  padding-top: 8px;
}

.dialogue-text {
  font-family: "Noto Serif SC", "Source Han Serif SC", "SimSun", serif;
  font-size: 16px;
  line-height: 1.9;
  color: #2a241c;
  letter-spacing: 0.04em;
  word-break: break-word;
}

/* 旁白样式 */
.dialogue-text.narration {
  color: #3a3428;
  font-style: italic;
}

/* 对话样式 */
.dialogue-text.dialogue {
  color: #2a241c;
  font-weight: 500;
}

/* 系统提示样式 */
.dialogue-text.system {
  color: #5a4a38;
  font-size: 0.9rem;
  font-family: var(--font-sans, sans-serif);
}

/* 光标 */
.cursor {
  display: inline-block;
  animation: blink-cursor 0.7s step-end infinite;
  color: #8b3a3a;
  font-weight: 400;
  margin-left: 1px;
}
@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* 继续提示 */
.continue-hint {
  display: flex;
  justify-content: flex-end;
  margin-top: 6px;
}
.continue-arrow {
  color: rgba(84,67,44,0.5);
  font-size: 0.7rem;
  animation: bounce-arrow 1.2s ease-in-out infinite;
}
@keyframes bounce-arrow {
  0%, 100% { transform: translateY(0); opacity: 0.5; }
  50% { transform: translateY(3px); opacity: 1; }
}

@media (max-width: 700px) {
  .dialogue-box {
    left: 12px;
    right: 12px;
    bottom: calc(28px + env(safe-area-inset-bottom, 0px));
    min-height: 118px;
    padding: 14px 16px 12px;
    border-radius: 14px;
  }

  .dialogue-text-wrap {
    min-height: 58px;
    padding-top: 4px;
  }

  .dialogue-text {
    font-size: 15px;
    line-height: 1.72;
    letter-spacing: 0.02em;
  }

  .speaker-tag {
    top: -12px;
    left: 16px;
    font-size: 0.72rem;
  }
}

/* 动画 */
.dialogue-rise-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.dialogue-rise-leave-active {
  transition: all 0.25s ease-in;
}
.dialogue-rise-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.dialogue-rise-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
