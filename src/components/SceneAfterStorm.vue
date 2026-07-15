<template>
  <div class="vn-scene">
    <div class="chapter-badge">第四幕 · 黄州</div>
    <div class="scene-title-vn">风暴之后</div>
    <div class="map-visual">
      <svg width="200" height="80" viewBox="0 0 200 80">
        <ellipse cx="100" cy="40" rx="95" ry="35" fill="rgba(61,79,95,0.6)"/>
        <ellipse cx="100" cy="40" rx="80" ry="25" fill="rgba(61,79,95,0.4)"/>
        <g transform="translate(100,40)">
          <circle r="20" fill="rgba(139,58,58,0.7)"/>
          <circle r="15" fill="rgba(139,58,58,0.5)"/>
          <text x="0" y="5" text-anchor="middle" font-family="Noto Serif SC" font-size="12" fill="#f5f0e6">黄州</text>
        </g>
      </svg>
    </div>
    <div class="dialogue-layer">
      <DialogueBox v-if="showD1" :text="narratorText" speaker="旁白" text-class="narration" @complete="isComplete = true" @advance="handleAdvance" />
    </div>
    <button v-if="showNextBtn" class="vn-next-btn" @click="handleNext">去黄州 <span class="vn-arrow">→</span></button>
    <div class="fact-btn-wrap"><button class="fab-trigger" @click="gameState.showFactBook = true">史实 · 改编</button></div>
    <FactAdaptationBook ref="fabRef" fact="乌台诗案是苏轼人生重大转折。苏轼因诗文被弹劾入狱，后被贬黄州。苏辙在兄长危机中有救兄举动。"    adaptation="'子由救援卡'与'亲友账'是游戏机制，用来表现兄弟相救背后的情感代价，并非真实历史中存在这种选择界面。" />
  </div>
</template>
<script setup>
import { ref, computed, onMounted, inject } from "vue"
import { setScene, gameState } from "../store/gameState.js"
import DialogueBox from "./DialogueBox.vue"
import FactAdaptationBook from "./FactAdaptationBook.vue"


const showD1 = ref(false)
const isComplete = ref(false)
const showNextBtn = ref(false)
const fabRef = ref(null)
const narratorText = computed(() => {
  const flag = gameState.flags.ziyou
  const narratives = {
    accepted_reflective: "他想起子由那封信。有些话以后仍要说，但不能再把每一句都扔给风。",
    accepted_no_reflection: "他想起子由那封信。却还没有真正想明白，亏欠也会记账。",
    refused: "他没有回头。可越是不回头，背影越冷。",
    relation_fix: "他离开风暴，却没能完全离开关系的阴影。"
  }
  return narratives[flag] || narratives.accepted_reflective
})
function handleAdvance() { showD1.value = false; showNextBtn.value = true }
function handleNext() {
  setScene('S34')
}
onMounted(() => { showD1.value = true })
</script>
<style scoped>
.vn-scene { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; padding: 60px 20px 200px; overflow: hidden; pointer-events: none; }
.vn-scene > * { pointer-events: auto; }
.chapter-badge { position: fixed; top: 60px; left: 16px; z-index: 40; padding: 4px 14px; background: rgba(13,13,18,0.8); border: 1px solid rgba(184,149,108,0.2); border-radius: 20px; font-family: var(--font-sans); font-size: 0.68rem; color: rgba(200,190,170,0.55); letter-spacing: 0.15em; text-transform: uppercase; backdrop-filter: blur(4px); }
.scene-title-vn { font-family: var(--font-serif); font-size: 1.1rem; color: rgba(232,228,223,0.75); text-align: center; margin-top: 8px; margin-bottom: 12px; }
.map-visual { margin: 16px 0; animation: map-pulse 3s ease-in-out infinite; }
@keyframes map-pulse { 0%,100% { opacity: 0.7; } 50% { opacity: 1; } }
.dialogue-layer { position: fixed; left: 0; right: 0; bottom: 0; }
.vn-next-btn { position: fixed; bottom: 220px; right: 20px; display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; background: rgba(20,18,14,0.85); border: 1px solid rgba(184,149,108,0.35); border-radius: 20px; color: rgba(200,190,170,0.85); font-family: var(--font-sans); font-size: 0.85rem; cursor: pointer; z-index: 90; backdrop-filter: blur(4px); animation: btn-fade-in 0.4s cubic-bezier(0.16,1,0.3,1); box-shadow: 0 4px 12px rgba(0,0,0,0.25); transition: all 0.2s; }
.vn-next-btn:hover { background: rgba(30,28,24,0.9); border-color: rgba(184,149,108,0.55); color: rgba(220,210,190,0.95); transform: translateY(-1px); }
.vn-arrow { font-size: 0.8rem; }
.fact-btn-wrap { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 90; }
.fab-trigger { padding: 6px 16px; background: rgba(20,18,14,0.7); border: 1px solid rgba(184,149,108,0.2); border-radius: 16px; color: rgba(200,190,170,0.55); font-family: var(--font-sans); font-size: 0.75rem; cursor: pointer; backdrop-filter: blur(4px); transition: all 0.2s; }
.fab-trigger:hover { color: rgba(200,190,170,0.8); border-color: rgba(184,149,108,0.35); }
@keyframes btn-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>