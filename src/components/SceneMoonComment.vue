<template>
  <div class="vn-scene">
    <div class="chapter-badge">第五幕 · 承天寺夜游</div>
    <div class="scene-title-vn">月下批注</div>
    <div class="seal-wrap">
      <div class="seal-anim"><span class="seal-char">{{ currentSeal }}</span></div>
      <p class="seal-label">此页已归档</p>
    </div>
    <!-- 可点月 -->
    <div class="clickable-moon" :class="{ active: moonClicked }" @click.stop="clickMoon">
      <div class="prop-caption" v-if="moonClicked">
        <p>何夜无月？</p>
      </div>
    </div>

    <!-- 可点承天寺剪影 -->
    <div class="clickable-temple" :class="{ active: templeClicked }" @click.stop="clickTemple">
      <div class="prop-caption" v-if="templeClicked">
        <p>念无与为乐者。</p>
      </div>
    </div>

    <div class="dialogue-layer">
      <DialogueBox v-if="showD1" :text="narratorText" speaker="旁白" text-class="narration" @complete="onTextComplete" @advance="handleAdvance" />
    </div>
    <button v-if="showNextBtn" class="vn-next-btn" data-testid="btn-next-S42" @click="handleNext">再入杭州 <span class="vn-arrow">→</span></button>
    <!-- z-index 降到 80 以下，不遮挡 temple (z-index 220) -->
    <div class="fact-btn-wrap" style="z-index: 70;"><button class="fab-trigger" @click="gameState.showFactBook = true">史实 · 改编</button></div>
    <FactAdaptationBook
      ref="fabRef"
      fact="《记承天夜游》中写苏轼月夜寻张怀民，张怀民亦未寝，两人相与步于中庭。该文本是黄州时期苏轼心境的重要呈现。"
      adaptation="'怀民状态检测'与'点击寻找怀民'是互动化改编，用来增强年轻玩家的参与感。原文的清冷意境和苏轼困境中的精神自守必须保留。"
      @click.stop
      style="pointer-events: none;"
    />
  </div>
</template>
<script setup>
import { ref, computed, onMounted, inject } from "vue"
import { setScene, gameState } from "../store/gameState.js"
import DialogueBox from "./DialogueBox.vue"
import FactAdaptationBook from "./FactAdaptationBook.vue"

const openChapterTransition = inject('openChapterTransition', null)
const showD1 = ref(false)
const isComplete = ref(false)
const showNextBtn = ref(false)
const fabRef = ref(null)
const moonClicked = ref(false)
const templeClicked = ref(false)
const narratorText = computed(() => {
  const flag = gameState.flags.huai
  const narratives = {
    moon_walk: "怀民没有救他出黄州。但陪他走过了一个夜晚。有时候，不沉下去，就是一种风骨。",
    hot_words: "月光没有拦住他的锋芒。子由的信，似乎又在远处响了一声。",
    closed_self: "这个夜晚很安静。安静到像没有人来过。",
    privilege_friend: "你找到了朋友，却差点把朋友变成门路。"
  }
  return narratives[flag] || narratives.moon_walk
})
const currentSeal = computed(() => {
  const flag = gameState.flags.huai
  const seals = { moon_walk: "游", hot_words: "灼", closed_self: "寂", privilege_friend: "歧" }
  return seals[flag] || "待"
})
function onTextComplete() {
  isComplete.value = true
  // 对话打字完成或被打断后，自动推进到下一幕（无需「点两次」）。
  // 与 SceneDongpo 一致，保持 S38 / S42 的 .vn-next-btn 出现节奏一致。
  setTimeout(() => {
    if (showD1.value) handleAdvance()
  }, 250)
}
function handleAdvance() { showD1.value = false; showNextBtn.value = true }
function clickMoon() { moonClicked.value = true }
function clickTemple() { templeClicked.value = true }
function handleNext() {
  // 与 SceneDongpo / SceneWutaiBridge 一致：先弹出章节转场墙，再由 setScene 真正切场。
  // App.vue 会在 currentScene 变化时自动 closeAllOverlays()，把转场墙一并收起。
  if (openChapterTransition) {
    openChapterTransition('chengtian', 'hangzhou')
  }
  setScene('S44')  // 第六幕：再入杭州
}
onMounted(() => { showD1.value = true })
</script>
<style scoped>
.vn-scene { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; padding: 60px 20px 200px; overflow: hidden; pointer-events: none; }
.vn-scene > * { pointer-events: auto; }
.chapter-badge { position: fixed; top: 60px; left: 16px; z-index: 40; padding: 4px 14px; background: rgba(13,13,18,0.8); border: 1px solid rgba(184,149,108,0.2); border-radius: 20px; font-family: var(--font-sans); font-size: 0.68rem; color: rgba(200,190,170,0.55); letter-spacing: 0.15em; text-transform: uppercase; backdrop-filter: blur(4px); }
.scene-title-vn { font-family: var(--font-serif); font-size: 1.1rem; color: rgba(232,228,223,0.75); text-align: center; margin-top: 8px; margin-bottom: 20px; }
.seal-wrap { margin-bottom: 20px; text-align: center; }
.seal-anim { width: 70px; height: 70px; background: var(--vermillion); border-radius: 6px; display: flex; align-items: center; justify-content: center; margin: 0 auto 8px; box-shadow: 0 6px 20px rgba(139,58,58,0.5); animation: seal-land 0.5s cubic-bezier(0.34,1.56,0.64,1); transform: rotate(-3deg); }
@keyframes seal-land { 0% { transform: rotate(-3deg) scale(1.5); opacity: 0; } 100% { transform: rotate(-3deg) scale(1); opacity: 1; } }
.seal-char { font-family: var(--font-serif); font-size: 2rem; color: var(--xuan-paper); font-weight: 700; }
.seal-label { font-size: 0.7rem; color: rgba(200,190,170,0.4); font-family: var(--font-sans); letter-spacing: 0.15em; }
.dialogue-layer { position: fixed; left: 0; right: 0; bottom: 0; }
.vn-next-btn { position: fixed; bottom: 220px; right: 20px; display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; background: rgba(20,18,14,0.85); border: 1px solid rgba(184,149,108,0.35); border-radius: 20px; color: rgba(200,190,170,0.85); font-family: var(--font-sans); font-size: 0.85rem; cursor: pointer; z-index: 90; backdrop-filter: blur(4px); animation: btn-fade-in 0.4s cubic-bezier(0.16,1,0.3,1); box-shadow: 0 4px 12px rgba(0,0,0,0.25); transition: all 0.2s; }
.vn-next-btn:hover { background: rgba(30,28,24,0.9); border-color: rgba(184,149,108,0.55); color: rgba(220,210,190,0.95); transform: translateY(-1px); }
.vn-arrow { font-size: 0.8rem; }
.fact-btn-wrap { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 80; }
.fab-trigger { padding: 6px 16px; background: rgba(20,18,14,0.7); border: 1px solid rgba(184,149,108,0.2); border-radius: 16px; color: rgba(200,190,170,0.55); font-family: var(--font-sans); font-size: 0.75rem; cursor: pointer; backdrop-filter: blur(4px); transition: all 0.2s; }
.fab-trigger:hover { color: rgba(200,190,170,0.8); border-color: rgba(184,149,108,0.35); }
@keyframes btn-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }

/* 可点月亮 */
.clickable-moon {
  position: fixed;
  top: 80px;
  right: 30px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 40%, #e8e4d8 0%, #c8c4b8 60%, #a8a498 100%);
  box-shadow: 0 0 20px rgba(220,215,200,0.3), 0 0 40px rgba(220,215,200,0.15);
  cursor: pointer;
  z-index: 15;
  pointer-events: auto;
  transition: all 0.3s ease;
  animation: moon-pulse 3s ease-in-out infinite;
}
.clickable-moon.active {
  box-shadow: 0 0 30px rgba(220,215,200,0.5), 0 0 60px rgba(220,215,200,0.25);
  animation: none;
}
.clickable-moon .prop-caption {
  position: absolute;
  top: 68px;
  right: 0;
  white-space: nowrap;
  background: rgba(20,18,14,0.85);
  border: 1px solid rgba(184,149,108,0.3);
  border-radius: 6px;
  padding: 6px 12px;
  animation: caption-fade 0.4s ease;
}
.clickable-moon .prop-caption p {
  font-family: var(--font-serif);
  font-size: 0.95rem;            /* V1.1 字号规范：正文 ≥ 15px */
  color: rgba(220,215,200,0.9);
  margin: 0;
}

/* 可点承天寺剪影 */
.clickable-temple {
  position: fixed;
  bottom: 260px;
  left: 20px;
  width: 90px;
  height: 90px;
  cursor: pointer;
  z-index: 220;
  pointer-events: auto;
  opacity: 0.5;
  transition: opacity 0.3s;
  border-radius: 12px;
  background: transparent;
}
.clickable-temple:hover { opacity: 0.8; }
.clickable-temple.active { opacity: 0.9; }
.clickable-temple .prop-caption {
  position: absolute;
  bottom: 78px;
  left: 0;
  white-space: nowrap;
  background: rgba(20,18,14,0.85);
  border: 1px solid rgba(184,149,108,0.3);
  border-radius: 6px;
  padding: 6px 12px;
  animation: caption-fade 0.4s ease;
}
.clickable-temple .prop-caption p {
  font-family: var(--font-serif);
  font-size: 0.95rem;            /* V1.1 字号规范：正文 ≥ 15px */
  color: rgba(220,215,200,0.9);
  margin: 0;
}

@keyframes moon-pulse {
  0%, 100% { box-shadow: 0 0 20px rgba(220,215,200,0.3), 0 0 40px rgba(220,215,200,0.15); }
  50% { box-shadow: 0 0 25px rgba(220,215,200,0.4), 0 0 50px rgba(220,215,200,0.2); }
}
@keyframes caption-fade {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
