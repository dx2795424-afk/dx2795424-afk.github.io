<template>
  <div class="choice-vn-wrap">
    <ChoiceOverlay
      :visible="true"
      question="西湖要疏，先疏哪里？"
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
    text: "先查民生急处，疏浚为用",
    group: "hangzhou_project",
    value: "people_first",
    variables: { qingfeng: 10, minsheng: 20, mingsheng: -5 },
    feedback: "西湖之水，先流向了民生。这一笔，记在账上，也记在人心里。",
    warning: null
  },
  {
    id: "B",
    text: "把工程做成最漂亮的名声工程",
    group: "hangzhou_project",
    value: "fame_project",
    variables: { qingfeng: -10, minsheng: 5, mingsheng: 25 },
    feedback: "名声涨得很快。可一旦工程变成表演，民生就被挤到了边缘。",
    annotation: "清风账污染风险",
    warning: "⚠️ 清风账污染风险"
  },
  {
    id: "C",
    text: "把部分工料交给熟人承办",
    group: "hangzhou_project",
    value: "relation_contract",
    variables: { qingfeng: -25, minsheng: -10, mingsheng: 5 },
    feedback: "人情进账本，清风就出账本。这一笔，糊涂了。",
    annotation: "清风账污染选项，不代表苏轼真实行为",
    warning: "⚠️ 此为虚构，不代表苏轼真实行为",
    isDirty: true
  },
  {
    id: "D",
    text: "不顾程序，先强行推进",
    group: "hangzhou_project",
    value: "bypass_process",
    variables: { qingfeng: -10, minsheng: 10, fenggu: 5, qinyou: -5 },
    feedback: "想做事是好的，但程序不守住，权力就会迷路。",
    annotation: "程序风险",
    warning: "⚠️ 程序风险"
  }
]

function handleConfirm(choice) {
  addLogEntry({
    type: 'choice',
    sceneId: 'S45',
    content: `西湖疏浚选择 ${choice.id}：${choice.text}`,
    meta: { variables: choice.variables, flag: choice.value }
  })
  addLogEntry({ type: 'feedback', sceneId: 'S45', content: choice.feedback })
  if (choice.annotation) {
    addLogEntry({ type: 'system', sceneId: 'S45', content: `[改编说明] ${choice.annotation}` })
  }
  applyChoice(choice, 'S45')
  if (choice.isDirty) {
    setDirtyFlag()
    addLogEntry({ type: 'system', sceneId: 'S45', content: '糊涂账标记已激活：account_dirty = true' })
  }
}

function handleContinue() {
  addLogEntry({ type: 'system', sceneId: 'S45', content: '剧情继续，进入工程账目选择' })
  setScene('S46')
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
