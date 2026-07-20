<template>
  <div class="intro-screen scene-frame">
    <!-- Animated book -->
    <div class="book-animation">
      <div class="book-cover" :class="{ open: bookOpen }">
        <div class="book-spine"></div>
        <div class="book-pages">
          <div class="page page-left"></div>
          <div class="page page-right"></div>
        </div>
      </div>
    </div>
    
    <!-- Content -->
    <div class="intro-content" :class="{ visible: contentVisible }">
      <h2 class="book-title">《东坡清风纪》</h2>
      <div class="残页列表">
        <span class="残页">眉山</span>
        <span class="残页-divider">·</span>
        <span class="残页">京城</span>
        <span class="残页-divider">·</span>
        <span class="残页">乌台</span>
        <span class="残页-divider">·</span>
        <span class="残页">黄州</span>
        <span class="残页-divider">·</span>
        <span class="残页">承天寺</span>
      </div>
      
      <div class="intro-narration">
        <p class="intro-narration-text">{{ narratorText }}</p>
      </div>
      
      <button class="btn btn-primary" data-testid="btn-next-S10" @click="handleNext">
        {{ nextText }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { setScene } from '../store/gameState.js'

const bookOpen = ref(false)
const contentVisible = ref(false)
const narratorText = ref('')
const nextText = ref('翻到眉山')

const fullNarrator = '你不是旁观者。你要修复这卷账。这本账不记他赚过多少钱，只记他在风雨里有没有把自己守清楚。'

onMounted(() => {
  // Open book animation
  setTimeout(() => {
    bookOpen.value = true
  }, 300)
  
  // Show content
  setTimeout(() => {
    contentVisible.value = true
    typeNarrator()
  }, 1200)
})

function typeNarrator() {
  let i = 0
  const interval = setInterval(() => {
    if (i < fullNarrator.length) {
      narratorText.value = fullNarrator.slice(0, i + 1)
      i++
    } else {
      clearInterval(interval)
    }
  }, 50)
}

function handleNext() {
  setScene('S10')
}
</script>

<style scoped>
.intro-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: transparent;
  z-index: 2;
}

.book-animation {
  margin-bottom: 2rem;
}

.book-cover {
  width: 120px;
  height: 160px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s ease;
}

.book-cover.open {
  transform: perspective(800px) rotateY(-15deg);
}

.book-spine {
  position: absolute;
  left: 0;
  top: 0;
  width: 15px;
  height: 100%;
  background: linear-gradient(90deg, var(--vermillion-dark), var(--vermillion));
  border-radius: 2px 0 0 2px;
}

.book-pages {
  position: absolute;
  left: 15px;
  top: 5px;
  width: calc(100% - 15px);
  height: calc(100% - 10px);
  display: flex;
}

.page {
  flex: 1;
  background: var(--xuan-paper);
  border-radius: 0 3px 3px 0;
}

.page-left {
  background: linear-gradient(90deg, var(--xuan-dark), var(--xuan-paper));
}

.page-right {
  background: var(--xuan-paper);
  box-shadow: inset 5px 0 15px rgba(0, 0, 0, 0.1);
}

.intro-content {
  text-align: center;
  width: min(90vw, 520px);
  max-width: 520px;
  padding: 1.5rem 2rem 1.75rem;
  border: 1px solid rgba(232, 215, 184, 0.22);
  border-radius: 12px;
  background: linear-gradient(180deg, rgba(38, 31, 27, 0.58), rgba(20, 18, 19, 0.68));
  box-shadow: 0 18px 55px rgba(0, 0, 0, 0.28), inset 0 1px rgba(255, 244, 220, 0.08);
  backdrop-filter: blur(3px);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.intro-content.visible {
  opacity: 1;
  transform: translateY(0);
}

.book-title {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  color: #fff8e9;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.75);
  margin-bottom: 1rem;
  letter-spacing: 0.1em;
}

.残页列表 {
  margin-bottom: 2rem;
}

.残页 {
  font-family: var(--font-serif);
  font-size: 0.875rem;
  color: var(--old-gold);
}

.残页-divider {
  color: rgba(184, 149, 108, 0.4);
  margin: 0 0.5rem;
}

.intro-narration {
  background: rgba(20, 17, 18, 0.46);
  border-left: 2px solid var(--vermillion);
  padding: 1rem;
  margin-bottom: 2rem;
  text-align: left;
}

.intro-narration-text {
  font-family: var(--font-serif);
  font-size: 1rem;
  line-height: 1.8;
  color: #fffaf0;
  text-shadow: 0 1px 5px rgba(0, 0, 0, 0.8);
  min-height: 4.5em;
}

.btn-primary {
  min-width: 160px;
  color: #fff8ea;
  background: #8f2f32;
  border-color: rgba(255, 224, 190, 0.35);
  box-shadow: 0 8px 22px rgba(44, 8, 10, 0.35);
}

@media (max-width: 640px) {
  .intro-content {
    width: min(92vw, 420px);
    padding: 1.25rem 1.15rem 1.4rem;
  }
}
</style>
