<template>
  <Teleport to="body">
    <div
      class="fab-layer"
      :class="{ 'fab-visible': isVisible }"
      role="dialog"
      aria-modal="true"
      aria-label="史实与改编说明"
      @click.self="onBackdropClick"
    >
      <article class="fab-modal" @click.stop>
        <!-- 独立资产：史实/改编双页底图（无烘入文字） -->
        <img src="/assets/dongpo/ui/fact_book_panel.png" class="fab-modal-bg" alt="" draggable="false" aria-hidden="true" />

        <!-- 右上角关闭 -->
        <button
          type="button"
          class="fab-xbtn"
          aria-label="关闭"
          @click="onXClick"
        >×</button>

        <!-- 标题区 -->
        <div class="fab-header">
          <span class="fab-archive-tag">档案批注</span>
          <h3 class="fab-title">史实与改编边界</h3>
        </div>

        <!-- 账本双页 -->
        <div class="fab-pages">

          <!-- 左页：史实 -->
          <section class="fab-page fab-fact">
            <div class="fab-page-kicker">史实依据</div>
            <div class="fab-page-rule"></div>
            <p class="fab-page-body">{{ fact }}</p>
          </section>

          <!-- 中缝 -->
          <div class="fab-spine" aria-hidden="true">
            <div class="fab-spine-threading"></div>
          </div>

          <!-- 右页：改编 -->
          <section class="fab-page fab-adaptation">
            <div class="fab-page-kicker">游戏改编</div>
            <div class="fab-page-rule"></div>
            <p class="fab-page-body">{{ adaptation }}</p>
          </section>
        </div>

        <!-- 底部归档印章 + 收起 -->
        <div class="fab-footer">
          <div class="fab-seal" aria-hidden="true">已归档</div>
          <button
            type="button"
            class="fab-collapse-btn"
            @click="onCollapseClick"
          >
            收起账页
          </button>
        </div>

      </article>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { gameState } from '../store/gameState.js'

const props = defineProps({
  fact:       { type: String, default: '' },
  adaptation: { type: String, default: '' },
})

// ── 本地可见性状态，独立于 props ────────────────────────────────
const isVisible = ref(false)
let isAnimating = false

// ── 打开 ──────────────────────────────────────────────────────
function showBook() {
  if (isVisible.value || isAnimating) return
  isVisible.value = true
  document.body.classList.add('fab-open')
  document.body.style.overflow = 'hidden'
  // 监听 Esc
  window.addEventListener('keydown', onKeydown)
}

// ── 关闭（统一入口）────────────────────────────────────────────
function hideBook() {
  if (!isVisible.value || isAnimating) return
  isAnimating = true
  isVisible.value = false
  document.body.classList.remove('fab-open')
  document.body.style.overflow = ''
  window.removeEventListener('keydown', onKeydown)
  // 动画结束后通知 gameState
  setTimeout(() => {
    gameState.showFactBook = false
    isAnimating = false
  }, 300)
}

function onXClick()       { hideBook() }
function onCollapseClick() { hideBook() }
function onBackdropClick() { hideBook() }

function onKeydown(e) {
  if (e.key === 'Escape' && isVisible.value) hideBook()
}

// ── 同步 gameState.showFactBook → 本地状态 ────────────────────
watch(
  () => gameState.showFactBook,
  val => {
    if (val && !isVisible.value) showBook()
    else if (!val && isVisible.value) hideBook()
  }
)

// ── 兼容旧 API ─────────────────────────────────────────────────
function openBook()  { showBook() }
function closeBook() { hideBook() }
defineExpose({ open: openBook, close: closeBook })

// ── 清理 ────────────────────────────────────────────────────────
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
  document.body.classList.remove('fab-open')
  document.body.style.overflow = ''
})
</script>

<style scoped>
/* ── 遮罩层（默认隐藏）────────────────────────────────────── */
.fab-layer {
  position: fixed;
  inset: 0;
  z-index: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 16px;
  background: rgba(7,10,13,0);
  backdrop-filter: blur(0px);
  -webkit-backdrop-filter: blur(0px);
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  transition:
    background 0.32s ease,
    backdrop-filter 0.32s ease,
    opacity 0.32s ease;
}

/* 可见状态 */
.fab-layer.fab-visible {
  background: rgba(7,10,13,0.62);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  pointer-events: auto;
  opacity: 1;
  visibility: visible;
}

/* ── 弹窗主体 ──────────────────────────────────────────────── */
.fab-modal {
  position: relative;
  z-index: 910;
  width: min(92vw, 720px);
  max-height: min(78vh, 560px);
  display: flex;
  flex-direction: column;
  padding: 22px 24px 20px;
  border-radius: 22px;
  background:
    radial-gradient(circle at 50% 0%, rgba(255,248,226,0.06), transparent 45%),
    linear-gradient(180deg, rgba(39,33,25,0.78) 0%, rgba(20,18,15,0.85) 100%);
  border: 1px solid rgba(194,157,91,0.38);
  box-shadow:
    0 28px 90px rgba(0,0,0,0.65),
    inset 0 0 40px rgba(143,47,37,0.06);
  pointer-events: none;
  overflow: hidden;
  transform: scale(0.95) translateY(8px);
  transition: transform 0.32s cubic-bezier(0.16,1,0.3,1);
}

/* 独立资产：史实/改编双页底图 */
.fab-modal-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  z-index: 0;
  pointer-events: none;
  opacity: 0.88;
}

.fab-modal > *:not(.fab-modal-bg) {
  position: relative;
  z-index: 1;
}

.fab-layer.fab-visible .fab-modal {
  transform: scale(1) translateY(0);
  pointer-events: auto;
}

/* ── 右上角关闭按钮 ────────────────────────────────────────── */
.fab-xbtn {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: 1px solid rgba(239,229,207,0.28);
  background: rgba(10,10,10,0.72);
  color: rgba(200,190,170,0.82);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, transform 0.15s;
  pointer-events: auto;
  z-index: 920;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: serif;
}
.fab-xbtn:hover {
  background: rgba(30,28,24,0.9);
  color: #f0e8d8;
  transform: scale(1.08);
}
.fab-xbtn:active { transform: scale(0.96); }

/* ── 标题区 ───────────────────────────────────────────────── */
.fab-header {
  margin-bottom: 14px;
  padding-right: 44px;
}
.fab-archive-tag {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px 2px;
  border: 1px solid rgba(143,47,37,0.55);
  border-radius: 999px;
  color: #d9b28a;
  font-size: 11px;
  letter-spacing: 0.18em;
  font-family: var(--font-sans);
  text-transform: uppercase;
  background: rgba(143,47,37,0.12);
  margin-bottom: 8px;
}
.fab-title {
  margin: 0;
  font-size: 18px;
  font-family: "Noto Serif SC", "Source Han Serif SC", var(--font-serif);
  color: rgba(240,230,210,0.92);
  font-weight: 600;
  letter-spacing: 0.05em;
}

/* ── 账本双页 ──────────────────────────────────────────────── */
.fab-pages {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 14px 1fr;
  flex: 1;
  min-height: 210px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow:
    0 18px 50px rgba(0,0,0,0.45),
    inset 0 0 24px rgba(90,62,31,0.14);
}

/* 通用账页 */
.fab-page {
  padding: 22px 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 0;
  overflow-y: auto;
}
.fab-page::-webkit-scrollbar { width: 4px; }
.fab-page::-webkit-scrollbar-track { background: transparent; }
.fab-page::-webkit-scrollbar-thumb { background: rgba(139,111,76,0.35); border-radius: 2px; }

/* 史实页 */
.fab-fact {
  background:
    linear-gradient(180deg, rgba(241,232,214,0.99) 0%, rgba(224,211,183,0.97) 100%);
}

/* 改编页 */
.fab-adaptation {
  background:
    linear-gradient(180deg, rgba(250,244,230,0.99) 0%, rgba(235,226,200,0.97) 100%);
}

/* 页签标签 */
.fab-page-kicker {
  font-size: 11px;
  letter-spacing: 0.22em;
  font-family: var(--font-sans);
  text-transform: uppercase;
  font-weight: 600;
  margin-bottom: 8px;
}
.fab-fact    .fab-page-kicker { color: rgba(139,58,58,0.72); }
.fab-adaptation .fab-page-kicker { color: rgba(80,100,68,0.78); }

/* 分割线 */
.fab-page-rule {
  height: 1px;
  margin-bottom: 12px;
}
.fab-fact    .fab-page-rule { background: rgba(139,58,58,0.20); }
.fab-adaptation .fab-page-rule { background: rgba(80,100,68,0.22); }

/* 正文 */
.fab-page-body {
  font-family: "Noto Serif SC", "Source Han Serif SC", var(--font-serif);
  font-size: 13.5px;
  color: #2a241c;
  line-height: 1.9;
  margin: 0;
}

/* 书脊 */
.fab-spine {
  background: linear-gradient(
    90deg,
    rgba(69,51,32,0.78) 0%,
    rgba(34,25,18,0.96) 30%,
    rgba(34,25,18,1.0)  50%,
    rgba(34,25,18,0.96) 70%,
    rgba(69,51,32,0.78) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  pointer-events: none;
}
.fab-spine-threading {
  width: 2px;
  flex: 1;
  margin: 14px 0;
  background: repeating-linear-gradient(
    180deg,
    rgba(180,140,70,0.38) 0px,
    rgba(180,140,70,0.38) 6px,
    transparent 6px,
    transparent 10px
  );
}

/* ── 底部 ─────────────────────────────────────────────────── */
.fab-footer {
  margin-top: 14px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 朱砂归档印章 */
.fab-seal {
  font-family: "Noto Serif SC", var(--font-serif);
  font-size: 13px;
  letter-spacing: 0.12em;
  color: rgba(180,70,50,0.80);
  border: 1.5px solid rgba(180,70,50,0.50);
  border-radius: 4px;
  padding: 3px 10px 2px;
  transform: rotate(-3deg);
  background: rgba(180,70,50,0.06);
  text-shadow: 0 0 8px rgba(180,70,50,0.25);
  user-select: none;
}

/* 收起按钮 */
.fab-collapse-btn {
  border: 1px solid rgba(168,138,74,0.55);
  border-radius: 999px;
  padding: 8px 18px;
  background: rgba(14,13,11,0.88);
  color: rgba(210,198,172,0.88);
  font-family: var(--font-serif);
  font-size: 13px;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: background 0.18s, color 0.18s, transform 0.15s;
  pointer-events: auto;
}
.fab-collapse-btn:hover {
  background: rgba(28,26,22,0.95);
  color: #f0e8d8;
  transform: translateY(-1px);
}
.fab-collapse-btn:active { transform: scale(0.97); }

/* ── 手机端适配（≤430px）──────────────────────────────────── */
@media (max-width: 430px) {
  .fab-layer {
    padding: 0;
    align-items: flex-end;
  }

  .fab-modal {
    width: 100vw;
    max-height: 82vh;
    border-radius: 22px 22px 0 0;
    padding: 18px 16px 16px;
  }

  .fab-pages {
    grid-template-columns: 1fr;
    grid-template-rows: auto 10px auto;
    min-height: 260px;
  }

  .fab-spine {
    width: 100%;
    height: 10px;
    background: linear-gradient(
      180deg,
      rgba(69,51,32,0.78) 0%,
      rgba(34,25,18,0.96) 50%,
      rgba(69,51,32,0.78) 100%
    );
  }

  .fab-spine-threading {
    width: 60%;
    height: 2px;
    flex: unset;
    margin: 4px auto;
    background: repeating-linear-gradient(
      90deg,
      rgba(180,140,70,0.38) 0px,
      rgba(180,140,70,0.38) 6px,
      transparent 6px,
      transparent 10px
    );
  }

  .fab-page {
    padding: 18px 16px;
  }

  .fab-page-body {
    font-size: 13px;
  }

  .fab-footer {
    flex-direction: column-reverse;
    align-items: stretch;
    gap: 10px;
    margin-top: 12px;
  }

  .fab-seal { align-self: flex-start; }

  .fab-collapse-btn {
    text-align: center;
    padding: 10px;
  }
}
</style>
