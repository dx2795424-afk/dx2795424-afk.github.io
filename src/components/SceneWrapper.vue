<!--
  SceneWrapper.vue — 统一视觉小说场景包装器

  用法:
  <SceneWrapper theme="meishan" :dialogue="text" speaker="旁白" @advance="nextStep">
    <template #character>
      <CharacterSilhouette character="sushi-young" position="right" />
    </template>

    <template #extras> ... </template>
  </SceneWrapper>
-->
<template>
  <div class="scene-wrapper" :class="'atmo-' + theme">

    <!-- 全屏场景背景 -->
    <BackgroundScene :theme="theme" />

    <!-- 顶部账目Ribbon -->
    <AccountRibbon v-if="showRibbon" />

    <!-- 人物剪影层 -->
    <div class="char-area">
      <slot name="character" />
    </div>

    <!-- 场景内容（剧情文字等） -->
    <div class="scene-content" :class="{ 'with-ribbon': showRibbon }">
      <slot />
    </div>

    <!-- 视觉小说对话框 -->
    <DialogueBox
      v-if="dialogue"
      :visible="showDialogue"
      :text="dialogue"
      :speaker="speaker"
      :text-class="dialogueClass"
      :pause-sentences="pauseSentences"
      @advance="handleAdvance"
    />

    <!-- 遮罩继续按钮（对话框未显示时） -->
    <button
      v-if="showContinue && !dialogue"
      class="continue-overlay-btn"
      @click="$emit('advance')"
    >
      <span class="co-btn-text">继续</span>
      <span class="co-arrow">▼</span>
    </button>

  </div>
</template>

<script setup>
import BackgroundScene from './BackgroundScene.vue'
import AccountRibbon from './AccountRibbon.vue'
import DialogueBox from './DialogueBox.vue'

defineProps({
  theme: {
    type: String,
    default: 'default',
    validator: v => ['home','meishan','capital','wutai','huangzhou','chengtian','result','share','credits','default'].includes(v)
  },
  dialogue: { type: String, default: '' },
  speaker: { type: String, default: '' },
  dialogueClass: { type: String, default: 'narration' },
  showRibbon: { type: Boolean, default: true },
  showDialogue: { type: Boolean, default: true },
  showContinue: { type: Boolean, default: false },
  pauseSentences: { type: Array, default: () => [] }
})

const emit = defineEmits(['advance'])

function handleAdvance() {
  emit('advance')
}
</script>

<style scoped>
.scene-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.char-area {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 10;
}

.scene-content {
  position: relative;
  z-index: 20;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.scene-content.with-ribbon {
  padding-top: 56px; /* ribbon height */
}

/* 继续覆盖按钮 */
.continue-overlay-btn {
  position: fixed;
  bottom: 24px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: rgba(20, 18, 14, 0.7);
  border: 1px solid rgba(184, 149, 108, 0.3);
  border-radius: 20px;
  color: rgba(200, 190, 170, 0.7);
  font-family: var(--font-sans, sans-serif);
  font-size: 0.8rem;
  cursor: pointer;
  z-index: 50;
  backdrop-filter: blur(4px);
  animation: co-pulse 2s ease-in-out infinite;
}
.co-arrow { font-size: 0.65rem; }
@keyframes co-pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
</style>
