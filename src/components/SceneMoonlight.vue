<template>
  <div class="moonlight-wrap scene-frame" style="pointer-events:auto;">
    <!-- 场景章节标记 -->
    <div class="chapter-badge"><span class="chapter-dot"></span>第六幕 · 承天寺夜游</div>

    <!-- 月光艺术层 -->
    <div class="moonlight-cg" aria-hidden="true">
      <div class="moonlight-bg"></div>
      <!-- 月光 -->
      <div class="moon-body"></div>
      <!-- 门框月光 -->
      <div class="door-beam"></div>
      <!-- 月色粒子 -->
      <div class="moon-dots">
        <div v-for="i in 12" :key="i" class="moon-dot" :style="{
          left: (5+i*7)+'%',
          top: (10+i*5)+'%',
          animationDelay: (i*0.4)+'s',
          width: (2+i%3)+'px',
          height: (2+i%3)+'px'
        }"></div>
      </div>
    </div>

    <!-- 对话框 -->
    <div class="dialogue-stack">
      <DialogueBox :text="text1" />
      <DialogueBox :text="text2" />
    </div>

    <!-- 继续按钮 -->
    <div class="continue-area">
      <button class="btn-continue" @click="handleNext">
        <span>去找一个还没睡的人</span>
        <span class="btn-arrow">›</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { setScene } from '../store/gameState.js'
import DialogueBox from './DialogueBox.vue'

const text1 = '夜深了。'
const text2 = '他解衣欲睡。月光却推门进来。'

function handleNext() {  setScene('S40')}
</script>

<style scoped>
.moonlight-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  padding: 60px 20px 40px;
  box-sizing: border-box;
}
.moonlight-cg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.moonlight-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 80% 20%, #1e2230 0%, #151a25 50%, #0d1018 100%);
}
.moon-body {
  position: absolute;
  top: 8%;
  right: 18%;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 40%, #f0f4ff 0%, #d8dce8 50%, #c0c4d4 100%);
  opacity: 0.2;
  box-shadow: 0 0 40px rgba(220,228,248,0.2), 0 0 80px rgba(220,228,248,0.1);
}
.door-beam {
  position: absolute;
  top: 20%;
  left: 30%;
  width: 40%;
  height: 60%;
  background: linear-gradient(160deg, rgba(220,228,248,0.06) 0%, transparent 60%);
  clip-path: polygon(30% 0%, 70% 0%, 100% 100%, 0% 100%);
}
.moon-dots { position: absolute; inset: 0; }
.moon-dot {
  position: absolute;
  border-radius: 50%;
  background: rgba(220,228,248,0.4);
  animation: moonTwinkle 3s ease-in-out infinite;
}
@keyframes moonTwinkle {
  0%, 100% { opacity: 0.2; }
  50% { opacity: 0.6; }
}
.dialogue-stack {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 360px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}
.continue-area {
  position: relative;
  z-index: 2;
  width: 100%;
  display: flex;
  justify-content: center;
}
.btn-continue {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: rgba(60,80,100,0.8);
  border: 1px solid rgba(140,160,180,0.3);
  border-radius: 4px;
  color: #d8dce8;
  font-family: "Noto Serif SC", serif;
  font-size: 0.95rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-continue:hover {
  background: rgba(80,100,120,0.9);
  transform: translateY(-1px);
}
.btn-arrow { font-size: 1.2rem; }
/* 章节标记 */
.chapter-badge {
  position: fixed;
  top: 60px;
  left: 16px;
  z-index: 40;
  padding: 4px 14px;
  background: rgba(13,13,18,0.8);
  border: 1px solid rgba(184,149,108,0.2);
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  color: rgba(200,190,170,0.55);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  backdrop-filter: blur(4px);
}

</style>
