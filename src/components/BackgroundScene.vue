<template>
  <!-- 全屏场景背景层：替代纯色渐变 -->
  <!-- 用法: <BackgroundScene theme="meishan" /> -->
  <div class="bg-scene" :class="'bg-' + theme" aria-hidden="true">

    <!-- ========== 全屏背景图（独立资产，最高优先级） ========== -->
    <img v-if="themeImage" :src="themeImage" class="bg-image" :class="`bg-image-${theme}`" alt="" draggable="false" />

    <!-- ========== HOME: 残卷展开 ========== -->
    <div v-if="theme === 'home'" class="home-cg">
      <!-- 底色：宣纸 -->
      <div class="bg-paper"></div>
      <!-- 墨水泼溅粒子 -->
      <div class="ink-particles">
        <div class="ink-dot dot1"></div>
        <div class="ink-dot dot2"></div>
        <div class="ink-dot dot3"></div>
      </div>
    </div>

    <!-- ========== MEISHAN: 眉山（书斋） ========== -->
    <div v-else-if="theme === 'meishan'" class="meishan-cg">
      <div class="bg-paper"></div>
      <!-- 油灯光晕叠加独立资产之上 -->
      <div class="lamp-glow"></div>
    </div>

    <!-- ========== WUTAI: 乌台风暴 ========== -->
    <div v-else-if="theme === 'wutai'" class="wutai-cg">
      <div class="bg-paper"></div>
      <!-- 压迫性黑顶 -->
      <div class="dark-ceiling"></div>
    </div>

    <!-- ========== MIZHOU: 密州 ========== -->
    <div v-else-if="theme === 'mizhou'" class="mizhou-cg">
      <div class="bg-paper"></div>
    </div>

    <!-- ========== HUANGZHOU: 黄州 ========== -->
    <div v-else-if="theme === 'huangzhou'" class="huangzhou-cg">
      <div class="bg-paper"></div>
      <!-- 小灶火 -->
      <div class="stove-area">
        <svg viewBox="0 0 390 844" preserveAspectRatio="xMidYMid slice">
          <!-- 灶台 -->
          <ellipse cx="200" cy="720" rx="70" ry="25" fill="#3a3020" opacity="0.7"/>
          <rect x="140" y="680" width="120" height="45" fill="#4a3828" rx="5"/>
          <ellipse cx="200" cy="680" rx="60" ry="15" fill="#2a2018"/>
          <!-- 火焰 -->
          <g class="flame-anim">
            <ellipse cx="200" cy="660" rx="20" ry="30" fill="#c47a30" opacity="0.5"/>
            <ellipse cx="192" cy="655" rx="12" ry="22" fill="#d4923a" opacity="0.5"/>
            <ellipse cx="208" cy="658" rx="10" ry="18" fill="#e0a84a" opacity="0.4"/>
            <ellipse cx="200" cy="648" rx="6" ry="12" fill="#f0c060" opacity="0.3"/>
          </g>
          <!-- 白气 -->
          <g class="steam" opacity="0.3">
            <ellipse cx="190" cy="630" rx="15" ry="8" fill="#d8d0c0" class="steam-puff"/>
            <ellipse cx="210" cy="620" rx="12" ry="7" fill="#d8d0c0" class="steam-puff" style="animation-delay:0.5s"/>
            <ellipse cx="200" cy="610" rx="10" ry="6" fill="#e8e0d0" class="steam-puff" style="animation-delay:1s"/>
          </g>
        </svg>
      </div>
    </div>

    <!-- ========== CHENGTIAN: 承天寺 ========== -->
    <div v-else-if="theme === 'chengtian'" class="chengtian-cg">
      <div class="bg-paper"></div>
      <!-- 月光洒入效果 -->
      <div class="moon-beam"></div>
    </div>

    <!-- ========== HANGZHOU: 杭州 ========== -->
    <div v-else-if="theme === 'hangzhou'" class="hangzhou-cg">
      <div class="bg-paper"></div>
    </div>

    <!-- ========== DANZHOU: 儋州 ========== -->
    <div v-else-if="theme === 'danzhou'" class="danzhou-cg">
      <div class="bg-paper"></div>
    </div>

    <!-- ========== RESULT: 结果页 ========== -->
    <div v-else-if="theme === 'result'" class="result-cg">
      <div class="bg-paper"></div>
    </div>

    <!-- ========== INTRO: 遗卷任务页 ========== -->
    <div v-else-if="theme === 'intro'" class="intro-cg">
      <div class="bg-paper"></div>
    </div>

    <!-- ========== DEFAULT: 通用黑 ========== -->
    <div v-else class="default-bg"></div>

    <!-- 通用纸纹叠加 -->
    <div class="paper-grain"></div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  theme: {
    type: String,
    default: 'default',
    validator: v => ['home','meishan','capital','wutai','huangzhou','chengtian','hangzhou','danzhou','result','share','credits','intro','default'].includes(v)
  }
})

// ─── 独立资产映射：每个章节主题对应一张全屏背景图 ───────────────
const THEME_IMAGES = {
  home:       '/assets/dongpo/backgrounds/bg_home_moon_city.png',
  meishan:    '/assets/dongpo/backgrounds/bg_meishan_study.png',
  capital:    '/assets/dongpo/backgrounds/bg_capital_night.png',
  wutai:      '/assets/dongpo/backgrounds/bg_wutai_storm.png',
  mizhou:     '/assets/dongpo/backgrounds/bg_mizhou_drought.png',
  huangzhou:  '/assets/dongpo/backgrounds/bg_huangzhou_river.png',
  chengtian:  '/assets/dongpo/backgrounds/bg_chengtian_moon.png',
  hangzhou:   '/assets/dongpo/backgrounds/bg_huangzhou_river.png',  // 杭州回响黄州气质
  danzhou:    '/assets/dongpo/backgrounds/bg_huangzhou_stove.png',  // 儋州温暖日常
  result:     '/assets/dongpo/backgrounds/bg_result_moon_landscape.png',
  intro:      '/assets/dongpo/backgrounds/bg_meishan_study.png',
  share:      '/assets/dongpo/share/share_poster_template.png',
  credits:    '/assets/dongpo/backgrounds/bg_result_moon_landscape.png',
  default:    null
}

const themeImage = computed(() => THEME_IMAGES[props.theme] || null)
</script>

<style scoped>
.bg-scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
}

/* ── 独立资产背景图层（最底层） ──────────── */
.bg-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
  z-index: 0;
  user-select: none;
  pointer-events: none;
  /* 暖色调微调，增加画面层次 */
  filter: brightness(0.92) contrast(1.05) saturate(1.05);
}

.bg-paper {
  z-index: 1;
  background: linear-gradient(180deg, rgba(13, 12, 16, 0.45) 0%, rgba(11, 9, 14, 0.55) 100%) !important;
}

/* ---- 通用 ---- */
.bg-paper {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #1a1c24 0%, #15171e 100%);
}

.paper-grain {
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(200,190,170,0.015) 2px, rgba(200,190,170,0.015) 4px),
    repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(200,190,170,0.01) 2px, rgba(200,190,170,0.01) 4px);
  opacity: 0.6;
}

.ink-wash-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 50% 80%, rgba(30,25,20,0.6) 0%, transparent 60%);
}

/* ---- HOME ---- */
.home-cg { position: relative; width: 100%; height: 100%; }
.home-cg .bg-paper { background: radial-gradient(ellipse at 50% 40%, #1e1e2c 0%, #0d0d15 70%); }
.ink-mountains { position: absolute; inset: 0; }
.ink-mountains svg { width: 100%; height: 100%; }

.ink-particles { position: absolute; inset: 0; }
.ink-dot {
  position: absolute;
  border-radius: 50%;
  background: rgba(20,15,10,0.4);
}
.dot1 { width: 120px; height: 120px; top: 20%; left: 10%; filter: blur(40px); }
.dot2 { width: 80px; height: 80px; top: 60%; right: 15%; filter: blur(30px); }
.dot3 { width: 60px; height: 60px; bottom: 20%; left: 40%; filter: blur(25px); }

.flame { animation: flicker 2s ease-in-out infinite alternate; }
@keyframes flicker {
  0% { transform: scaleY(1) scaleX(1); }
  50% { transform: scaleY(1.1) scaleX(0.95); }
  100% { transform: scaleY(0.92) scaleX(1.05); }
}

/* ---- MEISHAN ---- */
.meishan-cg { position: relative; width: 100%; height: 100%; }
.meishan-cg .bg-paper {
  background: linear-gradient(180deg, #1e2030 0%, #2d3040 50%, #3a3d50 100%);
}

.rain-layer {
  position: absolute;
  inset: 0;
  overflow: hidden;
}
.rain {
  position: absolute;
  width: 100%;
  height: 200%;
  background: repeating-linear-gradient(
    170deg,
    transparent 0px,
    transparent 8px,
    rgba(180,190,210,0.06) 8px,
    rgba(180,190,210,0.06) 9px
  );
  animation: rain-fall linear infinite;
}
.rain-1 { animation-duration: 0.8s; opacity: 0.7; }
.rain-2 { animation-duration: 1.2s; animation-delay: -0.4s; opacity: 0.5; left: 30%; }
.rain-3 { animation-duration: 1s; animation-delay: -0.7s; opacity: 0.6; left: 60%; }
@keyframes rain-fall {
  from { transform: translateY(-50%); }
  to { transform: translateY(0%); }
}

.ink-mountains { position: absolute; inset: 0; }
.ink-mountains svg { width: 100%; height: 100%; }

.lamp-glow {
  position: absolute;
  bottom: 30%;
  right: 20%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(200,160,60,0.15) 0%, rgba(200,140,40,0.05) 40%, transparent 70%);
  border-radius: 50%;
  animation: lamp-pulse 3s ease-in-out infinite;
}
@keyframes lamp-pulse {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

/* ---- WUTAI ---- */
.wutai-cg { position: relative; width: 100%; height: 100%; }
.wutai-cg .bg-paper { background: radial-gradient(ellipse at 50% 30%, #2a2a38 0%, #0d0d12 60%, #080810 100%); }
.dark-ceiling {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 100px;
  background: linear-gradient(180deg, #080810 0%, transparent 100%);
  z-index: 2;
}
.cage-shadow { position: absolute; inset: 0; z-index: 1; }
.cage-shadow svg { width: 100%; height: 100%; }

.flying-papers { position: absolute; inset: 0; z-index: 3; overflow: hidden; }
.paper {
  position: absolute;
  width: 40px;
  height: 55px;
  background: rgba(220,210,190,0.06);
  border: 1px solid rgba(200,190,170,0.1);
  border-radius: 2px;
}
.p1 { top: 15%; left: 10%; transform: rotate(20deg); animation: float-paper 4s ease-in-out infinite; }
.p2 { top: 25%; right: 15%; transform: rotate(-30deg); animation: float-paper 5s ease-in-out infinite reverse; }
.p3 { top: 40%; left: 25%; transform: rotate(45deg); animation: float-paper 3.5s ease-in-out infinite 0.5s; }
.p4 { top: 55%; right: 20%; transform: rotate(-15deg); animation: float-paper 4.5s ease-in-out infinite 1s; }
.p5 { top: 35%; left: 5%; transform: rotate(60deg); animation: float-paper 3s ease-in-out infinite 0.3s; }
.p6 { top: 60%; left: 40%; transform: rotate(-40deg); animation: float-paper 4.2s ease-in-out infinite 0.8s; }

@keyframes float-paper {
  0%, 100% { transform: translateY(0) rotate(var(--r, 20deg)); opacity: 0.4; }
  50% { transform: translateY(-20px) rotate(calc(var(--r, 20deg) + 10deg)); opacity: 0.7; }
}
.p1 { --r: 20deg; }
.p2 { --r: -30deg; }
.p3 { --r: 45deg; }
.p4 { --r: -15deg; }
.p5 { --r: 60deg; }
.p6 { --r: -40deg; }

.ink-crows { position: absolute; inset: 0; z-index: 2; }
.ink-crows svg { width: 100%; height: 100%; }

/* ---- MIZHOU ---- */
.mizhou-cg { position: relative; width: 100%; height: 100%; }
.mizhou-cg .bg-paper {
  background: linear-gradient(180deg, #a89860 0%, #c8b878 40%, #8a7850 100%);
}
.mizhou-svg { position: absolute; inset: 0; }
.mizhou-svg svg { width: 100%; height: 100%; }

/* ---- HUANGZHOU ---- */
.huangzhou-cg { position: relative; width: 100%; height: 100%; }
.river-svg { position: absolute; inset: 0; }
.river-svg svg { width: 100%; height: 100%; }
.stove-area { position: absolute; inset: 0; z-index: 2; }
.stove-area svg { width: 100%; height: 100%; }

.flame-anim { animation: flame-move 2s ease-in-out infinite alternate; transform-origin: center bottom; }
@keyframes flame-move {
  0% { transform: scaleY(1) translateY(0); }
  100% { transform: scaleY(1.15) translateY(-5px); }
}
.steam { position: absolute; bottom: 40%; right: 20%; }
.steam-puff {
  position: absolute;
  animation: steam-rise 3s ease-out infinite;
}
.steam-puff:nth-child(2) { left: 20px; animation-delay: 0.5s; }
.steam-puff:nth-child(3) { left: -10px; top: -10px; animation-delay: 1s; }
@keyframes steam-rise {
  0% { transform: translateY(0) scale(1); opacity: 0.3; }
  100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
}

/* ---- CHENGTIAN ---- */
.chengtian-cg { position: relative; width: 100%; height: 100%; }
.chengtian-cg .bg-paper {
  background: radial-gradient(ellipse at 80% 20%, #1e2230 0%, #151a25 50%, #0d1018 100%);
}
.moonlight-layer { position: absolute; inset: 0; }
.moonlight-layer svg { width: 100%; height: 100%; }
.moon-beam {
  position: absolute;
  top: 0; right: 0;
  width: 60%;
  height: 70%;
  background: linear-gradient(135deg, rgba(220,228,248,0.04) 0%, transparent 60%);
  pointer-events: none;
}

/* ---- HANGZHOU ---- */
.hangzhou-cg { position: relative; width: 100%; height: 100%; }
.hangzhou-cg .bg-paper { background: linear-gradient(180deg, #3a5068 0%, #6a8898 50%, #8aa8b8 100%); }
.hangzhou-svg { position: absolute; inset: 0; }
.hangzhou-svg svg { width: 100%; height: 100%; }

/* ---- DANZHOU ---- */
.danzhou-cg { position: relative; width: 100%; height: 100%; }
.danzhou-cg .bg-paper { background: linear-gradient(180deg, #1a2a38 0%, #2a3a4a 50%, #1a2a38 100%); }
.danzhou-svg { position: absolute; inset: 0; }
.danzhou-svg svg { width: 100%; height: 100%; }

/* ---- RESULT ---- */
.result-cg .bg-paper {
  background: radial-gradient(ellipse at 50% 30%, #1e1e2c 0%, #0d0d15 70%);
}

/* ---- INTRO ---- */
.intro-cg { position: relative; width: 100%; height: 100%; }
.intro-cg .bg-paper {
  background: radial-gradient(ellipse at 50% 50%, #1a1a24 0%, #0d0d15 60%);
}
.intro-ink-flow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse at 30% 60%, rgba(30,25,35,0.5) 0%, transparent 50%),
    radial-gradient(ellipse at 70% 40%, rgba(25,30,40,0.4) 0%, transparent 40%);
}

/* ---- DEFAULT ---- */
.default-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, #1a1a1a 0%, #0d0d12 100%);
}
</style>
