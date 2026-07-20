<template>
  <!-- 命运纸笺：场景压暗，选项从底部浮起 -->
  <Transition name="overlay-fade">
    <div v-if="visible" class="choice-overlay" role="dialog" aria-modal="true">

      <!-- 顶部导航栏 -->
      <div class="overlay-topbar">
        <button
          class="back-btn"
          @click="handleBack"
          :disabled="confirmedId !== null"
          :title="confirmedId !== null ? '已确认，不可返回' : '返回上一层'"
        >
          <span v-if="confirmedId !== null" class="back-lock">已</span>
          <span v-else class="back-arrow">←</span>
          <span v-if="confirmedId !== null" class="back-label-dim">已确认</span>
          <span v-else class="back-label">返回</span>
        </button>
        <span class="overlay-scene-label">命运选择</span>
        <div style="width: 70px;"></div>
      </div>

      <!-- 命题卷轴 -->
      <div class="choice-question-scroll">
        <h2 class="question-title">{{ question }}</h2>
        <p class="question-hint">这一笔，会影响他的风骨、名声，也会影响后来风暴的方向。</p>
      </div>

      <!-- 选项纸笺列表 -->
      <div class="choices-list" role="listbox" aria-label="选择项">
        <button
          v-for="(choice, index) in choices"
          :key="choice.id"
          class="choice-paper"
          :class="{
            'is-selected': selectedId === choice.id,
            'is-other-dim': selectedId !== null && selectedId !== choice.id,
            'is-warning': !!choice.warning && selectedId !== choice.id
          }"
          :style="{ animationDelay: `${index * 80}ms` }"
          role="option"
          :aria-selected="selectedId === choice.id"
          type="button"
          :data-testid="'choice-option-' + String.fromCharCode(65 + index)"
          @click="handleSelect(choice)"
        >
          <!-- 选项卡底图（独立资产，无文字） -->
          <img
            :src="getCardBg(choice, selectedId === choice.id)"
            class="choice-paper-bg"
            alt=""
            draggable="false"
            aria-hidden="true"
          />
          <div class="paper-accent" aria-hidden="true"></div>
          <div class="paper-content">
            <span class="choice-letter" aria-hidden="true">{{ String.fromCharCode(65 + index) }}</span>
            <div class="choice-text-wrap">
              <p class="choice-text">{{ choice.text }}</p>
              <p v-if="choice.warning" class="choice-warning" aria-live="polite">{{ choice.warning }}</p>
            </div>
            <!-- 账目变化 chips：仅在选中后才显示（v0.2 设计：点完才知道代价） -->
            <div
              v-if="selectedId === choice.id && getPredictedChanges(choice).length"
              class="choice-chips"
              aria-live="polite"
            >
              <span class="changes-label">这一笔，会记下：</span>
              <span
                v-for="(change, ci) in getPredictedChanges(choice)"
                :key="ci"
                class="choice-chip"
                :class="{
                  'chip-up': change.delta > 0,
                  'chip-down': change.delta < 0,
                  'chip-warn': change.isDanger
                }"
              >
                <span class="chip-arrow">{{ change.delta > 0 ? '△' : '▽' }}</span>
                <span class="chip-num">{{ change.delta > 0 ? '+' : '' }}{{ change.delta }}</span>
                <span class="chip-label">{{ change.shortLabel }}</span>
              </span>
              <span v-if="choice.warning" class="feedback-warning-inline">
                注意：{{ choice.warning }}
              </span>
            </div>
          </div>
          <div v-if="selectedId === choice.id && !confirmedId" class="seal-stamp" aria-hidden="true">
            <span>记</span>
          </div>
        </button>
      </div>

      <!-- 选择后反馈 + 继续按钮 -->
      <Transition name="feedback-reveal">
        <div v-if="selectedChoice && showFeedback" class="feedback-panel">
          <div class="feedback-inner">
            <!-- 预测账目变化 chips（醒目显示） -->
            <div v-if="getPredictedChanges(selectedChoice).length" class="feedback-changes">
              <span class="changes-label">这一笔，会记下：</span>
              <span
                v-for="(change, ci) in getPredictedChanges(selectedChoice)"
                :key="ci"
                class="change-chip"
                :class="{
                  'chip-up': change.delta > 0,
                  'chip-down': change.delta < 0,
                  'chip-warn': change.isDanger
                }"
              >
                <span class="chip-arrow">{{ change.delta > 0 ? '△' : '▽' }}</span>
                <span class="chip-num">{{ change.delta > 0 ? '+' : '' }}{{ change.delta }}</span>
                <span class="chip-label">{{ change.shortLabel }}</span>
              </span>
              <span v-if="selectedChoice.warning" class="feedback-warning">
                注意：{{ selectedChoice.warning }}
              </span>
            </div>

            <p class="feedback-text">{{ selectedChoice.feedback }}</p>

            <!-- 继续按钮（已默认确认） -->
            <button
              class="btn-continue"
              type="button"
              data-testid="btn-choice-continue"
              @click="handleContinue"
            >
              继续
            </button>

            <!-- 已记标识 -->
            <div class="confirmed-mark">
              <span class="confirmed-seal">已记</span>
              <span class="confirmed-hint">这一页，记完了。</span>
            </div>
          </div>
        </div>
      </Transition>

    </div>
  </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { goBackScene } from '../store/gameState.js'

const props = defineProps({
  visible: { type: Boolean, default: false },
  question: { type: String, default: '' },
  choices: { type: Array, default: () => [] }
})

const emit = defineEmits(['select', 'confirm', 'continue', 'back'])

const selectedId = ref(null)
const confirmedId = ref(null)
const showFeedback = ref(false)

const selectedChoice = computed(() =>
  props.choices.find(c => c.id === selectedId.value)
)

// 账目中文短标签 + 颜色（与 AccountRibbon 对齐）
const ACCOUNT_LABELS = {
  qingfeng:   { short: '清风', color: 'var(--bamboo-green, #5c7a5c)' },
  fenggu:     { short: '风骨', color: 'var(--old-gold, #b8956c)' },
  yanhuo:     { short: '烟火', color: 'var(--light-terracotta, #c4a77d)' },
  qinyou:     { short: '亲友', color: 'var(--vermillion, #8b3a3a)' },
  mingsheng:  { short: '名声', color: '#8a8aaa' },
  minsheng:   { short: '民生', color: '#6a8a5a' }
}

// 提取选项的预测账目变化（只显示非零）
function getPredictedChanges(choice) {
  if (!choice?.variables) return []
  return Object.entries(choice.variables)
    .filter(([, delta]) => delta && delta !== 0)
    .map(([key, delta]) => ({
      key,
      delta,
      shortLabel: ACCOUNT_LABELS[key]?.short || key,
      color: ACCOUNT_LABELS[key]?.color || '#888',
      // 亲友>70 是 danger，名声>70 是 warning
      isDanger: (key === 'qinyou' || key === 'mingsheng') && delta > 0
    }))
}

// 选项卡底图：依据状态返回不同独立资产（无烘入文字）
function getCardBg(choice, isSelected) {
  // 警告/污染选项：无论选中与否都使用警告底图，强化视觉警示
  if (choice?.warning) {
    return '/assets/dongpo/ui/choice_card_warning.png'
  }
  // 普通选中/未选中
  if (isSelected) return '/assets/dongpo/ui/choice_card_selected.png'
  return '/assets/dongpo/ui/choice_card_default.png'
}

function handleSelect(choice) {
  if (confirmedId.value) return
  if (selectedId.value === choice.id) return
  selectedId.value = choice.id
  confirmedId.value = choice.id  // 选择即确认，省掉中间"记下这一笔"步骤
  showFeedback.value = true
  emit('select', choice)
  emit('confirm', selectedChoice.value)  // 立即 emit confirm，让父组件 applyChoice 立即执行
}

function handleContinue() {
  emit('continue', selectedChoice.value)
}

function handleBack() {
  if (confirmedId.value) return
  emit('back')
  goBackScene()
}

watch(() => props.visible, (v) => {
  if (!v) {
    selectedId.value = null
    confirmedId.value = null
    showFeedback.value = false
  }
})
</script>

<style scoped>
/* ── 覆盖层 ── */
.choice-overlay {
  position: fixed;
  inset: 0;
  background: rgba(8, 10, 16, 0.84);
  z-index: 200;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 18px calc(150px + env(safe-area-inset-bottom, 0px));
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  pointer-events: auto;
  overflow-y: auto;
}

/* ── 顶部导航栏 ── */
.overlay-topbar {
  width: 100%;
  max-width: 480px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 4px 8px;
  margin-top: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(180,160,120,0.25);
  border-radius: 8px;
  padding: 6px 12px;
  color: rgba(180,160,120,0.8);
  font-size: 0.85rem;
  cursor: pointer;
  font-family: var(--font-serif, serif);
  transition: all 0.2s;
  min-width: 70px;
}

.back-btn:hover:not(:disabled) {
  background: rgba(255,255,255,0.1);
  border-color: rgba(180,160,120,0.5);
}

.back-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: rgba(180,160,120,0.15);
}

.back-label {
  color: rgba(180,160,120,0.8);
}

.back-label-dim {
  color: rgba(180,160,120,0.4);
  font-size: 0.75rem;
}

.overlay-scene-label {
  font-family: var(--font-serif, serif);
  font-size: 0.72rem;
  color: rgba(180,160,120,0.5);
  letter-spacing: 0.18em;
  text-align: center;
  flex: 1;
}

/* ── 命题卷轴 ── */
.choice-question-scroll {
  width: 100%;
  max-width: 480px;
  margin: 0 auto 18px;
  padding: 18px 20px 16px;
  border-radius: 18px;
  background:
    linear-gradient(180deg, rgba(239,229,207,0.97) 0%, rgba(214,195,153,0.94) 100%);
  border: 1px solid rgba(151, 116, 58, 0.45);
  box-shadow: 0 18px 40px rgba(0,0,0,0.35), 0 2px 8px rgba(0,0,0,0.12);
  color: #2a241c;
  flex-shrink: 0;
}

.question-title {
  margin: 0 0 8px;
  font-size: 19px;
  line-height: 1.45;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
  font-weight: 600;
  color: #1e1a12;
}

.question-hint {
  margin: 0;
  font-size: 0.95rem;
  color: #5a4a38;
  line-height: 1.6;
  font-family: "Noto Serif SC", serif;
  font-style: italic;
}

/* ── 选项列表 ── */
.choices-list {
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  padding-bottom: 18px;
}

.choice-paper {
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
  padding: 0;
  border: 1px solid rgba(116, 91, 53, 0.48);
  border-left: 4px solid rgba(143, 47, 37, 0.72);
  border-radius: 16px;
  background:
    linear-gradient(180deg, rgba(242,234,213,0.92) 0%, rgba(219,202,164,0.92) 100%);
  box-shadow: 0 14px 30px rgba(0,0,0,0.32);
  cursor: pointer;
  overflow: hidden;
  text-align: left;
  animation: paper-rise 0.45s cubic-bezier(0.16, 1, 0.3, 1) backwards;
  pointer-events: auto;
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}

/* 选项卡底图（独立资产，作为底图贴合在卡片背后） */
.choice-paper-bg {
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

.choice-paper > *:not(.choice-paper-bg) {
  position: relative;
  z-index: 1;
}

@keyframes paper-rise {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

.choice-paper:hover:not(.is-other-dim) {
  transform: translateY(-2px);
  box-shadow: 0 18px 40px rgba(0,0,0,0.38);
  border-color: rgba(143, 47, 37, 0.85);
}

.choice-paper.is-selected {
  border-color: rgba(143, 47, 37, 0.95);
  box-shadow: 0 18px 42px rgba(143,47,37,0.22), 0 4px 12px rgba(0,0,0,0.2);
  transform: translateY(-2px);
}

.choice-paper.is-other-dim {
  opacity: 0.5;
  filter: saturate(0.4);
  cursor: default;
}

.paper-accent {
  width: 4px;
  flex-shrink: 0;
  background: linear-gradient(180deg, rgba(143,47,37,0.85) 0%, rgba(107,42,42,0.9) 100%);
  border-radius: 16px 0 0 16px;
}

.paper-content {
  flex: 1;
  padding: 15px 48px 15px 16px;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.choice-letter {
  font-family: "Noto Serif SC", serif;
  font-size: 0.78rem;
  font-weight: 700;
  color: rgba(143, 47, 37, 0.7);
  letter-spacing: 0.06em;
  line-height: 1;
}

.choice-text {
  font-family: "Noto Serif SC", "Source Han Serif SC", "Songti SC", serif;
  font-size: 0.97rem;
  color: #2a241c;
  line-height: 1.7;
  margin: 0;
}

.choice-text-wrap {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.choice-warning {
  font-size: 0.95rem;
  font-family: "Noto Serif SC", "Source Han Serif SC", "Microsoft YaHei", "PingFang SC", serif;
  color: #8B2020;
  line-height: 1.5;
  margin: 0;
  padding: 4px 8px;
  background: rgba(139, 32, 32, 0.07);
  border-left: 2px solid rgba(139, 32, 32, 0.4);
  border-radius: 2px;
}

/* ── 预测账目变化 chips ── */
.choice-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-top: 8px;
  padding: 8px 10px;
  background: rgba(255, 250, 235, 0.06);
  border-left: 2px solid rgba(255, 212, 90, 0.5);
  border-radius: 4px;
  align-items: center;
}
.changes-label {
  font-family: "Noto Serif SC", serif;
  font-size: 0.78rem;
  color: rgba(255, 212, 90, 0.85);
  font-style: italic;
  margin-right: 4px;
}
.feedback-warning-inline {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.72rem;
  color: rgba(220, 130, 100, 0.95);
  font-style: italic;
  margin-left: 4px;
  display: inline-block;
}
.choice-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  border-radius: 6px;
  font-family: "Noto Serif SC", serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  border: 1px solid rgba(116, 91, 53, 0.4);
  background: rgba(255, 250, 235, 0.92);
  color: rgba(60, 50, 38, 0.92);
  transition: all 0.2s;
  white-space: nowrap;
}
.chip-arrow { font-size: 0.78rem; font-weight: 700; }
.chip-num   { font-weight: 700; min-width: 20px; text-align: center; }
.chip-label { font-weight: 500; opacity: 0.85; }
.choice-chip.chip-up {
  background: rgba(220, 235, 200, 0.95);
  border-color: rgba(110, 150, 90, 0.55);
  color: #2f5a2a;
}
.choice-chip.chip-up .chip-arrow { color: #4a8a3a; }
.choice-chip.chip-down {
  background: rgba(245, 220, 215, 0.95);
  border-color: rgba(180, 90, 70, 0.55);
  color: #8a3a2a;
}
.choice-chip.chip-down .chip-arrow { color: #b84a2a; }
.choice-chip.chip-warn {
  background: rgba(255, 225, 205, 0.95);
  border-color: rgba(180, 130, 60, 0.6);
  color: #6a4018;
}
.choice-chip.chip-warn .chip-arrow { color: #c46a1a; }

.seal-stamp {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 38px;
  height: 38px;
  background: #8F2F25;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: "Noto Serif SC", serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: #f5f0e6;
  box-shadow: 0 3px 10px rgba(0,0,0,0.35);
  animation: seal-pop 0.38s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes seal-pop {
  0%   { transform: translateY(-50%) scale(2.2) rotate(-12deg); opacity: 0; }
  60%  { transform: translateY(-50%) scale(0.88) rotate(3deg); opacity: 1; }
  100% { transform: translateY(-50%) scale(1) rotate(0deg); opacity: 1; }
}

/* ── 反馈面板 ── */
.feedback-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 18px calc(18px + env(safe-area-inset-bottom, 0px));
  z-index: 210;
  pointer-events: auto;
}

.feedback-inner {
  background: rgba(18, 16, 12, 0.97);
  border: 1px solid rgba(143, 99, 66, 0.4);
  border-radius: 16px;
  padding: 18px 22px 20px;
  max-width: 480px;
  margin: 0 auto;
  box-shadow: 0 -10px 38px rgba(0,0,0,0.44);
}

/* 反馈内的预测变化 chips */
.feedback-changes {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  margin: 0 0 12px;
  padding: 8px 10px;
  background: rgba(255, 250, 235, 0.06);
  border-left: 2px solid rgba(255,212,90,0.5);
  border-radius: 4px;
}
.changes-label {
  font-family: "Noto Serif SC", serif;
  font-size: 0.78rem;
  color: rgba(255,212,90,0.85);
  font-style: italic;
  margin-right: 4px;
}
.change-chip {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 2px 8px;
  border-radius: 6px;
  font-family: "Noto Serif SC", serif;
  font-size: 0.78rem;
  font-weight: 700;
  border: 1px solid rgba(116, 91, 53, 0.4);
}
.change-chip.chip-up {
  background: rgba(220, 235, 200, 0.95);
  border-color: rgba(110, 150, 90, 0.55);
  color: #2f5a2a;
}
.change-chip.chip-up .chip-arrow { color: #4a8a3a; }
.change-chip.chip-down {
  background: rgba(245, 220, 215, 0.95);
  border-color: rgba(180, 90, 70, 0.55);
  color: #8a3a2a;
}
.change-chip.chip-down .chip-arrow { color: #b84a2a; }
.change-chip.chip-warn {
  background: rgba(255, 225, 205, 0.95);
  border-color: rgba(180, 130, 60, 0.6);
  color: #6a4018;
}
.change-chip.chip-warn .chip-arrow { color: #c46a1a; }
.feedback-warning {
  font-family: var(--font-sans, sans-serif);
  font-size: 0.72rem;
  color: rgba(220, 130, 100, 0.95);
  font-style: italic;
  margin-left: 4px;
  display: inline-block;
}

.feedback-text {
  font-family: "Noto Serif SC", serif;
  font-size: 0.95rem;
  color: #ddd0b8;
  line-height: 1.85;
  margin: 0 0 16px;
}

.btn-confirm {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 24px;
  background: linear-gradient(135deg, #8F2F25 0%, #6b2020 100%);
  color: #f5f0e6;
  border: none;
  border-radius: 10px;
  font-family: "Noto Serif SC", serif;
  font-size: 1rem;
  letter-spacing: 0.08em;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(143,47,37,0.45);
  transition: all 0.2s;
  width: 100%;
  justify-content: center;
}

.btn-confirm:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(143,47,37,0.55);
  background: linear-gradient(135deg, #a3362a 0%, #7a2424 100%);
}

.btn-confirm:active {
  transform: translateY(0);
}

.btn-continue {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 11px 24px;
  background: linear-gradient(135deg, #3a5a3a 0%, #2a4a2a 100%);
  color: #e8f0e8;
  border: none;
  border-radius: 10px;
  font-family: "Noto Serif SC", serif;
  font-size: 1rem;
  letter-spacing: 0.08em;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(40,70,40,0.4);
  transition: all 0.2s;
  width: 100%;
  justify-content: center;
}

.btn-continue:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(40,70,40,0.5);
}

.confirmed-mark {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  margin-top: 8px;
}

.confirmed-seal {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: #8F2F25;
  border-radius: 6px;
  font-family: "Noto Serif SC", serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #f5f0e6;
  box-shadow: 0 3px 10px rgba(0,0,0,0.35);
}

.confirmed-hint {
  font-family: "Noto Serif SC", serif;
  font-size: 0.88rem;
  color: rgba(200,185,150,0.6);
  font-style: italic;
}

/* ── 过渡动画 ── */
.overlay-fade-enter-active { transition: opacity 0.32s ease; }
.overlay-fade-leave-active { transition: opacity 0.22s ease; }
.overlay-fade-enter-from,
.overlay-fade-leave-to { opacity: 0; }

.feedback-reveal-enter-active {
  transition: all 0.42s cubic-bezier(0.16, 1, 0.3, 1);
}
.feedback-reveal-enter-from {
  opacity: 0;
  transform: translateY(24px);
}

@media (max-width: 700px) {
  .choice-overlay {
    align-items: stretch;
    padding: calc(54px + env(safe-area-inset-top, 0px)) 12px calc(210px + env(safe-area-inset-bottom, 0px));
  }

  .overlay-topbar {
    position: fixed;
    top: calc(6px + env(safe-area-inset-top, 0px));
    left: 12px;
    right: 122px;
    width: auto;
    max-width: none;
    z-index: 3;
    padding: 0;
  }

  .back-btn {
    min-width: 58px;
    min-height: 38px;
    padding: 6px 10px;
    border-radius: 10px;
    background: rgba(18, 16, 12, 0.72);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
  }

  .overlay-scene-label {
    align-self: center;
    font-size: 0.66rem;
  }

  .choice-question-scroll,
  .choices-list {
    max-width: none;
  }

  .choice-question-scroll {
    margin-bottom: 12px;
    padding: 14px 16px 13px;
    border-radius: 14px;
  }

  .question-title {
    font-size: 18px;
    line-height: 1.35;
  }

  .question-hint {
    font-size: 0.84rem;
    line-height: 1.5;
  }

  .choices-list {
    gap: 10px;
  }

  .choice-paper {
    border-radius: 13px;
    min-height: 112px;
  }

  .paper-content {
    padding: 12px 42px 12px 12px;
    gap: 4px;
  }

  .choice-text {
    font-size: 0.93rem;
    line-height: 1.55;
  }

  .choice-warning {
    font-size: 0.82rem;
    line-height: 1.45;
  }

  .choice-chips {
    gap: 4px;
    margin-top: 5px;
    padding: 6px 7px;
  }

  .choice-chip {
    padding: 2px 6px;
    font-size: 0.68rem;
  }

  .seal-stamp {
    right: 10px;
    width: 32px;
    height: 32px;
    font-size: 0.92rem;
  }

  .feedback-panel {
    padding: 0 12px calc(12px + env(safe-area-inset-bottom, 0px));
  }

  .feedback-inner {
    padding: 12px 14px 14px;
    border-radius: 14px;
  }

  .feedback-changes {
    gap: 5px;
    margin-bottom: 9px;
    padding: 6px 8px;
  }

  .feedback-text {
    font-size: 0.9rem;
    line-height: 1.65;
    margin-bottom: 10px;
  }

  .btn-continue {
    min-height: 46px;
    padding: 10px 14px;
  }

  .confirmed-mark {
    margin-top: 7px;
  }

  .confirmed-seal {
    width: 36px;
    height: 36px;
    font-size: 0.94rem;
  }

  .confirmed-hint {
    font-size: 0.78rem;
  }
}

@media (max-width: 380px) {
  .choice-overlay {
    padding-left: 10px;
    padding-right: 10px;
  }

  .choice-paper {
    min-height: 104px;
  }

  .paper-content {
    padding-right: 38px;
  }

  .choice-text {
    font-size: 0.88rem;
  }

  .feedback-text {
    font-size: 0.86rem;
  }
}
</style>
