<template>
  <div class="vn-scene">
    <!-- 全屏背景：京城夜景独立资产 -->
    <BackgroundScene theme="capital" />

    <div class="chapter-badge">第一幕 · 京城</div>
    <div class="scene-title-vn">京城成名</div>

    <div class="character-layer">
      <!-- 飞舞的文稿（前景氛围） -->
      <div class="flying-docs-layer">
        <svg width="100%" height="100%" viewBox="0 0 390 400" preserveAspectRatio="xMidYMid slice">
          <g opacity="0.28">
            <rect class="doc doc-1" x="30" y="60" width="28" height="38" rx="2" fill="#f0e8d0" transform="rotate(-15 44 79)"/>
            <rect class="doc doc-2" x="80" y="120" width="25" height="35" rx="2" fill="#e8e0cc" transform="rotate(20 92 137)"/>
            <rect class="doc doc-3" x="130" y="40" width="30" height="40" rx="2" fill="#f0e8d0" transform="rotate(8 145 60)"/>
            <rect class="doc doc-4" x="200" y="90" width="26" height="36" rx="2" fill="#e8e0cc" transform="rotate(-25 213 108)"/>
            <rect class="doc doc-5" x="260" y="60" width="28" height="38" rx="2" fill="#f0e8d0" transform="rotate(12 274 79)"/>
            <rect class="doc doc-6" x="310" y="140" width="24" height="34" rx="2" fill="#e8e0cc" transform="rotate(-10 322 157)"/>
            <rect class="doc doc-7" x="50" y="220" width="22" height="30" rx="2" fill="#f0e8d0" transform="rotate(35 61 235)"/>
            <rect class="doc doc-8" x="340" y="250" width="20" height="28" rx="2" fill="#e8e0cc" transform="rotate(-25 350 264)"/>
          </g>
        </svg>
      </div>

      <!-- 苏轼青年立绘 -->
      <div class="su-figure">
        <img
          src="/assets/dongpo/characters/char_sushi_young.png"
          alt="少年苏轼"
          class="su-portrait"
          draggable="false"
        />
        <div class="su-figure-glow"></div>
      </div>
    </div>

    <div class="dialogue-layer">
      <DialogueBox
        v-if="showD1"
        text="他写得太好了。好到人人都看见他。"
        speaker="旁白"
        text-class="narration"
        @complete="isComplete = true"
        @advance="handleAdvance"
      />
      <DialogueBox
        v-if="showD2"
        text="可被看见，也意味着每一句话都会被保存、转述、判断。"
        speaker="旁白"
        text-class="narration"
        @complete="isComplete = true"
        @advance="handleAdvance"
      />
    </div>

    <button v-if="showNextBtn" class="vn-next-btn" @click="() => setScene('S21')">
      继续 <span class="vn-arrow">→</span>
    </button>

    <div class="fact-adapt-layer">
      <FactAdaptationBook
        fact="苏轼在京城以诗文闻名，其才华引起广泛关注。正式版本需核查相关年表和作品背景。"
        adaptation="本幕的文稿飞舞、人物剪影是电影化呈现，用于表现'才名与风险'的主题张力。"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { setScene } from '../store/gameState.js'
import DialogueBox from './DialogueBox.vue'
import FactAdaptationBook from './FactAdaptationBook.vue'
import BackgroundScene from './BackgroundScene.vue'

const showD1 = ref(false)
const showD2 = ref(false)
const isComplete = ref(false)
const showNextBtn = ref(false)

function nextD1() { showD1.value = false; setTimeout(() => { showD2.value = true }, 200) }
function nextD2() { showD2.value = false; showNextBtn.value = true }

function handleAdvance() {
  if (showD1.value && !isComplete.value) return
  if (showD1.value) { nextD1(); return }
  if (showD2.value && !isComplete.value) return
  if (showD2.value) { nextD2(); return }
}

onMounted(() => { showD1.value = true })
</script>

<style scoped>
.vn-scene { position: relative; width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; padding: 60px 20px 200px; overflow: hidden; pointer-events: none; }
.vn-scene > * { pointer-events: auto; }
.chapter-badge { position: fixed; top: 60px; left: 16px; z-index: 40; padding: 4px 14px; background: rgba(13,13,18,0.8); border: 1px solid rgba(184,149,108,0.2); border-radius: 20px; font-family: var(--font-sans); font-size: 0.68rem; color: rgba(200,190,170,0.55); letter-spacing: 0.15em; text-transform: uppercase; backdrop-filter: blur(4px); }
.scene-title-vn {
  font-family: var(--font-serif);
  font-size: 1.55rem;
  color: rgba(255,232,200,0.95);
  text-align: center;
  margin-top: 8px;
  margin-bottom: 16px;
  letter-spacing: 0.18em;
  text-shadow: 0 0 18px rgba(255,210,140,0.35), 0 2px 6px rgba(0,0,0,0.7);
  position: relative;
  z-index: 5;
}
.character-layer {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  position: relative;
  z-index: 4;
}

/* 文稿飞舞（持续飘动） */
.flying-docs-layer {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}
.doc { transform-origin: center; }
.doc-1 { animation: doc-drift-a 6s ease-in-out infinite; }
.doc-2 { animation: doc-drift-b 7s ease-in-out infinite 0.5s; }
.doc-3 { animation: doc-drift-a 5.5s ease-in-out infinite 1.2s; }
.doc-4 { animation: doc-drift-b 6.5s ease-in-out infinite 2s; }
.doc-5 { animation: doc-drift-a 7.5s ease-in-out infinite 0.8s; }
.doc-6 { animation: doc-drift-b 5s ease-in-out infinite 1.8s; }
.doc-7 { animation: doc-drift-a 6.2s ease-in-out infinite 2.5s; }
.doc-8 { animation: doc-drift-b 7.2s ease-in-out infinite 3s; }
@keyframes doc-drift-a {
  0%, 100% { transform: translate(0, 0) rotate(-15deg); opacity: 0.2; }
  50% { transform: translate(20px, -14px) rotate(-10deg); opacity: 0.35; }
}
@keyframes doc-drift-b {
  0%, 100% { transform: translate(0, 0) rotate(20deg); opacity: 0.25; }
  50% { transform: translate(-18px, 12px) rotate(25deg); opacity: 0.4; }
}

/* 苏轼青年立绘 — 矩形宣纸卡 + 金边挂画 */
.su-figure {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-bottom: 60px;
  padding: 18px 16px 22px;
  background:
    linear-gradient(135deg, rgba(232,216,180,0.94) 0%, rgba(216,192,148,0.9) 50%, rgba(184,148,96,0.85) 100%);
  border: 2px solid rgba(184,149,108,0.55);
  border-radius: 8px;
  box-shadow:
    0 14px 36px rgba(0,0,0,0.55),
    0 0 28px rgba(255,210,140,0.18),
    inset 0 0 40px rgba(184,148,96,0.15);
  animation: figure-rise 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}
/* 内描边金线（挂画细线） */
.su-figure::before {
  content: '';
  position: absolute;
  inset: 5px;
  border: 1px solid rgba(255,212,90,0.4);
  border-radius: 4px;
  pointer-events: none;
}
.su-portrait {
  width: auto;
  height: 360px;
  max-width: 70vw;
  object-fit: contain;
  /* 透明 PNG 透明区域透出下方米色宣纸底（避免显示黑底/棋盘格） */
  background-color: #e8d8b8;
  /* 让黑色立绘在宣纸上更立体 */
  filter: drop-shadow(2px 4px 8px rgba(60,40,20,0.5));
  user-select: none;
  position: relative;
  z-index: 1;
  border-radius: 4px;
  /* 强制按 PNG 原始尺寸，不让透明区被压缩 */
  image-rendering: -webkit-optimize-contrast;
}
.su-figure-glow {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 280px;
  height: 30px;
  background: radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%);
  filter: blur(8px);
  z-index: -2;
}
@keyframes paper-aura {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
@keyframes figure-rise {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes glow-pulse {
  0%, 100% { opacity: 0.6; transform: translateX(-50%) scaleX(1); }
  50% { opacity: 1; transform: translateX(-50%) scaleX(1.1); }
}

.dialogue-layer { position: fixed; left: 0; right: 0; bottom: 0; z-index: 6; }
.fact-adapt-layer { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); z-index: 90; }
.vn-next-btn { position: fixed; bottom: 220px; right: 20px; display: inline-flex; align-items: center; gap: 6px; padding: 10px 18px; background: rgba(20,18,14,0.85); border: 1px solid rgba(184,149,108,0.35); border-radius: 20px; color: rgba(200,190,170,0.85); font-family: var(--font-sans); font-size: 0.85rem; cursor: pointer; z-index: 90; backdrop-filter: blur(4px); animation: btn-fade-in 0.4s cubic-bezier(0.16,1,0.3,1); box-shadow: 0 4px 12px rgba(0,0,0,0.25); transition: all 0.2s; }
.vn-next-btn:hover { background: rgba(30,28,24,0.9); border-color: rgba(184,149,108,0.55); color: rgba(220,210,190,0.95); transform: translateY(-1px); }
.vn-arrow { font-size: 0.8rem; }
@keyframes btn-fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>
