<template>
  <div class="floating-poem-layer" aria-hidden="true">
    <!-- Floating poem fragments -->
    <div
      v-for="fragment in fragments"
      :key="fragment.id"
      class="poem-fragment"
      :class="`poem-fragment--${fragment.type}`"
      :style="fragment.style"
    >
      <span class="poem-fragment__text">{{ fragment.text }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  active: { type: Boolean, default: false },
})

// Predefined poem fragments
const poemData = [
  { id: 1, text: '莫听穿林打叶声', type: 'dingfeng', style: { top: '8%', left: '5%', fontSize: '0.65rem', opacity: 0.18, animationDelay: '0s' } },
  { id: 2, text: '何妨吟啸且徐行', type: 'dingfeng', style: { top: '15%', right: '8%', fontSize: '0.6rem', opacity: 0.14, animationDelay: '1.2s' } },
  { id: 3, text: '竹杖芒鞋轻胜马', type: 'dingfeng', style: { bottom: '20%', left: '3%', fontSize: '0.55rem', opacity: 0.12, animationDelay: '0.7s' } },
  { id: 4, text: '回首向来萧瑟处', type: 'dingfeng', style: { bottom: '12%', right: '5%', fontSize: '0.58rem', opacity: 0.15, animationDelay: '2s' } },
  { id: 5, text: '庭下如积水空明', type: 'chengtian', style: { top: '20%', left: '12%', fontSize: '0.62rem', opacity: 0.16, animationDelay: '0.3s' } },
  { id: 6, text: '水中藻荇交横', type: 'chengtian', style: { top: '10%', right: '12%', fontSize: '0.6rem', opacity: 0.13, animationDelay: '1.8s' } },
  { id: 7, text: '盖竹柏影也', type: 'chengtian', style: { bottom: '25%', left: '15%', fontSize: '0.55rem', opacity: 0.11, animationDelay: '1s' } },
  { id: 8, text: '黄州猪肉', type: 'zhurou', style: { top: '30%', left: '8%', fontSize: '0.58rem', opacity: 0.12, animationDelay: '0.5s' } },
  { id: 9, text: '价贱如泥土', type: 'zhurou', style: { bottom: '30%', right: '10%', fontSize: '0.55rem', opacity: 0.1, animationDelay: '1.5s' } },
  { id: 10, text: '净洗锅', type: 'zhurou', style: { top: '5%', right: '20%', fontSize: '0.52rem', opacity: 0.09, animationDelay: '2.5s' } },
  { id: 11, text: '东坡', type: 'general', style: { top: '50%', left: '2%', fontSize: '0.7rem', opacity: 0.2, animationDelay: '0.8s' } },
  { id: 12, text: '清风', type: 'general', style: { bottom: '40%', right: '3%', fontSize: '0.65rem', opacity: 0.18, animationDelay: '1.3s' } },
]

const fragments = ref([])

// Mouse parallax
let mouseX = 0
let mouseY = 0
let rafId = null

function onMouseMove(e) {
  if (!props.active) return
  const rect = document.documentElement.getBoundingClientRect()
  mouseX = (e.clientX / rect.width - 0.5) * 2
  mouseY = (e.clientY / rect.height - 0.5) * 2
}

function animateParallax() {
  if (!props.active) return
  fragments.value.forEach((frag, i) => {
    const depth = (i % 3 + 1) * 0.015
    const baseX = parseFloat(frag._baseStyle.left || frag._baseStyle.right || 0)
    const baseY = parseFloat(frag._baseStyle.top || frag._baseStyle.bottom || 0)
    const signX = frag._baseStyle.left ? 1 : -1
    const offsetX = mouseX * depth * 100
    const offsetY = mouseY * depth * 80
    frag.style = {
      ...frag.style,
      transform: `translate(${offsetX}px, ${offsetY}px)`,
    }
  })
  rafId = requestAnimationFrame(animateParallax)
}

onMounted(() => {
  fragments.value = poemData.map(f => ({ ...f, _baseStyle: { ...f.style } }))
  if (props.active) {
    window.addEventListener('mousemove', onMouseMove)
    rafId = requestAnimationFrame(animateParallax)
  }
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.floating-poem-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.poem-fragment {
  position: absolute;
  font-family: var(--font-serif);
  color: var(--moon-white);
  white-space: nowrap;
  pointer-events: none;
  will-change: transform;
  transition: opacity 0.5s ease;
  text-shadow: 0 1px 8px rgba(0,0,0,0.5);
  line-height: 1.8;
  letter-spacing: 0.1em;
}

.poem-fragment--dingfeng {
  color: rgba(212, 196, 168, 0.9);
}

.poem-fragment--chengtian {
  color: rgba(216, 220, 232, 0.9);
}

.poem-fragment--zhurou {
  color: rgba(196, 168, 130, 0.9);
}

.poem-fragment--general {
  color: rgba(232, 228, 223, 0.8);
}

/* Float animations */
.poem-fragment:nth-child(odd) {
  animation: float-drift-odd 18s ease-in-out infinite;
}

.poem-fragment:nth-child(even) {
  animation: float-drift-even 22s ease-in-out infinite;
}

@keyframes float-drift-odd {
  0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.8; }
  25% { transform: translate(8px, -12px) rotate(0.5deg); opacity: 1; }
  75% { transform: translate(-5px, 8px) rotate(-0.3deg); opacity: 0.7; }
}

@keyframes float-drift-even {
  0%, 100% { transform: translate(0, 0) rotate(0deg); opacity: 0.7; }
  33% { transform: translate(-10px, 6px) rotate(-0.4deg); opacity: 0.9; }
  66% { transform: translate(6px, -8px) rotate(0.2deg); opacity: 0.75; }
}
</style>
