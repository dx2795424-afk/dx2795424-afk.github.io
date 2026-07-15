<template>
  <div class="choice-vn-wrap">
    <ChoiceOverlay
      :visible="true"
      question="天涯日用，也是一种修行。你要怎样过下去？"
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
    text: "学着入乡随俗，与乡民互助",
    group: "danzhou_life",
    value: "live_with_people",
    variables: { yanhuo: 20, minsheng: 10, qinyou: 5 },
    feedback: "入乡随俗，不是妥协，是在天涯重新学会活着。",
    annotation: null
  },
  {
    id: "B",
    text: "只靠诗文撑住自己",
    group: "danzhou_life",
    value: "poetry_only",
    variables: { fenggu: 10, yanhuo: -10 },
    feedback: "诗文是锚，可如果只剩诗文，生活的温度就没了。",
    annotation: null
  },
  {
    id: "C",
    text: "怨恨命运，不再回应他人",
    group: "danzhou_life",
    value: "resentment",
    variables: { yanhuo: -25, qinyou: -10, fenggu: -5 },
    feedback: "怨恨是一口越来越窄的井。困住的不是别人，是自己。",
    annotation: "后续倾向：天涯更冷",
    warning: "⚠️ 此为虚构，不代表苏轼真实行为"
  },
  {
    id: "D",
    text: "用医药、文字和经验帮一些人",
    group: "danzhou_life",
    value: "help_people",
    variables: { minsheng: 15, yanhuo: 10, qingfeng: 5 },
    feedback: "在天涯仍然在帮人。这一笔，账上是暖的。",
    annotation: null
  }
]

function handleConfirm(choice) {
  addLogEntry({
    type: 'choice',
    sceneId: 'S52',
    content: `天涯生活选择 ${choice.id}：${choice.text}`,
    meta: { variables: choice.variables, flag: choice.value }
  })
  addLogEntry({ type: 'feedback', sceneId: 'S52', content: choice.feedback })
  if (choice.annotation) {
    addLogEntry({ type: 'system', sceneId: 'S52', content: `[改编说明] ${choice.annotation}` })
  }
  applyChoice(choice, 'S52')
}

function handleContinue() {
  addLogEntry({ type: 'system', sceneId: 'S52', content: '进入姜唐佐求学选择' })
  setScene('S53')
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
