<template>
  <!-- 人物剪影层：背影/侧影，不做正面 -->
  <div class="char-layer" :class="'char-' + character" :style="layerStyle">
    <svg
      v-if="character === 'sushi-young'"
      viewBox="0 0 120 280"
      class="char-svg"
      aria-hidden="true"
    >
      <!-- 少年苏轼背影 -->
      <defs>
        <linearGradient id="youngGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#1a1c22" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="#1a1c22" stop-opacity="0.2"/>
        </linearGradient>
      </defs>
      <!-- 头 -->
      <ellipse cx="60" cy="35" rx="22" ry="26" fill="url(#youngGrad)"/>
      <!-- 发髻 -->
      <path d="M42 20 Q60 5 78 20 Q70 15 60 12 Q50 15 42 20 Z" fill="#1a1c22" opacity="0.8"/>
      <!-- 身衣 -->
      <path d="M38 58 Q60 50 82 58 L88 160 Q60 170 32 160 Z" fill="url(#youngGrad)"/>
      <!-- 袖子 -->
      <path d="M32 70 Q20 80 18 110 Q22 115 28 112 Q30 90 38 80 Z" fill="#1a1c22" opacity="0.6"/>
      <path d="M88 70 Q100 80 102 110 Q98 115 92 112 Q90 90 82 80 Z" fill="#1a1c22" opacity="0.6"/>
      <!-- 腰 -->
      <rect x="38" y="155" width="44" height="20" rx="4" fill="#1a1c22" opacity="0.5"/>
      <!-- 下摆 -->
      <path d="M38 175 Q60 185 82 175 L85 280 Q60 290 35 280 Z" fill="#1a1c22" opacity="0.6"/>
    </svg>

    <svg
      v-else-if="character === 'sushi-adult'"
      viewBox="0 0 140 300"
      class="char-svg"
      aria-hidden="true"
    >
      <!-- 成年苏轼背影 -->
      <defs>
        <linearGradient id="adultGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#1e2028" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="#1e2028" stop-opacity="0.15"/>
        </linearGradient>
      </defs>
      <!-- 头 -->
      <ellipse cx="70" cy="38" rx="25" ry="29" fill="url(#adultGrad)"/>
      <!-- 发髻 -->
      <path d="M48 22 Q70 4 92 22 Q82 16 70 13 Q58 16 48 22 Z" fill="#1e2028" opacity="0.85"/>
      <!-- 身衣 -->
      <path d="M42 64 Q70 56 98 64 L105 180 Q70 192 35 180 Z" fill="url(#adultGrad)"/>
      <!-- 袖子 -->
      <path d="M35 76 Q18 90 15 130 Q20 138 26 134 Q28 100 40 86 Z" fill="#1e2028" opacity="0.7"/>
      <path d="M105 76 Q122 90 125 130 Q120 138 114 134 Q112 100 100 86 Z" fill="#1e2028" opacity="0.7"/>
      <!-- 腰带 -->
      <rect x="42" y="175" width="56" height="24" rx="5" fill="#1a1c22" opacity="0.6"/>
      <!-- 下摆 -->
      <path d="M42 198 Q70 210 98 198 L102 300 Q70 315 38 300 Z" fill="#1e2028" opacity="0.65"/>
    </svg>

    <svg
      v-else-if="character === 'suzhe'"
      viewBox="0 0 120 280"
      class="char-svg"
      aria-hidden="true"
    >
      <!-- 苏辙背影：更沉稳、挺直 -->
      <defs>
        <linearGradient id="suzheGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#1c1e26" stop-opacity="0.75"/>
          <stop offset="100%" stop-color="#1c1e26" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="35" rx="22" ry="25" fill="url(#suzheGrad)"/>
      <path d="M42 18 Q60 2 78 18 Q68 12 60 10 Q52 12 42 18 Z" fill="#1c1e26" opacity="0.85"/>
      <path d="M36 58 Q60 50 84 58 L90 165 Q60 178 30 165 Z" fill="url(#suzheGrad)"/>
      <path d="M30 70 Q15 82 13 115 Q17 122 22 118 Q24 95 36 78 Z" fill="#1c1e26" opacity="0.65"/>
      <path d="M90 70 Q105 82 107 115 Q103 122 98 118 Q96 95 84 78 Z" fill="#1c1e26" opacity="0.65"/>
      <rect x="38" y="160" width="44" height="22" rx="4" fill="#1a1c22" opacity="0.55"/>
      <path d="M38 182 Q60 194 82 182 L86 280 Q60 295 34 280 Z" fill="#1c1e26" opacity="0.6"/>
    </svg>

    <svg
      v-else-if="character === 'huaimin'"
      viewBox="0 0 120 280"
      class="char-svg"
      aria-hidden="true"
    >
      <!-- 张怀民：安静、朴素 -->
      <defs>
        <linearGradient id="huaiGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#252838" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="#252838" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      <ellipse cx="60" cy="36" rx="21" ry="24" fill="url(#huaiGrad)"/>
      <path d="M43 20 Q60 8 77 20 Q67 15 60 12 Q53 15 43 20 Z" fill="#252838" opacity="0.8"/>
      <path d="M37 58 Q60 50 83 58 L89 160 Q60 172 31 160 Z" fill="url(#huaiGrad)"/>
      <path d="M31 70 Q18 82 16 112 Q20 118 25 115 Q27 92 38 76 Z" fill="#252838" opacity="0.6"/>
      <path d="M89 70 Q102 82 104 112 Q100 118 95 115 Q93 92 82 76 Z" fill="#252838" opacity="0.6"/>
      <path d="M37 178 Q60 188 83 178 L87 280 Q60 295 33 280 Z" fill="#252838" opacity="0.6"/>
    </svg>

    <svg
      v-else-if="character === 'villager'"
      viewBox="0 0 100 260"
      class="char-svg"
      aria-hidden="true"
    >
      <!-- 村民：朴素、弯腰递物 -->
      <defs>
        <linearGradient id="villGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#2a2820" stop-opacity="0.65"/>
          <stop offset="100%" stop-color="#2a2820" stop-opacity="0.1"/>
        </linearGradient>
      </defs>
      <!-- 弯腰姿态 -->
      <ellipse cx="50" cy="80" rx="20" ry="23" fill="url(#villGrad)"/>
      <path d="M28 100 Q50 88 72 100 L78 160 Q50 175 22 160 Z" fill="url(#villGrad)"/>
      <!-- 递出的手 -->
      <path d="M72 130 Q95 120 100 130 Q102 138 96 142 Q90 138 78 135 Z" fill="#2a2820" opacity="0.7"/>
      <!-- 肉块 -->
      <ellipse cx="98" cy="132" rx="14" ry="10" fill="#5a4a38" opacity="0.5" transform="rotate(-15 98 132)"/>
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  character: {
    type: String,
    default: 'sushi-adult',
    validator: v => ['sushi-young','sushi-adult','suzhe','huaimin','villager'].includes(v)
  },
  position: {
    type: String,
    default: 'center',
    validator: v => ['left','center','right'].includes(v)
  },
  size: { type: Number, default: 1 }, // scale multiplier
  opacity: { type: Number, default: 0.6 }
})

const layerStyle = computed(() => ({
  '--char-opacity': props.opacity,
  '--char-scale': props.size,
  left: props.position === 'left' ? '5%' : props.position === 'right' ? 'auto' : '50%',
  right: props.position === 'right' ? '5%' : 'auto',
  transform: props.position === 'center'
    ? `translateX(-50%) scale(${props.size})`
    : `scale(${props.size})`
}))
</script>

<style scoped>
.char-layer {
  position: absolute;
  bottom: 0;
  pointer-events: none;
  opacity: var(--char-opacity, 0.6);
  filter: drop-shadow(0 0 20px rgba(0,0,0,0.4));
  transition: opacity 0.5s ease;
}

.char-svg {
  height: clamp(180px, 35vh, 280px);
  width: auto;
}
</style>
