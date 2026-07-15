<template>
  <div class="choice-vn-wrap">
    <ChoiceOverlay
      :visible="true"
      question="天涯之地，还有人来问学。你要如何回应？"
      :choices="choices"
      @confirm="handleConfirm"
      @continue="handleContinue"
    />
  </div>
</template>

<script setup>
import { setScene, applyChoice, addLogEntry } from '../store/gameState.js'
import ChoiceOverlay from './ChoiceOverlay.vue'

const choices = [
  {
    id: "A",
    text: "开门授课，不问远近贵贱",
    group: "danzhou_teach",
    value: "open_teach",
    variables: { fenggu: 10, minsheng: 15, yanhuo: 10 },
    feedback: "门开了，火就往外走。这一笔，账上不记，但会被人记在心里。",
    annotation: null
  },
  {
    id: "B",
    text: "只教少数聪明人，留下名声",
    group: "danzhou_teach",
    value: "selective_teach",
    variables: { fenggu: 5, minsheng: -5, mingsheng: 15 },
    feedback: "聪明人留下了，可学问也留下了门槛。",
    annotation: null
  },
  {
    id: "C",
    text: "闭门自守，不再与世相接",
    group: "danzhou_teach",
    value: "closed_door",
    variables: { fenggu: -5, yanhuo: -20, qinyou: -5 },
    feedback: "把门关上，风是挡住了，可自己也困在里面了。",
    annotation: "后续倾向：月光很冷 / 孤高成碑"
  },
  {
    id: "D",
    text: "把讲学包装成自己的苦难传奇",
    group: "danzhou_teach",
    value: "fame_suffering",
    variables: { mingsheng: 25, qingfeng: -10 },
    feedback: "苦难变成了表演，名声账又翻涌了。",
    annotation: "名声风险，不代表史实",
    warning: "⚠️ 此为虚构，不代表苏轼真实行为"
  }
]

function handleConfirm(choice) {
  addLogEntry({
    type: 'choice',
    sceneId: 'S51',
    content: `儋州讲学选择 ${choice.id}：${choice.text}`,
    meta: { variables: choice.variables, flag: choice.value }
  })
  addLogEntry({ type: 'feedback', sceneId: 'S51', content: choice.feedback })
  if (choice.annotation) {
    addLogEntry({ type: 'system', sceneId: 'S51', content: `[改编说明] ${choice.annotation}` })
  }
  applyChoice(choice, 'S51')
}

function handleContinue() {
  addLogEntry({ type: 'system', sceneId: 'S51', content: '进入天涯生活选择' })
  setScene('S52')
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
