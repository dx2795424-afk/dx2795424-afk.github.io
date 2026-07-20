<template>
  <section class="brothers-wrap scene-frame">
    <div class="scene-version-marker" data-version="SceneBrothers-VN-20260628-002" style="position:fixed;top:0;left:0;z-index:9999;background:red;color:white;padding:4px 8px;font-size:12px;">VN-002</div>

    <!-- 章节标记 -->
    <div class="chapter-badge"><span class="chapter-dot"></span>序幕 · 眉山少年</div>

    <!-- 氛围艺术层（绝对不拦截点击） -->
    <div class="brothers-cg" aria-hidden="true">
      <!-- 宣纸底 -->
      <div class="paper-bg"></div>
      <!-- 远山剪影 -->
      <svg class="far-mountains" viewBox="0 0 400 200" preserveAspectRatio="xMidYMax slice">
        <path d="M0,200 L0,140 Q50,100 100,130 Q150,80 200,120 Q250,60 300,100 Q350,80 400,130 L400,200 Z" fill="rgba(20,18,28,0.7)"/>
      </svg>
      <!-- 瓦檐剪影 -->
      <svg class="roof-line" viewBox="0 0 400 60" preserveAspectRatio="xMidYMax slice">
        <path d="M0,60 L0,45 Q100,20 200,30 Q300,15 400,35 L400,60 Z" fill="rgba(25,23,32,0.8)"/>
      </svg>
      <!-- 灯火点点 -->
      <div class="lanterns">
        <div class="lantern lt-1"></div>
        <div class="lantern lt-2"></div>
        <div class="lantern lt-3"></div>
      </div>
      <!-- 两个人影剪影 -->
      <div class="silhouettes">
        <div class="sil-a">
          <svg viewBox="0 0 80 220" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="40" cy="20" rx="15" ry="17" fill="rgba(15,13,22,0.92)"/>
            <rect x="24" y="37" width="32" height="95" rx="7" fill="rgba(15,13,22,0.92)"/>
            <rect x="28" y="45" width="10" height="60" rx="4" fill="rgba(15,13,22,0.85)"/>
            <rect x="42" y="45" width="10" height="60" rx="4" fill="rgba(15,13,22,0.85)"/>
            <rect x="20" y="132" width="16" height="86" rx="4" fill="rgba(15,13,22,0.92)"/>
            <rect x="44" y="132" width="16" height="86" rx="4" fill="rgba(15,13,22,0.92)"/>
          </svg>
        </div>
        <div class="sil-b">
          <svg viewBox="0 0 80 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="40" cy="20" rx="13" ry="15" fill="rgba(28,26,38,0.75)"/>
            <rect x="26" y="35" width="28" height="85" rx="6" fill="rgba(28,26,38,0.75)"/>
            <rect x="30" y="42" width="9" height="55" rx="3" fill="rgba(28,26,38,0.68)"/>
            <rect x="41" y="42" width="9" height="55" rx="3" fill="rgba(28,26,38,0.68)"/>
            <rect x="22" y="120" width="15" height="78" rx="4" fill="rgba(28,26,38,0.75)"/>
            <rect x="43" y="120" width="15" height="78" rx="4" fill="rgba(28,26,38,0.75)"/>
          </svg>
        </div>
      </div>
      <!-- 信纸飘落 -->
      <div class="letter-fold">
        <svg viewBox="0 0 64 44" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="60" height="40" rx="3" fill="rgba(220,208,175,0.1)" stroke="rgba(200,185,150,0.2)" stroke-width="1"/>
          <line x1="10" y1="14" x2="54" y2="14" stroke="rgba(200,185,150,0.18)" stroke-width="1.5"/>
          <line x1="10" y1="22" x2="42" y2="22" stroke="rgba(200,185,150,0.14)" stroke-width="1"/>
          <line x1="10" y1="30" x2="50" y2="30" stroke="rgba(200,185,150,0.1)" stroke-width="1"/>
          <text x="14" y="39" font-size="8" fill="rgba(180,165,130,0.3)" font-family="serif">子由</text>
        </svg>
      </div>
      <!-- 雨丝 -->
      <div class="rain-container">
        <div v-for="n in 12" :key="n" class="rain-drop" :style="rainStyle(n)"></div>
      </div>
    </div>

    <!-- 对话框（z-index 30，保证可点击） -->
    <div class="dialogue-zone" @click="handleDialogueClick">
      <DialogueBox
        :text="text1"
        :key="'d1-' + dk"
        @complete="d1Done = true"
        @advance="d1Done = true"
      />
      <DialogueBox
        v-if="d1Done"
        :text="text2"
        :key="'d2-' + dk"
        @complete="onAllDone"
        @advance="onAllDone"
      />
    </div>

    <!-- 史实/改编账本 -->
    <div class="fact-zone">
      <FactAdaptationBook
        fact="苏轼出生于眉山，苏辙为其弟。少年家学、兄弟关系是苏轼人格形成的重要背景。"
        adaptation="本幕的雨夜、书案、灯火和兄弟剪影是电影化呈现，用于建立人物氛围，不对应某一条完整史实记录。"
      />
    </div>

    <!-- 导航按钮（打字完成才出现） -->
    <Transition name="nav-rise">
      <div v-if="showNav" class="nav-zone">
        <button class="vn-back-btn" @click="handleBack">← 返回</button>
        <button class="vn-next-btn" @click="handleNext">
          去京城
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M6 3l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </Transition>
  </section>
</template>

<script setup>
import { ref, inject } from 'vue'
import DialogueBox from './DialogueBox.vue'
import FactAdaptationBook from './FactAdaptationBook.vue'
import { setScene, goBackScene } from '../store/gameState.js'

const openChapterTransition = inject('openChapterTransition', null)

const text1 = '他有一个弟弟，名叫苏辙，字子由。'
const text2 = '很多年后，这个名字会一次次出现在他的命运里。有些人陪你长大，也可能在风暴里替你扛下一部分重量。'

const d1Done = ref(false)
const dk = ref(0)
const showNav = ref(false)

function handleDialogueClick() {
  if (!d1Done.value) d1Done.value = true
}

function onAllDone() {
  showNav.value = true
}

function handleNext() {
  if (openChapterTransition) {
    openChapterTransition('meishan', 'capital', 'S20')
  } else {
    setScene('S20')
  }
}

function handleBack() {
  goBackScene()
}

function rainStyle(n) {
  const left = ((n * 37 + 5) % 100)
  const delay = ((n * 0.7) % 3).toFixed(1)
  const dur = (2 + (n % 3) * 0.5).toFixed(1)
  return {
    left: `${left}%`,
    animationDelay: `${delay}s`,
    animationDuration: `${dur}s`
  }
}
</script>

<style scoped>
/* ── 外层（建立层叠上下文） ── */
.brothers-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /* 宣纸暖调 */
  background: radial-gradient(ellipse at 30% 20%, rgba(60,55,45,0.6) 0%, rgba(25,23,30,0.95) 60%);
}

/* ── 艺术层：pointer-events:none ── */
.brothers-cg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.paper-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(80,72,58,0.2) 0%, transparent 70%),
    linear-gradient(180deg, #1a1924 0%, #22202e 40%, #1e1d28 100%);
}
/* 远山 */
.far-mountains {
  position: absolute;
  bottom: 20%;
  left: 0; right: 0;
  height: 40%;
}
/* 瓦檐 */
.roof-line {
  position: absolute;
  bottom: 28%;
  left: 0; right: 0;
  height: 12%;
}
/* 灯火 */
.lanterns { position: absolute; inset: 0; }
.lantern {
  position: absolute;
  width: 6px; height: 6px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,210,100,0.9) 0%, rgba(255,160,50,0.4) 60%, transparent 100%);
  box-shadow: 0 0 8px 2px rgba(255,190,80,0.3);
  animation: flicker 3s ease-in-out infinite;
}
.lt-1 { top: 18%; left: 22%; animation-delay: 0s; }
.lt-2 { top: 14%; left: 62%; animation-delay: 1.1s; }
.lt-3 { top: 22%; left: 78%; animation-delay: 2.3s; width: 4px; height: 4px; }
@keyframes flicker {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}
/* 两个人影 */
.silhouettes {
  position: absolute;
  bottom: 22%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: flex-end;
  gap: 24px;
}
.sil-a svg { height: 200px; width: auto; }
.sil-b svg { height: 175px; width: auto; }
/* 信纸飘落 */
.letter-fold {
  position: absolute;
  top: 25%;
  right: 12%;
  width: 64px;
  animation: letterFloat 5s ease-in-out infinite;
}
@keyframes letterFloat {
  0%, 100% { transform: translateY(0) rotate(-4deg); }
  50% { transform: translateY(-12px) rotate(3deg); }
}
/* 雨丝 */
.rain-container { position: absolute; inset: 0; overflow: hidden; }
.rain-drop {
  position: absolute;
  top: -20px;
  width: 1px;
  height: 18px;
  background: linear-gradient(180deg, transparent, rgba(160,175,195,0.25));
  animation: rainFall linear infinite;
}
@keyframes rainFall {
  0% { transform: translateY(-20px); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(900px); opacity: 0; }
}

/* ── 对话框区域（z-index 30） ── */
.dialogue-zone {
  position: absolute;
  bottom: 120px;
  left: 0; right: 0;
  z-index: 30;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  cursor: pointer;
}

/* ── 史实卡片区域 ── */
.fact-zone {
  position: absolute;
  bottom: 90px;
  left: 0; right: 0;
  z-index: 30;
  display: flex;
  justify-content: center;
}

/* ── 导航按钮（z-index 30） ── */
.nav-zone {
  position: absolute;
  bottom: 30px;
  left: 0; right: 0;
  z-index: 30;
  display: flex;
  gap: 12px;
  padding: 0 20px;
  justify-content: center;
}
.vn-back-btn {
  flex: 0 0 auto;
  padding: 10px 18px;
  background: rgba(20,18,28,0.8);
  border: 1px solid rgba(140,145,165,0.2);
  border-radius: 3px;
  color: rgba(180,175,160,0.6);
  font-family: "Noto Serif SC", serif;
  font-size: 0.82rem;
  letter-spacing: 0.06em;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s;
}
.vn-back-btn:hover {
  background: rgba(35,33,48,0.9);
  color: rgba(200,195,180,0.85);
}
.vn-next-btn {
  flex: 1;
  max-width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 24px;
  background: rgba(35,30,22,0.9);
  border: 1px solid rgba(184,149,108,0.4);
  border-radius: 3px;
  color: #d4c8a8;
  font-family: "Noto Serif SC", serif;
  font-size: 0.95rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  backdrop-filter: blur(4px);
  transition: all 0.2s;
}
.vn-next-btn:hover {
  background: rgba(50,44,32,0.95);
  box-shadow: 0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(184,149,108,0.2);
  transform: translateY(-1px);
}

/* 导航出现动画 */
.nav-rise-enter-active { transition: all 0.5s cubic-bezier(0.16,1,0.3,1); }
.nav-rise-enter-from { opacity: 0; transform: translateY(16px); }

/* ── 章节标记 ── */
.chapter-badge {
  position: fixed;
  top: 60px;
  left: 16px;
  z-index: 40;
}
</style>
