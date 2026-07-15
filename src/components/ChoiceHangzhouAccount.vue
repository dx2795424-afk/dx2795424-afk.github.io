<template>
  <div class="choice-vn-wrap">
    <ChoiceOverlay
      :visible="true"
      question="工程账目，要不要公开？"
      :choices="choices"
      @confirm="handleConfirm"
      @continue="handleContinue"
    />
  </div>
</template>

<script setup>
import { setScene, applyChoice, addLogEntry, setDirtyFlag } from '../store/gameState.js'
import ChoiceOverlay from './ChoiceOverlay.vue'

const choices = [
  {
    id: "A",
    text: "公开工料账目，接受监督",
    group: "hangzhou_account",
    value: "open_account",
    variables: { qingfeng: 20, minsheng: 10, mingsheng: -5 },
    feedback: "账公开，风就透。这一笔，记在明处。",
    warning: null
  },
  {
    id: "B",
    text: "只公开结果，不公开细账",
    group: "hangzhou_account",
    value: "result_only",
    variables: { qingfeng: -10, minsheng: 5, mingsheng: 10 },
    feedback: "给了结果，但账还有一半藏在暗处。清风账还差一笔。",
    annotation: "清风账污染风险",
    warning: "⚠️ 清风账污染风险"
  },
  {
    id: "C",
    text: "借工程名义给私人关系留余地",
    group: "hangzhou_account",
    value: "private_margin",
    variables: { qingfeng: -25, minsheng: -10, mingsheng: 10 },
    feedback: "公账开了一道缝，人情就进来住下了。糊涂账又多一笔。",
    annotation: "清风账污染选项，不代表苏轼真实行为",
    warning: "⚠️ 此为虚构，不代表苏轼真实行为",
    isDirty: true
  },
  {
    id: "D",
    text: "为避嫌过度收缩，工程推进停滞",
    group: "hangzhou_account",
    value: "overcautious",
    variables: { qingfeng: 5, minsheng: -15, mingsheng: -5 },
    feedback: "过度避嫌，也是一种不作为。民生账被冷落了。",
    warning: null
  }
]

function handleConfirm(choice) {
  addLogEntry({
    type: 'choice',
    sceneId: 'S46',
    content: `工程账目选择 ${choice.id}：${choice.text}`,
    meta: { variables: choice.variables, flag: choice.value }
  })
  addLogEntry({ type: 'feedback', sceneId: 'S46', content: choice.feedback })
  if (choice.annotation) {
    addLogEntry({ type: 'system', sceneId: 'S46', content: `[改编说明] ${choice.annotation}` })
  }
  applyChoice(choice, 'S46')
  if (choice.isDirty) {
    setDirtyFlag()
    addLogEntry({ type: 'system', sceneId: 'S46', content: '糊涂账标记已激活：account_dirty = true' })
  }
}

function handleContinue() {
  addLogEntry({ type: 'system', sceneId: 'S46', content: '进入杭州小结' })
  setScene('S47')
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
