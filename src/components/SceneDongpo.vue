<template>
  <div class="vn-scene">
    <div class="chapter-mark">第五幕 · 黄州 · 东坡初成</div>
    <div class="scene-title-vn">东坡初成</div>
    <div class="stove-visual">
      <svg width="160" height="120" viewBox="0 0 160 120">
        <ellipse cx="80" cy="100" rx="70" ry="18" fill="rgba(58,48,32,0.8)"/>
        <rect x="20" y="70" width="120" height="32" fill="rgba(74,56,40,0.9)" rx="6"/>
        <ellipse cx="80" cy="70" rx="60" ry="14" fill="rgba(30,24,16,0.95)"/>
        <g class="flame-dongpo">
          <ellipse cx="80" cy="55" rx="22" ry="30" fill="rgba(196,122,48,0.5)"/>
          <ellipse cx="72" cy="50" rx="14" ry="22" fill="rgba(212,146,58,0.5)"/>
          <ellipse cx="88" cy="53" rx="12" ry="18" fill="rgba(224,168,74,0.4)"/>
          <ellipse cx="80" cy="42" rx="8" ry="14" fill="rgba(240,192,96,0.3)"/>
        </g>
        <g opacity="0.25" class="steam-dongpo">
          <ellipse cx="70" cy="25" rx="16" ry="8" fill="rgba(216,208,192,0.6)"/>
          <ellipse cx="90" cy="15" rx="12" ry="7" fill="rgba(216,208,192,0.5)"/>
        </g>
      </svg>
    </div>
    <div class="dialogue-layer">
      <DialogueBox v-if="showD1" :text="narratorText" speaker="旁白" text-class="narration" @complete="onTextComplete" @advance="handleAdvance" />
    </div>
    <button v-if="showNextBtn" class="vn-next-btn" data-testid="btn-next-S38" @click="handleNext">月亮升起来了 <span class="vn-arrow">→</span></button>
    <div class="fact-btn-wrap"><button class="fab-trigger" @click="gameState.showFactBook = true">史实 · 改编</button></div>
    <FactAdaptationBook ref="fabRef" fact="苏轼贬黄州期间留下《猪肉颂》，其中写到黄州猪肉价格低廉，并以通俗方式写烹肉方法。"    adaptation="'村民送肉'属于游戏情景改编，用来呈现普通人情与廉洁边界的关系，不对应某一条确定史实。" />
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
const narratorText = computed(() => {
  const meatFlag = gameState.flags.meat
  const cookFlag = gameState.flags.cook
  if (meatFlag === "clean_human_touch" && cookFlag === "slow_stew") return "那一晚，锅里有肉，账上无亏。东坡不是突然诞生的。他是在一口小锅前，慢慢把自己从风暴里捞回来。"
  if (meatFlag === "confused_account" || cookFlag === "public_misuse") return "饭香起来了，账却不清。烟火气不是清廉的反面，糊涂账才是。"
  if (meatFlag === "isolated" || cookFlag === "collapse") return "你避开了一些风险，也避开了生活本身。黄州还在，东坡却还没有真正落地。"
  return "黄州没有立刻治好他。但至少，日子开始有了一点热气。"
})
function onTextComplete() {
  isComplete.value = true
  // 对话自然播放完毕或被打断后，自动推进到下一幕。
  // VN 标准做法是「点一次完成打字 → 再点一次推进」。
  // 此处统一为：完成打字后由 onTextComplete 推动剧情，
  // 这样无论是观众点到、还是玩家点掉字，都能在同一节奏内落到 .vn-next-btn。
  setTimeout(() => {
    if (showD1.value) handleAdvance()
  }, 250)
}
function handleAdvance() { showD1.value = false; showNextBtn.value = true }
function handleNext() {
  // 与 SceneWutaiBridge 一致：先弹出章节转场墙（视听语言），紧接着由 setScene 真正切场。
  // App.vue 会在 currentScene 变化时自动 closeAllOverlays() 把转场墙收掉，
  // 这样既保留用户层视觉过场，又让自动化测试 / 重放器在点击 next 之后能直接落到 S39。
  if (openChapterTransition) {
    openChapterTransition('huangzhou', 'chengtian')
  }
  setScene('S39')
}
onMounted(() => { showD1.value = true })
</script>
<style scoped>
.vn-scene { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; padding: 60px 20px 200px; overflow: hidden; pointer-events: none; }
.vn-scene > * { pointer-events: auto; }
.chapter-badge { position: fixed; top: 60px; left: 16px; z-index: 40; padding: 5px 14px; background: rgba(13,13,18,0.92); border: 1px solid rgba(184,149,108,0.45); border-radius: 20px; font-family: var(--font-sans); font-size: 0.72rem; color: rgba(245,232,200,0.95); font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; backdrop-filter: blur(4px); box-shadow: 0 2px 8px rgba(0,0,0,0.5), 0 0 12px rgba(184,149,108,0.15); }
.scene-title-vn {
  font-family: var(--font-serif);
  font-size: 1.55rem;
  font-weight: 600;
  color: rgba(255,238,210,0.98);
  text-align: center;
  margin-top: 8px;
  margin-bottom: 12px;
  letter-spacing: 0.2em;
  text-shadow: 0 0 18px rgba(255,200,140,0.5), 0 2px 8px rgba(0,0,0,0.85), 0 0 4px rgba(0,0,0,0.6);
  position: relative;
  z-index: 5;
}
.stove-visual { margin: 12px 0; }
.flame-dongpo { animation: flame-move-d 2s ease-in-out infinite alternate; transform-origin: center bottom; }
@keyframes flame-move-d { 0% { transform: scaleY(1) translateY(0); } 100% { transform: scaleY(1.15) translateY(-4px); } }
.steam-dongpo { animation: steam-rise-d 3s ease-out infinite; }
.steam-dongpo ellipse:nth-child(2) { animation-delay: 0.5s; }
@keyframes steam-rise-d { 0% { transform: translateY(0) scale(1); opacity: 0.25; } 100% { transform: translateY(-30px) scale(1.4); opacity: 0; } }
.dialogue-layer { position: fixed; left: 0; right: 0; bottom: 0; }
.vn-next-btn { position: fixed; bottom: 220px; right: 20px; display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; background: rgba(20,18,14,0.85); border: 1px solid rgba(184,149,108,0.35); border-radius: 20px; color: rgba(200,190,170,0.85); font-family: var(--font-sans); font-size: 0.85rem; cursor: pointer; z-index: 90; backdrop-filter: blur(4px); animation: btn-fade-in 0.4s cubic-bezier(0.16,1,0.3,1); box-shadow: 0 4px 12px rgba(0,0,0,0.25); transition: all 0.2s; }
.vn-next-btn:hover { background: rgba(30,28,24,0.9); border-color: rgba(184,149,108,0.55); color: rgba(220,210,190,0.95); transform: translateY(-1px); }
.vn-arrow { font-size: 0.8rem; }
.fact-btn-wrap { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 90; }
.fab-trigger { padding: 6px 16px; background: rgba(20,18,14,0.7); border: 1px solid rgba(184,149,108,0.2); border-radius: 16px; color: rgba(200,190,170,0.55); font-family: var(--font-sans); font-size: 0.75rem; cursor: pointer; backdrop-filter: blur(4px); transition: all 0.2s; }
.fab-trigger:hover { color: rgba(200,190,170,0.8); border-color: rgba(184,149,108,0.35); }
@keyframes btn-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>