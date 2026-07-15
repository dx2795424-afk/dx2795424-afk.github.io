<template>
  <div class="choice-vn-wrap">
    <ChoiceOverlay
      :visible="true"
      question="这顿饭怎么做？"
      :choices="choices"
      @confirm="handleConfirm"
      @continue="handleContinue"
    />
  </div>
</template>

<script setup>
import { setScene, applyChoice, addLogEntry, setDirtyFlag, gameState } from '../store/gameState.js'
import ChoiceOverlay from './ChoiceOverlay.vue'

const choices = [
  {
    id: "A",
    text: "用自己的预算，少水慢火，把它认真做成一顿饭",
    group: "cook",
    value: "slow_stew",
    variables: { yanhuo: 20, fenggu: 10, qingfeng: 10 },
    feedback: "火不大，却稳。锅里的水汽慢慢把夜色熬软。",
    feedbackLowQf: "锅气很暖，账页却不太干净。"
  },
  {
    id: "B",
    text: "为了面子大摆宴席，账先欠着",
    group: "cook",
    value: "face_spend",
    variables: { yanhuo: 5, qingfeng: -10, mingsheng: 10 },
    feedback: "体面不是靠欠账撑出来的。越是失意，越容易用排场遮住空虚。"
  },
  {
    id: "C",
    text: "借公务名义报销私人饮食",
    group: "cook",
    value: "public_misuse",
    variables: { qingfeng: -25 },
    feedback: "这不是一顿饭的问题。这是边界的问题。私人生活一旦披上公务外衣，清风账就开始发霉。",
    warning: "注意：此为游戏化风险选项，不代表苏轼真实行为。"
  },
  {
    id: "D",
    text: "情绪崩溃，什么都不做",
    group: "cook",
    value: "collapse",
    variables: { yanhuo: -20, fenggu: -10 },
    feedback: "黄州的冷没有放过你。但如果连一顿饭都不愿意认真做，命运就只剩下冷。"
  }
]

function handleConfirm(choice) {
  // 清风账批注风格日志
  if (choice.value === 'slow_stew') {
    const base = '【黄州·东坡肉】小火慢煨，日子也一样，慢慢熬。'
    const extra = (gameState.variables.qingfeng < 45) ? ' 锅气很暖，账页却不太干净。' : ''
    addLogEntry({ type: 'account', sceneId: 'S33', content: base + extra, meta: { '烟火 +20': true, '风骨 +10': true, '清风 +10': true } })
  } else if (choice.value === 'face_spend') {
    addLogEntry({ type: 'account', sceneId: 'S33', content: '【黄州·东坡肉】体面不是靠欠账撑出来的。', meta: { '清风 -10': true } })
  } else if (choice.value === 'public_misuse') {
    addLogEntry({ type: 'account', sceneId: 'S33', content: '【黄州·清风账】清风账污染：私人饮食披上公务外衣。', meta: { 'account_dirty = true': true } })
  } else if (choice.value === 'collapse') {
    addLogEntry({ type: 'account', sceneId: 'S33', content: '【黄州·东坡肉】连一顿饭都不愿意认真做，命运就只剩下冷。', meta: { '烟火 -20': true, '风骨 -10': true } })
  }
  const fb = choice.value === 'slow_stew' && choice.feedbackLowQf && gameState.variables.qingfeng < 45
    ? choice.feedback + ' ' + choice.feedbackLowQf
    : choice.feedback
  addLogEntry({ type: 'feedback', sceneId: 'S33', content: fb })
  applyChoice(choice, 'S33')
  if (choice.id === 'C') {
    setDirtyFlag()
    addLogEntry({ type: 'system', sceneId: 'S33', content: '糊涂账标记已激活：account_dirty = true' })
  }
}

function handleContinue() {
  addLogEntry({ type: 'system', sceneId: 'S37', content: '剧情继续，前往 S38' })
  setScene('S38')
}
</script>

<style scoped>
.choice-vn-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
