<template>
  <div class="choice-vn-wrap">
    <ChoiceOverlay
      :visible="true"
      question="找到怀民之后，你要怎么过这个夜晚？"
      :choices="choices"
      @confirm="handleConfirm"
      @continue="handleContinue"
    />
  </div>
</template>

<script setup>
import { setScene, applyChoice, applyCombo, addLogEntry, setColdFlag, gameState } from '../store/gameState.js'
import ChoiceOverlay from './ChoiceOverlay.vue'

const choices = [
  {
    id: "A",
    text: "与怀民步于中庭，把怨气交给月光",
    group: "huai",
    value: "moon_walk",
    variables: { fenggu: 20, yanhuo: 10, qinyou: 5 },
    feedback: "你没有改变贬谪的现实，但你保住了不沉下去的能力。今晚，风骨账亮了一点。"
  },
  {
    id: "B",
    text: "情绪上头，写一堆可能再次惹祸的话",
    group: "huai",
    value: "hot_words",
    variables: { mingsheng: 15, qinyou: 10, fenggu: 5 },
    feedback: "才华又开始发烫。可有些话一旦写出去，就会让风再次变硬。"
  },
  {
    id: "C",
    text: "闷在屋里，不再见任何人",
    group: "huai",
    value: "closed_self",
    variables: { fenggu: -10, yanhuo: -10, qinyou: -5 },
    feedback: "你避开了风险，也避开了月光。一个人如果把自己关得太久，风骨也会变冷。"
  },
  {
    id: "D",
    text: "借朋友关系求特殊照顾",
    group: "huai",
    value: "privilege_friend",
    variables: { qingfeng: -15, qinyou: 10 },
    feedback: "朋友不是特权通道。真正的知己，是陪你清醒，不是替你越界。"
  }
]

function handleConfirm(choice) {
  addLogEntry({ type: 'choice', sceneId: 'S41', content: `选择 ${choice.id}：${choice.text}`, meta: { variables: choice.variables, flag: choice.value } })
  addLogEntry({ type: 'feedback', sceneId: 'S41', content: choice.feedback })
  applyChoice(choice, 'S41')
  if (choice.id === 'C' && gameState.flags.meat === 'isolated') {
    setColdFlag()
    addLogEntry({ type: 'system', sceneId: 'S41', content: '冷生活标记已激活：life_cold = true' })
  }
  // Combo: moon_walk + slow_stew
  if (choice.id === 'A' && gameState.flags.cook === 'slow_stew') {
    applyCombo({ fenggu: 5, yanhuo: 5 }, '黄州没有治好他，但让他开始重新呼吸。')
    addLogEntry({ type: 'system', sceneId: 'S41', content: '组合触发：烟火账 + 风骨账' })
  }
}

function handleContinue() {
  addLogEntry({ type: 'system', sceneId: 'S41', content: '剧情继续，前往 S42' })
  setScene('S42')
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
