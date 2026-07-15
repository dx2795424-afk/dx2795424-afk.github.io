<template>
  <div class="scene-frame" @click="handleClick">
    <!-- 全局背景由 BackgroundScene(meishan) 处理 -->
    <!-- 顶部账目已由 App.vue 全局 AccountRibbon 处理 -->

    <!-- 章节标记 -->
    <div class="chapter-mark">序幕</div>

    <!-- 场景CG（已由背景提供，此处只叠加交互反馈） -->
    <div class="click-feedback" :class="{ active: hasClicked }">
      <CharacterSilhouette
        character="sushi-young"
        position="right"
        :opacity="hasClicked ? 0.75 : 0.5"
        :size="hasClicked ? 1.05 : 1"
      />
    </div>

    <!-- 场景文字（用 DialogueBox 替代原来的 p 标签） -->
    <DialogueBox
      :visible="showDialogue"
      :text="currentText"
      speaker=""
      text-class="narration"
      :pause-sentences="['也会把他推向风暴。']"
      @complete="onTextComplete"
      @advance="handleAdvance"
    />

    <!-- 继续按钮（无对话框时显示） -->
    <button
      v-if="showContinue"
      class="continue-btn"
      @click="handleNext"
    >
      <span>翻到下一页</span>
      <span class="arrow">→</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { setScene } from '../store/gameState.js'
import CharacterSilhouette from './CharacterSilhouette.vue'
import DialogueBox from './DialogueBox.vue'

const hasClicked = ref(false)
const showDialogue = ref(true)
const showContinue = ref(false)
const textIndex = ref(0)

const texts = [
  '眉山，冬夜。',
  '后来名满天下的苏轼，此时还只是一个少年。',
  '他不知道，才华会照亮他。',
  '也会把他推向风暴。'
]

const currentText = computed(() => texts[textIndex.value] || '')

function handleClick() {
  if (!hasClicked.value) {
    hasClicked.value = true
  }
}

function onTextComplete() {
  // 打字完成后自动进入下一步
  setTimeout(() => {
    if (textIndex.value < texts.length - 1) {
      textIndex.value++
    } else {
      showDialogue.value = false
      showContinue.value = true
    }
  }, 800)
}

function handleAdvance() {
  if (textIndex.value < texts.length - 1) {
    textIndex.value++
  } else {
    showDialogue.value = false
    showContinue.value = true
  }
}

function handleNext() {
  // S10 序幕 → S11 书案三物
  setScene('S11')
}
</script>

<style scoped>
.scene-frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  cursor: pointer;
}

.chapter-mark {
  position: fixed;
  top: 60px;
  left: 16px;
  z-index: 30;
  padding: 4px 14px;
  background: rgba(13, 13, 18, 0.8);
  border: 1px solid rgba(184, 149, 108, 0.2);
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  color: rgba(200, 190, 170, 0.55);
  letter-spacing: 0.2em;
  backdrop-filter: blur(4px);
}

.click-feedback {
  position: absolute;
  bottom: 0;
  right: 5%;
  z-index: 15;
  transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.continue-btn {
  position: fixed;
  bottom: 24px;
  right: 20px;
  z-index: 50;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: rgba(20, 18, 14, 0.7);
  border: 1px solid rgba(184, 149, 108, 0.35);
  border-radius: 20px;
  color: rgba(200, 190, 170, 0.75);
  font-family: var(--font-sans);
  font-size: 0.82rem;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s;
  animation: co-pulse 2s ease-in-out infinite;
}
.continue-btn:hover {
  background: rgba(30, 28, 24, 0.85);
  border-color: rgba(184, 149, 108, 0.55);
  color: rgba(200, 190, 170, 0.95);
}
.arrow { font-size: 0.8rem; }

@keyframes co-pulse {
  0%, 100% { opacity: 0.8; }
  50% { opacity: 1; }
}
</style>
