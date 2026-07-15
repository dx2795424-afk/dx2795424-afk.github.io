<template>
  <div class="choice-vn-wrap">
    <ChoiceOverlay
      :visible="true"
      question="面对公共事务，你会让苏轼怎样表达？"
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
    text: "把听到的、看到的写下来，让事实先开口",
    group: "expression",
    value: "responsible",
    variables: { fenggu: 10, minsheng: 5, mingsheng: 5 },
    feedback: "你让他说真话，也让他知道真话有重量。风骨不是乱撞，责任也不是沉默。"
  },
  {
    id: "B",
    text: "先听一圈，把不同声音都记在纸上，再决定落笔",
    group: "expression",
    value: "listening",
    variables: { fenggu: 5, mingsheng: 8, minsheng: 8, qinyou: 5 },
    feedback: "他没有急着站队。先听完，再写。这样的人会慢一点，但也会稳一点。风不会立刻绕开他，因为他没给自己树敌。"
  },
  {
    id: "C",
    text: "把心里压了许久的话，一次性写痛快",
    group: "expression",
    value: "reckless",
    variables: { fenggu: 15, mingsheng: 20, qinyou: 5 },
    feedback: "字落下去，像火星。照亮一瞬，也可能烧出一场风。"
  },
  {
    id: "D",
    text: "把公共事务写成能被远人看见的故事",
    group: "expression",
    value: "fame_first",
    variables: { mingsheng: 25, minsheng: -10 },
    feedback: "名声涨得很快。但账本提醒：如果公共议题只剩个人表演，真实会被挤到角落。"
  }
]

function handleConfirm(choice) {
  addLogEntry({ type: 'choice', sceneId: 'S21', content: `选择 ${choice.id}：${choice.text}`, meta: { variables: choice.variables, flag: choice.value } })
  addLogEntry({ type: 'feedback', sceneId: 'S21', content: choice.feedback })
  applyChoice(choice, 'S21')
}

function handleContinue() {
  addLogEntry({ type: 'system', sceneId: 'S21', content: '剧情继续，前往 S22' })
  setScene('S22')
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
