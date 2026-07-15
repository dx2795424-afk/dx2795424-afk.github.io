<template>
  <div class="explore-scene scene-frame">
    <!-- 章节标记 -->
    <div class="chapter-mark">第五幕 · 承天寺</div>

    <!-- 地图视觉 -->
    <div class="map-visual">
      <!-- Path -->
      <svg class="path-svg" viewBox="0 0 200 120">
        <path d="M30,100 Q60,80 100,85 T170,60" stroke="rgba(232,228,223,0.3)" stroke-width="2" fill="none" stroke-dasharray="5,5"/>
        <!-- Points -->
        <circle cx="30" cy="100" r="8" class="map-point home" :class="{ visited: visitedPoints.includes('home') }"/>
        <circle cx="100" cy="85" r="6" class="map-point mid" :class="{ visited: visitedPoints.includes('mid') }"/>
        <circle cx="170" cy="60" r="8" class="map-point temple" :class="{ visited: visitedPoints.includes('temple') }"/>
        <!-- Labels -->
        <text x="30" y="115" class="map-label">苏轼屋舍</text>
        <text x="160" y="45" class="map-label">承天寺</text>
      </svg>
    </div>
    
    <!-- Exploration points -->
    <!-- 修复：寺门初始不禁用，pending状态通过 pendingPoints ref 追踪 -->
    <div class="explore-points">
      <button
        v-for="point in explorePoints"
        :key="point.id"
        class="explore-btn"
        :class="{
          discovered: discoveredPoints.includes(point.id),
          pending: pendingPoints.includes(point.id)
        }"
        :disabled="discoveredPoints.includes(point.id)"
        :data-testid="'explore-' + point.id"
        @click="discoverPoint(point)"
      >
        <span class="point-icon">{{ point.id === 'temple' ? '🚪' : (point.id === 'bamboo' ? '🎋' : '🌙') }}</span>
        <span class="point-name">{{ point.name }}</span>
        <span v-if="pendingPoints.includes(point.id)" class="point-status">探索中...</span>
        <span v-if="discoveredPoints.includes(point.id) && !pendingPoints.includes(point.id)" class="point-text">{{ point.text }}</span>
      </button>
    </div>
    
    <!-- 怀民状态弹窗 -->
    <Transition name="fade">
      <div v-if="showHuaiMin" class="huaimin-popup">
        <div class="popup-system-tag">系统提示</div>
        <p class="popup-title">张怀民状态</p>
        <p class="popup-result">亦未寝</p>
      </div>
    </Transition>

    <!-- 继续按钮 -->
    <button v-if="canProceed" class="continue-btn-vn" data-testid="btn-next-S42" @click="handleNext">
      <span>合上黄州这一页</span>
      <span class="arrow">→</span>
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { setScene } from '../store/gameState.js'

const explorePoints = [
  { id: 'moonlight', name: '月光石阶', text: '月色铺了一地，冷得像一页空账。' },
  { id: 'bamboo', name: '竹影', text: '竹影碎在地上，像没有写完的句子。' },
  { id: 'temple', name: '怀民门环', text: '门环很凉。你忽然想起，今夜还有人未睡。', delay: 1000 }
]

const discoveredPoints = ref([])
const pendingPoints = ref([])
const visitedPoints = ref(['home'])
const showHuaiMin = ref(false)

const canProceed = computed(() => discoveredPoints.value.length === 3)

function discoverPoint(point) {
  // 修复：寺门初始可点击，已发现或等待中的不可重复触发
  if (discoveredPoints.value.includes(point.id)) return
  if (pendingPoints.value.includes(point.id)) return

  if (point.delay) {
    // 延迟发现（寺门）：加入pending，1秒后移至discovered
    pendingPoints.value.push(point.id)

    setTimeout(() => {
      pendingPoints.value = pendingPoints.value.filter(id => id !== point.id)
      discoveredPoints.value.push(point.id)
      showHuaiMin.value = true

      setTimeout(() => {
        showHuaiMin.value = false
      }, 2000)
    }, point.delay)
  } else {
    discoveredPoints.value.push(point.id)
  }
}

function handleNext() {
  setScene('S41')
}
</script>

<style scoped>
.scene-frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 60px;
}

.chapter-mark {
  position: fixed;
  top: 60px;
  left: 16px;
  z-index: 30;
  padding: 4px 14px;
  background: rgba(13, 13, 18, 0.8);
  border: 1px solid rgba(184, 149, 108, 0.2);
  border-radius: 20px;
  font-family: var(--font-sans);
  font-size: 0.68rem;
  color: rgba(200, 190, 170, 0.55);
  letter-spacing: 0.15em;
  backdrop-filter: blur(4px);
}

.map-visual {
  width: 100%;
  max-width: 240px;
  margin-bottom: 1.5rem;
}

.path-svg {
  width: 100%;
}

.map-point {
  fill: rgba(232, 228, 223, 0.3);
  stroke: rgba(232, 228, 223, 0.5);
  stroke-width: 1;
  transition: all 0.3s ease;
}

.map-point.visited {
  fill: var(--old-gold);
  stroke: var(--old-gold);
}

.map-label {
  font-size: 8px;
  fill: rgba(232, 228, 223, 0.6);
  text-anchor: middle;
}

.explore-points {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
  max-width: 280px;
  margin-bottom: 1.5rem;
}

.explore-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(26, 26, 26, 0.6);
  border: 1px solid rgba(232, 228, 223, 0.1);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.explore-btn:hover:not(:disabled) {
  background: rgba(61, 79, 95, 0.5);
}

.explore-btn.discovered {
  background: rgba(92, 122, 92, 0.3);
  border-color: var(--bamboo-green);
}

.explore-btn.waiting { opacity: 0.6; }
.explore-btn.pending { opacity: 0.6; }

.point-icon {
  font-size: 1.25rem;
}

.point-name {
  font-family: var(--font-serif);
  font-size: 0.9375rem;
  color: var(--moon-white);
  flex: 1;
}

.point-status {
  font-size: 0.75rem;
  color: rgba(232, 228, 223, 0.5);
  animation: pulse 1s ease-in-out infinite;
}

.point-text {
  font-family: var(--font-serif);
  font-size: 0.95rem;
  color: var(--old-gold);
}

@keyframes pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

/* 怀民弹窗 */
.huaimin-popup {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(13, 13, 18, 0.97);
  border: 1px solid rgba(139, 58, 58, 0.5);
  border-radius: 12px;
  padding: 1.5rem 2.5rem;
  z-index: 200;
  text-align: center;
  box-shadow: 0 8px 40px rgba(0,0,0,0.5);
}

.popup-system-tag {
  font-family: var(--font-sans);
  font-size: 0.65rem;
  color: rgba(139, 58, 58, 0.7);
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 8px;
}

.popup-title {
  font-size: 0.95rem;
  color: rgba(232, 228, 223, 0.6);
  margin-bottom: 0.5rem;
  font-family: var(--font-sans);
}

.popup-result {
  font-family: var(--font-serif);
  font-size: 1.6rem;
  color: var(--old-gold);
  letter-spacing: 0.05em;
}

/* 继续按钮 */
.continue-btn-vn {
  position: fixed;
  bottom: 24px;
  right: 20px;
  z-index: 50;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  background: linear-gradient(135deg, var(--vermillion) 0%, var(--vermillion-dark) 100%);
  border: none;
  border-radius: 20px;
  color: #f5f0e6;
  font-family: var(--font-sans);
  font-size: 0.82rem;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(139, 58, 58, 0.4);
  transition: all 0.2s;
  animation: co-pulse 2s ease-in-out infinite;
}
.continue-btn-vn:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(139, 58, 58, 0.5);
}
.arrow { font-size: 0.8rem; }

@keyframes co-pulse {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 1; }
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
