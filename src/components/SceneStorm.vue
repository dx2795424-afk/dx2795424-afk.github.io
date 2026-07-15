<template>
  <div class="storm-wrap scene-frame" style="pointer-events:auto;">
    <!-- 场景章节标记 -->
    <div class="chapter-badge"><span class="chapter-dot"></span>第一幕 · 京城成名</div>

    <!-- 动态CSS艺术：风暴+黑鸦 -->
    <div class="storm-cg" aria-hidden="true">
      <div class="storm-bg"></div>
      <div class="cage-lines">
        <div v-for="i in 5" :key="i" class="cage-bar" :style="{left: (20+i*15)+'%'}"></div>
      </div>
      <div class="crows-wrap">
        <div v-for="i in 8" :key="i" class="crow" :style="{
          top: (12+i*8)+'%',
          left: (5+i*10)+'%',
          animationDelay: (i*0.3)+'s',
          transform: `rotate(${(i%2==0?1:-1)*(10+i*5)}deg)`
        }"></div>
      </div>
      <div class="candle-glow"></div>
    </div>

    <!-- 对话框：条件台词 -->
    <div class="dialogue-stack">
      <DialogueBox :text="narratorText" />
    </div>

    <!-- 继续按钮 -->
    <div class="continue-area">
      <button class="btn-continue" @click="handleNext">
        <span>风暴来了</span>
        <span class="btn-arrow">›</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { setScene, gameState } from '../store/gameState.js'
import DialogueBox from './DialogueBox.vue'

const narratorText = computed(() => {
  const flag = gameState.flags.expression
  const map = {
    responsible: '即使字字有据，风暴也未必会放过一个太亮的人。',
    safe_but_weak: '你曾试着避开风。可时代的风，不会只吹向说话的人。',
    reckless: '那些锋利的字，没有停在纸上。它们被翻出，被剪开，被重新排列。',
    fame_first: '名声把他推得更高。高处的风，也更冷。'
  }
  return map[flag] || map.reckless
})

function handleNext() { setScene('S26') }
</script>

<style scoped>
.storm-wrap {
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
.storm-cg {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}
.storm-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 30%, #2a2a38 0%, #0d0d12 60%, #080810 100%);
}
.cage-lines {
  position: absolute;
  inset: 0;
}
.cage-bar {
  position: absolute;
  top: 0; bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, transparent 0%, rgba(13,13,18,0.5) 30%, rgba(13,13,18,0.9) 50%, rgba(13,13,18,0.5) 70%, transparent 100%);
}
.crows-wrap {
  position: absolute;
  inset: 0;
}
.crow {
  position: absolute;
  width: 28px;
  height: 14px;
  background: #0d0d18;
  border-radius: 50% 50% 0 0;
  opacity: 0;
  animation: crowFade 3s ease-out infinite;
}
.crow::before, .crow::after {
  content: '';
  position: absolute;
  top: 0;
  width: 20px;
  height: 4px;
  background: #0d0d18;
  border-radius: 50%;
}
.crow::before { left: -8px; transform: rotate(-20deg); }
.crow::after { right: -8px; transform: rotate(20deg); }
@keyframes crowFade {
  0% { opacity: 0; transform: translateY(0); }
  20% { opacity: 0.6; }
  80% { opacity: 0.3; }
  100% { opacity: 0; transform: translateY(-30px); }
}
.candle-glow {
  position: absolute;
  top: 35%;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 80px;
  background: radial-gradient(ellipse, rgba(200,160,48,0.15) 0%, transparent 70%);
  animation: candleFlicker 2s ease-in-out infinite alternate;
}
@keyframes candleFlicker {
  0% { opacity: 0.7; transform: translateX(-50%) scaleY(1); }
  100% { opacity: 1; transform: translateX(-50%) scaleY(1.1); }
}
.dialogue-stack {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 360px;
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
  background: rgba(139,58,58,0.85);
  border: 1px solid rgba(180,80,80,0.4);
  border-radius: 4px;
  color: #f0e8d8;
  font-family: "Noto Serif SC", serif;
  font-size: 0.95rem;
  letter-spacing: 0.1em;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 12px rgba(139,58,58,0.3);
}
.btn-continue:hover {
  background: rgba(160,70,70,0.9);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(139,58,58,0.4);
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
