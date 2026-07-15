<template>
  <Teleport to="body">
    <Transition name="log-slide">
      <div v-if="visible" class="log-overlay" @click.self="close">
        <div class="log-panel">
          <!-- 独立资产：日志卡底图（无烘入文字） -->
          <img src="/assets/dongpo/ui/log_card.png" class="log-panel-bg" alt="" draggable="false" aria-hidden="true" />

          <!-- Header -->
          <div class="log-header">
            <span class="log-title">日志</span>
            <span class="log-count">{{ entries.length }} 条</span>
            <button class="log-retro-btn" @click="openRetrospective">人生回溯</button>
            <button class="log-close-btn" @click="close" aria-label="关闭" data-testid="btn-log-close">×</button>
          </div>

          <!-- Log entries -->
          <div class="log-entries" ref="listEl">
            <div v-if="entries.length === 0" class="log-empty">
              暂无记录
            </div>
            <div
              v-for="entry in entries"
              :key="entry.id"
              class="log-entry"
              :class="'log-' + entry.type"
            >
              <div class="entry-meta">
                <span class="entry-scene">{{ sceneLabel(entry.sceneId) }}</span>
                <span class="entry-type-badge">{{ typeLabel(entry.type) }}</span>
              </div>
              <p class="entry-content">{{ entry.content }}</p>
              <div v-if="entry.meta && Object.keys(entry.meta).length" class="entry-meta-extra">
                <span v-if="entry.meta.choiceId">选项 {{ entry.meta.choiceId }}</span>
                <span v-if="entry.meta.flag">flag: {{ entry.meta.flag }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>

  <!-- Global toggle button -->
  <button
    v-if="showToggle"
    class="log-toggle-btn"
    data-testid="btn-open-log"
    @click="open"
    :class="{ 'has-new': hasNew }"
    aria-label="打开日志"
  >
    <span class="toggle-icon">☰</span>
  </button>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { gameState, getLogDisplay } from '../store/gameState.js'

const props = defineProps({
  showToggle: { type: Boolean, default: true }
})

const visible = ref(false)
const listEl = ref(null)
const hasNew = ref(false)

// Sync with global gameState so closeAllOverlays() can close the log
watch(() => gameState.showDialogueLog, (val) => {
  visible.value = val
})

const entries = computed(() => getLogDisplay(20))

// Auto-scroll to bottom when new entries arrive
watch(entries, async () => {
  hasNew.value = true
  await nextTick()
  if (listEl.value) {
    listEl.value.scrollTop = listEl.value.scrollHeight
  }
}, { deep: true })

function open() {
  visible.value = true
  gameState.showDialogueLog = true
  hasNew.value = false
  nextTick(() => {
    if (listEl.value) listEl.value.scrollTop = listEl.value.scrollHeight
  })
}

function close() {
  visible.value = false
  gameState.showDialogueLog = false
}

function openRetrospective() {
  visible.value = false
  gameState.showDialogueLog = false
  gameState.archiveWallMode = 'retrospective'
  gameState.showArchiveWall = true
}

function sceneLabel(sceneId) {
  const labels = {
    S00: '加载页', S01: '首页', S02: '遗卷任务', S10: '眉山夜雨',
    S11: '书案三物', S12: '兄弟并行', S20: '京城成名', S21: '锋芒选择',
    S22: '风暴变暗', S23: '乌台惊魂', S24: '子由救援', S25: '风暴之后',
    S30: '黄州靠岸', S31: '黄州预算', S32: '村民送肉', S33: '东坡肉',
    S34: '东坡初成', S40: '月色入户', S41: '夜游探索', S42: '怀民选择',
    S43: '月下批注', S50: '结果页', S60: '分享海报', S70: '史实说明'
  }
  return labels[sceneId] || sceneId
}

function typeLabel(type) {
  const labels = {
    scene_enter: '进入',
    dialogue: '对白',
    choice: '选择',
    feedback: '反馈',
    annotation: '批注',
    system: '系统'
  }
  return labels[type] || type
}

// Expose open method for parent components
defineExpose({ open })
</script>

<style scoped>
.log-overlay {
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(10, 10, 10, 0.7);
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.log-panel {
  width: 100%;
  max-width: 480px;
  max-height: 75vh;
  background: linear-gradient(180deg, rgba(26, 28, 30, 0.85) 0%, rgba(18, 20, 26, 0.88) 100%);
  border: 1px solid rgba(180, 160, 120, 0.3);
  border-bottom: none;
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

/* 独立资产：日志卡底图 */
.log-panel-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
  pointer-events: none;
  opacity: 0.85;
}

.log-panel > *:not(.log-panel-bg) {
  position: relative;
  z-index: 1;
}

.log-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px 10px;
  border-bottom: 1px solid rgba(180, 160, 120, 0.2);
  flex-shrink: 0;
}

.log-title {
  font-family: var(--font-serif, serif);
  font-size: 1rem;
  color: var(--old-gold, #b8956c);
  font-weight: 600;
}

.log-count {
  font-size: 0.75rem;
  color: rgba(180, 160, 120, 0.5);
  flex: 1;
}

.log-close-btn {
  background: none;
  border: none;
  color: rgba(180, 160, 120, 0.6);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  padding: 0 4px;
}

.log-retro-btn {
  background: none;
  border: 1px solid rgba(180, 160, 120, 0.3);
  border-radius: 12px;
  color: rgba(180, 160, 120, 0.6);
  font-size: 0.72rem;
  cursor: pointer;
  padding: 3px 10px;
  letter-spacing: 0.05em;
  transition: all 0.2s;
}
.log-retro-btn:hover {
  border-color: rgba(180, 160, 120, 0.5);
  color: rgba(180, 160, 120, 0.85);
}

.log-entries {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px 20px;
  scrollbar-width: thin;
  scrollbar-color: rgba(180, 160, 120, 0.3) transparent;
}

.log-empty {
  text-align: center;
  color: rgba(180, 160, 120, 0.4);
  font-size: 0.95rem;
  padding: 2rem 0;
}

.log-entry {
  padding: 8px 0;
  border-bottom: 1px solid rgba(180, 160, 120, 0.1);
}

.log-entry:last-child {
  border-bottom: none;
}

.entry-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.entry-scene {
  font-size: 0.7rem;
  color: rgba(180, 160, 120, 0.5);
}

.entry-type-badge {
  font-size: 0.65rem;
  padding: 1px 5px;
  border-radius: 3px;
  background: rgba(180, 160, 120, 0.15);
  color: rgba(180, 160, 120, 0.7);
}

.log-choice .entry-type-badge {
  background: rgba(92, 122, 92, 0.2);
  color: var(--bamboo-green, #5c7a5c);
}

.log-feedback .entry-type-badge {
  background: rgba(184, 115, 51, 0.15);
  color: var(--vermilion, #b43b3b);
}

.entry-content {
  font-size: 0.95rem;
  color: rgba(242, 235, 216, 0.85);
  line-height: 1.5;
  font-family: var(--font-serif, serif);
}

.entry-meta-extra {
  display: flex;
  gap: 8px;
  margin-top: 3px;
  font-size: 0.7rem;
  color: rgba(180, 160, 120, 0.45);
}

/* Toggle button — fixed top-right */
.log-toggle-btn {
  position: fixed;
  top: 14px;
  right: 14px;
  z-index: 8000;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(26, 28, 30, 0.85);
  border: 1px solid rgba(180, 160, 120, 0.3);
  color: rgba(180, 160, 120, 0.8);
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  transition: background 0.2s;
}

.log-toggle-btn:hover {
  background: rgba(40, 40, 40, 0.9);
}

.log-toggle-btn.has-new {
  border-color: var(--old-gold, #b8956c);
  color: var(--old-gold, #b8956c);
}

/* Transitions */
.log-slide-enter-active,
.log-slide-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.log-slide-enter-from,
.log-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
